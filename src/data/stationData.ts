// ─── Station Extended Data ────────────────────────────────────────────────────

export interface StationMeta {
  id: string;
  operator: string;
  installDate: string;
  lastMaintenance: string;
  nextMaintenance: string;
  connectorTypes: string[];
  tags: string[];
  address: string;
  contactEmail: string;
  networkType: "Highway" | "Urban" | "Fleet" | "Airport" | "Campus";
}

export const stationMeta: StationMeta[] = [
  {
    id: "STN-001",
    operator: "ALTREX Operations Pvt. Ltd.",
    installDate: "2022-08-14",
    lastMaintenance: "2025-04-03",
    nextMaintenance: "2025-10-03",
    connectorTypes: ["CCS2", "CHAdeMO", "Type2"],
    tags: ["24/7", "Solar-Assisted", "Flagship"],
    address: "SG Highway, Prahlad Nagar, Ahmedabad 380015",
    contactEmail: "sg-highway@altrex.in",
    networkType: "Urban",
  },
  {
    id: "STN-002",
    operator: "ALTREX Operations Pvt. Ltd.",
    installDate: "2022-11-21",
    lastMaintenance: "2025-05-12",
    nextMaintenance: "2025-11-12",
    connectorTypes: ["CCS2", "Type2"],
    tags: ["HPC", "24/7", "Smart-Grid"],
    address: "GIFT City, Sector 12, Gandhinagar 382355",
    contactEmail: "gift-city@altrex.in",
    networkType: "Urban",
  },
  {
    id: "STN-003",
    operator: "Partner: PortConnect India",
    installDate: "2023-03-07",
    lastMaintenance: "2025-02-28",
    nextMaintenance: "2025-08-28",
    connectorTypes: ["CCS2", "CHAdeMO", "Type2"],
    tags: ["Industrial", "Fleet"],
    address: "Udhna Magdalla Road, Surat 395007",
    contactEmail: "surat-ring@altrex.in",
    networkType: "Fleet",
  },
  {
    id: "STN-004",
    operator: "Partner: Rajkot Smart City Ltd.",
    installDate: "2023-06-19",
    lastMaintenance: "2025-05-01",
    nextMaintenance: "2025-11-01",
    connectorTypes: ["CCS2", "Type2"],
    tags: ["Smart City", "24/7"],
    address: "Kalawad Road, Rajkot 360001",
    contactEmail: "rajkot@altrex.in",
    networkType: "Urban",
  },
  {
    id: "STN-005",
    operator: "ALTREX Operations Pvt. Ltd.",
    installDate: "2023-01-30",
    lastMaintenance: "2025-03-15",
    nextMaintenance: "2025-09-15",
    connectorTypes: ["CCS2", "CHAdeMO", "Type2"],
    tags: ["Corporate", "Solar"],
    address: "Alkapuri Society, Vadodara 390007",
    contactEmail: "vadodara@altrex.in",
    networkType: "Urban",
  },
  {
    id: "STN-006",
    operator: "Partner: BKC Infrastructure Ltd.",
    installDate: "2022-09-05",
    lastMaintenance: "2025-05-20",
    nextMaintenance: "2025-11-20",
    connectorTypes: ["CCS2", "Type2"],
    tags: ["HPC", "24/7", "Flagship"],
    address: "BKC, Bandra Kurla Complex, Mumbai 400051",
    contactEmail: "mumbai-bkc@altrex.in",
    networkType: "Urban",
  },
  {
    id: "STN-007",
    operator: "ALTREX Operations Pvt. Ltd.",
    installDate: "2023-09-11",
    lastMaintenance: "2025-01-14",
    nextMaintenance: "2025-07-14",
    connectorTypes: ["CCS2", "Type2"],
    tags: ["Tech Park", "Fleet"],
    address: "Hinjewadi Phase 1, Pune 411057",
    contactEmail: "pune-hinjewadi@altrex.in",
    networkType: "Campus",
  },
  {
    id: "STN-008",
    operator: "Partner: Whitefield IT Park Assoc.",
    installDate: "2023-11-02",
    lastMaintenance: "2025-04-22",
    nextMaintenance: "2025-10-22",
    connectorTypes: ["CCS2", "CHAdeMO", "Type2"],
    tags: ["IT Corridor", "Solar-Assisted"],
    address: "ITPL Road, Whitefield, Bengaluru 560066",
    contactEmail: "bengaluru-whitefield@altrex.in",
    networkType: "Campus",
  },
  {
    id: "STN-009",
    operator: "ALTREX Operations Pvt. Ltd.",
    installDate: "2023-02-14",
    lastMaintenance: "2025-05-10",
    nextMaintenance: "2025-11-10",
    connectorTypes: ["CCS2", "CHAdeMO"],
    tags: ["HPC", "Corporate", "24/7"],
    address: "DLF Cyber City, Phase 2, Gurugram 122002",
    contactEmail: "gurugram-cybercity@altrex.in",
    networkType: "Urban",
  },
  {
    id: "STN-010",
    operator: "ALTREX Operations Pvt. Ltd.",
    installDate: "2023-05-22",
    lastMaintenance: "2025-03-28",
    nextMaintenance: "2025-09-28",
    connectorTypes: ["CCS2", "Type2"],
    tags: ["Tech Hub", "High-Utilization"],
    address: "HITEC City Main Rd, Madhapur, Hyderabad 500081",
    contactEmail: "hyderabad-hitech@altrex.in",
    networkType: "Urban",
  },
  {
    id: "STN-011",
    operator: "Partner: OMR Developers Assoc.",
    installDate: "2023-08-01",
    lastMaintenance: "2025-04-15",
    nextMaintenance: "2025-10-15",
    connectorTypes: ["CCS2", "CHAdeMO", "Type2"],
    tags: ["IT Corridor", "Coastal"],
    address: "Old Mahabalipuram Road, Perungudi, Chennai 600096",
    contactEmail: "chennai-omr@altrex.in",
    networkType: "Urban",
  },
  {
    id: "STN-012",
    operator: "ALTREX Operations Pvt. Ltd.",
    installDate: "2023-10-10",
    lastMaintenance: "2025-05-05",
    nextMaintenance: "2025-11-05",
    connectorTypes: ["CCS2", "Type2"],
    tags: ["Residential", "24/7"],
    address: "Mansarovar Sector 3, Jaipur 302020",
    contactEmail: "jaipur-mansarovar@altrex.in",
    networkType: "Urban",
  },
];

