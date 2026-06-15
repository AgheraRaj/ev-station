import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { revenueData } from "@/data/mockData";

interface TooltipEntry { name: string; value: number; color: string }

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipEntry[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-muted-foreground">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span>{p.name}:</span>
          <span className="font-medium text-foreground tabular-nums">
            {p.name === "Avg Duration" ? `${p.value} min` : p.value.toLocaleString("en-IN")}
          </span>
        </div>
      ))}
    </div>
  );
}

const totalSessions = revenueData.reduce((s, d) => s + d.sessions, 0);
const avgDuration   = Math.round(revenueData.reduce((s, d) => s + d.avgDuration, 0) / revenueData.length);

export function SessionsAnalyticsChart() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between px-5 pt-4 pb-3 shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Sessions & Duration — Last 7 Days</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Daily session volume and average charging duration</p>
        </div>
        <div className="flex gap-3 text-right shrink-0">
          <div>
            <p className="text-sm font-bold text-foreground tabular-nums">{totalSessions.toLocaleString("en-IN")}</p>
            <p className="text-[10px] text-muted-foreground">total sessions</p>
          </div>
          <div>
            <p className="text-sm font-bold text-[oklch(0.72_0.16_75)] tabular-nums">{avgDuration} min</p>
            <p className="text-[10px] text-muted-foreground">avg duration</p>
          </div>
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
            {/* Left axis: sessions */}
            <YAxis
              yAxisId="sessions"
              tick={{ fontSize: 10, fill: "oklch(0.60 0.010 240)" }}
              tickLine={false}
              axisLine={false}
            />
            {/* Right axis: duration in minutes */}
            <YAxis
              yAxisId="duration"
              orientation="right"
              tick={{ fontSize: 10, fill: "oklch(0.60 0.010 240)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}m`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              formatter={(value) => <span style={{ color: "oklch(0.60 0.010 240)" }}>{value}</span>}
            />
            <Bar
              yAxisId="sessions"
              dataKey="sessions"
              name="Sessions"
              fill="oklch(0.65 0.20 240)"
              opacity={0.75}
              radius={[4, 4, 0, 0]}
              barSize={28}
            />
            <Line
              yAxisId="duration"
              type="monotone"
              dataKey="avgDuration"
              name="Avg Duration"
              stroke="oklch(0.72 0.16 75)"
              strokeWidth={2}
              dot={{ r: 4, fill: "oklch(0.72 0.16 75)", strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}