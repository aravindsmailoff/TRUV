import { NextRequest, NextResponse } from "next/server";
import { transactionGraph } from "@/lib/intelligence/graphNetwork";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const requestingTenantId = searchParams.get("tenantId") || "biz_us_apparel_02";
  const role = (searchParams.get("role") as "buyer" | "seller" | "admin") || "buyer";
  const targetBusinessId = searchParams.get("target") || "biz_in_textiles_01";

  const result = transactionGraph.queryNetwork({
    requestingTenantId,
    role,
    targetBusinessId,
  });

  return NextResponse.json(result);
}

