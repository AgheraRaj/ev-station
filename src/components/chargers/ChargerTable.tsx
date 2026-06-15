import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, ChevronsUpDown, Zap, Thermometer, AlertTriangle, WifiOff, CheckCircle2 } from "lucide-react";
import type { ChargerExtended } from "@/data/chargerData";
import type { ChargerStatus } from "@/data/mockData";
import { stations } from "@/data/mockData";

const STATUS_CFG: Record<ChargerStatus, { dot: string; text: string; badge: string; icon: React.ElementType }> = {
  charging:  { dot: "bg-[oklch(0.65_0.20_240)] animate-pulse", text: "text-[oklch(0.68_0.18_240)]", badge: "bg-[oklch(0.60_0.20_240)/12] border-[oklch(0.60_0.20_240)/25]", icon: Zap           },
  available: { dot: "bg-[oklch(0.65_0.18_145)]",               text: "text-[oklch(0.65_0.18_145)]", badge: "bg-[oklch(0.65_0.18_145)/12] border-[oklch(0.65_0.18_145)/25]", icon: CheckCircle2  },
  fault:     { dot: "bg-[oklch(0.65_0.22_25)] animate-pulse",  text: "text-[oklch(0.65_0.22_25)]",  badge: "bg-[oklch(0.65_0.22_25)/12]  border-[oklch(0.65_0.22_25)/25]",  icon: AlertTriangle },
  offline:   { dot: "bg-muted-foreground/40",                   text: "text-muted-foreground",        badge: "bg-muted/40 border-border",                                       icon: WifiOff       },
};

const CONNECTOR_BADGE: Record<string, string> = {
  CCS2:    "bg-[oklch(0.60_0.20_240)/12] text-[oklch(0.68_0.18_240)] border-[oklch(0.60_0.20_240)/25]",
  CHAdeMO: "bg-[oklch(0.65_0.18_300)/12] text-[oklch(0.65_0.18_300)] border-[oklch(0.65_0.18_300)/25]",
  Type2:   "bg-[oklch(0.65_0.18_145)/12] text-[oklch(0.65_0.18_145)] border-[oklch(0.65_0.18_145)/25]",
  OCPP:    "bg-[oklch(0.72_0.16_75)/12]  text-[oklch(0.72_0.16_75)]  border-[oklch(0.72_0.16_75)/25]",
};

function tempColor(t: number) {
  if (t >= 65) return "text-[oklch(0.65_0.22_25)]";
  if (t >= 50) return "text-[oklch(0.72_0.16_75)]";
  return "text-muted-foreground";
}

type SortKey = "id" | "station" | "label" | "status" | "power" | "temp" | "utilization";
type SortDir = "asc" | "desc";

function SortTh({ label, sortKey, current, dir, onSort, className }: {
  label: string; sortKey: SortKey; current: SortKey; dir: SortDir;
  onSort: (k: SortKey) => void; className?: string;
}) {
  const active = current === sortKey;
  return (
    <th className={cn("bg-muted/40 px-3 py-2.5 text-left border-b border-border", className)}>
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
    </th>
  );
}

