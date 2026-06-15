import { cn } from "@/lib/utils";
import {
  X, MapPin, Calendar, Wrench, Mail, Zap, Activity,
  IndianRupee, TrendingUp, AlertTriangle, CheckCircle2,
  WifiOff, Info, Cpu, Wifi, CreditCard, Shield,
} from "lucide-react";
import { stations, alarms } from "@/data/mockData";
import { allChargers } from "@/data/chargerData";
import { stationMeta, stationRevenue7d, stationEnergy24h } from "@/data/stationData";
import { useLiveChargerStatus } from "@/hook/useLiveData";
import { StationHealthBar } from "./StationHealthBar";
import type { ChargerStatus, AlarmSeverity } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { formatDistanceToNow } from "date-fns";

// ─── Status configs ───────────────────────────────────────────────────────────

const CHARGER_STATUS: Record<ChargerStatus, { dot: string; bg: string; text: string; border: string }> = {
  charging:  { dot: "bg-[oklch(0.65_0.20_240)] animate-pulse", bg: "bg-[oklch(0.60_0.20_240)/10]", text: "text-[oklch(0.68_0.18_240)]", border: "border-[oklch(0.60_0.20_240)/25]" },
  available: { dot: "bg-[oklch(0.65_0.18_145)]", bg: "bg-[oklch(0.65_0.18_145)/10]", text: "text-[oklch(0.65_0.18_145)]", border: "border-[oklch(0.65_0.18_145)/25]" },
  fault:     { dot: "bg-[oklch(0.65_0.22_25)] animate-pulse", bg: "bg-[oklch(0.65_0.22_25)/10]", text: "text-[oklch(0.65_0.22_25)]", border: "border-[oklch(0.65_0.22_25)/25]" },
  offline:   { dot: "bg-muted-foreground/40", bg: "bg-muted/30", text: "text-muted-foreground", border: "border-border" },
};

const ALARM_CONFIG: Record<AlarmSeverity, { icon: React.ElementType; text: string; bg: string; border: string }> = {
  critical: { icon: AlertTriangle, text: "text-[oklch(0.65_0.22_25)]",  bg: "bg-[oklch(0.65_0.22_25)/8]",  border: "border-[oklch(0.65_0.22_25)/25]" },
  major:    { icon: AlertTriangle, text: "text-[oklch(0.72_0.16_75)]",  bg: "bg-[oklch(0.72_0.16_75)/8]",  border: "border-[oklch(0.72_0.16_75)/25]" },
  minor:    { icon: Info,          text: "text-[oklch(0.65_0.20_240)]", bg: "bg-[oklch(0.65_0.20_240)/8]", border: "border-[oklch(0.65_0.20_240)/20]" },
  info:     { icon: Info,          text: "text-muted-foreground",       bg: "bg-transparent",              border: "border-border" },
};

const CATEGORY_ICON: Record<string, React.ElementType> = {
  hardware: Cpu, network: Wifi, power: Zap, billing: CreditCard, security: Shield,
};

interface StationDetailPanelProps {
  stationId: string;
  onClose: () => void;
}

