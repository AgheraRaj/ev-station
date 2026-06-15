import { cn } from "@/lib/utils";
import { AlertTriangle, ShieldAlert, Info, CheckCircle2, BellRing } from "lucide-react";
import type { AlarmExtended } from "@/data/alarmData";

export function AlarmSummaryBar({ alarms }: { alarms: AlarmExtended[] }) {
  const critical = alarms.filter(a => a.severity === "critical" && a.status !== "resolved").length;
  const major    = alarms.filter(a => a.severity === "major"    && a.status !== "resolved").length;
  const minor    = alarms.filter(a => a.severity === "minor"    && a.status !== "resolved").length;
  const unacked  = alarms.filter(a => a.status === "active").length;
  const resolved = alarms.filter(a => a.status === "resolved").length;

  const items = [
    { icon: ShieldAlert,   label: "Critical",       value: critical, sub: "immediate action", color: "text-[oklch(0.65_0.22_25)]",  bg: "bg-[oklch(0.65_0.22_25)/8]",  border: critical > 0 ? "border-[oklch(0.65_0.22_25)/30]" : "border-border", pulse: critical > 0 },
    { icon: AlertTriangle, label: "Major",          value: major,    sub: "action required",  color: "text-[oklch(0.72_0.16_75)]",  bg: "bg-[oklch(0.72_0.16_75)/8]",  border: "border-[oklch(0.72_0.16_75)/20]" },
    { icon: Info,          label: "Minor / Info",   value: minor,    sub: "low priority",     color: "text-[oklch(0.65_0.20_240)]", bg: "bg-[oklch(0.60_0.20_240)/8]", border: "border-[oklch(0.60_0.20_240)/20]" },
    { icon: BellRing,      label: "Unacknowledged", value: unacked,  sub: "awaiting review",  color: unacked > 0 ? "text-[oklch(0.65_0.22_25)]" : "text-muted-foreground", bg: "bg-muted/40", border: "border-border" },
    { icon: CheckCircle2,  label: "Resolved",       value: resolved, sub: "last 7 days",      color: "text-[oklch(0.65_0.18_145)]", bg: "bg-[oklch(0.65_0.18_145)/8]", border: "border-[oklch(0.65_0.18_145)/20]" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {items.map(({ icon: Icon, label, value, sub, color, bg, border, pulse }) => (
        <div key={label} className={cn("flex items-center gap-3 rounded-xl border px-4 py-3", bg, border)}>
          <div className={cn("relative w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border", bg, border)}>
            <Icon className={cn("w-4 h-4", color)} />
            {pulse && value > 0 && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[oklch(0.65_0.22_25)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[oklch(0.65_0.22_25)]" />
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className={cn("text-xl font-bold tabular-nums leading-none", color)}>{value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{label}</p>
            <p className="text-[10px] text-muted-foreground/60 truncate">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}