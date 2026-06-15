import { useState } from "react";
import { cn } from "@/lib/utils";
import { alarms as initialAlarms, type Alarm, type AlarmSeverity } from "@/data/mockData";
import {
  AlertTriangle,
  Info,
  CheckCircle2,
  Bell,
  Wifi,
  Zap,
  CreditCard,
  Shield,
  Cpu,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// ─── Config ───────────────────────────────────────────────────────────────────

const SEVERITY_CONFIG: Record<
  AlarmSeverity,
  { label: string; border: string; bg: string; text: string; dot: string; icon: React.ElementType }
> = {
  critical: {
    label: "Critical",
    border: "border-[oklch(0.65_0.22_25)/40]",
    bg:     "bg-[oklch(0.65_0.22_25)/8]",
    text:   "text-[oklch(0.65_0.22_25)]",
    dot:    "bg-[oklch(0.65_0.22_25)]",
    icon:   AlertTriangle,
  },
  major: {
    label: "Major",
    border: "border-[oklch(0.72_0.16_75)/40]",
    bg:     "bg-[oklch(0.72_0.16_75)/8]",
    text:   "text-[oklch(0.72_0.16_75)]",
    dot:    "bg-[oklch(0.72_0.16_75)]",
    icon:   AlertTriangle,
  },
  minor: {
    label: "Minor",
    border: "border-[oklch(0.65_0.20_240)/30]",
    bg:     "bg-[oklch(0.65_0.20_240)/6]",
    text:   "text-[oklch(0.65_0.20_240)]",
    dot:    "bg-[oklch(0.65_0.20_240)]",
    icon:   Info,
  },
  info: {
    label: "Info",
    border: "border-border",
    bg:     "bg-transparent",
    text:   "text-muted-foreground",
    dot:    "bg-muted-foreground/40",
    icon:   Info,
  },
};

const CATEGORY_ICONS: Record<Alarm["category"], React.ElementType> = {
  hardware: Cpu,
  network:  Wifi,
  power:    Zap,
  billing:  CreditCard,
  security: Shield,
};

// ─── Single alarm row ─────────────────────────────────────────────────────────

interface AlarmRowProps {
  alarm: Alarm;
  onAcknowledge: (id: string) => void;
}

function AlarmRow({ alarm, onAcknowledge }: AlarmRowProps) {
  const cfg = SEVERITY_CONFIG[alarm.severity];
  const SeverityIcon = cfg.icon;
  const CategoryIcon = CATEGORY_ICONS[alarm.category];

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 border-b border-border transition-opacity",
        alarm.acknowledged && "opacity-50"
      )}
    >
      {/* Severity indicator */}
      <div className={cn("flex items-center justify-center w-7 h-7 rounded-lg shrink-0 mt-0.5", cfg.bg)}>
        <SeverityIcon className={cn("w-3.5 h-3.5", cfg.text)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className={cn("text-[10px] font-bold uppercase tracking-wider", cfg.text)}>
            {cfg.label}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 border border-border rounded px-1.5 py-px">
            <CategoryIcon className="w-2.5 h-2.5" />
            {alarm.category}
          </span>
          <span className="text-[10px] text-muted-foreground">{alarm.stationName}</span>
        </div>

        <p className="text-xs text-foreground leading-snug">{alarm.message}</p>

        <p className="text-[10px] text-muted-foreground mt-1">
          {formatDistanceToNow(alarm.timestamp, { addSuffix: true })}
          {alarm.chargerId && (
            <span className="ml-2 font-mono">{alarm.chargerId}</span>
          )}
        </p>
      </div>

      {/* Acknowledge button */}
      {!alarm.acknowledged && (
        <button
          onClick={() => onAcknowledge(alarm.id)}
          className="shrink-0 flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground border border-border hover:border-border/80 rounded px-2 py-1 transition-colors mt-0.5"
        >
          <CheckCircle2 className="w-3 h-3" />
          Ack
        </button>
      )}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function AlarmPanel() {
  const [alarmList, setAlarmList] = useState(initialAlarms);
  const [filterAcknowledged, setFilterAcknowledged] = useState(false);

  const handleAcknowledge = (id: string) => {
    setAlarmList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const unacknowledgedCount = alarmList.filter((a) => !a.acknowledged).length;
  const criticalCount = alarmList.filter(
    (a) => a.severity === "critical" && !a.acknowledged
  ).length;

  // Unacknowledged first, then by timestamp desc
  const sorted = [...alarmList].sort((a, b) => {
    if (a.acknowledged !== b.acknowledged) return a.acknowledged ? 1 : -1;
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  const visible = filterAcknowledged ? sorted : sorted.filter((a) => !a.acknowledged);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between px-4 pt-4 pb-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-foreground">Alarm Feed</h2>
            {criticalCount > 0 && (
              <span className="text-[10px] font-bold text-[oklch(0.65_0.22_25)] bg-[oklch(0.65_0.22_25)/10] border border-[oklch(0.65_0.22_25)/30] rounded-full px-2 py-px">
                {criticalCount} critical
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {unacknowledgedCount} unacknowledged · {alarmList.length} total
          </p>
        </div>

        <button
          onClick={() => setFilterAcknowledged((v) => !v)}
          className={cn(
            "flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-md border transition-colors",
            filterAcknowledged
              ? "bg-[oklch(0.60_0.20_240)/15] text-[oklch(0.68_0.18_240)] border-[oklch(0.60_0.20_240)/30]"
              : "text-muted-foreground border-border hover:text-foreground hover:bg-muted"
          )}
        >
          <Bell className="w-3 h-3" />
          {filterAcknowledged ? "All" : "Active only"}
        </button>
      </div>

      {/* Alarm list */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <CheckCircle2 className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-sm">All alarms acknowledged</p>
          </div>
        ) : (
          visible.map((alarm) => (
            <AlarmRow
              key={alarm.id}
              alarm={alarm}
              onAcknowledge={handleAcknowledge}
            />
          ))
        )}
      </div>
    </div>
  );
}