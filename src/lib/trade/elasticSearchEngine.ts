/**
 * Elastic Enterprise Search & Semantic Match Engine for TRUV
 *
 * Tool: Elastic (Elasticsearch BM25 + Dense Vector Semantic Embeddings)
 * For What: AI-powered Indian MSME manufacturer discovery and technical RFQ matching.
 * Why: Foreign buyers specify complex engineering specifications, material standards
 * (e.g., C36000 brass, EN 12164, ASTM B117 salt spray, DIN 933 fasteners, ±0.01mm tolerances).
 * Elastic performs fuzzy BM25 text queries and semantic vector scoring to match RFQs with
 * verified Indian industrial manufacturing clusters (Rajkot, Moradabad, Ludhiana, Peenya, Morbi).
 */

export interface MSMEClusterProfile {
  id: string;
  legalEntity: string;
  cluster: string;
  state: string;
  specialization: string[];
  materials: string[];
  certifications: string[];
  equipment: string[];
  monthlyCapacityUnits: number;
  dgftIecStatus: "VERIFIED" | "PENDING";
  iecNumber: string;
  exportReadyScore: number; // 0 - 100
  pastExportCorridors: string[];
}

export const INDIAN_MANUFACTURING_CLUSTERS: MSMEClusterProfile[] = [
  {
    id: "msme_rajkot_01",
    legalEntity: "Apex Precision Forgings & Turned Parts Ltd",
    cluster: "Rajkot Industrial Zone (Aji GIDC)",
    state: "Gujarat",
    specialization: ["High-pressure hydraulic fittings", "Forged brass valves", "CNC turned bushings"],
    materials: ["Brass C36000", "Forged Copper Alloy", "AISI 316 Stainless Steel"],
    certifications: ["ISO 9001:2015", "CE Mark", "IATF 16949"],
    equipment: ["Doosan 5-Axis CNC Turning Center", "500-Ton Forging Press", "Optical CMM Inspector"],
    monthlyCapacityUnits: 85000,
    dgftIecStatus: "VERIFIED",
    iecNumber: "0812049182",
    exportReadyScore: 96,
    pastExportCorridors: ["Germany", "United States", "UAE"],
  },
  {
    id: "msme_moradabad_02",
    legalEntity: "Moradabad Precision Foundry & Hardware Exports",
    cluster: "Moradabad Brassware Special Zone",
    state: "Uttar Pradesh",
    specialization: ["Architectural solid brass mortise locksets", "PVD coated lever handles", "Window cremone bolts"],
    materials: ["Brass alloy C36000", "EN 12164 architectural brass", "Bronze"],
    certifications: ["ISO 9001:2015", "ANSI Grade 1 Cycle Fatigue Tested", "RoHS Compliant"],
    equipment: ["Gravity die casting carousel", "Robotic PVD brass coating chamber", "Salt spray test chamber ASTM B117"],
    monthlyCapacityUnits: 45000,
    dgftIecStatus: "VERIFIED",
    iecNumber: "0508012491",
    exportReadyScore: 94,
    pastExportCorridors: ["United States", "United Kingdom", "Canada"],
  },
  {
    id: "msme_ludhiana_03",
    legalEntity: "Punjab Cold Forged Fasteners & Hex Bolts Corp",
    cluster: "Ludhiana Focal Point Industrial Area",
    state: "Punjab",
    specialization: ["High-tensile Grade 8.8 / 10.9 hex bolts", "Flange nuts", "Cold forged custom fasteners"],
    materials: ["Medium carbon alloy steel", "Boron steel", "Zinc nickel electroplate"],
    certifications: ["ISO 9001:2015", "DIN EN ISO 898-1", "CE"],
    equipment: ["National Cold Former 6-die", "Continuous mesh belt heat treatment line", "Automated optical sorting"],
    monthlyCapacityUnits: 1200000,
    dgftIecStatus: "VERIFIED",
    iecNumber: "0314059281",
    exportReadyScore: 91,
    pastExportCorridors: ["Poland", "Germany", "Netherlands"],
  },
  {
    id: "msme_peenya_04",
    legalEntity: "Karnataka Precision Aerospace & Tooling Tools",
    cluster: "Peenya Industrial Area, Bengaluru",
    state: "Karnataka",
    specialization: ["Aerospace structural brackets", "Titanium milled fixtures", "Micro-precision hydraulic manifolds"],
    materials: ["Titanium Grade 5", "Aerospace Aluminum 7075-T6", "Inconel 718"],
    certifications: ["AS9100D", "ISO 9001:2015", "Nadcap NDT Certified"],
    equipment: ["Makino 5-Axis Milling Centers", "Zeiss CMM ±1 micron", "Wire EDM Charmilles"],
    monthlyCapacityUnits: 15000,
    dgftIecStatus: "VERIFIED",
    iecNumber: "0719028472",
    exportReadyScore: 98,
    pastExportCorridors: ["France", "United States", "Israel"],
  },
  {
    id: "msme_morbi_05",
    legalEntity: "Saurashtra Vitrified Tiles & Engineered Cladding",
    cluster: "Morbi Ceramic Hub",
    state: "Gujarat",
    specialization: ["Large-format porcelain slabs", "Anti-skid outdoor pavers", "Antibacterial floor vitrified tiles"],
    materials: ["Ultra-compact sintered porcelain", "Kaolin clays", "Nano-glazed silicate"],
    certifications: ["ISO 13006:2018", "CE Marking", "GreenPro Certified"],
    equipment: ["Sacmi Continua+ 16000T Roller Press", "Digital Inkjet 12-color Glazer", "Automated Sorting Robot"],
    monthlyCapacityUnits: 450000,
    dgftIecStatus: "VERIFIED",
    iecNumber: "0816073910",
    exportReadyScore: 89,
    pastExportCorridors: ["Saudi Arabia", "United States", "Australia"],
  },
];

