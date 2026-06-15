import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { energyTrendData } from "@/data/mockData";

const totalGrid  = energyTrendData.reduce((s, d) => s + d.gridKWh, 0);
const totalSolar = energyTrendData.reduce((s, d) => s + d.solarKWh, 0);
const solarPct   = Math.round((totalSolar / (totalGrid + totalSolar)) * 100);

interface TooltipEntry { name: string; value: number; color: string }

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipEntry[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + p.value, 0);
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-muted-foreground">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span>{p.name}:</span>
          <span className="font-medium text-foreground tabular-nums">{p.value} kWh</span>
        </div>
      ))}
      <div className="border-t border-border mt-1.5 pt-1.5 flex justify-between text-muted-foreground">
        <span>Total</span>
        <span className="font-semibold text-foreground tabular-nums">{total} kWh</span>
      </div>
    </div>
  );
}

export function EnergyBreakdownChart() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between px-5 pt-4 pb-3 shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Energy Source Breakdown — Last 24h</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Grid import vs. rooftop solar across all stations</p>
        </div>
        <div className="flex gap-3 text-right shrink-0">
          <div>
            <p className="text-sm font-bold text-[oklch(0.72_0.18_145)] tabular-nums">{solarPct}%</p>
            <p className="text-[10px] text-muted-foreground">solar share</p>
          </div>
          <div>
            <p className="text-sm font-bold text-foreground tabular-nums">{(totalGrid + totalSolar).toLocaleString("en-IN")} kWh</p>
            <p className="text-[10px] text-muted-foreground">total</p>
          </div>
        </div>
      </div>
      <div className="flex-1 px-4 pb-4 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={energyTrendData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="rpt-colorGrid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="oklch(0.65 0.20 240)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(0.65 0.20 240)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="rpt-colorSolar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="oklch(0.72 0.18 145)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="oklch(0.72 0.18 145)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: "oklch(0.60 0.010 240)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v, i) => i % 4 === 0 ? v : ""}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "oklch(0.60 0.010 240)" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              formatter={(value) => <span style={{ color: "oklch(0.60 0.010 240)" }}>{value}</span>}
            />
            <Area type="monotone" dataKey="gridKWh"  name="Grid"  stackId="1" stroke="oklch(0.65 0.20 240)" strokeWidth={1.5} fill="url(#rpt-colorGrid)"  />
            <Area type="monotone" dataKey="solarKWh" name="Solar" stackId="1" stroke="oklch(0.72 0.18 145)" strokeWidth={1.5} fill="url(#rpt-colorSolar)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}