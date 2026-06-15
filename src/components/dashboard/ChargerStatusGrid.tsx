import { useState } from "react";
import { cn } from "@/lib/utils";
import { chargers, stations } from "@/data/mockData";
import type { Charger, ChargerStatus } from "@/data/mockData";
import { Zap, AlertTriangle, WifiOff, CheckCircle2, ChevronDown } from "lucide-react";
import { useLiveChargerStatus } from "@/hook/useLiveData";

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ChargerStatus, {
  label: string;
  bg: string;
  border: string;
  text: string;
  dot: string;
  icon: React.ElementType;
}> = {
  charging: {
    label: "Charging",
    bg: "bg-[oklch(0.60_0.20_240)/10]",
    border: "border-[oklch(0.60_0.20_240)/30]",
    text: "text-[oklch(0.68_0.18_240)]",
    dot: "bg-[oklch(0.65_0.20_240)]",
    icon: Zap,
  },
  available: {
    label: "Available",
    bg: "bg-[oklch(0.65_0.18_145)/10]",
    border: "border-[oklch(0.65_0.18_145)/30]",
    text: "text-[oklch(0.65_0.18_145)]",
    dot: "bg-[oklch(0.65_0.18_145)]",
    icon: CheckCircle2,
  },
  fault: {
    label: "Fault",
    bg: "bg-[oklch(0.65_0.22_25)/10]",
    border: "border-[oklch(0.65_0.22_25)/35]",
    text: "text-[oklch(0.65_0.22_25)]",
    dot: "bg-[oklch(0.65_0.22_25)]",
    icon: AlertTriangle,
  },
  offline: {
    label: "Offline",
    bg: "bg-muted/30",
    border: "border-border",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground/40",
    icon: WifiOff,
  },
};

// ─── Single charger cell ───────────────────────────────────────────────────────

interface ChargerCellProps {
  charger: Charger;
  livePower: number;
  liveTemp: number;
  selected: boolean;
  onClick: () => void;
}

function ChargerCell({ charger, livePower, liveTemp, selected, onClick }: ChargerCellProps) {
  const cfg = STATUS_CONFIG[charger.status];
  const Icon = cfg.icon;
  const powerPct = charger.powerKW > 0 ? Math.round((livePower / charger.powerKW) * 100) : 0;
  const isCharging = charger.status === "charging";

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col gap-1 p-2 rounded-lg border text-left transition-all duration-150 cursor-pointer",
        cfg.bg, cfg.border,
        selected && "ring-2 ring-[oklch(0.60_0.20_240)] ring-offset-1 ring-offset-background",
        "hover:brightness-110"
      )}
    >
      {/* Label + status dot */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-foreground">{charger.label}</span>
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot, isCharging && "animate-pulse")} />
      </div>

      {/* Icon + power */}
      <div className="flex items-center gap-1">
        <Icon className={cn("w-3 h-3 shrink-0", cfg.text)} />
        {isCharging ? (
          <span className={cn("text-[11px] font-semibold tabular-nums", cfg.text)}>
            {livePower.toFixed(0)}kW
          </span>
        ) : (
          <span className="text-[10px] text-muted-foreground">{cfg.label}</span>
        )}
      </div>

      {/* Power bar */}
      {isCharging && (
        <div className="w-full h-0.5 rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-[oklch(0.65_0.20_240)] transition-all duration-700"
            style={{ width: `${powerPct}%` }}
          />
        </div>
      )}

      {/* Connector type badge */}
      <span className="text-[9px] text-muted-foreground/60 font-mono leading-none">
        {charger.connectorType}
      </span>
    </button>
  );
}

// ─── Detail panel ──────────────────────────────────────────────────────────────