interface ChargerTableProps {
  chargers: ChargerExtended[];
  liveStatuses: Record<string, { power: number; temp: number }>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ChargerTable({ chargers, liveStatuses, selectedId, onSelect }: ChargerTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("status");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const stationMap = Object.fromEntries(stations.map((s) => [s.id, s.name]));

  const sorted = [...chargers].sort((a, b) => {
    const liveA = liveStatuses[a.id] ?? { power: a.currentPowerKW, temp: a.temperature };
    const liveB = liveStatuses[b.id] ?? { power: b.currentPowerKW, temp: b.temperature };
    const ORDER: Record<ChargerStatus, number> = { fault: 0, charging: 1, available: 2, offline: 3 };
    let va: string | number = 0, vb: string | number = 0;
    if (sortKey === "id")          { va = a.id;                            vb = b.id; }
    if (sortKey === "station")     { va = stationMap[a.stationId] ?? "";   vb = stationMap[b.stationId] ?? ""; }
    if (sortKey === "label")       { va = a.label;                         vb = b.label; }
    if (sortKey === "status")      { va = ORDER[a.status];                 vb = ORDER[b.status]; }
    if (sortKey === "power")       { va = liveA.power;                     vb = liveB.power; }
    if (sortKey === "temp")        { va = liveA.temp;                      vb = liveB.temp; }
    if (sortKey === "utilization") { va = a.powerKW > 0 ? liveA.power / a.powerKW : 0; vb = b.powerKW > 0 ? liveB.power / b.powerKW : 0; }
    if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb as string) : (vb as string).localeCompare(va);
    return sortDir === "asc" ? (va as number) - (vb as number) : (vb as number) - (va as number);
  });

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden">
      <div className="overflow-auto flex-1 min-h-0">
        <table className="w-full text-sm border-separate border-spacing-0">
          <thead className="bg-muted/40 sticky top-0 z-10 backdrop-blur-sm">
            <tr>
              <SortTh label="Charger ID"    sortKey="id"          current={sortKey} dir={sortDir} onSort={handleSort} className="first:rounded-tl-xl pl-4" />
              <SortTh label="Station"       sortKey="station"     current={sortKey} dir={sortDir} onSort={handleSort} className="hidden md:table-cell" />
              <SortTh label="Port"          sortKey="label"       current={sortKey} dir={sortDir} onSort={handleSort} className="hidden sm:table-cell" />
              <SortTh label="Status"        sortKey="status"      current={sortKey} dir={sortDir} onSort={handleSort} />
              <SortTh label="Live Power"    sortKey="power"       current={sortKey} dir={sortDir} onSort={handleSort} />
              <SortTh label="Utilization"   sortKey="utilization" current={sortKey} dir={sortDir} onSort={handleSort} className="hidden lg:table-cell" />
              <SortTh label="Temperature"   sortKey="temp"        current={sortKey} dir={sortDir} onSort={handleSort} className="hidden sm:table-cell" />
              <th className="bg-muted/40 px-3 py-2.5 border-b border-border text-[11px] font-medium uppercase tracking-wider text-muted-foreground text-left hidden lg:table-cell">Connector</th>
              <th className="bg-muted/40 px-3 py-2.5 border-b border-border text-[11px] font-medium uppercase tracking-wider text-muted-foreground text-left hidden xl:table-cell last:rounded-tr-xl pr-4">Firmware</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((charger, idx) => {
              const live = liveStatuses[charger.id] ?? { power: charger.currentPowerKW, temp: charger.temperature };
              const cfg = STATUS_CFG[charger.status];
              const Icon = cfg.icon;
              const utilPct = charger.powerKW > 0 ? Math.round((live.power / charger.powerKW) * 100) : 0;
              const isLast = idx === sorted.length - 1;
              const isSelected = selectedId === charger.id;

              return (
                <tr
                  key={charger.id}
                  onClick={() => onSelect(charger.id)}
                  className={cn(
                    "cursor-pointer transition-colors",
                    isSelected ? "bg-[oklch(0.60_0.20_240)/6]" : "hover:bg-muted/20"
                  )}
                >
                  {/* Charger ID */}
                  <td className={cn("px-3 py-2.5 pl-4", !isLast && "border-b border-border")}>
                    <div className="flex items-center gap-2">
                      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)} />
                      <span className="text-xs font-mono font-semibold text-foreground">{charger.id}</span>
                    </div>
                  </td>

                  {/* Station */}
                  <td className={cn("px-3 py-2.5 hidden md:table-cell", !isLast && "border-b border-border")}>
                    <p className="text-xs text-foreground truncate max-w-[160px]">{stationMap[charger.stationId]}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{charger.stationId}</p>
                  </td>

                  {/* Port label */}
                  <td className={cn("px-3 py-2.5 hidden sm:table-cell", !isLast && "border-b border-border")}>
                    <span className="text-xs font-bold text-foreground">{charger.label}</span>
                  </td>

                  {/* Status */}
                  <td className={cn("px-3 py-2.5", !isLast && "border-b border-border")}>
                    <div className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-medium", cfg.badge, cfg.text)}>
                      <Icon className="w-2.5 h-2.5 shrink-0" />
                      {charger.status.charAt(0).toUpperCase() + charger.status.slice(1)}
                    </div>
                  </td>

                  {/* Live power */}
                  <td className={cn("px-3 py-2.5", !isLast && "border-b border-border")}>
                    {charger.status === "charging" ? (
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[oklch(0.65_0.20_240)] shrink-0" />
                        <span className="text-xs font-semibold text-foreground tabular-nums">{live.power.toFixed(0)} kW</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>

                  {/* Utilization bar */}
                  <td className={cn("px-3 py-2.5 hidden lg:table-cell min-w-[100px]", !isLast && "border-b border-border")}>
                    {charger.status === "charging" ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                          <div className="h-full rounded-full bg-[oklch(0.65_0.20_240)] transition-all duration-700" style={{ width: `${utilPct}%` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground tabular-nums w-8 text-right">{utilPct}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>

                  {/* Temperature */}
                  <td className={cn("px-3 py-2.5 hidden sm:table-cell", !isLast && "border-b border-border")}>
                    <div className="flex items-center gap-1">
                      <Thermometer className={cn("w-3 h-3 shrink-0", tempColor(live.temp))} />
                      <span className={cn("text-xs tabular-nums font-medium", tempColor(live.temp))}>{live.temp.toFixed(0)}°C</span>
                    </div>
                  </td>

                  {/* Connector */}
                  <td className={cn("px-3 py-2.5 hidden lg:table-cell", !isLast && "border-b border-border")}>
                    <span className={cn("text-[9px] font-medium px-1.5 py-0.5 rounded-full border", CONNECTOR_BADGE[charger.connectorType])}>
                      {charger.connectorType}
                    </span>
                  </td>

                  {/* Firmware */}
                  <td className={cn("px-3 py-2.5 pr-4 hidden xl:table-cell", !isLast && "border-b border-border")}>
                    <span className="text-[10px] font-mono text-muted-foreground">{charger.firmwareVersion}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}