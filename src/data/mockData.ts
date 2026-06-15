// ─── Types ────────────────────────────────────────────────────────────────────

export type ChargerStatus = "charging" | "available" | "fault" | "offline";
export type AlarmSeverity = "critical" | "major" | "minor" | "info";
export type ConnectorType = "CCS2" | "CHAdeMO" | "Type2" | "OCPP";

export interface Station {
  id: string;
  name: string;
  location: string;
  city: string;
  lat: number;
  lng: number;
  totalChargers: number;
  activeChargers: number;
  faultChargers: number;
  offlineChargers: number;
  powerCapacityKW: number;
  currentLoadKW: number;
  revenue24h: number;
  uptime: number; // percent
}

export interface Charger {
  id: string;
  stationId: string;
  label: string;
  status: ChargerStatus;
  connectorType: ConnectorType;
  powerKW: number;
  currentPowerKW: number;
  sessionId: string | null;
  voltage: number;
  current: number;
  temperature: number;
}

export interface ChargingSession {
  id: string;
  chargerId: string;
  chargerLabel: string;
  stationName: string;
  vehicleId: string;
  driverName: string;
  startTime: Date;
  durationMin: number;
  energyKWh: number;
  powerKW: number;
  stateOfCharge: number; // percent
  targetSoC: number;
  cost: number;
  connectorType: ConnectorType;
}

export interface Alarm {
  id: string;
  severity: AlarmSeverity;
  stationName: string;
  chargerId: string | null;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  category: "hardware" | "network" | "power" | "billing" | "security";
}

export interface EnergyDataPoint {
  time: string;
  totalKWh: number;
  solarKWh: number;
  gridKWh: number;
  peakKW: number;
}

export interface RevenueDataPoint {
  day: string;
  revenue: number;
  sessions: number;
  avgDuration: number;
}

export interface UtilizationDataPoint {
  hour: string;
  utilization: number;
  sessions: number;
}

// ─── Stations ─────────────────────────────────────────────────────────────────

