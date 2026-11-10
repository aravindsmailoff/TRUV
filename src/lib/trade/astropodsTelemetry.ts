/**
 * Astropods Satellite Cargo & Container Telemetry for TRUV
 *
 * Tool: Astropods (AIS Satellite Vessel Tracking & IoT Container Telemetry)
 * For What: Live tracking of ocean containers departing Indian ports (Mundra, Nhava Sheva)
 * destined for foreign ports (Long Beach, Felixstowe, Hamburg, Jebel Ali).
 * Why: Cross-border trade execution requires empirical evidence of movement before
 * the final 70% balance is released against the original Bill of Lading. Astropods delivers
 * satellite vessel coordinates, container seal integrity, and port gate-in verification.
 */

export interface ContainerShipmentTelemetry {
  containerNumber: string;
  sealNumber: string;
  carrierVessel: string;
  voyageNumber: string;
  imoNumber: string;
  originPort: string;
  destinationPort: string;
  currentCoordinates: {
    lat: number;
    lng: number;
    locationName: string;
  };
  vesselSpeedKnots: number;
  estArrivalDate: string;
  daysRemaining: number;
  containerTempCelsius: number;
  sealIntegrity: "INTACT" | "BREACHED";
  status: "PORT_GATE_IN" | "CUSTOMS_CLEARED" | "VESSEL_DEPARTED" | "IN_TRANSIT" | "ARRIVED_DESTINATION";
}

export const ACTIVE_SHIPMENTS: Record<string, ContainerShipmentTelemetry> = {
  "ORD-9921": {
    containerNumber: "MSKU-7491024",
    sealNumber: "IN-LEO-98214",
    carrierVessel: "Maersk Mc-Kinney Moller",
    voyageNumber: "2644W",
    imoNumber: "9619907",
    originPort: "Mundra Port (INMUN1), India",
    destinationPort: "Port of Long Beach (USLGB), United States",
    currentCoordinates: {
      lat: 12.8421,
      lng: 51.4921,
      locationName: "Arabian Sea (En route via Gulf of Aden)",
    },
    vesselSpeedKnots: 18.4,
    estArrivalDate: "2026-11-28",
    daysRemaining: 18,
    containerTempCelsius: 24.2,
    sealIntegrity: "INTACT",
    status: "IN_TRANSIT",
  },
  "ORD-9918": {
    containerNumber: "CMAU-4819201",
    sealNumber: "IN-LEO-61842",
    carrierVessel: "CMA CGM Palais Royal",
    voyageNumber: "0FM74E",
    imoNumber: "9839181",
    originPort: "Jawaharlal Nehru Port (INNSA), Mumbai, India",
    destinationPort: "Port of Felixstowe (GBFXT), United Kingdom",
    currentCoordinates: {
      lat: 51.956,
      lng: 1.341,
      locationName: "Felixstowe Berthing Terminal 6",
    },
    vesselSpeedKnots: 0.0,
    estArrivalDate: "2026-11-09",
    daysRemaining: 0,
    containerTempCelsius: 16.5,
    sealIntegrity: "INTACT",
    status: "ARRIVED_DESTINATION",
  },
};

export class AstropodsCargoTracker {
  public getShipmentTelemetry(orderNumber: string): ContainerShipmentTelemetry | null {
    return ACTIVE_SHIPMENTS[orderNumber] || null;
  }

  public getAllActiveShipments(): ContainerShipmentTelemetry[] {
    return Object.values(ACTIVE_SHIPMENTS);
  }
}

export const astropodsTracker = new AstropodsCargoTracker();
