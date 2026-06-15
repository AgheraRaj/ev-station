import { Zap, TrendingUp, AlertTriangle, Activity, IndianRupee, Wifi, Server, BatteryCharging } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LiveKPI } from "@/hook/useLiveData";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  trend?: { value: string; positive: boolean };
  accent?: "blue" | "green" | "amber" | "red" | "purple" | "cyan";
  pulse?: boolean;
}

const accentStyles = {
  blue:   { icon: "text-[oklch(0.65_0.20_240)]", bg: "bg-[oklch(0.60_0.20_240)/10]", border: "border-[oklch(0.60_0.20_240)/20]", glow: "shadow-[0_0_20px_oklch(0.60_0.20_240/0.08)]" },
  green:  { icon: "text-[oklch(0.65_0.18_145)]", bg: "bg-[oklch(0.65_0.18_145)/10]", border: "border-[oklch(0.65_0.18_145)/20]", glow: "shadow-[0_0_20px_oklch(0.65_0.18_145/0.08)]" },
  amber:  { icon: "text-[oklch(0.75_0.16_75)]",  bg: "bg-[oklch(0.75_0.16_75)/10]",  border: "border-[oklch(0.75_0.16_75)/20]",  glow: "" },
  red:    { icon: "text-[oklch(0.65_0.22_25)]",  bg: "bg-[oklch(0.65_0.22_25)/10]",  border: "border-[oklch(0.65_0.22_25)/20]",  glow: "" },
  purple: { icon: "text-[oklch(0.65_0.18_300)]", bg: "bg-[oklch(0.65_0.18_300)/10]", border: "border-[oklch(0.65_0.18_300)/20]", glow: "" },
  cyan:   { icon: "text-[oklch(0.72_0.14_210)]", bg: "bg-[oklch(0.72_0.14_210)/10]", border: "border-[oklch(0.72_0.14_210)/20]", glow: "" },
};

function KPICard({ title, value, subtitle, icon: Icon, trend, accent = "blue", pulse }: KPICardProps) {
  const styles = accentStyles[accent];
  return (
    <div className={cn(
      "relative flex flex-col gap-3 rounded-xl border bg-card p-4 transition-all duration-200 hover:border-border/80",
      styles.border,
      styles.glow,
    )}>
      {/* Header row */}
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider leading-none">{title}</p>
        <div className={cn("flex items-center justify-center w-7 h-7 rounded-lg", styles.bg)}>
          <Icon className={cn("w-3.5 h-3.5", styles.icon)} />
        </div>
      </div>

      {/* Value */}
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-foreground tabular-nums leading-none">
          {value}
        </span>
        {pulse && (
          <span className="mb-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.72_0.18_145)] animate-pulse" />
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{subtitle}</p>
        {trend && (
          <span className={cn(
            "text-[11px] font-medium px-1.5 py-0.5 rounded-full",
            trend.positive
              ? "text-[oklch(0.65_0.18_145)] bg-[oklch(0.65_0.18_145)/10]"
              : "text-[oklch(0.65_0.22_25)] bg-[oklch(0.65_0.22_25)/10]"
          )}>
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}

// Formats a rupee value as "₹1.85L" (lakhs) or "₹85K" (thousands)
function formatINR(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
  if (amount >= 1000)   return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
}

interface KPICardsProps {
  kpi: LiveKPI;
}

export function KPICards({ kpi }: KPICardsProps) {
  const utilizationPct = Math.round((kpi.currentLoadKW / kpi.totalCapacityKW) * 100);
  const availableChargers = kpi.totalChargers - kpi.activeChargers - kpi.faultChargers;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <KPICard
        title="Active Sessions"
        value={kpi.activeSessions}
        subtitle={`${availableChargers} chargers available`}
        icon={BatteryCharging}
        accent="blue"
        pulse
        trend={{ value: "12% vs yesterday", positive: true }}
      />
      <KPICard
        title="Network Load"
        value={`${kpi.currentLoadKW.toLocaleString("en-IN")} kW`}
        subtitle={`${utilizationPct}% of ${(kpi.totalCapacityKW / 1000).toFixed(1)} MW capacity`}
        icon={Zap}
        accent="green"
        pulse
        trend={{ value: `${utilizationPct}% utilized`, positive: utilizationPct < 85 }}
      />
      <KPICard
        title="Energy Delivered"
        value={`${(kpi.totalEnergyToday / 1000).toFixed(1)} MWh`}
        subtitle="Today across all stations"
        icon={Activity}
        accent="cyan"
        trend={{ value: "8% vs yesterday", positive: true }}
      />
      <KPICard
        title="Revenue Today"
        value={formatINR(kpi.totalRevenueToday)}
        subtitle="All stations combined"
        icon={IndianRupee}
        accent="purple"
        trend={{ value: "₹12K ahead of target", positive: true }}
      />
      <KPICard
        title="Network Uptime"
        value={`${kpi.networkUptime}%`}
        subtitle={`${kpi.totalStations} stations monitored`}
        icon={Wifi}
        accent="green"
        trend={{ value: "SLA: 99.5%", positive: kpi.networkUptime >= 99 }}
      />
      <KPICard
        title="Active Alarms"
        value={kpi.activeAlarms}
        subtitle={`${kpi.criticalAlarms} critical, need attention`}
        icon={AlertTriangle}
        accent={kpi.criticalAlarms > 0 ? "red" : "amber"}
        trend={kpi.criticalAlarms > 0 ? { value: "Action required", positive: false } : undefined}
      />
      <KPICard
        title="Charger Health"
        value={`${kpi.activeChargers}/${kpi.totalChargers}`}
        subtitle={`${kpi.faultChargers} fault · ${kpi.totalChargers - kpi.activeChargers - kpi.faultChargers - (kpi.totalChargers - kpi.activeChargers - kpi.faultChargers)} offline`}
        icon={Server}
        accent="blue"
        trend={{ value: `${Math.round((kpi.activeChargers / kpi.totalChargers) * 100)}% online`, positive: true }}
      />
      <KPICard
        title="Avg Session Power"
        value={`${Math.round(kpi.currentLoadKW / Math.max(1, kpi.activeSessions))} kW`}
        subtitle="Per active session"
        icon={TrendingUp}
        accent="amber"
        trend={{ value: "↑ 4 kW vs avg", positive: true }}
      />
    </div>
  );
}