export const stations: Station[] = [
  {
    id: "STN-001",
    name: "SG Highway EV Hub",
    location: "SG Highway, Prahlad Nagar",
    city: "Ahmedabad",
    lat: 23.0225,
    lng: 72.5714,
    totalChargers: 12,
    activeChargers: 8,
    faultChargers: 1,
    offlineChargers: 1,
    powerCapacityKW: 600,
    currentLoadKW: 387,
    revenue24h: 18420,
    uptime: 94.2,
  },
  {
    id: "STN-002",
    name: "GIFT City EV Station",
    location: "GIFT City, Sector 12",
    city: "Gandhinagar",
    lat: 23.1685,
    lng: 72.6798,
    totalChargers: 20,
    activeChargers: 15,
    faultChargers: 0,
    offlineChargers: 2,
    powerCapacityKW: 1200,
    currentLoadKW: 743,
    revenue24h: 32110,
    uptime: 97.8,
  },
  {
    id: "STN-003",
    name: "Ring Road Charging Station",
    location: "Udhna Magdalla Road",
    city: "Surat",
    lat: 21.1702,
    lng: 72.8311,
    totalChargers: 8,
    activeChargers: 5,
    faultChargers: 2,
    offlineChargers: 0,
    powerCapacityKW: 400,
    currentLoadKW: 212,
    revenue24h: 9780,
    uptime: 88.5,
  },
  {
    id: "STN-004",
    name: "Rajkot Smart Charging Hub",
    location: "Kalawad Road, Rajkot",
    city: "Rajkot",
    lat: 22.3039,
    lng: 70.8022,
    totalChargers: 6,
    activeChargers: 4,
    faultChargers: 0,
    offlineChargers: 0,
    powerCapacityKW: 300,
    currentLoadKW: 178,
    revenue24h: 6540,
    uptime: 100,
  },
  {
    id: "STN-005",
    name: "Vadodara Express EV Point",
    location: "Alkapuri, Vadodara",
    city: "Vadodara",
    lat: 22.3072,
    lng: 73.1812,
    totalChargers: 10,
    activeChargers: 7,
    faultChargers: 1,
    offlineChargers: 0,
    powerCapacityKW: 500,
    currentLoadKW: 298,
    revenue24h: 11230,
    uptime: 96.0,
  },
  {
    id: "STN-006",
    name: "Mumbai Express EV Plaza",
    location: "BKC, Bandra Kurla Complex",
    city: "Mumbai",
    lat: 19.0596,
    lng: 72.8650,
    totalChargers: 16,
    activeChargers: 11,
    faultChargers: 0,
    offlineChargers: 1,
    powerCapacityKW: 800,
    currentLoadKW: 521,
    revenue24h: 20870,
    uptime: 98.1,
  },
  {
    id: "STN-007",
    name: "Hinjewadi Tech Park EV Hub",
    location: "Hinjewadi Phase 1",
    city: "Pune",
    lat: 18.5914,
    lng: 73.7380,
    totalChargers: 4,
    activeChargers: 2,
    faultChargers: 0,
    offlineChargers: 2,
    powerCapacityKW: 200,
    currentLoadKW: 87,
    revenue24h: 3120,
    uptime: 82.3,
  },
  {
    id: "STN-008",
    name: "Whitefield EV Charging Hub",
    location: "ITPL Road, Whitefield",
    city: "Bengaluru",
    lat: 12.9698,
    lng: 77.7499,
    totalChargers: 6,
    activeChargers: 3,
    faultChargers: 1,
    offlineChargers: 0,
    powerCapacityKW: 240,
    currentLoadKW: 134,
    revenue24h: 4890,
    uptime: 91.7,
  },
  {
    id: "STN-009",
    name: "Cyber City Fast Charge Station",
    location: "DLF Cyber City, Gurugram",
    city: "Delhi NCR",
    lat: 28.4949,
    lng: 77.0878,
    totalChargers: 14,
    activeChargers: 10,
    faultChargers: 1,
    offlineChargers: 0,
    powerCapacityKW: 700,
    currentLoadKW: 462,
    revenue24h: 15640,
    uptime: 95.4,
  },
  {
    id: "STN-010",
    name: "HITEC City EV Station",
    location: "HITEC City, Madhapur",
    city: "Hyderabad",
    lat: 17.4435,
    lng: 78.3772,
    totalChargers: 10,
    activeChargers: 7,
    faultChargers: 0,
    offlineChargers: 1,
    powerCapacityKW: 500,
    currentLoadKW: 315,
    revenue24h: 10250,
    uptime: 97.2,
  },
  {
    id: "STN-011",
    name: "OMR Charging Station",
    location: "Old Mahabalipuram Road, Perungudi",
    city: "Chennai",
    lat: 12.9516,
    lng: 80.2282,
    totalChargers: 8,
    activeChargers: 5,
    faultChargers: 1,
    offlineChargers: 0,
    powerCapacityKW: 400,
    currentLoadKW: 198,
    revenue24h: 7820,
    uptime: 90.8,
  },
  {
    id: "STN-012",
    name: "Mansarovar EV Hub",
    location: "Mansarovar, Jaipur",
    city: "Jaipur",
    lat: 26.8467,
    lng: 75.7558,
    totalChargers: 6,
    activeChargers: 4,
    faultChargers: 0,
    offlineChargers: 0,
    powerCapacityKW: 300,
    currentLoadKW: 165,
    revenue24h: 5980,
    uptime: 99.1,
  },
];

