import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { dataDb, login, logout, session } from "@/lib/local/workspace";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const cookie = "truv_local_session";
// This prototype is intentionally restricted to direct local access, never public preview/deployment.
function local(request: NextRequest) {
  const host = request.headers.get("host") || "";
  if (!/^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(host)) return false;
  const origin = request.headers.get("origin");
  if (request.method !== "GET") {
    if (origin ? origin !== `http://${host}` : !(request.headers.get("sec-fetch-site") === "same-origin" && request.headers.get("referer")?.startsWith(`http://${host}/`))) return false;
  }
  return process.env.TRUV_LOCAL_WORKSPACE === "1";
}
function error(message: string, status: number) { return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } }); }
export async function GET(req: NextRequest) {
  if (!local(req)) return error("Local workspace is disabled or not accessed through localhost.", 403);
  try {
    const user = session(req.cookies.get(cookie)?.value);
    if (!user) return error("Please sign in to the local workspace.", 401);
    const db = dataDb();
    try {
      const rows = user.role === "buyer"
        ? db.prepare("SELECT * FROM rfqs WHERE buyer_id=? ORDER BY created_at DESC").all(user.id)
        : db.prepare("SELECT r.*,o.name AS buyer_name FROM rfqs r JOIN organizations o ON o.id=r.buyer_id WHERE r.kind=? ORDER BY r.created_at DESC").all(user.role === "manufacturer" ? "goods" : "service");
      return NextResponse.json({ user, rfqs: rows }, { headers: { "Cache-Control": "no-store" } });
    } finally { db.close(); }
  } catch { return error("Local storage is unavailable. Check setup instructions.", 503); }
}
export async function POST(req: NextRequest) {
  if (!local(req)) return error("Local workspace is disabled or not accessed through localhost.", 403);
  try {
    if (Number(req.headers.get("content-length") || 0) > 16000) return error("Request is too large.", 413);
    const payload = await req.json();
    if (payload.action === "login") {
      if (typeof payload.email !== "string" || typeof payload.password !== "string" || payload.email.length > 254 || payload.password.length > 1024) return error("Invalid credentials.", 400);
      const result = login(payload.email.trim(), payload.password);
      if (!result) return error("Invalid email or password.", 401);
      const response = NextResponse.json({ user: result.user });
      response.cookies.set(cookie, result.token, { httpOnly: true, sameSite: "strict", path: "/", maxAge: 28800 });
      return response;
    }
    if (payload.action === "logout") {
      logout(req.cookies.get(cookie)?.value);
      const response = NextResponse.json({ ok: true });
      response.cookies.set(cookie, "", { httpOnly: true, sameSite: "strict", path: "/", maxAge: 0 });
      return response;
    }
    const user = session(req.cookies.get(cookie)?.value);
    if (!user) return error("Please sign in.", 401);
    if (payload.action !== "create_rfq" || user.role !== "buyer") return error("Not permitted.", 403);
    if (typeof payload.title !== "string" || !payload.title.trim() || payload.title.length > 200 || typeof payload.description !== "string" || !payload.description.trim() || payload.description.length > 5000 || !["goods", "service"].includes(payload.kind)) return error("Enter a title, description and request type.", 400);
    const db = dataDb();
    try {
      db.exec("BEGIN IMMEDIATE");
      try {
        db.prepare("INSERT INTO organizations (id,name,role) VALUES (?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name").run(user.id, user.company, user.role);
        db.prepare("INSERT INTO rfqs (id,buyer_id,kind,title,description) VALUES (?,?,?,?,?)").run(randomUUID(), user.id, payload.kind, payload.title.trim(), payload.description.trim());
        db.exec("COMMIT");
      } catch (e) { db.exec("ROLLBACK"); throw e; }
    } finally { db.close(); }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch { return error("Unable to complete the request. Check local storage and account setup.", 500); }
}
