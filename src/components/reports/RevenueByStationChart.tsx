import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { stations } from "@/data/mockData";
import { stationRevenue7d } from "@/data/stationData";

// Build per-station 7d totals and sort descending
const stationTotals = stations
  .map((s) => ({
    name: s.name.replace(" EV Hub", "").replace(" EV Station", "").replace(" Charging Station", "").replace(" Charging Hub", "").replace(" EV Plaza", "").replace(" EV Point", "").replace(" Fast Charge Station", ""),
    city: s.city,
    revenue: (stationRevenue7d[s.id] ?? []).reduce((a, b) => a + b, 0),
    id: s.id,
  }))
  .sort((a, b) => b.revenue - a.revenue);

const maxRevenue = stationTotals[0]?.revenue ?? 1;

// Colour gradient — top stations get a richer blue, lower ones get muted
function barColor(rank: number, total: number): string {
  if (rank === 0) return "oklch(0.65 0.20 240)";
  if (rank === 1) return "oklch(0.62 0.18 240)";
  if (rank < total * 0.4) return "oklch(0.58 0.15 240)";
  return "oklch(0.50 0.10 240)";
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const v = payload[0].value;
  const formatted = v >= 100000 ? `₹${(v / 100000).toFixed(2)}L` : `₹${(v / 1000).toFixed(1)}K`;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-foreground mb-0.5">{label}</p>
      <p className="text-muted-foreground">7-day revenue: <span className="font-bold text-foreground">{formatted}</span></p>
    </div>
  );
}

export function RevenueByStationChart() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-4 pb-3 shrink-0">
        <h2 className="text-sm font-semibold text-foreground">Revenue by Station — Last 7 Days</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Ranked by total revenue, all 12 stations</p>
      </div>
      <div className="flex-1 px-2 pb-4 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={stationTotals}
            margin={{ top: 0, right: 60, left: 8, bottom: 0 }}
            barSize={14}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, maxRevenue * 1.05]}
              tick={{ fontSize: 10, fill: "oklch(0.60 0.010 240)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${(v / 1000).toFixed(0)}K`}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fontSize: 10, fill: "oklch(0.60 0.010 240)" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "oklch(0.60 0.20 240 / 0.05)" }} />
            <Bar dataKey="revenue" radius={[0, 4, 4, 0]} label={{ position: "right", fontSize: 9, fill: "oklch(0.60 0.010 240)", formatter: (v: any) => v >= 100000 ? `₹${(v/100000).toFixed(1)}L` : `₹${(v/1000).toFixed(0)}K` }}>
              {stationTotals.map((_, i) => (
                <Cell key={i} fill={barColor(i, stationTotals.length)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}