export const chargers: Charger[] = [
  // STN-001 — SG Highway EV Hub, Ahmedabad
  { id: "CHG-001", stationId: "STN-001", label: "A1", status: "charging",   connectorType: "CCS2",    powerKW: 150, currentPowerKW: 142, sessionId: "SES-001", voltage: 800, current: 177, temperature: 38 },
  { id: "CHG-002", stationId: "STN-001", label: "A2", status: "charging",   connectorType: "CCS2",    powerKW: 150, currentPowerKW: 131, sessionId: "SES-002", voltage: 800, current: 164, temperature: 41 },
  { id: "CHG-003", stationId: "STN-001", label: "A3", status: "available",  connectorType: "CCS2",    powerKW: 150, currentPowerKW: 0,   sessionId: null,      voltage: 0,   current: 0,   temperature: 27 },
  { id: "CHG-004", stationId: "STN-001", label: "B1", status: "charging",   connectorType: "CHAdeMO", powerKW: 50,  currentPowerKW: 48,  sessionId: "SES-003", voltage: 400, current: 120, temperature: 35 },
  { id: "CHG-005", stationId: "STN-001", label: "B2", status: "fault",      connectorType: "CHAdeMO", powerKW: 50,  currentPowerKW: 0,   sessionId: null,      voltage: 0,   current: 0,   temperature: 74 },
  { id: "CHG-006", stationId: "STN-001", label: "C1", status: "charging",   connectorType: "Type2",   powerKW: 22,  currentPowerKW: 21,  sessionId: "SES-004", voltage: 230, current: 32,  temperature: 31 },
  { id: "CHG-007", stationId: "STN-001", label: "C2", status: "available",  connectorType: "Type2",   powerKW: 22,  currentPowerKW: 0,   sessionId: null,      voltage: 0,   current: 0,   temperature: 25 },
  { id: "CHG-008", stationId: "STN-001", label: "C3", status: "charging",   connectorType: "Type2",   powerKW: 22,  currentPowerKW: 19,  sessionId: "SES-005", voltage: 230, current: 32,  temperature: 33 },
  { id: "CHG-009", stationId: "STN-001", label: "D1", status: "charging",   connectorType: "CCS2",    powerKW: 150, currentPowerKW: 138, sessionId: "SES-006", voltage: 800, current: 172, temperature: 40 },
  { id: "CHG-010", stationId: "STN-001", label: "D2", status: "offline",    connectorType: "CCS2",    powerKW: 150, currentPowerKW: 0,   sessionId: null,      voltage: 0,   current: 0,   temperature: 22 },
  { id: "CHG-011", stationId: "STN-001", label: "D3", status: "charging",   connectorType: "CCS2",    powerKW: 150, currentPowerKW: 149, sessionId: "SES-007", voltage: 800, current: 186, temperature: 45 },
  { id: "CHG-012", stationId: "STN-001", label: "E1", status: "available",  connectorType: "Type2",   powerKW: 22,  currentPowerKW: 0,   sessionId: null,      voltage: 0,   current: 0,   temperature: 26 },

  // STN-002 — GIFT City EV Station, Gandhinagar
  { id: "CHG-013", stationId: "STN-002", label: "A1", status: "charging",   connectorType: "CCS2",    powerKW: 350, currentPowerKW: 312, sessionId: "SES-008", voltage: 1000, current: 312, temperature: 47 },
  { id: "CHG-014", stationId: "STN-002", label: "A2", status: "charging",   connectorType: "CCS2",    powerKW: 350, currentPowerKW: 298, sessionId: "SES-009", voltage: 1000, current: 298, temperature: 45 },
  { id: "CHG-015", stationId: "STN-002", label: "B1", status: "available",  connectorType: "CCS2",    powerKW: 350, currentPowerKW: 0,   sessionId: null,      voltage: 0,   current: 0,   temperature: 28 },
  { id: "CHG-016", stationId: "STN-002", label: "B2", status: "offline",    connectorType: "CCS2",    powerKW: 350, currentPowerKW: 0,   sessionId: null,      voltage: 0,   current: 0,   temperature: 23 },
  { id: "CHG-017", stationId: "STN-002", label: "C1", status: "charging",   connectorType: "Type2",   powerKW: 22,  currentPowerKW: 20,  sessionId: "SES-010", voltage: 230, current: 32,  temperature: 30 },
  { id: "CHG-018", stationId: "STN-002", label: "C2", status: "available",  connectorType: "Type2",   powerKW: 22,  currentPowerKW: 0,   sessionId: null,      voltage: 0,   current: 0,   temperature: 24 },

  // STN-003 — Ring Road Charging Station, Surat
  { id: "CHG-019", stationId: "STN-003", label: "A1", status: "charging",   connectorType: "CCS2",    powerKW: 150, currentPowerKW: 134, sessionId: "SES-011", voltage: 800, current: 167, temperature: 39 },
  { id: "CHG-020", stationId: "STN-003", label: "A2", status: "fault",      connectorType: "CCS2",    powerKW: 150, currentPowerKW: 0,   sessionId: null,      voltage: 0,   current: 0,   temperature: 71 },
  { id: "CHG-021", stationId: "STN-003", label: "B1", status: "charging",   connectorType: "CHAdeMO", powerKW: 50,  currentPowerKW: 44,  sessionId: "SES-012", voltage: 400, current: 110, temperature: 36 },
  { id: "CHG-022", stationId: "STN-003", label: "B2", status: "fault",      connectorType: "CHAdeMO", powerKW: 50,  currentPowerKW: 0,   sessionId: null,      voltage: 0,   current: 0,   temperature: 68 },
  { id: "CHG-023", stationId: "STN-003", label: "C1", status: "available",  connectorType: "Type2",   powerKW: 22,  currentPowerKW: 0,   sessionId: null,      voltage: 0,   current: 0,   temperature: 26 },
  { id: "CHG-024", stationId: "STN-003", label: "C2", status: "charging",   connectorType: "Type2",   powerKW: 22,  currentPowerKW: 18,  sessionId: "SES-013", voltage: 230, current: 30,  temperature: 34 },

  // STN-004 — Rajkot Smart Charging Hub
  { id: "CHG-025", stationId: "STN-004", label: "A1", status: "charging",   connectorType: "CCS2",    powerKW: 150, currentPowerKW: 128, sessionId: "SES-014", voltage: 800, current: 160, temperature: 37 },
  { id: "CHG-026", stationId: "STN-004", label: "A2", status: "available",  connectorType: "CCS2",    powerKW: 150, currentPowerKW: 0,   sessionId: null,      voltage: 0,   current: 0,   temperature: 26 },
  { id: "CHG-027", stationId: "STN-004", label: "B1", status: "charging",   connectorType: "Type2",   powerKW: 22,  currentPowerKW: 20,  sessionId: "SES-015", voltage: 230, current: 32,  temperature: 29 },
  { id: "CHG-028", stationId: "STN-004", label: "B2", status: "available",  connectorType: "Type2",   powerKW: 22,  currentPowerKW: 0,   sessionId: null,      voltage: 0,   current: 0,   temperature: 24 },
];

