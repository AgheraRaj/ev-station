import { cn } from "@/lib/utils";
import { MapPin, Zap, TrendingUp, AlertTriangle, ExternalLink, Settings2, IndianRupee } from "lucide-react";
import { StationHealthBar } from "./StationHealthBar";
import type { Station } from "@/data/mockData";
import type { StationMeta } from "@/data/stationData";
import { stationRevenue7d } from "@/data/stationData";

function getStationStatus(s: Station): { label: string; dot: string; badge: string } {
  if (s.offlineChargers === s.totalChargers)
    return { label: "Offline",  dot: "bg-muted-foreground/60",   badge: "bg-muted text-muted-foreground border-border" };
  if (s.faultChargers > 1)
    return { label: "Critical", dot: "bg-[oklch(0.65_0.22_25)] animate-pulse", badge: "bg-[oklch(0.65_0.22_25)/12] text-[oklch(0.65_0.22_25)] border-[oklch(0.65_0.22_25)/30]" };
  if (s.faultChargers > 0 || s.uptime < 90)
    return { label: "Warning",  dot: "bg-[oklch(0.72_0.16_75)] animate-pulse",  badge: "bg-[oklch(0.72_0.16_75)/12] text-[oklch(0.72_0.16_75)] border-[oklch(0.72_0.16_75)/30]" };
  return { label: "Healthy",  dot: "bg-[oklch(0.65_0.18_145)]",  badge: "bg-[oklch(0.65_0.18_145)/12] text-[oklch(0.65_0.18_145)] border-[oklch(0.65_0.18_145)/30]" };
}

// Tiny sparkline using SVG
function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = 28;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  const areaBottom = `${w},${h} 0,${h}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={pts} stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <polygon points={`${pts} ${areaBottom}`} fill={color} opacity="0.12" />
    </svg>
  );
}

interface StationCardProps {
  station: Station;
  // meta may be undefined if stationMeta doesn't have an entry for this station
  meta: StationMeta | undefined;
  onViewDetails: (id: string) => void;
}

export function StationCard({ station, meta, onViewDetails }: StationCardProps) {
  const status = getStationStatus(station);
  const utilPct = Math.round((station.currentLoadKW / station.powerCapacityKW) * 100);
  const revenue7d = stationRevenue7d[station.id] ?? [];
  const revenueSparkColor = "oklch(0.65 0.18 145)";

  return (
    <div className={cn(
      "group flex flex-col rounded-xl border bg-card transition-all duration-200 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-px overflow-hidden",
      station.faultChargers > 1
        ? "border-[oklch(0.65_0.22_25)/30]"
        : station.faultChargers > 0
        ? "border-[oklch(0.72_0.16_75)/25]"
        : "border-border hover:border-border/60"
    )}>
      {/* Card header */}
      <div className="flex items-start justify-between px-4 pt-4 pb-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={cn("w-2 h-2 rounded-full shrink-0", status.dot)} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground leading-tight truncate">{station.name}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className="text-[11px] text-muted-foreground truncate">{station.city}</span>
            </div>
          </div>
        </div>
        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ml-2", status.badge)}>
          {status.label}
        </span>
      </div>

      {/* Tags */}
      {meta && (
        <div className="flex flex-wrap gap-1 px-4 pb-3">
          {meta.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
              {tag}
            </span>
          ))}
          {meta.networkType && (
            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-muted/50 text-muted-foreground/60">
              {meta.networkType}
            </span>
          )}
        </div>
      )}

      {/* Charger health bar */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Charger Health</span>
          <span className="text-[11px] font-semibold text-foreground tabular-nums">
            {station.activeChargers}/{station.totalChargers} active
          </span>
        </div>
        <StationHealthBar station={station} showLabels height="h-2.5" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-px mx-4 mb-4 rounded-lg overflow-hidden border border-border bg-border">
        {/* Load */}
        <div className="bg-card px-3 py-2.5">
          <div className="flex items-center gap-1 mb-1">
            <Zap className="w-3 h-3 text-[oklch(0.65_0.20_240)]" />
            <span className="text-[10px] text-muted-foreground">Load</span>
          </div>
          <p className="text-sm font-bold text-foreground tabular-nums">{station.currentLoadKW} kW</p>
          <div className="mt-1.5 w-full h-1 rounded-full bg-border overflow-hidden">
            <div
              className={cn("h-full rounded-full", utilPct > 85 ? "bg-[oklch(0.65_0.22_25)]" : "bg-[oklch(0.65_0.20_240)]")}
              style={{ width: `${utilPct}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">{utilPct}% of {station.powerCapacityKW} kW</p>
        </div>

        {/* Uptime */}
        <div className="bg-card px-3 py-2.5">
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp className="w-3 h-3 text-[oklch(0.65_0.18_145)]" />
            <span className="text-[10px] text-muted-foreground">Uptime</span>
          </div>
          <p className={cn(
            "text-sm font-bold tabular-nums",
            station.uptime >= 99 ? "text-[oklch(0.65_0.18_145)]" :
            station.uptime >= 95 ? "text-foreground" : "text-[oklch(0.72_0.16_75)]"
          )}>
            {station.uptime}%
          </p>
          <p className="text-[10px] text-muted-foreground mt-1.5">30-day average</p>
        </div>

        {/* Revenue */}
        <div className="bg-card px-3 py-2.5">
          <div className="flex items-center gap-1 mb-1">
            <IndianRupee className="w-3 h-3 text-[oklch(0.65_0.18_300)]" />
            <span className="text-[10px] text-muted-foreground">Revenue 24h</span>
          </div>
          <p className="text-sm font-bold text-foreground tabular-nums">
            ₹{station.revenue24h.toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1.5">
            {meta?.operator?.startsWith("Partner") ? "Partner share" : "Direct"}
          </p>
        </div>

        {/* 7d Sparkline */}
        <div className="bg-card px-3 py-2.5">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[10px] text-muted-foreground">7-day revenue</span>
          </div>
          {revenue7d.length > 0 ? (
            <MiniSparkline data={revenue7d} color={revenueSparkColor} />
          ) : (
            <p className="text-[10px] text-muted-foreground mt-1">No data</p>
          )}
        </div>
      </div>

      {/* Fault warning */}
      {station.faultChargers > 0 && (
        <div className="mx-4 mb-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-[oklch(0.65_0.22_25)/8] border border-[oklch(0.65_0.22_25)/25]">
          <AlertTriangle className="w-3.5 h-3.5 text-[oklch(0.65_0.22_25)] shrink-0" />
          <span className="text-[11px] text-[oklch(0.65_0.22_25)]">
            {station.faultChargers} charger{station.faultChargers > 1 ? "s" : ""} require attention
          </span>
        </div>
      )}

      {/* Action footer */}
      <div className="flex gap-2 px-4 pb-4 mt-auto pt-1">
        <button
          onClick={() => onViewDetails(station.id)}
          className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg bg-[oklch(0.60_0.20_240)/10] hover:bg-[oklch(0.60_0.20_240)/18] border border-[oklch(0.60_0.20_240)/20] text-[11px] font-medium text-[oklch(0.65_0.20_240)] transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          View Details
        </button>
        <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/50 hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors">
          <Settings2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}