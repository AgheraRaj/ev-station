import { cn } from "@/lib/utils";
import {
  X, Zap, Thermometer, Activity, Calendar, Wrench,
  AlertTriangle, CheckCircle2, Info, Wifi, CreditCard,
  Shield, Cpu, BatteryCharging, Clock, Car,
} from "lucide-react";
import { allChargers, chargerPowerHistory } from "@/data/chargerData";
import { stations, activeSessions, alarms } from "@/data/mockData";
import type { AlarmSeverity } from "@/data/mockData";
import { useLiveChargerStatus } from "@/hook/useLiveData";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { formatDistanceToNow } from "date-fns";

// ─── Shared config ─────────────────────────────────────────────────────────────

const ALARM_CFG: Record<AlarmSeverity, { icon: React.ElementType; text: string; bg: string; border: string }> = {
  critical: { icon: AlertTriangle, text: "text-[oklch(0.65_0.22_25)]",  bg: "bg-[oklch(0.65_0.22_25)/8]",  border: "border-[oklch(0.65_0.22_25)/25]" },
  major:    { icon: AlertTriangle, text: "text-[oklch(0.72_0.16_75)]",  bg: "bg-[oklch(0.72_0.16_75)/8]",  border: "border-[oklch(0.72_0.16_75)/25]" },
  minor:    { icon: Info,          text: "text-[oklch(0.65_0.20_240)]", bg: "bg-[oklch(0.65_0.20_240)/8]", border: "border-[oklch(0.65_0.20_240)/20]" },
  info:     { icon: Info,          text: "text-muted-foreground",        bg: "bg-transparent",               border: "border-border" },
};

const CATEGORY_ICON: Record<string, React.ElementType> = {
  hardware: Cpu, network: Wifi, power: Zap, billing: CreditCard, security: Shield,
};

function tempColor(t: number) {
  if (t >= 65) return "text-[oklch(0.65_0.22_25)]";
  if (t >= 50) return "text-[oklch(0.72_0.16_75)]";
  return "text-[oklch(0.65_0.18_145)]";
}

// ─── Power gauge (radial) ─────────────────────────────────────────────────────