// ─── Active Sessions ───────────────────────────────────────────────────────────

const now = new Date();
const minsAgo = (m: number) => new Date(now.getTime() - m * 60000);

export const activeSessions: ChargingSession[] = [
  { id: "SES-001", chargerId: "CHG-001", chargerLabel: "A1", stationName: "SG Highway EV Hub",        vehicleId: "GJ01AB1234", driverName: "Arjun Patel",       startTime: minsAgo(42),  durationMin: 42,  energyKWh: 99.4,  powerKW: 142, stateOfCharge: 74, targetSoC: 90,  cost: 3479, connectorType: "CCS2"    },
  { id: "SES-002", chargerId: "CHG-002", chargerLabel: "A2", stationName: "SG Highway EV Hub",        vehicleId: "GJ05CD5678", driverName: "Priya Shah",        startTime: minsAgo(18),  durationMin: 18,  energyKWh: 39.3,  powerKW: 131, stateOfCharge: 52, targetSoC: 80,  cost: 1376, connectorType: "CCS2"    },
  { id: "SES-003", chargerId: "CHG-004", chargerLabel: "B1", stationName: "SG Highway EV Hub",        vehicleId: "GJ09EF9012", driverName: "Ravi Mehta",        startTime: minsAgo(67),  durationMin: 67,  energyKWh: 53.6,  powerKW: 48,  stateOfCharge: 88, targetSoC: 95,  cost: 1876, connectorType: "CHAdeMO" },
  { id: "SES-004", chargerId: "CHG-006", chargerLabel: "C1", stationName: "SG Highway EV Hub",        vehicleId: "GJ06GH3456", driverName: "Meena Desai",       startTime: minsAgo(112), durationMin: 112, energyKWh: 39.2,  powerKW: 21,  stateOfCharge: 91, targetSoC: 100, cost: 1372, connectorType: "Type2"   },
  { id: "SES-005", chargerId: "CHG-008", chargerLabel: "C3", stationName: "SG Highway EV Hub",        vehicleId: "GJ03IJ7890", driverName: "Suresh Joshi",      startTime: minsAgo(29),  durationMin: 29,  energyKWh: 9.2,   powerKW: 19,  stateOfCharge: 33, targetSoC: 80,  cost: 322,  connectorType: "Type2"   },
  { id: "SES-006", chargerId: "CHG-009", chargerLabel: "D1", stationName: "SG Highway EV Hub",        vehicleId: "GJ01KL1111", driverName: "Kavya Nair",        startTime: minsAgo(8),   durationMin: 8,   energyKWh: 18.4,  powerKW: 138, stateOfCharge: 21, targetSoC: 80,  cost: 644,  connectorType: "CCS2"    },
  { id: "SES-007", chargerId: "CHG-011", chargerLabel: "D3", stationName: "SG Highway EV Hub",        vehicleId: "GJ07MN2222", driverName: "Vikram Singh",      startTime: minsAgo(55),  durationMin: 55,  energyKWh: 136.6, powerKW: 149, stateOfCharge: 81, targetSoC: 90,  cost: 4781, connectorType: "CCS2"    },
  { id: "SES-008", chargerId: "CHG-013", chargerLabel: "A1", stationName: "GIFT City EV Station",     vehicleId: "GJ17OP3333", driverName: "Ananya Trivedi",    startTime: minsAgo(14),  durationMin: 14,  energyKWh: 72.8,  powerKW: 312, stateOfCharge: 18, targetSoC: 80,  cost: 2548, connectorType: "CCS2"    },
  { id: "SES-009", chargerId: "CHG-014", chargerLabel: "A2", stationName: "GIFT City EV Station",     vehicleId: "GJ17QR4444", driverName: "Nilesh Kapoor",     startTime: minsAgo(31),  durationMin: 31,  energyKWh: 154.0, powerKW: 298, stateOfCharge: 45, targetSoC: 90,  cost: 5390, connectorType: "CCS2"    },
  { id: "SES-010", chargerId: "CHG-017", chargerLabel: "C1", stationName: "GIFT City EV Station",     vehicleId: "GJ02ST5555", driverName: "Deepa Rao",         startTime: minsAgo(23),  durationMin: 23,  energyKWh: 7.7,   powerKW: 20,  stateOfCharge: 44, targetSoC: 75,  cost: 269,  connectorType: "Type2"   },
  { id: "SES-011", chargerId: "CHG-019", chargerLabel: "A1", stationName: "Ring Road Charging Station",vehicleId: "GJ05UV6666", driverName: "Mohan Bhatia",      startTime: minsAgo(37),  durationMin: 37,  energyKWh: 82.7,  powerKW: 134, stateOfCharge: 63, targetSoC: 85,  cost: 2894, connectorType: "CCS2"    },
  { id: "SES-012", chargerId: "CHG-021", chargerLabel: "B1", stationName: "Ring Road Charging Station",vehicleId: "MH12CD4321", driverName: "Sneha Kulkarni",    startTime: minsAgo(51),  durationMin: 51,  energyKWh: 37.4,  powerKW: 44,  stateOfCharge: 72, targetSoC: 90,  cost: 1309, connectorType: "CHAdeMO" },
  { id: "SES-013", chargerId: "CHG-024", chargerLabel: "C2", stationName: "Ring Road Charging Station",vehicleId: "GJ05WX7777", driverName: "Harsh Solanki",     startTime: minsAgo(19),  durationMin: 19,  energyKWh: 5.7,   powerKW: 18,  stateOfCharge: 28, targetSoC: 70,  cost: 200,  connectorType: "Type2"   },
  { id: "SES-014", chargerId: "CHG-025", chargerLabel: "A1", stationName: "Rajkot Smart Charging Hub", vehicleId: "GJ03YZ8888", driverName: "Bhavesh Pandya",    startTime: minsAgo(45),  durationMin: 45,  energyKWh: 96.0,  powerKW: 128, stateOfCharge: 68, targetSoC: 88,  cost: 3360, connectorType: "CCS2"    },
  { id: "SES-015", chargerId: "CHG-027", chargerLabel: "B1", stationName: "Rajkot Smart Charging Hub", vehicleId: "GJ03AB9999", driverName: "Hiral Vyas",        startTime: minsAgo(62),  durationMin: 62,  energyKWh: 20.7,  powerKW: 20,  stateOfCharge: 55, targetSoC: 80,  cost: 724,  connectorType: "Type2"   },
];

