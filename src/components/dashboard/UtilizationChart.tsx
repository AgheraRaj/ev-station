import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { utilizationData } from "@/data/mockData";

function everyFourth(_: unknown, index: number) {
  return index % 4 === 0;
}

interface TooltipPayloadEntry {
  name: string;
  value: number;
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
  const util = payload.find((p) => p.name === "Utilization");
  const sessions = payload.find((p) => p.name === "Sessions");
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {util && (
        <p className="text-muted-foreground">
          Utilization: <span className="font-medium text-foreground">{util.value}%</span>
        </p>
      )}
      {sessions && (
        <p className="text-muted-foreground">
          Sessions: <span className="font-medium text-foreground">{sessions.value}</span>
        </p>
      )}
    </div>
  );
}

export function UtilizationChart() {
  const currentHour = new Date().getHours();
  const currentUtil =
    utilizationData[currentHour]?.utilization ?? 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between px-4 pt-4 pb-3 shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Network Utilization — Today</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Hourly charger utilization %</p>
        </div>
        <div className="text-right">
          <p className="text-base font-bold text-foreground tabular-nums">{currentUtil}%</p>
          <p className="text-[10px] text-muted-foreground">right now</p>
        </div>
      </div>

      <div className="flex-1 px-4 pb-4 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={utilizationData}
            margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorUtil" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="oklch(0.72 0.14 210)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="oklch(0.72 0.14 210)" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" vertical={false} />

            <XAxis
              dataKey="hour"
              tick={{ fontSize: 10, fill: "oklch(0.60 0.010 240)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v, i) => (everyFourth(v, i) ? v : "")}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "oklch(0.60 0.010 240)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />

            {/* Visual threshold marker at 80% */}
            <ReferenceLine
              y={80}
              stroke="oklch(0.72 0.16 75)"
              strokeDasharray="4 4"
              strokeWidth={1}
              label={{
                value: "80% threshold",
                position: "insideTopRight",
                fontSize: 9,
                fill: "oklch(0.60 0.010 240)",
              }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="utilization"
              name="Utilization"
              stroke="oklch(0.72 0.14 210)"
              strokeWidth={2}
              fill="url(#colorUtil)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}