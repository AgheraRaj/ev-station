import { cn } from "@/lib/utils";
import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  WifiOff,
  PlugZap,
} from "lucide-react";
import type { ChargerExtended } from "@/data/chargerData";

interface ChargerSummaryBarProps {
  chargers: ChargerExtended[];
}

export function ChargerSummaryBar({ chargers }: ChargerSummaryBarProps) {
  const total = chargers.length;
  const charging = chargers.filter((c) => c.status === "charging").length;
  const available = chargers.filter((c) => c.status === "available").length;
  const fault = chargers.filter((c) => c.status === "fault").length;
  const offline = chargers.filter((c) => c.status === "offline").length;
  const totalLiveKW = chargers.reduce((s, c) => s + c.currentPowerKW, 0);

  const items = [
    {
      icon: PlugZap,
      label: "Total Chargers",
      value: total,
      sub: `${chargers.filter((c) => c.ocppVersion === "2.0.1").length} on OCPP 2.0.1`,
      color: "text-muted-foreground",
      bg: "bg-muted/40",
      border: "border-border",
    },
    {
      icon: Zap,
      label: "Charging",
      value: charging,
      sub: `${totalLiveKW.toLocaleString("en-IN")} kW live`,
      color: "text-[oklch(0.65_0.20_240)]",
      bg: "bg-[oklch(0.60_0.20_240)/8]",
      border: "border-[oklch(0.60_0.20_240)/20]",
    },
    {
      icon: CheckCircle2,
      label: "Available",
      value: available,
      sub: "ready for session",
      color: "text-[oklch(0.65_0.18_145)]",
      bg: "bg-[oklch(0.65_0.18_145)/8]",
      border: "border-[oklch(0.65_0.18_145)/20]",
    },
    {
      icon: AlertTriangle,
      label: "Fault",
      value: fault,
      sub: fault > 0 ? "action required" : "all clear",
      color: fault > 0 ? "text-[oklch(0.65_0.22_25)]" : "text-muted-foreground",
      bg: fault > 0 ? "bg-[oklch(0.65_0.22_25)/8]" : "bg-muted/40",
      border: fault > 0 ? "border-[oklch(0.65_0.22_25)/20]" : "border-border",
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
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {items.map(({ icon: Icon, label, value, sub, color, bg, border }) => (
        <div
          key={label}
          className={cn(
            "flex items-center gap-3 rounded-xl border px-4 py-3",
            bg,
            border,
          )}
        >
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
              bg,
              border,
            )}
          >
            <Icon className={cn("w-4 h-4", color)} />
          </div>
          <div className="min-w-0">
            <p
              className={cn(
                "text-xl font-bold tabular-nums leading-none",
                color,
              )}
            >
              {value}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
              {label}
            </p>
            <p className="text-[10px] text-muted-foreground/60 truncate">
              {sub}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