export function StationDetailPanel({ stationId, onClose }: StationDetailPanelProps) {
  const station = stations.find((s) => s.id === stationId);
  const meta    = stationMeta.find((m) => m.id === stationId);
  const liveStatuses = useLiveChargerStatus();

  if (!station || !meta) return null;

  // Use allChargers (chargerData.ts) so all 12 stations have data
  const stationChargers = allChargers.filter((c) => c.stationId === stationId);
  const stationAlarms   = alarms.filter((a) => a.stationName === station.name);
  const revenue7d       = (stationRevenue7d[stationId] ?? []).map((v, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    revenue: v,
  }));
  const energy24h = (stationEnergy24h[stationId] ?? []).map((v, i) => ({
    hour: `${i.toString().padStart(2, "00")}:00`,
    kWh: v,
  }));

  const utilPct = Math.round((station.currentLoadKW / station.powerCapacityKW) * 100);
  const activeSess = stationChargers.filter((c) => c.status === "charging").length;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-[520px] bg-background border-l border-border z-50 flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-border shrink-0">
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-base font-bold text-foreground truncate">{station.name}</h2>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{meta.address}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              {meta.tags.map((tag) => (
                <span key={tag} className="text-[9px] font-medium px-1.5 py-px rounded-md bg-muted text-muted-foreground border border-border">
                  {tag}
                </span>
              ))}
              <span className="text-[9px] font-medium px-1.5 py-px rounded-md bg-[oklch(0.60_0.20_240)/10] text-[oklch(0.68_0.18_240)] border border-[oklch(0.60_0.20_240)/25]">
                {meta.networkType}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-7 h-7 rounded-md bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-5">

            {/* KPI row */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Zap,         label: "Active Sessions", value: activeSess,                            sub: "charging now",         color: "text-[oklch(0.65_0.20_240)]", bg: "bg-[oklch(0.60_0.20_240)/8]",  border: "border-[oklch(0.60_0.20_240)/20]" },
                { icon: Activity,    label: "Network Load",    value: `${utilPct}%`,                         sub: `${station.currentLoadKW} kW live`,  color: "text-[oklch(0.65_0.18_145)]", bg: "bg-[oklch(0.65_0.18_145)/8]",  border: "border-[oklch(0.65_0.18_145)/20]" },
                { icon: IndianRupee, label: "Revenue 24h",     value: `₹${station.revenue24h.toLocaleString("en-IN")}`, sub: "billed today", color: "text-[oklch(0.68_0.18_300)]", bg: "bg-[oklch(0.65_0.18_300)/8]",  border: "border-[oklch(0.65_0.18_300)/20]" },
                { icon: TrendingUp,  label: "Uptime",          value: `${station.uptime}%`,                  sub: "30-day average",        color: station.uptime >= 99 ? "text-[oklch(0.65_0.18_145)]" : "text-[oklch(0.72_0.16_75)]", bg: "bg-muted/40", border: "border-border" },
              ].map(({ icon: Icon, label, value, sub, color, bg, border }) => (
                <div key={label} className={cn("rounded-xl border px-3 py-2.5", bg, border)}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className={cn("w-3.5 h-3.5", color)} />
                    <span className="text-[10px] text-muted-foreground">{label}</span>
                  </div>
                  <p className={cn("text-lg font-bold tabular-nums leading-none", color)}>{value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
                </div>
              ))}
            </div>

            {/* Health bar */}
            <div className="rounded-xl border border-border bg-card px-4 py-3">
              <p className="text-xs font-semibold text-foreground mb-2">Charger Health — {station.totalChargers} units</p>
              <StationHealthBar station={station} showLabels height="h-3" />
            </div>

            {/* Charger grid */}
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">Live Charger Status</p>
              {stationChargers.length === 0 ? (
                <p className="text-xs text-muted-foreground py-3">No detailed charger telemetry available.</p>
              ) : (
                <div className="grid grid-cols-4 gap-1.5">
                  {stationChargers.map((c) => {
                    const live = liveStatuses[c.id];
                    const cfg = CHARGER_STATUS[c.status];
                    return (
                      <div key={c.id} className={cn("flex flex-col items-center gap-1 p-2 rounded-lg border text-center", cfg.bg, cfg.border)}>
                        <div className="flex items-center gap-1">
                          <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)} />
                          <span className="text-[10px] font-bold text-foreground">{c.label}</span>
                        </div>
                        {c.status === "charging" && live ? (
                          <span className={cn("text-[10px] font-semibold tabular-nums", cfg.text)}>
                            {live.power.toFixed(0)}kW
                          </span>
                        ) : (
                          <span className={cn("text-[9px]", cfg.text)}>{c.status}</span>
                        )}
                        <span className="text-[8px] text-muted-foreground/60 font-mono">{c.connectorType}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 7-day revenue chart */}
            <div className="rounded-xl border border-border bg-card px-4 pt-3 pb-2">
              <p className="text-xs font-semibold text-foreground mb-3">7-Day Revenue</p>
              <ResponsiveContainer width="100%" height={90}>
                <BarChart data={revenue7d} barSize={18}>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "oklch(0.55 0.01 240)" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }}
                    formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]}
                    cursor={{ fill: "oklch(0.60 0.20 240 / 0.06)" }}
                  />
                  <Bar dataKey="revenue" fill="oklch(0.65 0.18 300)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 24h energy chart */}
            <div className="rounded-xl border border-border bg-card px-4 pt-3 pb-2">
              <p className="text-xs font-semibold text-foreground mb-3">24h Energy Delivered (kWh)</p>
              <ResponsiveContainer width="100%" height={80}>
                <AreaChart data={energy24h}>
                  <defs>
                    <linearGradient id={`eg-${stationId}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="oklch(0.65 0.20 240)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="oklch(0.65 0.20 240)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "oklch(0.55 0.01 240)" }} tickFormatter={(v: string) => v.slice(0, 2)} axisLine={false} tickLine={false} interval={5} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }}
                    formatter={(v: number) => [`${v} kWh`, "Energy"]}
                    cursor={{ stroke: "oklch(0.60 0.20 240 / 0.3)", strokeWidth: 1 }}
                  />
                  <Area type="monotone" dataKey="kWh" stroke="oklch(0.65 0.20 240)" strokeWidth={1.5} fill={`url(#eg-${stationId})`} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Station alarms */}
            {stationAlarms.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-foreground mb-2">Recent Alarms</p>
                <div className="space-y-2">
                  {stationAlarms.slice(0, 4).map((alarm) => {
                    const cfg = ALARM_CONFIG[alarm.severity];
                    const CatIcon = CATEGORY_ICON[alarm.category] ?? AlertTriangle;
                    return (
                      <div key={alarm.id} className={cn("flex gap-2.5 p-3 rounded-lg border", cfg.bg, cfg.border)}>
                        <div className="flex items-center gap-1.5 shrink-0 mt-px">
                          <CatIcon className={cn("w-3.5 h-3.5", cfg.text)} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] text-foreground leading-snug line-clamp-2">{alarm.message}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={cn("text-[10px] font-medium capitalize", cfg.text)}>{alarm.severity}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {formatDistanceToNow(alarm.timestamp, { addSuffix: true })}
                            </span>
                            {alarm.acknowledged && (
                              <div className="flex items-center gap-0.5 text-[10px] text-[oklch(0.65_0.18_145)]">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                <span>ACK</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Station metadata */}
            <div className="rounded-xl border border-border bg-card px-4 py-4">
              <p className="text-xs font-semibold text-foreground mb-3">Station Information</p>
              <div className="space-y-2.5">
                {[
                  { icon: Wrench,   label: "Operator",         value: meta.operator },
                  { icon: MapPin,   label: "Address",          value: meta.address },
                  { icon: Calendar, label: "Installed",        value: new Date(meta.installDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
                  { icon: Wrench,   label: "Last Maintenance", value: new Date(meta.lastMaintenance).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
                  { icon: Calendar, label: "Next Maintenance", value: new Date(meta.nextMaintenance).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
                  { icon: Mail,     label: "Contact",          value: meta.contactEmail },
                  { icon: Zap,      label: "Connectors",       value: meta.connectorTypes.join(", ") },
                  { icon: WifiOff,  label: "Station ID",       value: station.id },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-muted-foreground block">{label}</span>
                      <span className="text-xs text-foreground break-words">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}