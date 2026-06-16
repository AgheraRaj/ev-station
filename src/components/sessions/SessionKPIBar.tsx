import { sessionKPIs } from "@/data/sessionData";
import { Activity, CheckCircle2, Zap, AlertTriangle, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";

function formatCost(rupees: number): string {
  return `₹${rupees.toLocaleString("en-IN")}`;
}

export function SessionKPIBar() {
  const kpis = [
    {
      label: "Total Sessions Today",
      value: sessionKPIs.totalToday.toLocaleString(),
      icon: Activity,
      color: "text-[oklch(0.60_0.20_240)]",
      bg: "bg-[oklch(0.60_0.20_240)/10]",
      border: "border-[oklch(0.60_0.20_240)/20]",
    },
    {
      label: "Active Now",
      value: sessionKPIs.activeNow.toLocaleString(),
      icon: Zap,
      color: "text-[oklch(0.65_0.20_240)]",
      bg: "bg-[oklch(0.65_0.20_240)/10]",
      border: "border-[oklch(0.65_0.20_240)/20]",
    },
    {
      label: "Completed Today",
      value: sessionKPIs.completedToday.toLocaleString(),
      icon: CheckCircle2,
      color: "text-[oklch(0.72_0.18_145)]",
      bg: "bg-[oklch(0.72_0.18_145)/10]",
      border: "border-[oklch(0.72_0.18_145)/20]",
    },
    {
      label: "Interrupted",
      value: sessionKPIs.interruptedToday.toLocaleString(),
      icon: AlertTriangle,
      color: "text-[oklch(0.65_0.22_25)]",
      bg: "bg-[oklch(0.65_0.22_25)/10]",
      border: "border-[oklch(0.65_0.22_25)/20]",
    },
    {
      label: "Energy Delivered",
      value: `${sessionKPIs.energyToday.toFixed(1)} kWh`,
      icon: Zap,
      color: "text-[oklch(0.72_0.16_75)]",
      bg: "bg-[oklch(0.72_0.16_75)/10]",
      border: "border-[oklch(0.72_0.16_75)/20]",
    },
    {
      label: "Revenue Today",
      value: formatCost(sessionKPIs.revenueToday),
      icon: Banknote,
      color: "text-[oklch(0.68_0.18_300)]",
      bg: "bg-[oklch(0.68_0.18_300)/10]",
      border: "border-[oklch(0.68_0.18_300)/20]",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card"
        >
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border",
              kpi.bg,
              kpi.border
            )}
          >
            <kpi.icon className={cn("w-5 h-5", kpi.color)} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground truncate">{kpi.label}</p>
            <p className="text-lg font-bold text-foreground tabular-nums truncate">{kpi.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
