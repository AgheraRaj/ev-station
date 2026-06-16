import { activeSessions, type ChargingSession } from "@/data/mockData";

export type SessionStatus = "active" | "completed" | "interrupted";
export type PaymentMethod = "UPI" | "RFID" | "App" | "Card";

export interface HistoricalSession extends ChargingSession {
  status: SessionStatus;
  endTime: Date | null;
  paymentMethod: PaymentMethod;
  stopReason: string | null;
}

const base = new Date();
const hoursAgo = (h: number) => new Date(base.getTime() - h * 3_600_000);
const daysAgo  = (d: number, h = 0) => new Date(base.getTime() - d * 86_400_000 - h * 3_600_000);

// Wrap active sessions with status="active"
const activeHistorical: HistoricalSession[] = activeSessions.map((s) => ({
  ...s,
  status: "active",
  endTime: null,
  paymentMethod: (["UPI","RFID","App","Card"] as PaymentMethod[])[
    Math.abs(s.id.charCodeAt(4) - 48) % 4
  ],
  stopReason: null,
}));

export const completedSessions: HistoricalSession[] = [
  // ── Today ──────────────────────────────────────────────────────────────────
  { id:"SES-101", chargerId:"CHG-003", chargerLabel:"A3", stationName:"SG Highway EV Hub",          vehicleId:"GJ01BC2211", driverName:"Dhruv Patel",       startTime:hoursAgo(2),   durationMin:58,  energyKWh:135.6, powerKW:140, stateOfCharge:90, targetSoC:90,  cost:4746, connectorType:"CCS2",    status:"completed",   endTime:hoursAgo(1),    paymentMethod:"UPI",  stopReason:"Target SoC reached"    },
  { id:"SES-102", chargerId:"CHG-007", chargerLabel:"C2", stationName:"SG Highway EV Hub",          vehicleId:"GJ05YZ3344", driverName:"Riya Jain",         startTime:hoursAgo(3.5), durationMin:45,  energyKWh:16.5,  powerKW:22,  stateOfCharge:80, targetSoC:80,  cost:578,  connectorType:"Type2",   status:"completed",   endTime:hoursAgo(2.8),  paymentMethod:"RFID", stopReason:"Target SoC reached"    },
  { id:"SES-103", chargerId:"CHG-013", chargerLabel:"A1", stationName:"GIFT City EV Station",       vehicleId:"GJ17AB5566", driverName:"Aakash Shah",       startTime:hoursAgo(1.2), durationMin:22,  energyKWh:107.4, powerKW:293, stateOfCharge:65, targetSoC:65,  cost:3759, connectorType:"CCS2",    status:"interrupted", endTime:hoursAgo(0.9),  paymentMethod:"App",  stopReason:"User stopped manually" },
  { id:"SES-104", chargerId:"CHG-019", chargerLabel:"A1", stationName:"Ring Road Charging Station", vehicleId:"GJ05CD7788", driverName:"Farhan Shaikh",     startTime:hoursAgo(4),   durationMin:72,  energyKWh:160.2, powerKW:134, stateOfCharge:95, targetSoC:95,  cost:5607, connectorType:"CCS2",    status:"completed",   endTime:hoursAgo(2.8),  paymentMethod:"UPI",  stopReason:"Target SoC reached"    },
  { id:"SES-105", chargerId:"CHG-025", chargerLabel:"A1", stationName:"Rajkot Smart Charging Hub",  vehicleId:"GJ03EF9900", driverName:"Komal Dave",        startTime:hoursAgo(3),   durationMin:38,  energyKWh:80.7,  powerKW:128, stateOfCharge:75, targetSoC:75,  cost:2824, connectorType:"CCS2",    status:"completed",   endTime:hoursAgo(2.4),  paymentMethod:"Card", stopReason:"Target SoC reached"    },
  { id:"SES-106", chargerId:"CHG-027", chargerLabel:"B1", stationName:"Rajkot Smart Charging Hub",  vehicleId:"GJ03GH1122", driverName:"Sanjay Trivedi",    startTime:hoursAgo(5),   durationMin:95,  energyKWh:31.7,  powerKW:20,  stateOfCharge:100,targetSoC:100, cost:1109, connectorType:"Type2",   status:"completed",   endTime:hoursAgo(3.4),  paymentMethod:"RFID", stopReason:"Target SoC reached"    },
  { id:"SES-107", chargerId:"CHG-033", chargerLabel:"C1", stationName:"Whitefield EV Charging Hub", vehicleId:"KA01IJ3344", driverName:"Shruti Rao",        startTime:hoursAgo(2.5), durationMin:43,  energyKWh:59.7,  powerKW:83,  stateOfCharge:78, targetSoC:80,  cost:2089, connectorType:"CCS2",    status:"interrupted", endTime:hoursAgo(1.8),  paymentMethod:"UPI",  stopReason:"Payment failed"        },
  { id:"SES-108", chargerId:"CHG-040", chargerLabel:"A2", stationName:"Cyber City Fast Charge Station", vehicleId:"DL3CAF9988", driverName:"Rohit Arora",  startTime:hoursAgo(1.5), durationMin:34,  energyKWh:166.1, powerKW:295, stateOfCharge:72, targetSoC:72,  cost:5813, connectorType:"CCS2",    status:"completed",   endTime:hoursAgo(0.9),  paymentMethod:"App",  stopReason:"Target SoC reached"    },
  { id:"SES-109", chargerId:"CHG-045", chargerLabel:"B2", stationName:"HITEC City EV Station",      vehicleId:"TS09KL6677", driverName:"Preethi Reddy",     startTime:hoursAgo(3.2), durationMin:62,  energyKWh:149.5, powerKW:145, stateOfCharge:90, targetSoC:90,  cost:5232, connectorType:"CCS2",    status:"completed",   endTime:hoursAgo(2.2),  paymentMethod:"RFID", stopReason:"Target SoC reached"    },
  { id:"SES-110", chargerId:"CHG-050", chargerLabel:"C1", stationName:"OMR Charging Station",       vehicleId:"TN10MN8899", driverName:"Arulmurugan K",     startTime:hoursAgo(4.5), durationMin:88,  energyKWh:29.3,  powerKW:20,  stateOfCharge:100,targetSoC:100, cost:1025, connectorType:"Type2",   status:"completed",   endTime:hoursAgo(3),    paymentMethod:"UPI",  stopReason:"Target SoC reached"    },

  // ── Yesterday ──────────────────────────────────────────────────────────────
  { id:"SES-201", chargerId:"CHG-001", chargerLabel:"A1", stationName:"SG Highway EV Hub",          vehicleId:"GJ01OP2345", driverName:"Nirav Mehta",       startTime:daysAgo(1,2),  durationMin:66,  energyKWh:155.9, powerKW:142, stateOfCharge:95, targetSoC:95,  cost:5456, connectorType:"CCS2",    status:"completed",   endTime:daysAgo(1,0.9), paymentMethod:"UPI",  stopReason:"Target SoC reached"    },
  { id:"SES-202", chargerId:"CHG-004", chargerLabel:"B1", stationName:"SG Highway EV Hub",          vehicleId:"GJ09QR6789", driverName:"Jalpa Shah",        startTime:daysAgo(1,5),  durationMin:54,  energyKWh:43.2,  powerKW:48,  stateOfCharge:88, targetSoC:88,  cost:1512, connectorType:"CHAdeMO", status:"completed",   endTime:daysAgo(1,4.1), paymentMethod:"RFID", stopReason:"Target SoC reached"    },
  { id:"SES-203", chargerId:"CHG-014", chargerLabel:"A2", stationName:"GIFT City EV Station",       vehicleId:"GJ17ST3456", driverName:"Chintan Joshi",     startTime:daysAgo(1,3),  durationMin:19,  energyKWh:94.1,  powerKW:298, stateOfCharge:58, targetSoC:58,  cost:3294, connectorType:"CCS2",    status:"completed",   endTime:daysAgo(1,2.7), paymentMethod:"App",  stopReason:"Target SoC reached"    },
  { id:"SES-204", chargerId:"CHG-021", chargerLabel:"B1", stationName:"Ring Road Charging Station", vehicleId:"MH12UV7890", driverName:"Pooja Kulkarni",    startTime:daysAgo(1,6),  durationMin:73,  energyKWh:53.3,  powerKW:44,  stateOfCharge:100,targetSoC:100, cost:1865, connectorType:"CHAdeMO", status:"completed",   endTime:daysAgo(1,4.8), paymentMethod:"UPI",  stopReason:"Target SoC reached"    },
  { id:"SES-205", chargerId:"CHG-033", chargerLabel:"C1", stationName:"Whitefield EV Charging Hub", vehicleId:"KA05WX4567", driverName:"Vikram Gowda",      startTime:daysAgo(1,4),  durationMin:48,  energyKWh:66.4,  powerKW:83,  stateOfCharge:85, targetSoC:85,  cost:2324, connectorType:"CCS2",    status:"completed",   endTime:daysAgo(1,3.2), paymentMethod:"Card", stopReason:"Target SoC reached"    },
  { id:"SES-206", chargerId:"CHG-040", chargerLabel:"A2", stationName:"Cyber City Fast Charge Station", vehicleId:"DL7YZ5678", driverName:"Akshay Kumar",  startTime:daysAgo(1,7),  durationMin:26,  energyKWh:127.2, powerKW:294, stateOfCharge:70, targetSoC:70,  cost:4452, connectorType:"CCS2",    status:"interrupted", endTime:daysAgo(1,6.6), paymentMethod:"UPI",  stopReason:"Charger fault"         },
  { id:"SES-207", chargerId:"CHG-045", chargerLabel:"B2", stationName:"HITEC City EV Station",      vehicleId:"TS09AB1234", driverName:"Kavitha Nair",      startTime:daysAgo(1,8),  durationMin:78,  energyKWh:186.5, powerKW:144, stateOfCharge:100,targetSoC:100, cost:6527, connectorType:"CCS2",    status:"completed",   endTime:daysAgo(1,6.7), paymentMethod:"RFID", stopReason:"Target SoC reached"    },
  { id:"SES-208", chargerId:"CHG-050", chargerLabel:"C1", stationName:"OMR Charging Station",       vehicleId:"TN22CD5678", driverName:"Muthukumar S",      startTime:daysAgo(1,9),  durationMin:103, energyKWh:34.3,  powerKW:20,  stateOfCharge:100,targetSoC:100, cost:1200, connectorType:"Type2",   status:"completed",   endTime:daysAgo(1,7.3), paymentMethod:"UPI",  stopReason:"Target SoC reached"    },

  // ── 2 days ago ─────────────────────────────────────────────────────────────
  { id:"SES-301", chargerId:"CHG-002", chargerLabel:"A2", stationName:"SG Highway EV Hub",          vehicleId:"GJ05ZA9012", driverName:"Bhavna Patel",      startTime:daysAgo(2,3),  durationMin:42,  energyKWh:91.8,  powerKW:131, stateOfCharge:80, targetSoC:80,  cost:3213, connectorType:"CCS2",    status:"completed",   endTime:daysAgo(2,2.3), paymentMethod:"App",  stopReason:"Target SoC reached"    },
  { id:"SES-302", chargerId:"CHG-011", chargerLabel:"D3", stationName:"SG Highway EV Hub",          vehicleId:"GJ07BC3456", driverName:"Harish Solanki",    startTime:daysAgo(2,5),  durationMin:60,  energyKWh:149.0, powerKW:149, stateOfCharge:92, targetSoC:92,  cost:5215, connectorType:"CCS2",    status:"completed",   endTime:daysAgo(2,4),   paymentMethod:"RFID", stopReason:"Target SoC reached"    },
  { id:"SES-303", chargerId:"CHG-017", chargerLabel:"C1", stationName:"GIFT City EV Station",       vehicleId:"GJ02DE7890", driverName:"Smita Kapoor",      startTime:daysAgo(2,7),  durationMin:55,  energyKWh:18.3,  powerKW:20,  stateOfCharge:88, targetSoC:88,  cost:642,  connectorType:"Type2",   status:"completed",   endTime:daysAgo(2,6.1), paymentMethod:"UPI",  stopReason:"Target SoC reached"    },
  { id:"SES-304", chargerId:"CHG-024", chargerLabel:"C2", stationName:"Ring Road Charging Station", vehicleId:"GJ05FG1234", driverName:"Tejas Vora",        startTime:daysAgo(2,2),  durationMin:34,  energyKWh:10.2,  powerKW:18,  stateOfCharge:70, targetSoC:70,  cost:357,  connectorType:"Type2",   status:"completed",   endTime:daysAgo(2,1.4), paymentMethod:"Card", stopReason:"Target SoC reached"    },
  { id:"SES-305", chargerId:"CHG-026", chargerLabel:"A2", stationName:"Rajkot Smart Charging Hub",  vehicleId:"GJ03HI5678", driverName:"Pallavi Rao",       startTime:daysAgo(2,6),  durationMin:50,  energyKWh:125.0, powerKW:150, stateOfCharge:90, targetSoC:90,  cost:4375, connectorType:"CCS2",    status:"completed",   endTime:daysAgo(2,5.2), paymentMethod:"UPI",  stopReason:"Target SoC reached"    },

  // ── 3 days ago ─────────────────────────────────────────────────────────────
  { id:"SES-401", chargerId:"CHG-001", chargerLabel:"A1", stationName:"SG Highway EV Hub",          vehicleId:"GJ01JK9012", driverName:"Manish Shah",       startTime:daysAgo(3,4),  durationMin:55,  energyKWh:129.7, powerKW:142, stateOfCharge:88, targetSoC:88,  cost:4539, connectorType:"CCS2",    status:"completed",   endTime:daysAgo(3,3.1), paymentMethod:"RFID", stopReason:"Target SoC reached"    },
  { id:"SES-402", chargerId:"CHG-013", chargerLabel:"A1", stationName:"GIFT City EV Station",       vehicleId:"GJ17LM3456", driverName:"Riddhi Trivedi",    startTime:daysAgo(3,2),  durationMin:17,  energyKWh:88.3,  powerKW:312, stateOfCharge:52, targetSoC:52,  cost:3090, connectorType:"CCS2",    status:"interrupted", endTime:daysAgo(3,1.7), paymentMethod:"App",  stopReason:"User stopped manually" },
  { id:"SES-403", chargerId:"CHG-019", chargerLabel:"A1", stationName:"Ring Road Charging Station", vehicleId:"GJ05NO7890", driverName:"Kiran Bhatia",      startTime:daysAgo(3,5),  durationMin:68,  energyKWh:151.8, powerKW:134, stateOfCharge:98, targetSoC:98,  cost:5313, connectorType:"CCS2",    status:"completed",   endTime:daysAgo(3,3.9), paymentMethod:"UPI",  stopReason:"Target SoC reached"    },
  { id:"SES-404", chargerId:"CHG-040", chargerLabel:"A2", stationName:"Cyber City Fast Charge Station", vehicleId:"DL4PQ1234", driverName:"Simran Kaur",   startTime:daysAgo(3,3),  durationMin:31,  energyKWh:152.0, powerKW:295, stateOfCharge:75, targetSoC:75,  cost:5320, connectorType:"CCS2",    status:"completed",   endTime:daysAgo(3,2.5), paymentMethod:"UPI",  stopReason:"Target SoC reached"    },

  // ── 4 days ago ─────────────────────────────────────────────────────────────
  { id:"SES-501", chargerId:"CHG-006", chargerLabel:"C1", stationName:"SG Highway EV Hub",          vehicleId:"GJ06RS5678", driverName:"Gaurav Desai",      startTime:daysAgo(4,6),  durationMin:115, energyKWh:40.2,  powerKW:21,  stateOfCharge:100,targetSoC:100, cost:1407, connectorType:"Type2",   status:"completed",   endTime:daysAgo(4,4.1), paymentMethod:"Card", stopReason:"Target SoC reached"    },
  { id:"SES-502", chargerId:"CHG-014", chargerLabel:"A2", stationName:"GIFT City EV Station",       vehicleId:"GJ17TU9012", driverName:"Hina Kapoor",       startTime:daysAgo(4,2),  durationMin:27,  energyKWh:134.1, powerKW:298, stateOfCharge:68, targetSoC:68,  cost:4694, connectorType:"CCS2",    status:"completed",   endTime:daysAgo(4,1.6), paymentMethod:"RFID", stopReason:"Target SoC reached"    },
  { id:"SES-503", chargerId:"CHG-045", chargerLabel:"B2", stationName:"HITEC City EV Station",      vehicleId:"TS07VW3456", driverName:"Sudhir Reddy",      startTime:daysAgo(4,8),  durationMin:82,  energyKWh:195.8, powerKW:144, stateOfCharge:100,targetSoC:100, cost:6853, connectorType:"CCS2",    status:"completed",   endTime:daysAgo(4,6.6), paymentMethod:"UPI",  stopReason:"Target SoC reached"    },

  // ── 5 days ago ─────────────────────────────────────────────────────────────
  { id:"SES-601", chargerId:"CHG-009", chargerLabel:"D1", stationName:"SG Highway EV Hub",          vehicleId:"GJ01XY7890", driverName:"Dhruvil Joshi",     startTime:daysAgo(5,3),  durationMin:50,  energyKWh:115.0, powerKW:138, stateOfCharge:87, targetSoC:87,  cost:4025, connectorType:"CCS2",    status:"completed",   endTime:daysAgo(5,2.2), paymentMethod:"App",  stopReason:"Target SoC reached"    },
  { id:"SES-602", chargerId:"CHG-021", chargerLabel:"B1", stationName:"Ring Road Charging Station", vehicleId:"MH12ZA1234", driverName:"Nisha Kamble",      startTime:daysAgo(5,5),  durationMin:60,  energyKWh:44.0,  powerKW:44,  stateOfCharge:90, targetSoC:90,  cost:1540, connectorType:"CHAdeMO", status:"completed",   endTime:daysAgo(5,4),   paymentMethod:"RFID", stopReason:"Target SoC reached"    },
  { id:"SES-603", chargerId:"CHG-033", chargerLabel:"C1", stationName:"Whitefield EV Charging Hub", vehicleId:"KA09BC5678", driverName:"Manoj Hebbar",      startTime:daysAgo(5,7),  durationMin:52,  energyKWh:72.1,  powerKW:83,  stateOfCharge:87, targetSoC:87,  cost:2524, connectorType:"CCS2",    status:"interrupted", endTime:daysAgo(5,6.1), paymentMethod:"UPI",  stopReason:"Power outage"          },

  // ── 6 days ago ─────────────────────────────────────────────────────────────
  { id:"SES-701", chargerId:"CHG-002", chargerLabel:"A2", stationName:"SG Highway EV Hub",          vehicleId:"GJ05DE9012", driverName:"Pinal Shah",        startTime:daysAgo(6,2),  durationMin:44,  energyKWh:96.4,  powerKW:131, stateOfCharge:82, targetSoC:82,  cost:3374, connectorType:"CCS2",    status:"completed",   endTime:daysAgo(6,1.3), paymentMethod:"UPI",  stopReason:"Target SoC reached"    },
  { id:"SES-702", chargerId:"CHG-025", chargerLabel:"A1", stationName:"Rajkot Smart Charging Hub",  vehicleId:"GJ03FG3456", driverName:"Hiren Pandya",      startTime:daysAgo(6,4),  durationMin:47,  energyKWh:100.3, powerKW:128, stateOfCharge:85, targetSoC:85,  cost:3510, connectorType:"CCS2",    status:"completed",   endTime:daysAgo(6,3.2), paymentMethod:"Card", stopReason:"Target SoC reached"    },
  { id:"SES-703", chargerId:"CHG-040", chargerLabel:"A2", stationName:"Cyber City Fast Charge Station", vehicleId:"DL9HI7890", driverName:"Ravi Sharma",   startTime:daysAgo(6,6),  durationMin:23,  energyKWh:112.4, powerKW:293, stateOfCharge:62, targetSoC:62,  cost:3934, connectorType:"CCS2",    status:"completed",   endTime:daysAgo(6,5.6), paymentMethod:"RFID", stopReason:"Target SoC reached"    },
];

