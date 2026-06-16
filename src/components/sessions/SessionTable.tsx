import React, { useState } from "react";
import { cn } from "@/lib/utils";
import type { HistoricalSession, SessionStatus } from "@/data/sessionData";
import type { ConnectorType } from "@/data/mockData";
import { Car, Clock, Zap, ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { useLiveSessionPower } from "@/hook/useLiveData";

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function formatTime(date: Date): string {
  return date.toLocaleString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCost(rupees: number): string {
  return `₹${rupees.toLocaleString("en-IN")}`;
}

const CONNECTOR_COLORS: Record<ConnectorType, string> = {
  CCS2:    "bg-[oklch(0.60_0.20_240)/12] text-[oklch(0.68_0.18_240)] border-[oklch(0.60_0.20_240)/25]",
  CHAdeMO: "bg-[oklch(0.65_0.18_300)/12] text-[oklch(0.65_0.18_300)] border-[oklch(0.65_0.18_300)/25]",
  Type2:   "bg-[oklch(0.65_0.18_145)/12] text-[oklch(0.65_0.18_145)] border-[oklch(0.65_0.18_145)/25]",
  OCPP:    "bg-[oklch(0.72_0.16_75)/12]  text-[oklch(0.72_0.16_75)]  border-[oklch(0.72_0.16_75)/25]",
};

const STATUS_COLORS: Record<SessionStatus, string> = {
  active:      "bg-[oklch(0.60_0.20_240)/12] text-[oklch(0.68_0.18_240)] border-[oklch(0.60_0.20_240)/25]",
  completed:   "bg-[oklch(0.72_0.18_145)/12] text-[oklch(0.72_0.18_145)] border-[oklch(0.72_0.18_145)/25]",
  interrupted: "bg-[oklch(0.65_0.22_25)/12]  text-[oklch(0.65_0.22_25)]  border-[oklch(0.65_0.22_25)/25]",
};

type SortKey = "time" | "driver" | "station" | "duration" | "energy" | "cost" | "status";
type SortDir = "asc" | "desc" | null;

function SortHeader({
  label, sortKey, current, dir, onSort,
}: {
  label: string; sortKey: SortKey; current: SortKey; dir: SortDir;
  onSort: (k: SortKey) => void;
}) {
  const active = current === sortKey;
  return (
    <button
      onClick={() => onSort(sortKey)}
      className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors group"
    >
      {label}
      <span className="text-muted-foreground/40 group-hover:text-muted-foreground">
        {active && dir === "asc"  ? <ChevronUp className="w-3 h-3" /> :
         active && dir === "desc" ? <ChevronDown className="w-3 h-3" /> :
         <ChevronsUpDown className="w-3 h-3" />}
      </span>
    </button>
  );
}

export function SessionTable({
  sessions,
}: {
  sessions: HistoricalSession[];
}) {
  const livePowers = useLiveSessionPower();
  const [sortKey, setSortKey] = useState<SortKey>("time");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : d === "desc" ? null : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = [...sessions].sort((a, b) => {
    if (!sortDir) return 0;
    let va: any, vb: any;
    if (sortKey === "time")     { va = a.startTime.getTime(); vb = b.startTime.getTime(); }
    if (sortKey === "driver")   { va = a.driverName; vb = b.driverName; }
    if (sortKey === "station")  { va = a.stationName; vb = b.stationName; }
    if (sortKey === "duration") { va = a.durationMin; vb = b.durationMin; }
    if (sortKey === "energy")   { va = a.energyKWh; vb = b.energyKWh; }
    if (sortKey === "cost")     { va = a.cost; vb = b.cost; }
    if (sortKey === "status")   { va = a.status; vb = b.status; }

    if (typeof va === "string") {
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    }
    return sortDir === "asc" ? va - vb : vb - va;
  });

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden">
      <div className="overflow-auto flex-1 min-h-0">
        <table className="w-full text-sm border-separate border-spacing-0">
          <thead className="bg-muted/40 sticky top-0 z-10 backdrop-blur-sm">
            <tr>
              {[
                { label: "Status", key: "status" as SortKey, width: "w-24" },
                { label: "Vehicle / Driver", key: "driver" as SortKey, width: "" },
                { label: "Station", key: "station" as SortKey, width: "hidden md:table-cell" },
                { label: "Time", key: "time" as SortKey, width: "hidden sm:table-cell" },
                { label: "Duration", key: "duration" as SortKey, width: "hidden lg:table-cell" },
                { label: "Energy", key: "energy" as SortKey, width: "" },
                { label: "Cost", key: "cost" as SortKey, width: "hidden sm:table-cell" },
              ].map(({ label, key, width }) => (
                <th key={key} className={cn("px-4 py-3 text-left border-b border-border", width)}>
                  <SortHeader label={label} sortKey={key} current={sortKey} dir={sortDir} onSort={handleSort} />
                </th>
              ))}
              <th className="px-4 py-3 border-b border-border w-10"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((session) => {
              const isExpanded = expanded === session.id;
              const livePower = session.status === "active" ? (livePowers[session.id] ?? session.powerKW) : null;

              return (
                <React.Fragment key={session.id}>
                  <tr
                    className={cn(
                      "group cursor-pointer transition-colors border-b border-border last:border-b-0",
                      isExpanded ? "bg-[oklch(0.60_0.20_240)/5]" : "hover:bg-muted/30"
                    )}
                    onClick={() => setExpanded(isExpanded ? null : session.id)}
                  >
                    <td className="px-4 py-3 border-b border-border">
                      <span className={cn("text-[10px] font-medium px-2 py-1 rounded-full border capitalize", STATUS_COLORS[session.status])}>
                        {session.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[oklch(0.60_0.20_240)/10] flex items-center justify-center shrink-0">
                          <Car className="w-4 h-4 text-[oklch(0.65_0.20_240)]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">{session.driverName}</p>
                          <p className="text-[10px] text-muted-foreground font-mono truncate">{session.vehicleId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 border-b border-border hidden md:table-cell">
                      <p className="text-xs text-foreground truncate max-w-[160px]">{session.stationName}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-muted-foreground">{session.chargerLabel}</span>
                        <span className={cn("text-[9px] font-medium px-1.5 py-px rounded-full border", CONNECTOR_COLORS[session.connectorType])}>
                          {session.connectorType}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 border-b border-border hidden sm:table-cell">
                      <p className="text-xs text-foreground">{formatTime(session.startTime)}</p>
                      {session.endTime && <p className="text-[10px] text-muted-foreground">to {formatTime(session.endTime)}</p>}
                    </td>
                    <td className="px-4 py-3 border-b border-border hidden lg:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="text-xs text-foreground tabular-nums">{formatDuration(session.durationMin)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 border-b border-border">
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="text-xs font-medium text-foreground tabular-nums">{session.energyKWh.toFixed(1)} kWh</span>
                      </div>
                      {livePower && (
                        <p className="text-[10px] text-[oklch(0.65_0.20_240)] mt-0.5 font-medium">{livePower.toFixed(0)} kW (Live)</p>
                      )}
                    </td>
                    <td className="px-4 py-3 border-b border-border hidden sm:table-cell">
                      <span className="text-xs font-semibold text-foreground tabular-nums">{formatCost(session.cost)}</span>
                    </td>
                    <td className="px-4 py-3 border-b border-border">
                      <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={8} className="px-4 py-3 border-b border-border bg-[oklch(0.60_0.20_240)/3]">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-[10px] text-muted-foreground mb-1">Session ID</p>
                            <p className="text-xs font-medium text-foreground">{session.id}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground mb-1">Payment Method</p>
                            <p className="text-xs font-medium text-foreground">{session.paymentMethod}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground mb-1">State of Charge</p>
                            <p className="text-xs font-medium text-foreground">{session.stateOfCharge}% (Target {session.targetSoC}%)</p>
                          </div>
                          {session.stopReason && (
                            <div>
                              <p className="text-[10px] text-muted-foreground mb-1">Stop Reason</p>
                              <p className="text-xs font-medium text-foreground">{session.stopReason}</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
