import { cn } from "@/lib/utils";
import {
  Zap,
  AlertTriangle,
  WifiOff,
  CheckCircle2,
  Thermometer,
} from "lucide-react";
import type { ChargerExtended } from "@/data/chargerData";
import type { ChargerStatus } from "@/data/mockData";
import { stations } from "@/data/mockData";

const STATUS_CFG: Record<
  ChargerStatus,
  {
    dot: string;
    border: string;
    bg: string;
    text: string;
    icon: React.ElementType;
    label: string;
  }
> = {
  charging: {
    dot: "bg-[oklch(0.65_0.20_240)] animate-pulse",
    border: "border-[oklch(0.60_0.20_240)/30]",
    bg: "bg-[oklch(0.60_0.20_240)/8]",
    text: "text-[oklch(0.68_0.18_240)]",
    icon: Zap,
    label: "Charging",
  },
  available: {
    dot: "bg-[oklch(0.65_0.18_145)]",
    border: "border-[oklch(0.65_0.18_145)/25]",
    bg: "bg-[oklch(0.65_0.18_145)/8]",
    text: "text-[oklch(0.65_0.18_145)]",
    icon: CheckCircle2,
    label: "Available",
  },
  fault: {
    dot: "bg-[oklch(0.65_0.22_25)] animate-pulse",
    border: "border-[oklch(0.65_0.22_25)/40]",
    bg: "bg-[oklch(0.65_0.22_25)/8]",
    text: "text-[oklch(0.65_0.22_25)]",
    icon: AlertTriangle,
    label: "Fault",
  },
  offline: {
    dot: "bg-muted-foreground/40",
    border: "border-border",
    bg: "bg-muted/20",
    text: "text-muted-foreground",
    icon: WifiOff,
    label: "Offline",
  },
};

const CONNECTOR_BADGE: Record<string, string> = {
  CCS2: "bg-[oklch(0.60_0.20_240)/12] text-[oklch(0.68_0.18_240)] border-[oklch(0.60_0.20_240)/25]",
  CHAdeMO:
    "bg-[oklch(0.65_0.18_300)/12] text-[oklch(0.65_0.18_300)] border-[oklch(0.65_0.18_300)/25]",
  Type2:
    "bg-[oklch(0.65_0.18_145)/12] text-[oklch(0.65_0.18_145)] border-[oklch(0.65_0.18_145)/25]",
  OCPP: "bg-[oklch(0.72_0.16_75)/12]  text-[oklch(0.72_0.16_75)]  border-[oklch(0.72_0.16_75)/25]",
};

function tempColor(t: number) {
  if (t >= 65) return "text-[oklch(0.65_0.22_25)]";
  if (t >= 50) return "text-[oklch(0.72_0.16_75)]";
  return "text-[oklch(0.65_0.18_145)]";
}

interface ChargerCardProps {
  charger: ChargerExtended;
  livePower: number;
  liveTemp: number;
  selected: boolean;
  onClick: () => void;
}

export function ChargerCard({
  charger,
  livePower,
  liveTemp,
  selected,
  onClick,
}: ChargerCardProps) {
  const cfg = STATUS_CFG[charger.status];
  const Icon = cfg.icon;
  const utilPct =
    charger.powerKW > 0 ? Math.round((livePower / charger.powerKW) * 100) : 0;
  const station = stations.find((s) => s.id === charger.stationId);
  const isCharging = charger.status === "charging";

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col gap-2 p-3 rounded-xl border text-left transition-all duration-150 hover:-translate-y-px hover:shadow-md hover:shadow-black/10",
        cfg.bg,
        cfg.border,
        selected &&
          "ring-2 ring-[oklch(0.60_0.20_240)] ring-offset-2 ring-offset-background shadow-lg",
      )}
    >
      {/* Header row: label + connector + status dot */}
      <div className="flex items-start justify-between gap-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-bold text-foreground shrink-0">
            {charger.label}
          </span>
          <span
            className={cn(
              "text-[9px] font-medium px-1.5 py-px rounded-full border shrink-0",
              CONNECTOR_BADGE[charger.connectorType],
            )}
          >
            {charger.connectorType}
          </span>
        </div>
        <span className={cn("w-2 h-2 rounded-full shrink-0 mt-0.5", cfg.dot)} />
      </div>

      {/* Power display */}
      {isCharging ? (
        <>
          <div className="flex items-end gap-1">
            <Icon className={cn("w-3.5 h-3.5 shrink-0 mb-0.5", cfg.text)} />
            <span
              className={cn(
                "text-sm font-bold tabular-nums leading-none",
                cfg.text,
              )}
            >
              {livePower.toFixed(0)}
            </span>
            <span className="text-[10px] text-muted-foreground mb-0.5">
              / {charger.powerKW} kW
            </span>
          </div>
          {/* Power utilization bar */}
          <div className="w-full h-1 rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full bg-[oklch(0.65_0.20_240)] transition-all duration-700"
              style={{ width: `${utilPct}%` }}
            />
          </div>
        </>
      ) : (
        <div className="flex items-center gap-1.5">
          <Icon className={cn("w-3.5 h-3.5 shrink-0", cfg.text)} />
          <span className={cn("text-xs font-semibold", cfg.text)}>
            {cfg.label}
          </span>
        </div>
      )}

      {/* Temperature + station */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1">
          <Thermometer
            className={cn("w-3 h-3 shrink-0", tempColor(liveTemp))}
          />
          <span
            className={cn(
              "text-[10px] font-medium tabular-nums",
              tempColor(liveTemp),
            )}
          >
            {liveTemp.toFixed(0)}°C
          </span>
        </div>
        {isCharging && (
          <span className="text-[10px] text-muted-foreground tabular-nums">
            {utilPct}%
          </span>
        )}
      </div>

      {/* Station name */}
      <p className="text-[9px] text-muted-foreground/60 truncate leading-none border-t border-border/50 pt-1.5">
        {station?.name ?? charger.stationId}
      </p>

      {/* Fault overlay */}
      {charger.status === "fault" && liveTemp >= 65 && (
        <div className="absolute top-1.5 right-1.5">
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[oklch(0.65_0.22_25)] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[oklch(0.65_0.22_25)]" />
          </span>
        </div>
      )}
    </button>
  );
}
