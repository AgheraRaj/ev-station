import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { revenueData } from "@/data/mockData";

interface TooltipPayloadEntry {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-muted-foreground">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span>{p.name}:</span>
          <span className="font-medium text-foreground tabular-nums">
            {p.name === "Revenue" ? `₹${p.value.toLocaleString("en-IN")}` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function RevenueChart() {
  const weekTotal = revenueData.reduce((s, d) => s + d.revenue, 0);
  const weekTotalFormatted =
    weekTotal >= 100000
      ? `₹${(weekTotal / 100000).toFixed(2)}L`
      : `₹${(weekTotal / 1000).toFixed(1)}K`;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between px-4 pt-4 pb-3 shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Revenue — Last 7 Days</h2>
          <p className="text-xs text-muted-foreground mt-0.5">All stations combined</p>
        </div>
        <div className="text-right">
          <p className="text-base font-bold text-foreground tabular-nums">
            {weekTotalFormatted}
          </p>
          <p className="text-[10px] text-muted-foreground">7-day total</p>
        </div>
      </div>

      <div className="flex-1 px-4 pb-4 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={revenueData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" vertical={false} />

            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: "oklch(0.60 0.010 240)" }}
              tickLine={false}
              axisLine={false}
            />
            {/* Left axis: revenue in INR, formatted as ₹xK */}
            <YAxis
              yAxisId="revenue"
              tick={{ fontSize: 10, fill: "oklch(0.60 0.010 240)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
            />
            {/* Right axis: sessions */}
            <YAxis
              yAxisId="sessions"
              orientation="right"
              tick={{ fontSize: 10, fill: "oklch(0.60 0.010 240)" }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              formatter={(value) => (
                <span style={{ color: "oklch(0.60 0.010 240)" }}>{value}</span>
              )}
            />

            <Bar
              yAxisId="revenue"
              dataKey="revenue"
              name="Revenue"
              fill="oklch(0.65 0.18 300)"
              opacity={0.85}
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="sessions"
              type="monotone"
              dataKey="sessions"
              name="Sessions"
              stroke="oklch(0.72 0.16 75)"
              strokeWidth={2}
              dot={{ r: 3, fill: "oklch(0.72 0.16 75)", strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}