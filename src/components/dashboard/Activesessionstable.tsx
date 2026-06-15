import { useState } from "react";
import { cn } from "@/lib/utils";
import { activeSessions, type ChargingSession, type ConnectorType } from "@/data/mockData";
import {
  Zap,
  Clock,
  Car,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
} from "lucide-react";
import { useLiveSessionPower } from "@/hook/useLiveData";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

// Formats paise/rupees as ₹1,234 using Indian locale
function formatCost(rupees: number): string {
  return `₹${rupees.toLocaleString("en-IN")}`;
}

function getETA(session: ChargingSession): string {
  const remaining = session.targetSoC - session.stateOfCharge;
  if (remaining <= 0) return "Complete";
  const kwhNeeded = (remaining / 100) * 75; // assume 75 kWh battery
  const hoursLeft = kwhNeeded / Math.max(session.powerKW, 1);
  const minsLeft = Math.round(hoursLeft * 60);
  return `~${formatDuration(minsLeft)}`;
}

const CONNECTOR_COLORS: Record<ConnectorType, string> = {
  CCS2:    "bg-[oklch(0.60_0.20_240)/12] text-[oklch(0.68_0.18_240)] border-[oklch(0.60_0.20_240)/25]",
  CHAdeMO: "bg-[oklch(0.65_0.18_300)/12] text-[oklch(0.65_0.18_300)] border-[oklch(0.65_0.18_300)/25]",
  Type2:   "bg-[oklch(0.65_0.18_145)/12] text-[oklch(0.65_0.18_145)] border-[oklch(0.65_0.18_145)/25]",
  OCPP:    "bg-[oklch(0.72_0.16_75)/12]  text-[oklch(0.72_0.16_75)]  border-[oklch(0.72_0.16_75)/25]",
};

function SoCBar({ value, target }: { value: number; target: number }) {
  const color =
    value >= 80 ? "bg-[oklch(0.65_0.18_145)]" :
    value >= 40 ? "bg-[oklch(0.65_0.20_240)]" :
                  "bg-[oklch(0.72_0.16_75)]";
  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden relative">
        {/* Target marker */}
        <div
          className="absolute top-0 bottom-0 w-px bg-muted-foreground/40 z-10"
          style={{ left: `${target}%` }}
        />
        <div
          className={cn("h-full rounded-full transition-all duration-700", color)}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-foreground font-medium w-8 text-right">{value}%</span>
    </div>
  );
}

// ─── Sort logic ───────────────────────────────────────────────────────────────

type SortKey = "station" | "driver" | "duration" | "energy" | "power" | "soc" | "cost";
type SortDir = "asc" | "desc" | null;

function sortSessions(sessions: ChargingSession[], key: SortKey, dir: SortDir) {
  if (!dir) return sessions;
  return [...sessions].sort((a, b) => {
    let va: number | string = 0, vb: number | string = 0;
    if (key === "station")  { va = a.stationName;    vb = b.stationName; }
    if (key === "driver")   { va = a.driverName;     vb = b.driverName; }
    if (key === "duration") { va = a.durationMin;    vb = b.durationMin; }
    if (key === "energy")   { va = a.energyKWh;      vb = b.energyKWh; }
    if (key === "power")    { va = a.powerKW;        vb = b.powerKW; }
    if (key === "soc")      { va = a.stateOfCharge;  vb = b.stateOfCharge; }
    if (key === "cost")     { va = a.cost;           vb = b.cost; }
    if (typeof va === "string") return dir === "asc" ? va.localeCompare(vb as string) : (vb as string).localeCompare(va);
    return dir === "asc" ? (va as number) - (vb as number) : (vb as number) - (va as number);
  });
}

// ─── Column header ─────────────────────────────────────────────────────────────

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

// ─── Main component ────────────────────────────────────────────────────────────

