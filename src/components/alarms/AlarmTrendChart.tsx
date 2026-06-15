import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const trendData = [
  { day: "Mon", critical: 1, major: 3, minor: 2, info: 4 },
  { day: "Tue", critical: 0, major: 2, minor: 3, info: 2 },
  { day: "Wed", critical: 2, major: 4, minor: 1, info: 3 },
  { day: "Thu", critical: 1, major: 1, minor: 4, info: 5 },
  { day: "Fri", critical: 0, major: 3, minor: 2, info: 2 },
  { day: "Sat", critical: 1, major: 2, minor: 1, info: 1 },
  { day: "Sun", critical: 3, major: 5, minor: 3, info: 2 },
];

interface TooltipPayload { name: string; value: number; color: string; }

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-muted-foreground">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="capitalize">{p.name}:</span>
          <span className="font-medium text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function AlarmTrendChart() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 shrink-0">
        <h2 className="text-sm font-semibold text-foreground">Alarm Trend — Last 7 Days</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Daily alarm counts by severity</p>
      </div>
      <div className="flex-1 px-4 pb-4 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={trendData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }} barSize={10}>
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: "oklch(0.60 0.010 240)" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "oklch(0.60 0.010 240)" }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "oklch(1 0 0 / 4%)" }} />
            <Legend wrapperStyle={{ fontSize: 11 }} formatter={(v) => <span style={{ color: "oklch(0.60 0.010 240)", textTransform: "capitalize" }}>{v}</span>} />
            <Bar dataKey="critical" stackId="a" fill="oklch(0.65 0.22 25)"  radius={[0, 0, 0, 0]} />
            <Bar dataKey="major"    stackId="a" fill="oklch(0.72 0.16 75)"  radius={[0, 0, 0, 0]} />
            <Bar dataKey="minor"    stackId="a" fill="oklch(0.65 0.20 240)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="info"     stackId="a" fill="oklch(0.55 0.01 240)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}