// All sessions merged: active first, then completed (newest first)
export const allSessions: HistoricalSession[] = [
  ...activeHistorical,
  ...completedSessions,
];

// ─── Session KPI aggregates ────────────────────────────────────────────────────
export const sessionKPIs = {
  totalToday:       [...activeHistorical, ...completedSessions.filter(s => s.startTime > daysAgo(1))].length,
  activeNow:        activeHistorical.length,
  completedToday:   completedSessions.filter(s => s.startTime > daysAgo(1)).length,
  interruptedToday: completedSessions.filter(s => s.startTime > daysAgo(1) && s.status === "interrupted").length,
  energyToday:      [...activeHistorical, ...completedSessions.filter(s => s.startTime > daysAgo(1))].reduce((s,x)=>s+x.energyKWh,0),
  revenueToday:     [...activeHistorical, ...completedSessions.filter(s => s.startTime > daysAgo(1))].reduce((s,x)=>s+x.cost,0),
  avgDurationToday: Math.round(
    [...activeHistorical, ...completedSessions.filter(s=>s.startTime > daysAgo(1))].reduce((s,x)=>s+x.durationMin,0) /
    [...activeHistorical, ...completedSessions.filter(s=>s.startTime > daysAgo(1))].length
  ),
  avgEnergyPerSession: parseFloat((
    allSessions.reduce((s,x)=>s+x.energyKWh,0) / allSessions.length
  ).toFixed(1)),
};