export function ActiveSessionsTable() {
  const livePowers = useLiveSessionPower();
  const [sortKey, setSortKey]   = useState<SortKey>("duration");
  const [sortDir, setSortDir]   = useState<SortDir>("desc");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter]     = useState<"all" | ConnectorType>("all");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : d === "desc" ? null : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const connectorTypes: ConnectorType[] = ["CCS2", "CHAdeMO", "Type2"];

  const filtered = filter === "all"
    ? activeSessions
    : activeSessions.filter((s) => s.connectorType === filter);

  const sorted = sortSessions(filtered, sortKey, sortDir);

  const totalEnergy  = filtered.reduce((s, x) => s + x.energyKWh, 0);
  const totalRevenue = filtered.reduce((s, x) => s + x.cost, 0);
  const totalPower   = filtered.reduce((s, x) => s + (livePowers[x.id] ?? x.powerKW), 0);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4 pb-3 shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Active Charging Sessions</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {filtered.length} sessions · {totalPower.toFixed(0)} kW live · {totalEnergy.toFixed(1)} kWh delivered · {formatCost(totalRevenue)} billed
          </p>
        </div>

        {/* Connector filter pills */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "text-[11px] font-medium px-2.5 py-1 rounded-full border transition-colors",
              filter === "all"
                ? "bg-[oklch(0.60_0.20_240)/15] text-[oklch(0.68_0.18_240)] border-[oklch(0.60_0.20_240)/30]"
                : "text-muted-foreground border-border hover:text-foreground hover:bg-muted"
            )}
          >
            All
          </button>
          {connectorTypes.map((ct) => (
            <button
              key={ct}
              onClick={() => setFilter(ct)}
              className={cn(
                "text-[11px] font-medium px-2.5 py-1 rounded-full border transition-colors",
                filter === ct
                  ? cn("border", CONNECTOR_COLORS[ct])
                  : "text-muted-foreground border-border hover:text-foreground hover:bg-muted"
              )}
            >
              {ct}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-4 pb-4 min-h-0">
        <table className="w-full text-sm border-separate border-spacing-0">
          <thead className="sticky top-0 z-10">
            <tr>
              {[
                { label: "Vehicle / Driver", key: "driver" as SortKey,   width: "" },
                { label: "Station · Charger", key: "station" as SortKey, width: "hidden md:table-cell" },
                { label: "Duration",          key: "duration" as SortKey, width: "hidden sm:table-cell" },
                { label: "Power",             key: "power" as SortKey,   width: "" },
                { label: "Energy",            key: "energy" as SortKey,  width: "hidden lg:table-cell" },
                { label: "State of Charge",   key: "soc" as SortKey,     width: "hidden sm:table-cell" },
                { label: "Cost",              key: "cost" as SortKey,    width: "hidden md:table-cell" },
              ].map(({ label, key, width }) => (
                <th
                  key={key}
                  className={cn(
                    "bg-muted/40 backdrop-blur-sm px-3 py-2 text-left first:rounded-l-lg last:rounded-r-lg border-y border-border first:border-l last:border-r",
                    width
                  )}
                >
                  <SortHeader label={label} sortKey={key} current={sortKey} dir={sortDir} onSort={handleSort} />
                </th>
              ))}
              <th className="bg-muted/40 backdrop-blur-sm px-3 py-2 rounded-r-lg border-y border-r border-border w-8" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((session) => {
              const livePower = livePowers[session.id] ?? session.powerKW;
              const isExpanded = expanded === session.id;
              const eta = getETA(session);

              return (
                <>
                  <tr
                    key={session.id}
                    className={cn(
                      "group cursor-pointer transition-colors",
                      isExpanded ? "bg-[oklch(0.60_0.20_240)/5]" : "hover:bg-muted/30"
                    )}
                    onClick={() => setExpanded(isExpanded ? null : session.id)}
                  >
                    {/* Vehicle / Driver */}
                    <td className="px-3 py-2.5 border-b border-border">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-[oklch(0.60_0.20_240)/10] flex items-center justify-center shrink-0">
                          <Car className="w-3.5 h-3.5 text-[oklch(0.65_0.20_240)]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">{session.driverName}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{session.vehicleId}</p>
                        </div>
                      </div>
                    </td>

                    {/* Station · Charger */}
                    <td className="px-3 py-2.5 border-b border-border hidden md:table-cell">
                      <p className="text-xs text-foreground truncate max-w-[160px]">{session.stationName}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-muted-foreground">
                          {session.chargerId} · {session.chargerLabel}
                        </span>
                        <span className={cn(
                          "text-[9px] font-medium px-1.5 py-px rounded-full border",
                          CONNECTOR_COLORS[session.connectorType]
                        )}>
                          {session.connectorType}
                        </span>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="px-3 py-2.5 border-b border-border hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-muted-foreground shrink-0" />
                        <div>
                          <p className="text-xs text-foreground tabular-nums">{formatDuration(session.durationMin)}</p>
                          <p className="text-[10px] text-muted-foreground">since {formatTime(session.startTime)}</p>
                        </div>
                      </div>
                    </td>

                    {/* Live Power */}
                    <td className="px-3 py-2.5 border-b border-border">
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[oklch(0.65_0.20_240)] shrink-0" />
                        <span className="text-xs font-semibold text-foreground tabular-nums">
                          {livePower.toFixed(0)} kW
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">ETA: {eta}</p>
                    </td>

                    {/* Energy */}
                    <td className="px-3 py-2.5 border-b border-border hidden lg:table-cell">
                      <span className="text-xs text-foreground tabular-nums font-medium">
                        {session.energyKWh.toFixed(1)} kWh
                      </span>
                    </td>

                    {/* SoC */}
                    <td className="px-3 py-2.5 border-b border-border hidden sm:table-cell">
                      <SoCBar value={session.stateOfCharge} target={session.targetSoC} />
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Target: {session.targetSoC}%
                      </p>
                    </td>

                    {/* Cost */}
                    <td className="px-3 py-2.5 border-b border-border hidden md:table-cell">
                      <span className="text-xs font-semibold text-foreground tabular-nums">
                        {formatCost(session.cost)}
                      </span>
                    </td>

                    {/* Expand toggle */}
                    <td className="px-3 py-2.5 border-b border-border">
                      <ChevronDown className={cn(
                        "w-3.5 h-3.5 text-muted-foreground transition-transform",
                        isExpanded && "rotate-180"
                      )} />
                    </td>
                  </tr>

                  {/* Expanded detail row */}
                  {isExpanded && (
                    <tr key={`${session.id}-expanded`}>
                      <td colSpan={8} className="px-3 pb-3 border-b border-border bg-[oklch(0.60_0.20_240)/5]">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                          {[
                            { label: "Session ID",    value: session.id },
                            { label: "Started",       value: formatTime(session.startTime) },
                            { label: "Live Power",    value: `${livePower.toFixed(1)} kW`, highlight: true },
                            { label: "Energy So Far", value: `${session.energyKWh.toFixed(2)} kWh` },
                            { label: "Connector",     value: session.connectorType },
                            { label: "Vehicle Reg",   value: session.vehicleId },
                            { label: "Billed So Far", value: formatCost(session.cost), highlight: true },
                            { label: "ETA to Target", value: eta },
                          ].map(({ label, value, highlight }) => (
                            <div key={label} className="bg-card/60 rounded-lg border border-border px-3 py-2">
                              <p className="text-[10px] text-muted-foreground mb-0.5">{label}</p>
                              <p className={cn(
                                "text-xs font-semibold",
                                highlight ? "text-[oklch(0.68_0.18_240)]" : "text-foreground"
                              )}>
                                {value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>

          {/* Footer totals */}
          <tfoot>
            <tr>
              <td colSpan={2} className="px-3 pt-2 pb-1">
                <span className="text-[11px] font-medium text-muted-foreground">
                  {filtered.length} active sessions
                </span>
              </td>
              <td className="px-3 pt-2 pb-1 hidden sm:table-cell" />
              <td className="px-3 pt-2 pb-1">
                <span className="text-[11px] font-semibold text-foreground tabular-nums">
                  {totalPower.toFixed(0)} kW
                </span>
              </td>
              <td className="px-3 pt-2 pb-1 hidden lg:table-cell">
                <span className="text-[11px] font-semibold text-foreground tabular-nums">
                  {totalEnergy.toFixed(1)} kWh
                </span>
              </td>
              <td className="px-3 pt-2 pb-1 hidden sm:table-cell" />
              <td className="px-3 pt-2 pb-1 hidden md:table-cell">
                <span className="text-[11px] font-semibold text-foreground tabular-nums">
                  {formatCost(totalRevenue)}
                </span>
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}