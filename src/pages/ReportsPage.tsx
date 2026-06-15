import { useState } from "react";
import { cn } from "@/lib/utils";
import { Download, Calendar } from "lucide-react";
import { ReportsSummaryBar }       from "@/components/reports/ReportsSummaryBar";
import { RevenueByStationChart }   from "@/components/reports/RevenueByStationChart";
import { EnergyBreakdownChart }    from "@/components/reports/EnergyBreakdownChart";
import { SessionsAnalyticsChart }  from "@/components/reports/SessionsAnalyticsChart";
import { StationPerformanceTable } from "@/components/reports/StationPerformanceTable";

// ─── Date range options (UI only — data is fixed mock) ───────────────────────

const DATE_RANGES = [
  { label: "Today",    value: "1d"  },
  { label: "7 Days",   value: "7d"  },
  { label: "30 Days",  value: "30d" },
  { label: "90 Days",  value: "90d" },
] as const;

type DateRange = (typeof DATE_RANGES)[number]["value"];

// ─── Report section wrapper ───────────────────────────────────────────────────

function Section({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden", className)} style={style}>
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("7d");

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="p-4 md:p-6 space-y-5">

      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Performance analytics · India network · {today}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Date range selector */}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-0.5">
              {DATE_RANGES.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setDateRange(value)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                    dateRange === value
                      ? "bg-[oklch(0.60_0.20_240)] text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Export button — UI only */}
          <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-card text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary KPI bar */}
      <ReportsSummaryBar />

      {/* Revenue + Sessions row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Section className="lg:col-span-3" style={{ height: 340 } as React.CSSProperties}>
          <RevenueByStationChart />
        </Section>
        <Section className="lg:col-span-2" style={{ height: 340 } as React.CSSProperties}>
          <SessionsAnalyticsChart />
        </Section>
      </div>

      {/* Energy breakdown */}
      <Section style={{ height: 280 } as React.CSSProperties}>
        <EnergyBreakdownChart />
      </Section>

      {/* Station performance table */}
      <StationPerformanceTable />

    </div>
  );
}