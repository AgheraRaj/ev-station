import { cn } from "@/lib/utils";
import { MapPin, CheckCircle2, AlertTriangle, WifiOff, Zap } from "lucide-react";
import type { Station } from "@/data/mockData";

function getStationStatus(s: Station) {
  if (s.offlineChargers === s.totalChargers) return "offline";
  if (s.faultChargers > 1) return "critical";
  if (s.faultChargers > 0 || s.uptime < 90) return "warning";
  return "healthy";
}

interface SummaryBarProps {
  stations: Station[];
}

export function StationSummaryBar({ stations }: SummaryBarProps) {
  const healthy  = stations.filter((s) => getStationStatus(s) === "healthy").length;
  const warning  = stations.filter((s) => getStationStatus(s) === "warning").length;
  const critical = stations.filter((s) => getStationStatus(s) === "critical").length;
  const offline  = stations.filter((s) => getStationStatus(s) === "offline").length;

  const totalChargers  = stations.reduce((a, s) => a + s.totalChargers, 0);
  const activeChargers = stations.reduce((a, s) => a + s.activeChargers, 0);
  const totalLoadKW    = stations.reduce((a, s) => a + s.currentLoadKW, 0);
  const totalCapKW     = stations.reduce((a, s) => a + s.powerCapacityKW, 0);

  const items = [
    {
      icon: MapPin,
      label: "Total Stations",
      value: stations.length,
      sub: `${totalChargers} chargers`,
      color: "text-muted-foreground",
      bg: "bg-muted/40",
      border: "border-border",
    },
    {
      icon: CheckCircle2,
      label: "Healthy",
      value: healthy,
      sub: "fully operational",
      color: "text-[oklch(0.65_0.18_145)]",
      bg: "bg-[oklch(0.65_0.18_145)/8]",
      border: "border-[oklch(0.65_0.18_145)/20]",
    },
    {
      icon: AlertTriangle,
      label: "Warning / Critical",
      value: warning + critical,
      sub: `${critical} critical`,
      color: critical > 0 ? "text-[oklch(0.65_0.22_25)]" : "text-[oklch(0.72_0.16_75)]",
      bg: critical > 0 ? "bg-[oklch(0.65_0.22_25)/8]" : "bg-[oklch(0.72_0.16_75)/8]",
      border: critical > 0 ? "border-[oklch(0.65_0.22_25)/20]" : "border-[oklch(0.72_0.16_75)/20]",
    },
    {
      icon: WifiOff,
      label: "Offline",
      value: offline,
      sub: "no connection",
      color: "text-muted-foreground",
      bg: "bg-muted/40",
      border: "border-border",
    },
    {
      icon: Zap,
      label: "Active Chargers",
      value: activeChargers,
      sub: `of ${totalChargers} total`,
      color: "text-[oklch(0.65_0.20_240)]",
      bg: "bg-[oklch(0.60_0.20_240)/8]",
      border: "border-[oklch(0.60_0.20_240)/20]",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {items.map(({ icon: Icon, label, value, sub, color, bg, border }) => (
        <div key={label} className={cn("flex items-center gap-3 rounded-xl border px-4 py-3", bg, border)}>
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", bg, border, "border")}>
            <Icon className={cn("w-4 h-4", color)} />
          </div>
          <div className="min-w-0">
            <p className={cn("text-xl font-bold tabular-nums leading-none", color)}>{value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{label}</p>
            <p className="text-[10px] text-muted-foreground/60 truncate">{sub}</p>
          </div>
        </div>
      ))}
      {/* Network load bar fills last slot on larger screens */}
      <div className="hidden lg:flex flex-col justify-center rounded-xl border border-border bg-card px-4 py-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Network Load</span>
          <span className="text-[11px] font-bold text-foreground tabular-nums">
            {Math.round((totalLoadKW / totalCapKW) * 100)}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-[oklch(0.65_0.20_240)] transition-all duration-700"
            style={{ width: `${Math.round((totalLoadKW / totalCapKW) * 100)}%` }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">
          {totalLoadKW.toLocaleString()} / {totalCapKW.toLocaleString()} kW
        </p>
      </div>
    </div>
  );
}