// ─── Alarms ────────────────────────────────────────────────────────────────────

export const alarms: Alarm[] = [
  { id: "ALM-001", severity: "critical", stationName: "SG Highway EV Hub",         chargerId: "CHG-005", message: "Charger B2 — over temperature detected. Temperature 74°C exceeds 65°C threshold. Emergency stop activated, session terminated.",        timestamp: minsAgo(4),   acknowledged: false, category: "hardware" },
  { id: "ALM-002", severity: "critical", stationName: "Ring Road Charging Station", chargerId: "CHG-020", message: "Ground fault protection tripped on DC bus. All DC chargers suspended pending DISCOM safety inspection.",                               timestamp: minsAgo(12),  acknowledged: false, category: "power"    },
  { id: "ALM-003", severity: "major",    stationName: "Hinjewadi Tech Park EV Hub", chargerId: null,      message: "Station offline — network connectivity loss for 31 minutes. Backup Jio 4G link active. OCPP heartbeat resumed.",                        timestamp: minsAgo(31),  acknowledged: false, category: "network"  },
  { id: "ALM-004", severity: "major",    stationName: "SG Highway EV Hub",         chargerId: "CHG-010", message: "Charger D2 unreachable via OCPP for 18 minutes. Remote restart attempted via CMS — no response. Field inspection required.",            timestamp: minsAgo(49),  acknowledged: true,  category: "network"  },
  { id: "ALM-005", severity: "major",    stationName: "Whitefield EV Charging Hub", chargerId: "CHG-033", message: "UPI payment gateway timeout on connector C1. 4 transactions declined. Razorpay fallback active. Manual reconciliation needed.",          timestamp: minsAgo(65),  acknowledged: false, category: "billing"  },
  { id: "ALM-006", severity: "minor",    stationName: "Ring Road Charging Station", chargerId: "CHG-019", message: "Charge rate limited to 60 kW due to GETCO transformer load constraint. Peak demand tariff in effect until 22:00.",                       timestamp: minsAgo(90),  acknowledged: true,  category: "power"    },
  { id: "ALM-007", severity: "minor",    stationName: "Rajkot Smart Charging Hub",  chargerId: null,      message: "Scheduled OTA firmware update v4.3.2 failed on 2 units. Manual intervention required via service portal.",                              timestamp: minsAgo(137), acknowledged: true,  category: "hardware" },
  { id: "ALM-008", severity: "info",     stationName: "GIFT City EV Station",       chargerId: null,      message: "Rooftop solar array output 22% below forecast due to dust accumulation. Grid import from DGVCL increased automatically.",                timestamp: minsAgo(193), acknowledged: true,  category: "power"    },
  { id: "ALM-009", severity: "info",     stationName: "Cyber City Fast Charge Station", chargerId: null,  message: "Station utilization reached 92%. Demand response signal sent to 6 enrolled vehicles via OCPP 2.0.1 smart charging profile.",             timestamp: minsAgo(218), acknowledged: true,  category: "network"  },
  { id: "ALM-010", severity: "minor",    stationName: "Vadodara Express EV Point",  chargerId: "CHG-030", message: "Low input voltage warning — grid supply dropped to 198V (nominal 230V). Charger output derated to 16 kW to protect inverter.",           timestamp: minsAgo(244), acknowledged: true,  category: "power"    },
];