function ChargerDetail({ charger, livePower, liveTemp }: { charger: Charger; livePower: number; liveTemp: number }) {
  const cfg = STATUS_CONFIG[charger.status];
  const powerPct = charger.powerKW > 0 ? Math.round((livePower / charger.powerKW) * 100) : 0;

  const rows = [
    { label: "Status",       value: cfg.label,                      highlight: cfg.text },
    { label: "Connector",    value: charger.connectorType,           highlight: "" },
    { label: "Max Power",    value: `${charger.powerKW} kW`,         highlight: "" },
    { label: "Live Power",   value: `${livePower.toFixed(1)} kW`,    highlight: charger.status === "charging" ? cfg.text : "" },
    { label: "Utilization",  value: `${powerPct}%`,                  highlight: "" },
    { label: "Voltage",      value: charger.voltage > 0 ? `${charger.voltage} V` : "—", highlight: "" },
    { label: "Current",      value: charger.current > 0 ? `${charger.current} A` : "—", highlight: "" },
    { label: "Temperature",  value: `${liveTemp.toFixed(0)}°C`,      highlight: liveTemp > 60 ? "text-[oklch(0.65_0.22_25)]" : "" },
    { label: "Session",      value: charger.sessionId ?? "No active session", highlight: "" },
  ];

  return (
    <div className="border-t border-border mt-3 pt-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-foreground">
          Charger {charger.label} · {charger.id}
        </p>
        <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full", cfg.bg, cfg.text, cfg.border, "border")}>
          {cfg.label}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {rows.map(({ label, value, highlight }) => (
          <div key={label} className="flex flex-col">
            <span className="text-[10px] text-muted-foreground">{label}</span>
            <span className={cn("text-xs font-medium truncate", highlight || "text-foreground")}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function ChargerStatusGrid() {
  const liveStatuses = useLiveChargerStatus();
  const [selectedStation, setSelectedStation] = useState(stations[0].id);
  const [selectedCharger, setSelectedCharger] = useState<string | null>(null);
  const [showStationPicker, setShowStationPicker] = useState(false);

  const station = stations.find((s) => s.id === selectedStation)!;
  const stationChargers = chargers.filter((c) => c.stationId === selectedStation);
  const selected = stationChargers.find((c) => c.id === selectedCharger) ?? null;

  const counts = {
    charging:  stationChargers.filter((c) => c.status === "charging").length,
    available: stationChargers.filter((c) => c.status === "available").length,
    fault:     stationChargers.filter((c) => c.status === "fault").length,
    offline:   stationChargers.filter((c) => c.status === "offline").length,
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between px-4 pt-4 pb-3 shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Charger Status</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Live SCADA view</p>
        </div>

        {/* Station selector */}
        <div className="relative">
          <button
            onClick={() => setShowStationPicker((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-medium text-foreground bg-muted/50 hover:bg-muted border border-border rounded-md px-2.5 py-1.5 transition-colors"
          >
            <span className="max-w-[100px] truncate">{station.name.split(" ").slice(0, 2).join(" ")}</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
          </button>
          {showStationPicker && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-card border border-border rounded-lg shadow-xl z-50 py-1 overflow-hidden">
              {stations.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedStation(s.id); setSelectedCharger(null); setShowStationPicker(false); }}
                  className={cn(
                    "w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors",
                    s.id === selectedStation ? "text-[oklch(0.65_0.20_240)] font-medium bg-[oklch(0.60_0.20_240)/8]" : "text-foreground"
                  )}
                >
                  <span className="font-medium">{s.name}</span>
                  <span className="block text-[10px] text-muted-foreground mt-0.5">{s.totalChargers} chargers · {s.city}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status summary pills */}
      <div className="flex gap-2 px-4 pb-3 shrink-0">
        {(Object.entries(counts) as [ChargerStatus, number][]).map(([status, count]) => {
          const cfg = STATUS_CONFIG[status];
          return (
            <div key={status} className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium", cfg.bg, cfg.border, cfg.text)}>
              <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
              {count} {cfg.label}
            </div>
          );
        })}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-2 min-h-0">
        <div className="grid grid-cols-3 gap-2">
          {stationChargers.map((charger) => {
            const live = liveStatuses[charger.id] ?? { power: charger.currentPowerKW, temp: charger.temperature };
            return (
              <ChargerCell
                key={charger.id}
                charger={charger}
                livePower={live.power}
                liveTemp={live.temp}
                selected={selectedCharger === charger.id}
                onClick={() => setSelectedCharger(selectedCharger === charger.id ? null : charger.id)}
              />
            );
          })}
        </div>

        {/* Detail panel */}
        {selected && (
          <ChargerDetail
            charger={selected}
            livePower={liveStatuses[selected.id]?.power ?? selected.currentPowerKW}
            liveTemp={liveStatuses[selected.id]?.temp ?? selected.temperature}
          />
        )}
      </div>

      {/* Footer: station load bar */}
      <div className="border-t border-border px-4 py-3 shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-muted-foreground">Station Load</span>
          <span className="text-[10px] font-medium text-foreground tabular-nums">
            {station.currentLoadKW} / {station.powerCapacityKW} kW
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700",
              station.currentLoadKW / station.powerCapacityKW > 0.85
                ? "bg-[oklch(0.65_0.22_25)]"
                : "bg-[oklch(0.65_0.20_240)]"
            )}
            style={{ width: `${Math.round((station.currentLoadKW / station.powerCapacityKW) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}