// ─── Per-station 7-day revenue (Mon→Sun, in INR) ──────────────────────────────

export const stationRevenue7d: Record<string, number[]> = {
  "STN-001": [16210, 17800, 15430, 19020, 22340, 25670, 18420],
  "STN-002": [28900, 31020, 27540, 33110, 36780, 40120, 32110],
  "STN-003": [8120, 9340, 7780, 10120, 10890, 12010, 9780],
  "STN-004": [5340, 6120, 4980, 6870, 7010, 7430, 6540],
  "STN-005": [9340, 10120, 8890, 11340, 12030, 12980, 11230],
  "STN-006": [17890, 19340, 16780, 21010, 22340, 24010, 20870],
  "STN-007": [2450, 2890, 2120, 3340, 3560, 3890, 3120],
  "STN-008": [4010, 4450, 3780, 5120, 5230, 5670, 4890],
  "STN-009": [13400, 14500, 12900, 15600, 17800, 19200, 15640],
  "STN-010": [8900, 9500, 8200, 10200, 11500, 12800, 10250],
  "STN-011": [6700, 7200, 6500, 7800, 8900, 9400, 7820],
  "STN-012": [5100, 5600, 4900, 5900, 6400, 7100, 5980],
};

// ─── Per-station 24h energy (hourly kWh) ──────────────────────────────────────

export const stationEnergy24h: Record<string, number[]> = {
  "STN-001": [42, 35, 28, 22, 19, 28, 54, 98, 142, 167, 178, 189, 184, 179, 167, 158, 168, 189, 201, 195, 178, 156, 134, 98],
  "STN-002": [68, 54, 42, 34, 28, 41, 87, 156, 212, 243, 261, 278, 271, 263, 248, 234, 251, 278, 298, 289, 256, 223, 189, 143],
  "STN-003": [28, 21, 16, 12, 10, 15, 34, 67, 98, 112, 121, 128, 124, 119, 112, 106, 113, 128, 138, 134, 119, 103, 88, 67],
  "STN-004": [18, 13, 9, 7, 5, 8, 21, 45, 67, 78, 84, 89, 86, 82, 77, 73, 78, 89, 96, 93, 82, 71, 60, 46],
  "STN-005": [34, 26, 19, 15, 12, 18, 45, 83, 121, 138, 147, 156, 152, 147, 138, 130, 139, 156, 168, 163, 144, 125, 107, 81],
  "STN-006": [54, 42, 31, 24, 20, 29, 67, 123, 178, 203, 217, 229, 223, 217, 204, 193, 206, 229, 247, 239, 212, 184, 157, 119],
  "STN-007": [12, 9, 6, 5, 4, 6, 18, 34, 52, 59, 63, 67, 65, 63, 59, 56, 60, 67, 72, 70, 62, 54, 46, 35],
  "STN-008": [22, 17, 12, 9, 7, 11, 28, 52, 76, 87, 93, 98, 96, 93, 87, 82, 88, 98, 106, 103, 91, 79, 68, 51],
  "STN-009": [38, 31, 25, 20, 17, 25, 48, 88, 128, 150, 160, 170, 166, 161, 150, 142, 151, 170, 181, 176, 160, 140, 121, 88],
  "STN-010": [25, 20, 16, 13, 11, 16, 31, 57, 83, 98, 104, 110, 108, 105, 98, 92, 98, 110, 117, 114, 104, 91, 78, 57],
  "STN-011": [20, 16, 13, 10, 9, 13, 25, 46, 67, 79, 84, 89, 87, 85, 79, 75, 80, 89, 95, 92, 84, 74, 63, 46],
  "STN-012": [15, 12, 10, 8, 7, 10, 19, 35, 51, 60, 64, 68, 66, 64, 60, 57, 61, 68, 72, 70, 64, 56, 48, 35],
};