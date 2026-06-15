import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ShieldAlert, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import type { AlarmExtended } from "@/data/alarmData";
import type { AlarmSeverity } from "@/data/mockData";

const SEV_ICON: Record<AlarmSeverity, React.ElementType> = {
  critical: ShieldAlert, major: AlertTriangle, minor: Info, info: Info,
};
const SEV_COLOR: Record<AlarmSeverity, string> = {
  critical: "text-[oklch(0.65_0.22_25)] bg-[oklch(0.65_0.22_25)/12] border-[oklch(0.65_0.22_25)/30]",
  major:    "text-[oklch(0.72_0.16_75)] bg-[oklch(0.72_0.16_75)/12] border-[oklch(0.72_0.16_75)/25]",
  minor:    "text-[oklch(0.65_0.20_240)] bg-[oklch(0.60_0.20_240)/10] border-[oklch(0.60_0.20_240)/20]",
  info:     "text-muted-foreground bg-muted/30 border-border",
};
const LINE_COLOR: Record<AlarmSeverity, string> = {
  critical: "bg-[oklch(0.65_0.22_25)/40]",
  major:    "bg-[oklch(0.72_0.16_75)/40]",
  minor:    "bg-[oklch(0.60_0.20_240)/30]",
  info:     "bg-border",
};

interface AlarmTimelineProps {
  alarms: AlarmExtended[];
  onSelect: (id: string) => void;
}

export function AlarmTimeline({ alarms, onSelect }: AlarmTimelineProps) {
  const sorted = [...alarms].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 12);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 shrink-0">
        <h2 className="text-sm font-semibold text-foreground">Alarm Timeline</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Most recent events, newest first</p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="relative">
          {sorted.map((alarm, idx) => {
            const Icon = SEV_ICON[alarm.severity];
            const isLast = idx === sorted.length - 1;
            return (
              <div key={alarm.id} className="flex gap-3 group">
                {/* Timeline spine */}
                <div className="flex flex-col items-center">
                  <div className={cn("w-7 h-7 rounded-full border flex items-center justify-center shrink-0 z-10 cursor-pointer transition-transform group-hover:scale-110", SEV_COLOR[alarm.severity])}
                    onClick={() => onSelect(alarm.id)}
                  >
                    {alarm.status === "resolved"
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-[oklch(0.65_0.18_145)]" />
                      : <Icon className="w-3.5 h-3.5" />
                    }
                  </div>
                  {!isLast && <div className={cn("w-px flex-1 mt-1 mb-1 min-h-[20px]", LINE_COLOR[alarm.severity])} />}
                </div>

                {/* Content */}
                <div
                  className="flex-1 min-w-0 pb-4 cursor-pointer"
                  onClick={() => onSelect(alarm.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-medium text-foreground leading-snug line-clamp-2 group-hover:text-[oklch(0.65_0.20_240)] transition-colors">
                      {alarm.message}
                    </p>
                    <span className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wide shrink-0",
                      SEV_COLOR[alarm.severity]
                    )}>
                      {alarm.severity}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{alarm.stationName}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                    {formatDistanceToNow(alarm.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}