import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, ChevronsUpDown, MapPin, ExternalLink, Settings2, AlertTriangle } from "lucide-react";
import { StationHealthBar } from "./StationHealthBar";
import type { Station } from "@/data/mockData";
import type { StationMeta } from "@/data/stationData";

function getStatus(s: Station) {
  if (s.offlineChargers === s.totalChargers) return { label: "Offline",  cls: "bg-muted text-muted-foreground border-border" };
  if (s.faultChargers > 1)                  return { label: "Critical", cls: "bg-[oklch(0.65_0.22_25)/12] text-[oklch(0.65_0.22_25)] border-[oklch(0.65_0.22_25)/30]" };
  if (s.faultChargers > 0 || s.uptime < 90) return { label: "Warning",  cls: "bg-[oklch(0.72_0.16_75)/12] text-[oklch(0.72_0.16_75)] border-[oklch(0.72_0.16_75)/30]" };
  return { label: "Healthy",  cls: "bg-[oklch(0.65_0.18_145)/12] text-[oklch(0.65_0.18_145)] border-[oklch(0.65_0.18_145)/30]" };
}

type SortKey = "name" | "city" | "chargers" | "load" | "uptime" | "revenue";
type SortDir = "asc" | "desc";

function SortHeader({ label, sortKey, current, dir, onSort }: {
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

interface StationListViewProps {
  stations: Station[];
  metaMap: Record<string, StationMeta>;
  onViewDetails: (id: string) => void;
}

export function StationListView({ stations, metaMap, onViewDetails }: StationListViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const sorted = [...stations].sort((a, b) => {
    let va: string | number = 0, vb: string | number = 0;
    if (sortKey === "name")     { va = a.name;         vb = b.name; }
    if (sortKey === "city")     { va = a.city;         vb = b.city; }
    if (sortKey === "chargers") { va = a.activeChargers; vb = b.activeChargers; }
    if (sortKey === "load")     { va = a.currentLoadKW / a.powerCapacityKW; vb = b.currentLoadKW / b.powerCapacityKW; }
    if (sortKey === "uptime")   { va = a.uptime;       vb = b.uptime; }
    if (sortKey === "revenue")  { va = a.revenue24h;   vb = b.revenue24h; }
    if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb as string) : (vb as string).localeCompare(va);
    return sortDir === "asc" ? (va as number) - (vb as number) : (vb as number) - (va as number);
  });

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <table className="w-full text-sm border-separate border-spacing-0">
        <thead>
          <tr>
            {[
              { label: "Station",   key: "name"     as SortKey },
              { label: "Location",  key: "city"     as SortKey, cls: "hidden md:table-cell" },
              { label: "Chargers",  key: "chargers" as SortKey },
              { label: "Health",    key: "load"     as SortKey, cls: "hidden sm:table-cell" },
              { label: "Load",      key: "load"     as SortKey, cls: "hidden lg:table-cell" },
              { label: "Uptime",    key: "uptime"   as SortKey, cls: "hidden sm:table-cell" },
              { label: "Revenue",   key: "revenue"  as SortKey, cls: "hidden md:table-cell" },
            ].map(({ label, key, cls }) => (
              <th key={`${label}-${key}`} className={cn("bg-muted/40 px-4 py-2.5 text-left first:rounded-tl-xl last:rounded-tr-xl border-b border-border", cls)}>
                <SortHeader label={label} sortKey={key} current={sortKey} dir={sortDir} onSort={handleSort} />
              </th>
            ))}
            <th className="bg-muted/40 px-4 py-2.5 border-b border-border rounded-tr-xl w-24 text-right">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((station, idx) => {
            const status = getStatus(station);
            const utilPct = Math.round((station.currentLoadKW / station.powerCapacityKW) * 100);
            const meta = metaMap[station.id];
            const isLast = idx === sorted.length - 1;
            return (
              <tr key={station.id} className="group hover:bg-muted/20 transition-colors">
                {/* Station name */}
                <td className={cn("px-4 py-3", !isLast && "border-b border-border")}>
                  <div className="flex items-center gap-2.5">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{station.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={cn("text-[10px] font-medium px-1.5 py-px rounded-full border", status.cls)}>
                          {status.label}
                        </span>
                        {station.faultChargers > 0 && (
                          <AlertTriangle className="w-3 h-3 text-[oklch(0.65_0.22_25)]" />
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Location */}
                <td className={cn("px-4 py-3 hidden md:table-cell", !isLast && "border-b border-border")}>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground">{station.city}</span>
                  </div>
                  {meta && <p className="text-[10px] text-muted-foreground/60 mt-0.5">{meta.networkType}</p>}
                </td>

                {/* Chargers */}
                <td className={cn("px-4 py-3", !isLast && "border-b border-border")}>
                  <p className="text-xs font-semibold text-foreground tabular-nums">
                    {station.activeChargers}
                    <span className="text-muted-foreground font-normal">/{station.totalChargers}</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">charging</p>
                </td>

                {/* Health bar */}
                <td className={cn("px-4 py-3 hidden sm:table-cell min-w-[120px]", !isLast && "border-b border-border")}>
                  <StationHealthBar station={station} height="h-2" />
                </td>

                {/* Load */}
                <td className={cn("px-4 py-3 hidden lg:table-cell", !isLast && "border-b border-border")}>
                  <p className="text-xs font-semibold text-foreground tabular-nums">{utilPct}%</p>
                  <p className="text-[10px] text-muted-foreground">{station.currentLoadKW} kW</p>
                </td>

                {/* Uptime */}
                <td className={cn("px-4 py-3 hidden sm:table-cell", !isLast && "border-b border-border")}>
                  <p className={cn(
                    "text-xs font-semibold tabular-nums",
                    station.uptime >= 99 ? "text-[oklch(0.65_0.18_145)]" :
                    station.uptime >= 95 ? "text-foreground" : "text-[oklch(0.72_0.16_75)]"
                  )}>
                    {station.uptime}%
                  </p>
                </td>

                {/* Revenue */}
                <td className={cn("px-4 py-3 hidden md:table-cell", !isLast && "border-b border-border")}>
                  <p className="text-xs font-semibold text-foreground tabular-nums">
                    ₹{station.revenue24h.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] text-muted-foreground">24h</p>
                </td>

                {/* Actions */}
                <td className={cn("px-4 py-3 text-right", !isLast && "border-b border-border")}>
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onViewDetails(station.id)}
                      className="flex items-center gap-1 text-[11px] font-medium text-[oklch(0.65_0.20_240)] hover:text-[oklch(0.70_0.20_240)] transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Details
                    </button>
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <Settings2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}