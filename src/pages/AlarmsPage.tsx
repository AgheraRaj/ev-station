import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Search, X, Filter, CheckCheck, SlidersHorizontal } from "lucide-react";
import { allAlarms, CATEGORY_LABELS, SEVERITY_ORDER, type AlarmCategory, type AlarmStatus } from "@/data/alarmData";
import type { AlarmSeverity } from "@/data/mockData";
import { AlarmSummaryBar } from "@/components/alarms/AlarmSummaryBar";
import { AlarmRow } from "@/components/alarms/AlarmRow";
import { AlarmTimeline } from "@/components/alarms/AlarmTimeline";
import { AlarmTrendChart } from "@/components/alarms/AlarmTrendChart";

type SeverityFilter = "all" | AlarmSeverity;
type StatusFilter   = "all" | AlarmStatus;

export function AlarmsPage() {
  const [alarms, setAlarms]             = useState(allAlarms);
  const [search, setSearch]             = useState("");
  const [severityFilter, setSeverity]   = useState<SeverityFilter>("all");
  const [statusFilter, setStatus]       = useState<StatusFilter>("active");
  const [categoryFilter, setCategory]   = useState<"all" | AlarmCategory>("all");
  const [expandedId, setExpandedId]     = useState<string | null>(null);
  const [showSidebar, setShowSidebar]   = useState(true);

  // Actions
  const acknowledge = (id: string) => {
    setAlarms((prev) => prev.map((a) =>
      a.id === id ? { ...a, status: "acknowledged" as AlarmStatus, acknowledgedAt: new Date(), acknowledgedBy: "Operator" } : a
    ));
  };

  const resolve = (id: string) => {
    setAlarms((prev) => prev.map((a) =>
      a.id === id ? { ...a, status: "resolved" as AlarmStatus, resolvedAt: new Date(), acknowledgedAt: a.acknowledgedAt ?? new Date(), acknowledgedBy: a.acknowledgedBy ?? "Operator" } : a
    ));
  };

  const acknowledgeAll = () => {
    setAlarms((prev) => prev.map((a) =>
      a.status === "active" ? { ...a, status: "acknowledged" as AlarmStatus, acknowledgedAt: new Date(), acknowledgedBy: "Operator" } : a
    ));
  };

  // Filtering
  const filtered = useMemo(() => {
    return alarms
      .filter((a) => {
        if (severityFilter !== "all" && a.severity !== severityFilter) return false;
        if (statusFilter   !== "all" && a.status   !== statusFilter)   return false;
        if (categoryFilter !== "all" && a.category !== categoryFilter) return false;
        if (search) {
          const q = search.toLowerCase();
          if (!a.message.toLowerCase().includes(q) &&
              !a.stationName.toLowerCase().includes(q) &&
              !a.code.toLowerCase().includes(q) &&
              !(a.chargerId?.toLowerCase().includes(q))) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const sevDiff = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
        if (sevDiff !== 0) return sevDiff;
        return b.timestamp.getTime() - a.timestamp.getTime();
      });
  }, [alarms, search, severityFilter, statusFilter, categoryFilter]);

  const activeCount = alarms.filter(a => a.status === "active").length;
  const hasFilters  = search || severityFilter !== "all" || statusFilter !== "active" || categoryFilter !== "all";

  const severityOptions: { value: SeverityFilter; label: string }[] = [
    { value: "all",      label: "All" },
    { value: "critical", label: "Critical" },
    { value: "major",    label: "Major" },
    { value: "minor",    label: "Minor" },
    { value: "info",     label: "Info" },
  ];

  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: "all",          label: "All" },
    { value: "active",       label: "Active" },
    { value: "acknowledged", label: "Acknowledged" },
    { value: "resolved",     label: "Resolved" },
  ];

  const severityColor: Record<SeverityFilter, string> = {
    all:      "bg-[oklch(0.60_0.20_240)] text-black",
    critical: "bg-[oklch(0.65_0.22_25)] text-white",
    major:    "bg-[oklch(0.72_0.16_75)] text-white",
    minor:    "bg-[oklch(0.65_0.20_240)] text-white",
    info:     "bg-muted text-foreground",
  };

  return (
    <div className="p-4 md:p-6 space-y-5">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Alarm Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            India network · {alarms.length} total alarms · {activeCount} active
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              onClick={acknowledgeAll}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-[oklch(0.72_0.16_75)/10] text-[oklch(0.72_0.16_75)] border border-[oklch(0.72_0.16_75)/25] hover:bg-[oklch(0.72_0.16_75)/18] transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Acknowledge All ({activeCount})
            </button>
          )}
          <button
            onClick={() => setShowSidebar(s => !s)}
            className={cn(
              "flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border transition-colors",
              showSidebar
                ? "bg-[oklch(0.60_0.20_240)/10] text-[oklch(0.68_0.18_240)] border-[oklch(0.60_0.20_240)/25]"
                : "bg-card text-muted-foreground border-border hover:text-foreground"
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {showSidebar ? "Hide" : "Show"} Panel
          </button>
        </div>
      </div>

      {/* Summary bar */}
      <AlarmSummaryBar alarms={alarms} />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search alarms, stations, codes..."
            className="w-full h-8 pl-8 pr-8 text-xs rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.60_0.20_240)/40] transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Severity filter */}
        <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-0.5">
          {severityOptions.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setSeverity(value)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                severityFilter === value
                  ? severityColor[value]
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-0.5">
          {statusOptions.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatus(value)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium transition-colors capitalize",
                statusFilter === value
                  ? "bg-muted text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategory(e.target.value as "all" | AlarmCategory)}
            className="h-8 text-xs rounded-lg border border-border bg-card text-foreground px-2 focus:outline-none focus:ring-2 focus:ring-[oklch(0.60_0.20_240)/40]"
          >
            <option value="all">All Categories</option>
            {(Object.entries(CATEGORY_LABELS) as [AlarmCategory, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        <div className="flex-1" />

        {hasFilters && (
          <button
            onClick={() => { setSearch(""); setSeverity("all"); setStatus("active"); setCategory("all"); }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Reset filters
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground -mt-2">
        Showing {filtered.length} of {alarms.length} alarms
      </p>

      {/* Main content: alarm list + optional sidebar */}
      <div className={cn("grid gap-4", showSidebar ? "grid-cols-1 xl:grid-cols-3" : "grid-cols-1")}>

        {/* Alarm list */}
        <div className={cn("space-y-2", showSidebar ? "xl:col-span-2" : "")}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-20">
              <Search className="w-8 h-8 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No alarms match your filters</p>
              <button
                onClick={() => { setSearch(""); setSeverity("all"); setStatus("active"); setCategory("all"); }}
                className="mt-3 text-xs text-[oklch(0.65_0.20_240)] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filtered.map((alarm) => (
              <AlarmRow
                key={alarm.id}
                alarm={alarm}
                expanded={expandedId === alarm.id}
                onExpand={() => setExpandedId(expandedId === alarm.id ? null : alarm.id)}
                onAcknowledge={acknowledge}
                onResolve={resolve}
              />
            ))
          )}
        </div>

        {/* Sidebar: timeline + trend chart */}
        {showSidebar && (
          <div className="space-y-4">
            {/* Timeline */}
            <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ maxHeight: 480 }}>
              <AlarmTimeline
                alarms={alarms}
                onSelect={(id) => {
                  setExpandedId(id);
                  setSeverity("all");
                  setStatus("all");
                  setSearch("");
                }}
              />
            </div>

            {/* Trend chart */}
            <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ height: 220 }}>
              <AlarmTrendChart />
            </div>

            {/* Category breakdown */}
            <div className="rounded-xl border border-border bg-card px-4 py-4">
              <p className="text-xs font-semibold text-foreground mb-3">By Category</p>
              <div className="space-y-2">
                {(Object.entries(CATEGORY_LABELS) as [AlarmCategory, string][]).map(([cat, label]) => {
                  const count = alarms.filter(a => a.category === cat && a.status !== "resolved").length;
                  const total = alarms.filter(a => a.category === cat).length;
                  if (total === 0) return null;
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">{label}</span>
                        <span className="text-xs font-medium text-foreground tabular-nums">{count} active / {total}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[oklch(0.65_0.20_240)] transition-all"
                          style={{ width: `${(count / total) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}