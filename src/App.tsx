import "./index.css";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hook/useTheme";
import { AppShell } from "@/components/layout/AppShell";
import { KPICards } from "@/components/dashboard/KPICards";
import { GISMap } from "@/components/dashboard/GISMap";
import { ChargerStatusGrid } from "@/components/dashboard/ChargerStatusGrid";
import { ActiveSessionsTable } from "@/components/dashboard/Activesessionstable";
import { EnergyTrendChart } from "@/components/dashboard/EnergyTrendChart";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { UtilizationChart } from "@/components/dashboard/UtilizationChart";
import { AlarmPanel } from "@/components/dashboard/AlarmPanel";
import { StationsPage } from "@/pages/StationsPage";
import { useLiveKPI } from "@/hook/useLiveData";
import ChargersPage from "./pages/ChargersPage";

function Dashboard() {
  const kpi = useLiveKPI();

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            Operations Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Real-time monitoring · India network ·{" "}
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long", day: "numeric", month: "long", year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card border border-border rounded-lg px-3 py-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.72_0.18_145)] animate-pulse inline-block" />
          Live — updates every 4s
        </div>
      </div>

      <KPICards kpi={kpi} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 rounded-xl border border-border bg-card overflow-hidden" style={{ height: 460 }}>
          <GISMap />
        </div>
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden" style={{ height: 460 }}>
          <ChargerStatusGrid />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <ActiveSessionsTable />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card" style={{ height: 280 }}>
          <EnergyTrendChart />
        </div>
        <div className="rounded-xl border border-border bg-card" style={{ height: 280 }}>
          <RevenueChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card" style={{ height: 280 }}>
          <UtilizationChart />
        </div>
        <div className="lg:col-span-3 rounded-xl border border-border bg-card" style={{ height: 280 }}>
          <AlarmPanel />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppShell>
        <Routes>
          <Route path="/"          element={<Dashboard />} />
          <Route path="/stations"  element={<StationsPage />} />
          <Route path="/chargers"  element={<ChargersPage />} />
          <Route path="/sessions"  element={<ComingSoon title="Sessions" />} />
          <Route path="/alarms"    element={<ComingSoon title="Alarms" />} />
          <Route path="/analytics" element={<ComingSoon title="Analytics" />} />
          <Route path="/reports"   element={<ComingSoon title="Reports" />} />
          <Route path="/settings"  element={<ComingSoon title="Settings" />} />
        </Routes>
      </AppShell>
    </ThemeProvider>
  );
}

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-3">
      <div className="w-12 h-12 rounded-2xl bg-[oklch(0.60_0.20_240)/10] border border-[oklch(0.60_0.20_240)/20] flex items-center justify-center">
        <span className="text-xl">⚡</span>
      </div>
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground">This page is coming soon.</p>
    </div>
  );
}

export default App;