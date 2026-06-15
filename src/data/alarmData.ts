import type { AlarmSeverity } from "@/data/mockData";

export type AlarmCategory = "hardware" | "network" | "power" | "billing" | "security" | "maintenance";
export type AlarmStatus = "active" | "acknowledged" | "resolved";

export interface AlarmExtended {
  id: string;
  severity: AlarmSeverity;
  status: AlarmStatus;
  stationId: string;
  stationName: string;
  chargerId: string | null;
  chargerLabel: string | null;
  message: string;
  detail: string;
  timestamp: Date;
  acknowledgedAt: Date | null;
  acknowledgedBy: string | null;
  resolvedAt: Date | null;
  category: AlarmCategory;
  code: string;
}

const now = new Date();
const minsAgo  = (m: number) => new Date(now.getTime() - m * 60000);
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000);
const daysAgo  = (d: number) => new Date(now.getTime() - d * 86400000);

export const allAlarms: AlarmExtended[] = [
  // ── Active / Critical ──────────────────────────────────────────────────────
  {
    id: "ALM-001", severity: "critical", status: "active",
    stationId: "STN-001", stationName: "SG Highway EV Hub", chargerId: "CHG-005", chargerLabel: "B2",
    message: "Thermal runaway detected — charger shutdown",
    detail: "Charger B2 reached 74°C, exceeding the 65°C safety threshold. Emergency shutdown triggered. Session SES-003 terminated. Inspect cooling system and IGBT module before restart.",
    timestamp: minsAgo(3), acknowledgedAt: null, acknowledgedBy: null, resolvedAt: null,
    category: "hardware", code: "HW-TEMP-001",
  },
  {
    id: "ALM-002", severity: "critical", status: "active",
    stationId: "STN-003", stationName: "Ring Road Charging Station", chargerId: null, chargerLabel: null,
    message: "Ground fault protection tripped — DC bus isolated",
    detail: "Ground fault detected on 400V DC bus. All DC chargers (CHG-019, CHG-021) suspended. Safety interlock engaged. On-site technician dispatch required before reset.",
    timestamp: minsAgo(11), acknowledgedAt: null, acknowledgedBy: null, resolvedAt: null,
    category: "power", code: "PWR-GFI-001",
  },
  {
    id: "ALM-003", severity: "critical", status: "active",
    stationId: "STN-009", stationName: "Cyber City Fast Charge Station", chargerId: "CHG-061", chargerLabel: "D1",
    message: "HPC charger overcurrent fault — breaker tripped",
    detail: "Charger D1 (350 kW) recorded 398A sustained for 8 seconds, exceeding 380A limit. Main breaker tripped. Cabinet CB-03 needs manual reset after inspection. Session SES-032 failed mid-charge.",
    timestamp: minsAgo(19), acknowledgedAt: null, acknowledgedBy: null, resolvedAt: null,
    category: "power", code: "PWR-OC-002",
  },

  // ── Active / Major ─────────────────────────────────────────────────────────
  {
    id: "ALM-004", severity: "major", status: "active",
    stationId: "STN-007", stationName: "Hinjewadi Tech Park EV Hub", chargerId: null, chargerLabel: null,
    message: "Station offline — primary comms link lost (29 min)",
    detail: "Primary fibre uplink to STN-007 has been unresponsive for 29 minutes. Backup 4G LTE link is active. OCPP heartbeat failing. Contact ISP to investigate fibre cut at Hinjewadi Junction.",
    timestamp: minsAgo(29), acknowledgedAt: null, acknowledgedBy: null, resolvedAt: null,
    category: "network", code: "NET-LINK-001",
  },
  {
    id: "ALM-005", severity: "major", status: "active",
    stationId: "STN-001", stationName: "SG Highway EV Hub", chargerId: "CHG-010", chargerLabel: "D2",
    message: "Charger D2 unreachable via OCPP for 18 minutes",
    detail: "Charger CHG-010 has not sent a heartbeat in 18 minutes. Three restart attempts via remote command failed. Power cycle via PDU required. No active session was affected.",
    timestamp: minsAgo(47), acknowledgedAt: null, acknowledgedBy: null, resolvedAt: null,
    category: "network", code: "NET-OCPP-002",
  },
  {
    id: "ALM-006", severity: "major", status: "active",
    stationId: "STN-005", stationName: "Vadodara Express EV Point", chargerId: "CHG-031", chargerLabel: "B1",
    message: "Payment terminal timeout — 3 transactions declined",
    detail: "CHAdeMO payment terminal on B1 has been timing out for 62 minutes. 3 customer transactions declined with error code 'TERM_NO_RESP'. Failover to QR code payment is active. Terminal firmware may need update.",
    timestamp: minsAgo(62), acknowledgedAt: null, acknowledgedBy: null, resolvedAt: null,
    category: "billing", code: "BIL-TERM-001",
  },
  {
    id: "ALM-007", severity: "major", status: "active",
    stationId: "STN-008", stationName: "Whitefield EV Charging Hub", chargerId: "CHG-051", chargerLabel: "B1",
    message: "Charger temperature warning — approaching fault threshold",
    detail: "CHG-051 (B1) temperature reached 67°C. Auto-throttling initiated: max output reduced to 30 kW from 50 kW. If temperature exceeds 70°C, automatic shutdown will occur. Check ambient cooling.",
    timestamp: minsAgo(38), acknowledgedAt: null, acknowledgedBy: null, resolvedAt: null,
    category: "hardware", code: "HW-TEMP-002",
  },

  // ── Acknowledged / Major ───────────────────────────────────────────────────
  {
    id: "ALM-008", severity: "major", status: "acknowledged",
    stationId: "STN-003", stationName: "Ring Road Charging Station", chargerId: "CHG-019", chargerLabel: "A1",
    message: "Charge rate limited — transformer load constraint",
    detail: "Peak demand at Ring Road substation exceeded 95% capacity. CHG-019 auto-limited to 60 kW from 150 kW maximum per demand response protocol DR-02. Limitation will be released after 19:00.",
    timestamp: minsAgo(88), acknowledgedAt: minsAgo(75), acknowledgedBy: "Ravi Sharma", resolvedAt: null,
    category: "power", code: "PWR-DR-001",
  },
  {
    id: "ALM-009", severity: "major", status: "acknowledged",
    stationId: "STN-011", stationName: "OMR Charging Station", chargerId: "CHG-070", chargerLabel: "B1",
    message: "CHAdeMO charger hardware fault — service required",
    detail: "CHG-070 reported error code 0x3A (contactor welding suspected). Session terminated safely. Charger locked out pending physical inspection. Service ticket #SVC-2025-0892 raised.",
    timestamp: hoursAgo(3), acknowledgedAt: hoursAgo(2), acknowledgedBy: "Priya Nair", resolvedAt: null,
    category: "hardware", code: "HW-CONT-001",
  },

  // ── Active / Minor ─────────────────────────────────────────────────────────
  {
    id: "ALM-010", severity: "minor", status: "active",
    stationId: "STN-004", stationName: "Rajkot Smart Charging Hub", chargerId: null, chargerLabel: null,
    message: "OTA firmware update failed on 2 units",
    detail: "Scheduled firmware update OTA-v4.3.1 failed on CHG-025 and CHG-027 due to low disk space. Current version v4.2.1 remains active. Manual intervention required to clear cache before retry.",
    timestamp: hoursAgo(2), acknowledgedAt: null, acknowledgedBy: null, resolvedAt: null,
    category: "maintenance", code: "MAINT-OTA-001",
  },
  {
    id: "ALM-011", severity: "minor", status: "active",
    stationId: "STN-002", stationName: "GIFT City EV Station", chargerId: "CHG-016", chargerLabel: "B2",
    message: "Charger offline — scheduled maintenance window",
    detail: "CHG-016 taken offline for quarterly preventive maintenance. Expected back online by 14:00 today. Maintenance team on-site performing contactors and cooling system inspection.",
    timestamp: hoursAgo(1), acknowledgedAt: null, acknowledgedBy: null, resolvedAt: null,
    category: "maintenance", code: "MAINT-PM-001",
  },
  {
    id: "ALM-012", severity: "minor", status: "acknowledged",
    stationId: "STN-006", stationName: "Mumbai Express EV Plaza", chargerId: null, chargerLabel: null,
    message: "Solar array output 19% below forecast",
    detail: "PV array at Mumbai Express generating 198 kW vs 245 kW forecast due to overcast conditions. Grid import automatically increased to compensate. No customer impact. Energy cost marginally higher.",
    timestamp: hoursAgo(3), acknowledgedAt: hoursAgo(2), acknowledgedBy: "Anjali Desai", resolvedAt: null,
    category: "power", code: "PWR-SOLAR-001",
  },
  {
    id: "ALM-013", severity: "minor", status: "active",
    stationId: "STN-010", stationName: "HITEC City EV Station", chargerId: "CHG-067", chargerLabel: "D1",
    message: "Charger offline — network switch reboot",
    detail: "Local network switch at HITEC City rebooted (power flicker at 03:14). CHG-067 lost OCPP connectivity and did not auto-reconnect. Remote restart command sent — awaiting response.",
    timestamp: hoursAgo(4), acknowledgedAt: null, acknowledgedBy: null, resolvedAt: null,
    category: "network", code: "NET-SWITCH-001",
  },

  // ── Info ───────────────────────────────────────────────────────────────────
  {
    id: "ALM-014", severity: "info", status: "acknowledged",
    stationId: "STN-002", stationName: "GIFT City EV Station", chargerId: null, chargerLabel: null,
    message: "Station reached 95% utilization — demand response sent",
    detail: "All available chargers at GIFT City are occupied. Demand response signal broadcast to 6 enrolled vehicles suggesting they delay charging by 30 minutes. Waitlist queue: 2 vehicles.",
    timestamp: hoursAgo(3), acknowledgedAt: hoursAgo(3), acknowledgedBy: "System", resolvedAt: null,
    category: "network", code: "NET-DR-001",
  },
  {
    id: "ALM-015", severity: "info", status: "resolved",
    stationId: "STN-001", stationName: "SG Highway EV Hub", chargerId: null, chargerLabel: null,
    message: "Network latency spike detected — resolved automatically",
    detail: "OCPP latency to STN-001 briefly exceeded 800ms threshold (peak 1.2s) due to regional ISP congestion. Latency normalised within 4 minutes. No sessions affected. BGP rerouting resolved the issue.",
    timestamp: hoursAgo(6), acknowledgedAt: hoursAgo(6), acknowledgedBy: "System", resolvedAt: hoursAgo(5),
    category: "network", code: "NET-LAT-001",
  },
  {
    id: "ALM-016", severity: "info", status: "resolved",
    stationId: "STN-012", stationName: "Mansarovar EV Hub", chargerId: null, chargerLabel: null,
    message: "Scheduled backup completed successfully",
    detail: "Nightly configuration backup for STN-012 completed at 02:30. Config snapshot EV-BAK-20250614-STN012 uploaded to secure cloud storage. Retention: 90 days.",
    timestamp: daysAgo(1), acknowledgedAt: daysAgo(1), acknowledgedBy: "System", resolvedAt: daysAgo(1),
    category: "maintenance", code: "MAINT-BAK-001",
  },
  {
    id: "ALM-017", severity: "minor", status: "resolved",
    stationId: "STN-005", stationName: "Vadodara Express EV Point", chargerId: "CHG-033", chargerLabel: "C1",
    message: "Connector latch sensor intermittent fault — resolved",
    detail: "Connector C1 reported intermittent latch sensor errors (0x12) for 6 sessions over 2 days. Field tech replaced the latch sensor assembly. 3 subsequent sessions completed without error.",
    timestamp: daysAgo(2), acknowledgedAt: daysAgo(2), acknowledgedBy: "Vikram Patel", resolvedAt: daysAgo(1),
    category: "hardware", code: "HW-LATCH-001",
  },
  {
    id: "ALM-018", severity: "major", status: "resolved",
    stationId: "STN-009", stationName: "Cyber City Fast Charge Station", chargerId: null, chargerLabel: null,
    message: "Grid voltage sag — HPC chargers auto-derated",
    detail: "Grid voltage dropped to 358V (nominal 415V) for 14 minutes due to upstream transformer fault. All 350 kW chargers auto-derated to 200 kW. Utility restored voltage. Full capacity restored at 11:42.",
    timestamp: daysAgo(3), acknowledgedAt: daysAgo(3), acknowledgedBy: "Kiran Mehta", resolvedAt: daysAgo(3),
    category: "power", code: "PWR-SAG-001",
  },
  {
    id: "ALM-019", severity: "critical", status: "resolved",
    stationId: "STN-007", stationName: "Hinjewadi Tech Park EV Hub", chargerId: "CHG-047", chargerLabel: "B1",
    message: "Charger fire suppression system activated",
    detail: "Smoke detected in CHG-047 cabinet. Automatic CO2 suppression activated at 22:17. Station evacuated. Fire brigade attended — false alarm (condensation on sensor). Charger locked out for full inspection. Cleared at 01:30.",
    timestamp: daysAgo(5), acknowledgedAt: daysAgo(5), acknowledgedBy: "Site Manager", resolvedAt: daysAgo(4),
    category: "security", code: "SEC-FIRE-001",
  },
  {
    id: "ALM-020", severity: "info", status: "resolved",
    stationId: "STN-004", stationName: "Rajkot Smart Charging Hub", chargerId: null, chargerLabel: null,
    message: "New charger CHG-028 commissioned successfully",
    detail: "CHG-028 (Type2, 22 kW) installed and commissioned at Rajkot Smart Hub. OCPP 1.6 registration confirmed. First test session completed. Added to fleet management system.",
    timestamp: daysAgo(7), acknowledgedAt: daysAgo(7), acknowledgedBy: "Commissioning Team", resolvedAt: daysAgo(7),
    category: "maintenance", code: "MAINT-COMM-001",
  },
];

// ─── Derived helpers ──────────────────────────────────────────────────────────

export const SEVERITY_ORDER: Record<AlarmSeverity, number> = {
  critical: 0, major: 1, minor: 2, info: 3,
};

export const CATEGORY_LABELS: Record<AlarmCategory, string> = {
  hardware: "Hardware", network: "Network", power: "Power",
  billing: "Billing", security: "Security", maintenance: "Maintenance",
};