import { cn } from "@/lib/utils";
import type { Station } from "@/data/mockData";

interface StationHealthBarProps {
  station: Station;
  showLabels?: boolean;
  height?: string;
}

export function StationHealthBar({ station, showLabels = false, height = "h-2" }: StationHealthBarProps) {
  const { totalChargers, activeChargers, faultChargers, offlineChargers } = station;
  const available = totalChargers - activeChargers - faultChargers - offlineChargers;

  const segments = [
    { count: activeChargers,  color: "bg-[oklch(0.65_0.20_240)]", label: "Charging",  dotColor: "bg-[oklch(0.65_0.20_240)]" },
    { count: available,       color: "bg-[oklch(0.65_0.18_145)]", label: "Available", dotColor: "bg-[oklch(0.65_0.18_145)]" },
    { count: faultChargers,   color: "bg-[oklch(0.65_0.22_25)]",  label: "Fault",     dotColor: "bg-[oklch(0.65_0.22_25)]" },
    { count: offlineChargers, color: "bg-muted-foreground/40",     label: "Offline",   dotColor: "bg-muted-foreground/40" },
  ].filter((s) => s.count > 0);

  return (
    <div className="space-y-1.5">
      <div className={cn("w-full rounded-full overflow-hidden flex gap-px", height)}>
        {segments.map((seg) => (
          <div
            key={seg.label}
            className={cn("h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full", seg.color)}
            style={{ width: `${(seg.count / totalChargers) * 100}%` }}
            title={`${seg.label}: ${seg.count}`}
          />
        ))}
      </div>
      {showLabels && (
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {segments.map((seg) => (
            <div key={seg.label} className="flex items-center gap-1">
              <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", seg.dotColor)} />
              <span className="text-[10px] text-muted-foreground">{seg.count} {seg.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}