// ─── Energy Trend (last 24h, hourly) ──────────────────────────────────────────
// India has high solar irradiance; solar contribution peaks 09:00–16:00.
// Evening peak (18:00–21:00) reflects post-work charging demand.

export const energyTrendData: EnergyDataPoint[] = [
  { time: "00:00", totalKWh: 156, solarKWh: 0,   gridKWh: 156, peakKW: 342  },
  { time: "01:00", totalKWh: 128, solarKWh: 0,   gridKWh: 128, peakKW: 284  },
  { time: "02:00", totalKWh: 97,  solarKWh: 0,   gridKWh: 97,  peakKW: 213  },
  { time: "03:00", totalKWh: 74,  solarKWh: 0,   gridKWh: 74,  peakKW: 162  },
  { time: "04:00", totalKWh: 61,  solarKWh: 0,   gridKWh: 61,  peakKW: 138  },
  { time: "05:00", totalKWh: 83,  solarKWh: 6,   gridKWh: 77,  peakKW: 181  },
  { time: "06:00", totalKWh: 172, solarKWh: 28,  gridKWh: 144, peakKW: 376  },
  { time: "07:00", totalKWh: 318, solarKWh: 68,  gridKWh: 250, peakKW: 694  },
  { time: "08:00", totalKWh: 467, solarKWh: 134, gridKWh: 333, peakKW: 1021 },
  { time: "09:00", totalKWh: 534, solarKWh: 198, gridKWh: 336, peakKW: 1168 },
  { time: "10:00", totalKWh: 578, solarKWh: 241, gridKWh: 337, peakKW: 1264 },
  { time: "11:00", totalKWh: 612, solarKWh: 268, gridKWh: 344, peakKW: 1338 },
  { time: "12:00", totalKWh: 598, solarKWh: 279, gridKWh: 319, peakKW: 1307 },
  { time: "13:00", totalKWh: 571, solarKWh: 274, gridKWh: 297, peakKW: 1248 },
  { time: "14:00", totalKWh: 543, solarKWh: 258, gridKWh: 285, peakKW: 1187 },
  { time: "15:00", totalKWh: 511, solarKWh: 224, gridKWh: 287, peakKW: 1117 },
  { time: "16:00", totalKWh: 489, solarKWh: 161, gridKWh: 328, peakKW: 1069 },
  { time: "17:00", totalKWh: 563, solarKWh: 87,  gridKWh: 476, peakKW: 1231 },
  { time: "18:00", totalKWh: 648, solarKWh: 18,  gridKWh: 630, peakKW: 1417 },
  { time: "19:00", totalKWh: 634, solarKWh: 0,   gridKWh: 634, peakKW: 1386 },
  { time: "20:00", totalKWh: 589, solarKWh: 0,   gridKWh: 589, peakKW: 1287 },
  { time: "21:00", totalKWh: 512, solarKWh: 0,   gridKWh: 512, peakKW: 1119 },
  { time: "22:00", totalKWh: 418, solarKWh: 0,   gridKWh: 418, peakKW: 914  },
  { time: "23:00", totalKWh: 312, solarKWh: 0,   gridKWh: 312, peakKW: 682  },
];

