import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { stations } from "@/data/mockData";
import { stationRevenue7d, stationMeta } from "@/data/stationData";
import { allChargers } from "@/data/chargerData";

// ─── Build the row data set once ─────────────────────────────────────────────

interface StationRow {
  id: string;
  name: string;
  city: string;
  revenue7d: number;
  sessions7d: number;        // estimated: revenue7d / avg ticket
  uptime: number;
  utilization: number;       // %
  topConnector: string;
  chargerCount: number;
}

const AVG_TICKET = 2100; // ₹ per session estimated average

const rows: StationRow[] = stations.map((s) => {
  const rev7d = (stationRevenue7d[s.id] ?? []).reduce((a, b) => a + b, 0);
  const meta  = stationMeta.find((m) => m.id === s.id);
  const myChargers = allChargers.filter((c) => c.stationId === s.id);

  // Tally connector types to find the dominant one
  const connCount: Record<string, number> = {};
  for (const c of myChargers) connCount[c.connectorType] = (connCount[c.connectorType] ?? 0) + 1;
  const topConnector = Object.entries(connCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? meta?.connectorTypes[0] ?? "CCS2";

  return {
    id: s.id,
    name: s.name,
    city: s.city,
    revenue7d: rev7d,
    sessions7d: Math.round(rev7d / AVG_TICKET),
    uptime: s.uptime,
    utilization: Math.round((s.currentLoadKW / s.powerCapacityKW) * 100),
    topConnector,
    chargerCount: s.totalChargers,
  };
});

// ─── Sort helpers ─────────────────────────────────────────────────────────────

type SortKey = "name" | "city" | "revenue7d" | "sessions7d" | "uptime" | "utilization";
type SortDir = "asc" | "desc";

function SortTh({ label, sortKey, current, dir, onSort, className }: {
  label: string; sortKey: SortKey; current: SortKey; dir: SortDir;
  onSort: (k: SortKey) => void; className?: string;
}) {
  const active = current === sortKey;
  return (
    <th className={cn("bg-muted/40 px-4 py-2.5 text-left border-b border-border", className)}>
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

// ─── Inline sparkline from 7d revenue array ───────────────────────────────────

function MiniSparkline({ data }: { data: number[] }) {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 56, h = 20;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" className="shrink-0">
      <polyline points={pts} stroke="oklch(0.65 0.18 300)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function StationPerformanceTable() {
  const [sortKey, setSortKey] = useState<SortKey>("revenue7d");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const sorted = [...rows].sort((a, b) => {
    let va: string | number = a[sortKey];
    let vb: string | number = b[sortKey];
    if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb as string) : (vb as string).localeCompare(va);
    return sortDir === "asc" ? (va as number) - (vb as number) : (vb as number) - (va as number);
  });

  // rank map for revenue badges
  const revenueRanks = [...rows].sort((a, b) => b.revenue7d - a.revenue7d).map((r, i) => ({ id: r.id, rank: i }));
  const rankMap = Object.fromEntries(revenueRanks.map(({ id, rank }) => [id, rank]));

  function rankBadge(rank: number) {
    if (rank === 0) return <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded px-1.5 py-px ml-1">#1</span>;
    if (rank === 1) return <span className="text-[9px] font-bold text-slate-400 bg-slate-400/10 border border-slate-400/20 rounded px-1.5 py-px ml-1">#2</span>;
    if (rank === 2) return <span className="text-[9px] font-bold text-orange-500/80 bg-orange-500/10 border border-orange-500/20 rounded px-1.5 py-px ml-1">#3</span>;
    return null;
  }

  const CONNECTOR_BADGE: Record<string, string> = {
    CCS2:    "bg-[oklch(0.60_0.20_240)/12] text-[oklch(0.68_0.18_240)] border-[oklch(0.60_0.20_240)/25]",
    CHAdeMO: "bg-[oklch(0.65_0.18_300)/12] text-[oklch(0.65_0.18_300)] border-[oklch(0.65_0.18_300)/25]",
    Type2:   "bg-[oklch(0.65_0.18_145)/12] text-[oklch(0.65_0.18_145)] border-[oklch(0.65_0.18_145)/25]",
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Station Performance — Last 7 Days</h2>
          <p className="text-xs text-muted-foreground mt-0.5">All {rows.length} stations ranked and compared</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-0">
          <thead>
            <tr>
              <SortTh label="Station"     sortKey="name"       current={sortKey} dir={sortDir} onSort={handleSort} className="pl-5 first:rounded-tl-xl" />
              <SortTh label="City"        sortKey="city"       current={sortKey} dir={sortDir} onSort={handleSort} className="hidden md:table-cell" />
              <SortTh label="Revenue 7d"  sortKey="revenue7d"  current={sortKey} dir={sortDir} onSort={handleSort} />
              <SortTh label="Sessions"    sortKey="sessions7d" current={sortKey} dir={sortDir} onSort={handleSort} className="hidden sm:table-cell" />
              <SortTh label="Uptime"      sortKey="uptime"     current={sortKey} dir={sortDir} onSort={handleSort} className="hidden lg:table-cell" />
              <SortTh label="Utilization" sortKey="utilization" current={sortKey} dir={sortDir} onSort={handleSort} className="hidden lg:table-cell" />
              <th className="bg-muted/40 px-4 py-2.5 border-b border-border text-[11px] font-medium uppercase tracking-wider text-muted-foreground text-left hidden xl:table-cell">Top Connector</th>
              <th className="bg-muted/40 px-4 py-2.5 border-b border-border text-[11px] font-medium uppercase tracking-wider text-muted-foreground text-left pr-5 last:rounded-tr-xl">Trend</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, idx) => {
              const isLast = idx === sorted.length - 1;
              const rev7dData = stationRevenue7d[row.id] ?? [];
              const formattedRev = row.revenue7d >= 100000
                ? `₹${(row.revenue7d / 100000).toFixed(2)}L`
                : `₹${(row.revenue7d / 1000).toFixed(1)}K`;

              return (
                <tr key={row.id} className="hover:bg-muted/15 transition-colors">
                  {/* Station name */}
                  <td className={cn("px-5 py-3", !isLast && "border-b border-border")}>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-foreground truncate max-w-[150px]">{row.name}</span>
                      {rankBadge(rankMap[row.id])}
                    </div>
                    <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{row.id} · {row.chargerCount} chargers</p>
                  </td>

                  {/* City */}
                  <td className={cn("px-4 py-3 hidden md:table-cell", !isLast && "border-b border-border")}>
                    <span className="text-xs text-foreground">{row.city}</span>
                  </td>

                  {/* Revenue */}
                  <td className={cn("px-4 py-3", !isLast && "border-b border-border")}>
                    <span className="text-sm font-bold text-foreground tabular-nums">{formattedRev}</span>
                  </td>

                  {/* Sessions */}
                  <td className={cn("px-4 py-3 hidden sm:table-cell", !isLast && "border-b border-border")}>
                    <span className="text-xs text-foreground tabular-nums font-medium">~{row.sessions7d.toLocaleString("en-IN")}</span>
                  </td>

                  {/* Uptime */}
                  <td className={cn("px-4 py-3 hidden lg:table-cell min-w-[90px]", !isLast && "border-b border-border")}>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", row.uptime >= 99 ? "bg-[oklch(0.65_0.18_145)]" : row.uptime >= 95 ? "bg-[oklch(0.65_0.20_240)]" : "bg-[oklch(0.72_0.16_75)]")}
                          style={{ width: `${row.uptime}%` }}
                        />
                      </div>
                      <span className={cn("text-[10px] tabular-nums font-medium w-10 text-right", row.uptime >= 99 ? "text-[oklch(0.65_0.18_145)]" : row.uptime >= 95 ? "text-foreground" : "text-[oklch(0.72_0.16_75)]")}>
                        {row.uptime}%
                      </span>
                    </div>
                  </td>

                  {/* Utilization */}
                  <td className={cn("px-4 py-3 hidden lg:table-cell min-w-[90px]", !isLast && "border-b border-border")}>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", row.utilization > 85 ? "bg-[oklch(0.65_0.22_25)]" : row.utilization > 65 ? "bg-[oklch(0.72_0.16_75)]" : "bg-[oklch(0.65_0.20_240)]")}
                          style={{ width: `${row.utilization}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground tabular-nums w-8 text-right">{row.utilization}%</span>
                    </div>
                  </td>

                  {/* Top connector */}
                  <td className={cn("px-4 py-3 hidden xl:table-cell", !isLast && "border-b border-border")}>
                    <span className={cn("text-[9px] font-medium px-1.5 py-0.5 rounded-full border", CONNECTOR_BADGE[row.topConnector] ?? "bg-muted text-muted-foreground border-border")}>
                      {row.topConnector}
                    </span>
                  </td>

                  {/* Revenue sparkline */}
                  <td className={cn("px-4 py-3 pr-5", !isLast && "border-b border-border")}>
                    <MiniSparkline data={rev7dData} />
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