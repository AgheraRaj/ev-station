import { IndianRupee, Zap, Activity, Clock, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { revenueData, energyTrendData, stations } from "@/data/mockData";

// ─── Derived totals from existing data ───────────────────────────────────────

const totalRevenue7d   = revenueData.reduce((s, d) => s + d.revenue, 0);
const totalSessions7d  = revenueData.reduce((s, d) => s + d.sessions, 0);
const totalEnergy7d    = energyTrendData.reduce((s, d) => s + d.totalKWh, 0) * 7; // extrapolate from 24h
const avgDuration      = Math.round(revenueData.reduce((s, d) => s + d.avgDuration, 0) / revenueData.length);
const networkUptime    = parseFloat((stations.reduce((s, x) => s + x.uptime, 0) / stations.length).toFixed(1));

function formatINR(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
  if (amount >= 1000)   return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
}

interface SummaryCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  color: string;
  bg: string;
  border: string;
}

function SummaryCard({ icon: Icon, label, value, sub, color, bg, border }: SummaryCardProps) {
  return (
    <div className={cn("flex items-center gap-3 rounded-xl border px-4 py-3.5", bg, border)}>
      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border", bg, border)}>
        <Icon className={cn("w-4.5 h-4.5", color)} />
      </div>
      <div className="min-w-0">
        <p className={cn("text-xl font-bold tabular-nums leading-none", color)}>{value}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">{label}</p>
        <p className="text-[10px] text-muted-foreground/60 truncate">{sub}</p>
      </div>
    </div>
  );
}

export function ReportsSummaryBar() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <SummaryCard
        icon={IndianRupee}
        label="Revenue (7d)"
        value={formatINR(totalRevenue7d)}
        sub="all stations"
        color="text-[oklch(0.65_0.18_300)]"
        bg="bg-[oklch(0.65_0.18_300)/8]"
        border="border-[oklch(0.65_0.18_300)/20]"
      />
      <SummaryCard
        icon={Zap}
        label="Energy (7d)"
        value={`${(totalEnergy7d / 1000).toFixed(1)} MWh`}
        sub="grid + solar"
        color="text-[oklch(0.65_0.20_240)]"
        bg="bg-[oklch(0.60_0.20_240)/8]"
        border="border-[oklch(0.60_0.20_240)/20]"
      />
      <SummaryCard
        icon={Activity}
        label="Sessions (7d)"
        value={totalSessions7d.toLocaleString("en-IN")}
        sub="all stations"
        color="text-[oklch(0.65_0.18_145)]"
        bg="bg-[oklch(0.65_0.18_145)/8]"
        border="border-[oklch(0.65_0.18_145)/20]"
      />
      <SummaryCard
        icon={Clock}
        label="Avg Duration"
        value={`${avgDuration} min`}
        sub="per session, 7d avg"
        color="text-[oklch(0.72_0.16_75)]"
        bg="bg-[oklch(0.72_0.16_75)/8]"
        border="border-[oklch(0.72_0.16_75)/20]"
      />
      <SummaryCard
        icon={Wifi}
        label="Network Uptime"
        value={`${networkUptime}%`}
        sub="30-day average"
        color={networkUptime >= 99 ? "text-[oklch(0.65_0.18_145)]" : "text-[oklch(0.72_0.16_75)]"}
        bg="bg-muted/40"
        border="border-border"
      />
    </div>
  );
}