// ─── Revenue (last 7 days, in INR) ────────────────────────────────────────────
// Indian EV charging rate: ~₹15–18/kWh for DC fast chargers.
// Medium network with 12 stations, ~120 chargers.

export const revenueData: RevenueDataPoint[] = [
  { day: "Mon", revenue: 82340,  sessions: 312, avgDuration: 38 },
  { day: "Tue", revenue: 91870,  sessions: 341, avgDuration: 41 },
  { day: "Wed", revenue: 76540,  sessions: 289, avgDuration: 36 },
  { day: "Thu", revenue: 104210, sessions: 398, avgDuration: 44 },
  { day: "Fri", revenue: 128930, sessions: 487, avgDuration: 47 },
  { day: "Sat", revenue: 143120, sessions: 542, avgDuration: 52 },
  { day: "Sun", revenue: 110870, sessions: 421, avgDuration: 48 },
];

// ─── Station Utilization (hourly, today) ──────────────────────────────────────
// Indian pattern: morning peak (08:00–10:00), post-work peak (18:00–21:00).

export const utilizationData: UtilizationDataPoint[] = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0") + ":00";
  // Dual-peak sine: morning peak around 09:00, evening peak around 19:00
  const morning = Math.sin((i - 9) * Math.PI / 5) * 30;
  const evening = Math.sin((i - 19) * Math.PI / 4) * 35;
  const base = Math.max(morning, evening) + 45;
  const noise = Math.random() * 8 - 4;
  const utilization = Math.max(5, Math.min(97, Math.round(base + noise)));
  return {
    hour,
    utilization,
    sessions: Math.round(utilization * 0.42),
  };
});

// ─── KPI Summary ──────────────────────────────────────────────────────────────

export const kpiData = {
  totalStations: stations.length,
  totalChargers: stations.reduce((s, x) => s + x.totalChargers, 0),
  activeChargers: stations.reduce((s, x) => s + x.activeChargers, 0),
  faultChargers: stations.reduce((s, x) => s + x.faultChargers, 0),
  offlineChargers: stations.reduce((s, x) => s + x.offlineChargers, 0),
  activeSessions: activeSessions.length,
  totalEnergyToday: energyTrendData.reduce((s, x) => s + x.totalKWh, 0),
  totalRevenueToday: stations.reduce((s, x) => s + x.revenue24h, 0),
  networkUptime: parseFloat(
    (stations.reduce((s, x) => s + x.uptime, 0) / stations.length).toFixed(1)
  ),
  activeAlarms: alarms.filter((a) => !a.acknowledged).length,
  criticalAlarms: alarms.filter((a) => a.severity === "critical" && !a.acknowledged).length,
  totalCapacityKW: stations.reduce((s, x) => s + x.powerCapacityKW, 0),
  currentLoadKW: stations.reduce((s, x) => s + x.currentLoadKW, 0),
};