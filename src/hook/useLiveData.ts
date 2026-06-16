import { useState, useEffect, useCallback } from "react";
import { kpiData, activeSessions, alarms, chargers } from "@/data/mockData";

// Small random jitter on a number, within ±range percent
function jitter(value: number, rangePct = 3): number {
  const delta = value * (rangePct / 100);
  return Math.round((value + (Math.random() * delta * 2 - delta)) * 10) / 10;
}

export interface LiveKPI {
  activeChargers: number;
  activeSessions: number;
  currentLoadKW: number;
  totalEnergyToday: number;
  totalRevenueToday: number;
  networkUptime: number;
  activeAlarms: number;
  criticalAlarms: number;
  totalCapacityKW: number;
  faultChargers: number;
  totalChargers: number;
  totalStations: number;
}

export function useLiveKPI(intervalMs = 4000): LiveKPI {
  const [data, setData] = useState<LiveKPI>({
    ...kpiData,
    totalEnergyToday: Math.round(kpiData.totalEnergyToday),
  });

  const tick = useCallback(() => {
    setData((prev) => ({
      ...prev,
      currentLoadKW: jitter(prev.currentLoadKW, 4),
      totalEnergyToday: prev.totalEnergyToday + Math.round(Math.random() * 6),
      totalRevenueToday: prev.totalRevenueToday + Math.round(Math.random() * 12),
    }));
  }, []);

  useEffect(() => {
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [tick, intervalMs]);

  return data;
}

export function useLiveSessionPower(intervalMs = 2000) {
  const [powers, setPowers] = useState<Record<string, number>>(() =>
    Object.fromEntries(activeSessions.map((s) => [s.id, s.powerKW]))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setPowers((prev) => {
        const next = { ...prev };
        for (const id in next) {
          next[id] = jitter(next[id], 2);
        }
        return next;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return powers;
}

export function useLiveChargerStatus(intervalMs = 5000) {
  const [statuses, setStatuses] = useState(() =>
    Object.fromEntries(chargers.map((c) => [c.id, { power: c.currentPowerKW, temp: c.temperature }]))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setStatuses((prev) => {
        const next = { ...prev };
        for (const id in next) {
          if (next[id].power > 0) {
            next[id] = {
              power: jitter(next[id].power, 3),
              temp: jitter(next[id].temp, 1),
            };
          }
        }
        return next;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return statuses;
}

export function useAlarmCount() {
  const [count] = useState(alarms.filter((a) => !a.acknowledged).length);
  // Could simulate new alarms arriving; for now it's stable
  return count;
}