// ─── Hourly session volume (today, for bar chart) ──────────────────────────────
export const hourlySessionVolume = Array.from({ length: 24 }, (_, h) => {
  const sessions = allSessions.filter(s => {
    const sh = s.startTime.getHours();
    const startedToday = s.startTime > daysAgo(1);
    return startedToday && sh === h;
  }).length;
  return { hour: `${String(h).padStart(2,"0")}:00`, sessions };
});

// ─── Connector-type breakdown ──────────────────────────────────────────────────
export const connectorBreakdown = [
  { name:"CCS2",    value: allSessions.filter(s=>s.connectorType==="CCS2").length,    color:"oklch(0.65 0.20 240)" },
  { name:"CHAdeMO", value: allSessions.filter(s=>s.connectorType==="CHAdeMO").length, color:"oklch(0.68 0.18 300)" },
  { name:"Type2",   value: allSessions.filter(s=>s.connectorType==="Type2").length,   color:"oklch(0.72 0.18 145)" },
];

// ─── Status breakdown (for donut) ──────────────────────────────────────────────
export const statusBreakdown = [
  { name:"Completed",   value: allSessions.filter(s=>s.status==="completed").length,   color:"oklch(0.72 0.18 145)" },
  { name:"Active",      value: allSessions.filter(s=>s.status==="active").length,       color:"oklch(0.65 0.20 240)" },
  { name:"Interrupted", value: allSessions.filter(s=>s.status==="interrupted").length, color:"oklch(0.68 0.22 25)"  },
];