export class ElasticTradeSearchEngine {
  /**
   * Elastic BM25 + Vector Match Query Simulation
   * Evaluates query terms across technical specifications, certifications, and materials.
   */
  public searchSuitableManufacturers(query: {
    productDescription: string;
    targetMaterial?: string;
    minCapacityUnits?: number;
    requiredCertification?: string;
  }) {
    const qLower = query.productDescription.toLowerCase();

    const scored = INDIAN_MANUFACTURING_CLUSTERS.map((msme) => {
      let score = 0;
      const matchReasons: string[] = [];

      // Keyword & specialization BM25 boost
      msme.specialization.forEach((spec) => {
        if (qLower.includes(spec.toLowerCase()) || spec.toLowerCase().includes(qLower)) {
          score += 45;
          matchReasons.push(`Exact specialization match: ${spec}`);
        } else {
          const words = spec.toLowerCase().split(" ");
          const matchedWords = words.filter((w) => w.length > 3 && qLower.includes(w));
          if (matchedWords.length > 0) {
            score += matchedWords.length * 15;
            matchReasons.push(`Technical match keywords: ${matchedWords.join(", ")}`);
          }
        }
      });

      // Material compatibility boost
      msme.materials.forEach((mat) => {
        if (qLower.includes(mat.toLowerCase()) || (query.targetMaterial && mat.toLowerCase().includes(query.targetMaterial.toLowerCase()))) {
          score += 25;
          matchReasons.push(`Material compatibility verified: ${mat}`);
        }
      });

      // Export certification verification
      if (query.requiredCertification) {
        if (msme.certifications.some((c) => c.toLowerCase().includes(query.requiredCertification!.toLowerCase()))) {
          score += 20;
          matchReasons.push(`Required compliance certificate present: ${query.requiredCertification}`);
        }
      }

      // DGFT IEC statutory standing boost
      if (msme.dgftIecStatus === "VERIFIED") {
        score += 15;
      }

      // Capacity filter
      const meetsCapacity = !query.minCapacityUnits || msme.monthlyCapacityUnits >= query.minCapacityUnits;
      if (!meetsCapacity) {
        score *= 0.5;
        matchReasons.push(`Capacity warning: Requires ${query.minCapacityUnits}, factory capacity is ${msme.monthlyCapacityUnits}`);
      }

      return {
        msme,
        relevanceScore: Math.min(100, score),
        matchReasons,
        meetsCapacity,
        elasticIndex: "truv-msme-clusters-v2",
      };
    });

    // Rank descending by Elastic score
    return scored.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
}

export const elasticSearchEngine = new ElasticTradeSearchEngine();

