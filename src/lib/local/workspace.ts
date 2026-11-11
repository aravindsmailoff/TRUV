import { DatabaseSync } from "node:sqlite";
import { createHash, scryptSync, timingSafeEqual, randomBytes } from "node:crypto";
import path from "node:path";
import { existsSync } from "node:fs";

const dataDirectory = process.env.TRUV_LOCAL_DATA_DIR || path.join(process.cwd(), "data");
export type LocalUser = { id: string; name: string; email: string; company: string; role: "buyer" | "manufacturer" | "service" };
type LoginRow = LocalUser & { salt: string; password_hash: string };
export function authDb() {
  const file = path.join(dataDirectory, "local-auth.sqlite3");
  if (!existsSync(file)) throw new Error("Create local accounts first using scripts/db/create-local-user.py.");
  return new DatabaseSync(file);
}
export function dataDb() {
  const file = path.join(dataDirectory, "truv.sqlite3");
  if (!existsSync(file)) throw new Error("Initialize the database first using scripts/db/init.py.");
  const db = new DatabaseSync(file);
  db.exec("PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000");
  return db;
}
const digest = (value: string) => createHash("sha256").update(value).digest("hex");
export function login(email: string, password: string) {
  const db = authDb();
  try {
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase()) as LoginRow | undefined;
    const salt = user?.salt || "00000000000000000000000000000000";
    const expected = user ? Buffer.from(user.password_hash, "hex") : Buffer.alloc(64);
    const actual = scryptSync(password, Buffer.from(salt, "hex"), 64);
    if (!user || expected.length !== actual.length || !timingSafeEqual(actual, expected)) return null;
    const token = randomBytes(32).toString("hex");
    db.prepare("DELETE FROM sessions WHERE expires_at < ?").run(Date.now());
    db.prepare("INSERT INTO sessions (token_hash,user_id,expires_at) VALUES (?,?,?)").run(digest(token), user.id, Date.now() + 8 * 60 * 60 * 1000);
    return { token, user: { id: user.id, email: user.email, name: user.name, company: user.company, role: user.role } };
  } finally { db.close(); }
}
export function session(token: string | undefined): LocalUser | null {
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const db = authDb();
  try { return (db.prepare("SELECT u.id,u.email,u.name,u.company,u.role FROM users u JOIN sessions s ON s.user_id=u.id WHERE s.token_hash=? AND s.expires_at>?").get(digest(token), Date.now()) as LocalUser | undefined) ?? null; }
  finally { db.close(); }
}
export function logout(token: string | undefined) {
  if (!token) return;
  const db = authDb();
  try { db.prepare("DELETE FROM sessions WHERE token_hash=?").run(digest(token)); } finally { db.close(); }
}
