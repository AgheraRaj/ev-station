import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  ShieldAlert, AlertTriangle, Info, CheckCircle2,
  Clock, MapPin, Cpu, Wifi, Zap, CreditCard, Shield, Wrench,
  ChevronDown,
} from "lucide-react";
import type { AlarmExtended, AlarmCategory } from "@/data/alarmData";
import type { AlarmSeverity } from "@/data/mockData";

export const SEVERITY_CFG: Record<AlarmSeverity, {
  icon: React.ElementType; dot: string; text: string; bg: string; border: string; badge: string;
}> = {
  critical: { icon: ShieldAlert,   dot: "bg-[oklch(0.65_0.22_25)] animate-pulse", text: "text-[oklch(0.65_0.22_25)]",  bg: "bg-[oklch(0.65_0.22_25)/6]",   border: "border-[oklch(0.65_0.22_25)/30]",  badge: "bg-[oklch(0.65_0.22_25)/15] text-[oklch(0.65_0.22_25)] border-[oklch(0.65_0.22_25)/30]"  },
  major:    { icon: AlertTriangle, dot: "bg-[oklch(0.72_0.16_75)] animate-pulse",  text: "text-[oklch(0.72_0.16_75)]",  bg: "bg-[oklch(0.72_0.16_75)/5]",   border: "border-[oklch(0.72_0.16_75)/25]",  badge: "bg-[oklch(0.72_0.16_75)/15] text-[oklch(0.72_0.16_75)] border-[oklch(0.72_0.16_75)/25]"  },
  minor:    { icon: Info,          dot: "bg-[oklch(0.65_0.20_240)]",               text: "text-[oklch(0.65_0.20_240)]", bg: "bg-[oklch(0.60_0.20_240)/4]",  border: "border-[oklch(0.60_0.20_240)/20]", badge: "bg-[oklch(0.60_0.20_240)/15] text-[oklch(0.68_0.18_240)] border-[oklch(0.60_0.20_240)/25]" },
  info:     { icon: Info,          dot: "bg-muted-foreground/50",                   text: "text-muted-foreground",        bg: "bg-transparent",                border: "border-border",                    badge: "bg-muted/50 text-muted-foreground border-border" },
};

export const CATEGORY_CFG: Record<AlarmCategory, { icon: React.ElementType; label: string }> = {
  hardware:    { icon: Cpu,     label: "Hardware"    },
  network:     { icon: Wifi,    label: "Network"     },
  power:       { icon: Zap,     label: "Power"       },
  billing:     { icon: CreditCard, label: "Billing"  },
  security:    { icon: Shield,  label: "Security"    },
  maintenance: { icon: Wrench,  label: "Maintenance" },
};

interface AlarmRowProps {
  alarm: AlarmExtended;
  expanded: boolean;
  onExpand: () => void;
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
}

export function AlarmRow({ alarm, expanded, onExpand, onAcknowledge, onResolve }: AlarmRowProps) {
  const sev = SEVERITY_CFG[alarm.severity];
  const cat = CATEGORY_CFG[alarm.category];
  const SevIcon = sev.icon;
  const CatIcon = cat.icon;

  const statusBadge =
    alarm.status === "active"       ? "bg-[oklch(0.65_0.22_25)/12] text-[oklch(0.65_0.22_25)] border-[oklch(0.65_0.22_25)/25]" :
    alarm.status === "acknowledged" ? "bg-[oklch(0.72_0.16_75)/12] text-[oklch(0.72_0.16_75)] border-[oklch(0.72_0.16_75)/25]" :
                                      "bg-[oklch(0.65_0.18_145)/12] text-[oklch(0.65_0.18_145)] border-[oklch(0.65_0.18_145)/25]";

  return (
    <div className={cn(
      "rounded-xl border transition-all duration-200",
      expanded ? cn(sev.bg, sev.border) : "border-border bg-card hover:border-border/60 hover:bg-muted/10"
    )}>
      {/* Main row */}
      <div
        className="flex items-start gap-3 px-4 py-3 cursor-pointer"
        onClick={onExpand}
      >
        {/* Severity icon */}
        <div className={cn("flex items-center justify-center w-7 h-7 rounded-lg shrink-0 mt-0.5 border", sev.bg, sev.border)}>
          <SevIcon className={cn("w-3.5 h-3.5", sev.text)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground leading-snug">{alarm.message}</p>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <MapPin className="w-2.5 h-2.5 shrink-0" />
                  <span className="truncate">{alarm.stationName}</span>
                  {alarm.chargerLabel && (
                    <span className="text-muted-foreground/60">· {alarm.chargerLabel}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <CatIcon className="w-2.5 h-2.5 shrink-0" />
                  <span>{cat.label}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="w-2.5 h-2.5 shrink-0" />
                  <span>{formatDistanceToNow(alarm.timestamp, { addSuffix: true })}</span>
                </div>
              </div>
            </div>

            {/* Right side: badges + chevron */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wide", sev.badge)}>
                {alarm.severity}
              </span>
              <span className={cn("text-[9px] font-medium px-1.5 py-0.5 rounded-full border capitalize", statusBadge)}>
                {alarm.status}
              </span>
              <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", expanded && "rotate-180")} />
            </div>
          </div>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-border/50 mt-1 pt-3 space-y-3">
          {/* Detail text */}
          <p className="text-xs text-muted-foreground leading-relaxed">{alarm.detail}</p>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Alarm ID",    value: alarm.id },
              { label: "Code",        value: alarm.code },
              { label: "Station ID",  value: alarm.stationId },
              { label: "Charger ID",  value: alarm.chargerId ?? "—" },
              { label: "Triggered",   value: alarm.timestamp.toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" }) },
              { label: "Acknowledged", value: alarm.acknowledgedAt ? `${alarm.acknowledgedAt.toLocaleString("en-IN", { timeStyle: "short" })} by ${alarm.acknowledgedBy}` : "—" },
              { label: "Resolved",    value: alarm.resolvedAt ? alarm.resolvedAt.toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" }) : "—" },
              { label: "Category",    value: cat.label },
            ].map(({ label, value }) => (
              <div key={label} className="bg-background/60 rounded-lg border border-border px-3 py-2">
                <p className="text-[10px] text-muted-foreground">{label}</p>
                <p className="text-xs font-medium text-foreground truncate">{value}</p>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1">
            {alarm.status === "active" && (
              <button
                onClick={(e) => { e.stopPropagation(); onAcknowledge(alarm.id); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[oklch(0.72_0.16_75)/12] text-[oklch(0.72_0.16_75)] border border-[oklch(0.72_0.16_75)/25] hover:bg-[oklch(0.72_0.16_75)/20] transition-colors"
              >
                <CheckCircle2 className="w-3 h-3" />
                Acknowledge
              </button>
            )}
            {alarm.status !== "resolved" && (
              <button
                onClick={(e) => { e.stopPropagation(); onResolve(alarm.id); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[oklch(0.65_0.18_145)/12] text-[oklch(0.65_0.18_145)] border border-[oklch(0.65_0.18_145)/25] hover:bg-[oklch(0.65_0.18_145)/20] transition-colors"
              >
                <CheckCircle2 className="w-3 h-3" />
                Mark Resolved
              </button>
            )}
            <span className="text-[10px] text-muted-foreground/60 ml-auto">{alarm.id}</span>
          </div>
        </div>
      )}
    </div>
  );
}