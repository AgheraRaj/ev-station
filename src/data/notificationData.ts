// ─── Types ────────────────────────────────────────────────────────────────────

export type NotificationSeverity = "critical" | "warning" | "info";

export interface Notification {
  id: string;
  severity: NotificationSeverity;
  title: string;
  message: string;
  station: string;
  chargerId?: string;
  timestamp: Date;
  read: boolean;
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const now = new Date();
const minsAgo = (m: number) => new Date(now.getTime() - m * 60_000);

export const seedNotifications: Notification[] = [
  {
    id: "NTF-001",
    severity: "critical",
    title: "Charger Offline",
    message: "CHG-020 has gone offline. No OCPP heartbeat received for 6 minutes.",
    station: "Surat Station",
    chargerId: "CHG-020",
    timestamp: minsAgo(2),
    read: false,
  },
  {
    id: "NTF-002",
    severity: "critical",
    title: "Over Temperature",
    message: "CHG-005 thermal sensor reads 74°C. Emergency stop activated.",
    station: "Ahmedabad Station",
    chargerId: "CHG-005",
    timestamp: minsAgo(4),
    read: false,
  },
  {
    id: "NTF-003",
    severity: "critical",
    title: "Grid Failure",
    message: "Input power lost at main incomer. All chargers suspended.",
    station: "Rajkot Station",
    timestamp: minsAgo(9),
    read: false,
  },
  {
    id: "NTF-004",
    severity: "warning",
    title: "Communication Failure",
    message: "OCPP connection dropped. Retry 3 of 5 in progress.",
    station: "Rajkot Station",
    chargerId: "CHG-014",
    timestamp: minsAgo(8),
    read: false,
  },
  {
    id: "NTF-005",
    severity: "warning",
    title: "Low Voltage Warning",
    message: "Grid supply at 198V (nominal 230V). Output derated to 16 kW.",
    station: "Vadodara Express EV Point",
    chargerId: "CHG-030",
    timestamp: minsAgo(15),
    read: false,
  },
  {
    id: "NTF-006",
    severity: "warning",
    title: "Connector Fault",
    message: "Type 2 connector latch failure. Port locked, session cannot start.",
    station: "Mumbai Charging Plaza",
    chargerId: "CHG-041",
    timestamp: minsAgo(22),
    read: false,
  },
  {
    id: "NTF-007",
    severity: "warning",
    title: "Network Connectivity Issue",
    message: "Primary fibre down. Fallback to Jio 4G, latency increased to 420ms.",
    station: "Hinjewadi Tech Park EV Hub",
    timestamp: minsAgo(31),
    read: false,
  },
  {
    id: "NTF-008",
    severity: "info",
    title: "Charging Session Started",
    message: "GJ01AB1234 connected on port A1. Target SoC: 90%.",
    station: "Ahmedabad Station",
    chargerId: "CHG-001",
    timestamp: minsAgo(42),
    read: false,
  },
  {
    id: "NTF-009",
    severity: "info",
    title: "Station Back Online",
    message: "All systems nominal. 8 of 8 chargers available.",
    station: "Gandhinagar EV Hub",
    timestamp: minsAgo(55),
    read: true,
  },
  {
    id: "NTF-010",
    severity: "info",
    title: "Charging Session Completed",
    message: "MH12CD4321 disconnected. 37.4 kWh delivered. ₹1,309 billed.",
    station: "Surat Station",
    chargerId: "CHG-021",
    timestamp: minsAgo(68),
    read: true,
  },
  {
    id: "NTF-011",
    severity: "info",
    title: "New Charger Added",
    message: "CHG-079 (CCS2 · 150 kW) commissioned and OCPP-registered.",
    station: "Gandhinagar EV Hub",
    timestamp: minsAgo(110),
    read: true,
  },
  {
    id: "NTF-012",
    severity: "warning",
    title: "Emergency Stop Activated",
    message: "Hardware e-stop button pressed. Manual reset required on-site.",
    station: "Mumbai Charging Plaza",
    chargerId: "CHG-040",
    timestamp: minsAgo(130),
    read: true,
  },
];

// ─── Templates for auto-generated incoming notifications ─────────────────────
// When connecting to a real backend, delete this block and push from WebSocket.

interface NotificationTemplate {
  severity: NotificationSeverity;
  title: string;
  message: string;
  station: string;
  chargerId?: string;
}

export const incomingTemplates: NotificationTemplate[] = [
  { severity: "critical", title: "Charger Offline",          message: "Lost OCPP heartbeat for 5 minutes. Auto-restart failed.",           station: "Rajkot Station",       chargerId: "CHG-025" },
  { severity: "critical", title: "Emergency Stop Activated", message: "E-stop triggered via CMS. Remote reset pending operator approval.", station: "Surat Station",        chargerId: "CHG-022" },
  { severity: "warning",  title: "Connector Fault",          message: "CCS2 latch sensor open. Session cannot initiate on this port.",      station: "Ahmedabad Station",    chargerId: "CHG-003" },
  { severity: "warning",  title: "Network Connectivity Issue",message: "Packet loss > 30% on OCPP channel. Switching to backup SIM.",      station: "Gandhinagar EV Hub" },
  { severity: "info",     title: "Charging Session Started",  message: "KA05GH2468 connected. 22 kW AC · Type 2.",                         station: "Mumbai Charging Plaza",chargerId: "CHG-042" },
  { severity: "info",     title: "Station Back Online",       message: "Connectivity restored. All chargers resumed normal operation.",     station: "Rajkot Station" },
  { severity: "info",     title: "Charging Session Completed",message: "DL01EF9876 session ended. 96 kWh · ₹3,360 billed.",               station: "Ahmedabad Station",    chargerId: "CHG-009" },
];

// ─── Hook ─────────────────────────────────────────────────────────────────────
//
// All notification state lives here.
// When you have a real backend, replace the useEffect simulator with a
// WebSocket subscriber that calls dispatch({ type: "ADD", notification }).

import { useState, useCallback, useEffect, useRef } from "react";

let nextId = seedNotifications.length + 1;

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(
    () => [...seedNotifications].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  );

  // ── Selectors ──────────────────────────────────────────────────────────────

  const unreadCount = notifications.filter((n) => !n.read).length;
  const hasUnread   = unreadCount > 0;

  // ── Actions ────────────────────────────────────────────────────────────────

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Internal: push a new notification (called by the simulator below, or by a
  // future WebSocket handler).
  const addNotification = useCallback((n: Omit<Notification, "id" | "timestamp" | "read">) => {
    const fresh: Notification = {
      ...n,
      id: `NTF-${String(++nextId).padStart(3, "0")}`,
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [fresh, ...prev]);
  }, []);

  // ── Simulator: new notification every ~45s ─────────────────────────────────
  // Replace this block with `socket.on("notification", addNotification)` when
  // integrating a real backend. The addNotification function signature is
  // intentionally identical to what a WebSocket handler would call.

  const templateIndexRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      const template = incomingTemplates[templateIndexRef.current % incomingTemplates.length];
      templateIndexRef.current += 1;
      addNotification(template);
    }, 45_000);
    return () => clearInterval(id);
  }, [addNotification]);

  return {
    notifications,
    unreadCount,
    hasUnread,
    markAsRead,
    markAllAsRead,
    dismiss,
    clearAll,
    addNotification, // expose so future WebSocket code can call it directly
  };
}