function PowerGauge({ livePower, maxPower }: { livePower: number; maxPower: number }) {
  const pct = maxPower > 0 ? Math.round((livePower / maxPower) * 100) : 0;
  const data = [{ value: pct, fill: "oklch(0.65 0.20 240)" }];
  return (
    <div className="relative flex items-center justify-center">
      <ResponsiveContainer width={120} height={120}>
        <RadialBarChart
          cx="50%" cy="50%"
          innerRadius="70%" outerRadius="90%"
          startAngle={225} endAngle={-45}
          data={data}
          barSize={10}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            background={{ fill: "oklch(0.4 0.01 240 / 0.15)" }}
            dataKey="value"
            cornerRadius={6}
            angleAxisId={0}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-bold tabular-nums text-foreground">{livePower.toFixed(0)}</span>
        <span className="text-[10px] text-muted-foreground">/ {maxPower} kW</span>
        <span className="text-[10px] font-medium text-[oklch(0.65_0.20_240)]">{pct}%</span>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

interface ChargerDetailPanelProps {
  chargerId: string;
  onClose: () => void;
}

export function ChargerDetailPanel({ chargerId, onClose }: ChargerDetailPanelProps) {
  const liveStatuses = useLiveChargerStatus();
  const charger = allChargers.find((c) => c.id === chargerId);
  if (!charger) return null;

  const live = liveStatuses[charger.id] ?? { power: charger.currentPowerKW, temp: charger.temperature };
  const station = stations.find((s) => s.id === charger.stationId);
  const session = activeSessions.find((s) => s.chargerId === chargerId);
  const chargerAlarms = alarms.filter((a) => a.chargerId === chargerId);

  const powerHistory = (chargerPowerHistory[chargerId] ?? []).map((v, i) => ({
    hour: `${i.toString().padStart(2, "0")}:00`,
    kW: v,
  }));

  const isCharging = charger.status === "charging";
  const isFault    = charger.status === "fault";

  const statusLabel =
    isCharging ? "Charging" :
    charger.status === "available" ? "Available" :
    isFault ? "Fault" : "Offline";

  const statusBadge =
    isCharging ? "bg-[oklch(0.60_0.20_240)/15] text-[oklch(0.68_0.18_240)] border-[oklch(0.60_0.20_240)/30]" :
    charger.status === "available" ? "bg-[oklch(0.65_0.18_145)/15] text-[oklch(0.65_0.18_145)] border-[oklch(0.65_0.18_145)/30]" :
    isFault ? "bg-[oklch(0.65_0.22_25)/15] text-[oklch(0.65_0.22_25)] border-[oklch(0.65_0.22_25)/30]" :
    "bg-muted/40 text-muted-foreground border-border";

  function formatDuration(minutes: number) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 h-screen backdrop-blur-sm z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-[500px] bg-background border-l border-border z-50 flex flex-col shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-border shrink-0">
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-foreground">{charger.id}</h2>
              <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", statusBadge)}>
                {statusLabel}
              </span>
              {isFault && live.temp >= 65 && (
                <span className="text-[10px] font-bold text-[oklch(0.65_0.22_25)] animate-pulse">⚠ OVERTEMP</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Port {charger.label} · {station?.name ?? charger.stationId} · {station?.city}
            </p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-[9px] font-medium px-1.5 py-px rounded-md bg-muted border border-border text-muted-foreground">
                {charger.connectorType}
              </span>
              <span className="text-[9px] font-medium px-1.5 py-px rounded-md bg-muted border border-border text-muted-foreground">
                OCPP {charger.ocppVersion}
              </span>
              <span className="text-[9px] font-medium px-1.5 py-px rounded-md bg-muted border border-border text-muted-foreground">
                {charger.firmwareVersion}
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-5">

            {/* Live telemetry */}
            <div>
              <p className="text-xs font-semibold text-foreground mb-3">Live Telemetry</p>
              <div className="grid grid-cols-3 gap-3 items-center">
                {/* Power gauge */}
                <div className="col-span-1 flex justify-center">
                  <PowerGauge livePower={live.power} maxPower={charger.powerKW} />
                </div>

                {/* Metrics grid */}
                <div className="col-span-2 grid grid-cols-2 gap-2">
                  {[
                    { icon: Zap,         label: "Voltage",    value: charger.voltage > 0 ? `${charger.voltage} V` : "—",        color: "text-[oklch(0.65_0.20_240)]" },
                    { icon: Activity,    label: "Current",    value: charger.current > 0 ? `${charger.current} A` : "—",        color: "text-[oklch(0.65_0.20_240)]" },
                    { icon: Thermometer, label: "Temperature",value: `${live.temp.toFixed(0)}°C`,                               color: tempColor(live.temp) },
                    { icon: Zap,         label: "Max Power",  value: `${charger.powerKW} kW`,                                   color: "text-muted-foreground" },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="bg-muted/30 rounded-lg border border-border px-3 py-2">
                      <div className="flex items-center gap-1 mb-0.5">
                        <Icon className={cn("w-3 h-3 shrink-0", color)} />
                        <span className="text-[10px] text-muted-foreground">{label}</span>
                      </div>
                      <p className={cn("text-sm font-bold tabular-nums", color)}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Active session */}
            {session && (
              <div className="rounded-xl border border-[oklch(0.60_0.20_240)/25] bg-[oklch(0.60_0.20_240)/5] px-4 py-3">
                <p className="text-xs font-semibold text-foreground mb-2.5 flex items-center gap-1.5">
                  <BatteryCharging className="w-3.5 h-3.5 text-[oklch(0.65_0.20_240)]" />
                  Active Session — {session.id}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: Car,     label: "Driver",     value: session.driverName },
                    { icon: Car,     label: "Vehicle",    value: session.vehicleId },
                    { icon: Clock,   label: "Duration",   value: formatDuration(session.durationMin) },
                    { icon: Zap,     label: "Energy",     value: `${session.energyKWh.toFixed(1)} kWh` },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label}>
                      <p className="text-[10px] text-muted-foreground">{label}</p>
                      <p className="text-xs font-semibold text-foreground truncate">{value}</p>
                    </div>
                  ))}
                </div>
                {/* SoC bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                    <span>State of Charge</span>
                    <span>{session.stateOfCharge}% → {session.targetSoC}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-border overflow-hidden relative">
                    <div
                      className="absolute top-0 bottom-0 w-px bg-muted-foreground/40 z-10"
                      style={{ left: `${session.targetSoC}%` }}
                    />
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        session.stateOfCharge >= 80 ? "bg-[oklch(0.65_0.18_145)]" :
                        session.stateOfCharge >= 40 ? "bg-[oklch(0.65_0.20_240)]" :
                        "bg-[oklch(0.72_0.16_75)]"
                      )}
                      style={{ width: `${session.stateOfCharge}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] text-muted-foreground">Billed</span>
                  <span className="text-xs font-bold text-[oklch(0.68_0.18_240)]">
                    ₹{session.cost.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            )}

            {/* 24h power chart */}
            <div className="rounded-xl border border-border bg-card px-4 pt-3 pb-2">
              <p className="text-xs font-semibold text-foreground mb-3">24h Power Output (kW)</p>
              <ResponsiveContainer width="100%" height={80}>
                <AreaChart data={powerHistory}>
                  <defs>
                    <linearGradient id={`pwg-${chargerId}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="oklch(0.65 0.20 240)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="oklch(0.65 0.20 240)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "oklch(0.55 0.01 240)" }} tickFormatter={(v: string) => v.slice(0, 2)} axisLine={false} tickLine={false} interval={5} />
                  <YAxis hide domain={[0, charger.powerKW * 1.1]} />
                  <Tooltip
                    contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }}
                    formatter={(v: number) => [`${v} kW`, "Power"]}
                  />
                  <Area type="monotone" dataKey="kW" stroke="oklch(0.65 0.20 240)" strokeWidth={1.5} fill={`url(#pwg-${chargerId})`} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Alarms for this charger */}
            {chargerAlarms.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-foreground mb-2">
                  Alarms ({chargerAlarms.length})
                </p>
                <div className="space-y-2">
                  {chargerAlarms.map((alarm) => {
                    const cfg = ALARM_CFG[alarm.severity];
                    const CatIcon = CATEGORY_ICON[alarm.category] ?? AlertTriangle;
                    return (
                      <div key={alarm.id} className={cn("flex gap-2.5 p-3 rounded-lg border", cfg.bg, cfg.border)}>
                        <CatIcon className={cn("w-3.5 h-3.5 shrink-0 mt-px", cfg.text)} />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] text-foreground leading-snug line-clamp-2">{alarm.message}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={cn("text-[10px] font-medium capitalize", cfg.text)}>{alarm.severity}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {formatDistanceToNow(alarm.timestamp, { addSuffix: true })}
                            </span>
                            {alarm.acknowledged && (
                              <div className="flex items-center gap-0.5 text-[oklch(0.65_0.18_145)] text-[10px]">
                                <CheckCircle2 className="w-2.5 h-2.5" /><span>ACK</span>
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

            {/* Charger metadata */}
            <div className="rounded-xl border border-border bg-card px-4 py-4">
              <p className="text-xs font-semibold text-foreground mb-3">Charger Information</p>
              <div className="space-y-2.5">
                {[
                  { icon: Cpu,      label: "Charger ID",          value: charger.id },
                  { icon: Zap,      label: "Max Power",           value: `${charger.powerKW} kW` },
                  { icon: Cpu,      label: "Firmware",            value: charger.firmwareVersion },
                  { icon: Wifi,     label: "OCPP Version",        value: charger.ocppVersion },
                  { icon: Calendar, label: "Installed",           value: new Date(charger.installDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
                  { icon: Wrench,   label: "Last Service",        value: new Date(charger.lastServiceDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
                  { icon: Activity, label: "Lifetime Sessions",   value: charger.totalSessionsLifetime.toLocaleString("en-IN") },
                  { icon: Zap,      label: "Lifetime Energy",     value: `${(charger.totalEnergyLifetimeKWh / 1000).toFixed(1)} MWh` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-muted-foreground block">{label}</span>
                      <span className="text-xs text-foreground font-medium">{value}</span>
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