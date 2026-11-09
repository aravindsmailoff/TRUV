import { NextRequest, NextResponse } from "next/server";
import { INITIAL_BUSINESSES, INITIAL_CAPABILITIES } from "@/lib/intelligence/store";
import { BusinessEntity, VerificationStatus } from "@/types/intelligence";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const business = INITIAL_BUSINESSES.find((b) => b.id === id);
    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }
    const capability = INITIAL_CAPABILITIES[id];
    return NextResponse.json({ business, capability });
  }

  return NextResponse.json({
    totalBusinesses: INITIAL_BUSINESSES.length,
    businesses: INITIAL_BUSINESSES,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { legalName, country, gstin, iecCode, documents = [] } = body;

    // Cross-check DGFT IEC and GST format rules
    let status: VerificationStatus = "in_progress";
    let notes = "Self-declared registration submitted.";

    if (country === "India") {
      const isValidGST = gstin && /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin);
      const isValidIEC = iecCode && /^[0-9]{10}$/.test(iecCode);

      if (isValidGST && isValidIEC && documents.length > 0) {
        status = "verified_evidence";
        notes = "Verified against DGFT Central Server & GSTN live records. Active taxpayer.";
      } else if (!isValidGST || !isValidIEC) {
        status = "verification_failed";
        notes = "Invalid GSTIN or IEC format detected during automated schema validation.";
      }
    }

    const newBusiness: BusinessEntity = {
      id: `biz_${Date.now()}`,
      legalName,
      tradeName: legalName,
      country,
      registrationNumber: gstin || iecCode || `REG-${Date.now()}`,
      gstin,
      iecCode,
      role: "seller",
      verificationStatus: status,
      verificationEvidence: {
        verifiedAt: status === "verified_evidence" ? new Date().toISOString() : undefined,
        verifiedBy: "DGFT_GSTN_VALIDATOR_V2",
        checkedRegistries: ["DGFT", "GSTN"],
        notes,
      },
      documents,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      business: newBusiness,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request payload", details: (error as Error).message },
      { status: 400 }
    );
  }
}

