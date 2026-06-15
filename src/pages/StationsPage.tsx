import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Search, LayoutGrid, List, Filter, X } from "lucide-react";
import { stations } from "@/data/mockData";
import { stationMeta } from "@/data/stationData";
import { StationSummaryBar } from "@/components/stations/StationSummaryBar";
import { StationCard } from "@/components/stations/StationCard";
import { StationDetailPanel } from "@/components/stations/StationDetailPanel";
import { StationListView } from "@/components/stations/StationListView";

type ViewMode = "grid" | "list";
type StatusFilter = "all" | "healthy" | "warning" | "offline";
type NetworkFilter = "all" | "Urban" | "Airport" | "Campus" | "Fleet" | "Highway";

function getStatus(s: typeof stations[0]) {
  if (s.offlineChargers === s.totalChargers) return "offline";
  if (s.faultChargers > 1) return "critical";
  if (s.faultChargers > 0 || s.uptime < 90) return "warning";
  return "healthy";
}

export function StationsPage() {
  const [viewMode, setViewMode]           = useState<ViewMode>("grid");
  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState<StatusFilter>("all");
  const [networkFilter, setNetworkFilter] = useState<NetworkFilter>("all");
  const [selectedId, setSelectedId]       = useState<string | null>(null);

  const metaMap = useMemo(
    () => Object.fromEntries(stationMeta.map((m) => [m.id, m])),
    []
  );

  const filtered = useMemo(() => {
    return stations.filter((s) => {
      const meta = metaMap[s.id];
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.city.toLowerCase().includes(search.toLowerCase()) ||
        meta?.operator.toLowerCase().includes(search.toLowerCase());

      const st = getStatus(s);
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "healthy" && st === "healthy") ||
        (statusFilter === "warning" && (st === "warning" || st === "critical")) ||
        (statusFilter === "offline" && st === "offline");

      const matchNetwork =
        networkFilter === "all" || meta?.networkType === networkFilter;

      return matchSearch && matchStatus && matchNetwork;
    });
  }, [search, statusFilter, networkFilter, metaMap]);

  const hasFilters = search || statusFilter !== "all" || networkFilter !== "all";

  // Only show network types that are actually present in the data
  const presentNetworkTypes = useMemo(() => {
    const types = new Set(stationMeta.map((m) => m.networkType));
    return (["Urban", "Airport", "Campus", "Fleet", "Highway"] as const).filter((t) =>
      types.has(t)
    );
  }, []);

  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: "all",     label: "All" },
    { value: "healthy", label: "Healthy" },
    { value: "warning", label: "Warning" },
    { value: "offline", label: "Offline" },
  ];

  return (
    <div className="p-4 md:p-6 h-full flex flex-col gap-5">
      <div className="shrink-0 flex flex-col gap-5">
        {/* Page header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Stations</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {stations.length} stations · India network · Manage and monitor all charging locations
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card border border-border rounded-lg px-3 py-2 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.72_0.18_145)] animate-pulse inline-block" />
            Live data
          </div>
        </div>

        {/* Summary bar */}
        <StationSummaryBar stations={stations} />

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stations, cities..."
              className="w-full h-8 pl-8 pr-8 text-xs rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.60_0.20_240)/40] transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-0.5">
            {statusOptions.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                  statusFilter === value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {presentNetworkTypes.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-0.5">
                <button
                  onClick={() => setNetworkFilter("all")}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                    networkFilter === "all"
                      ? "bg-muted text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  All Types
                </button>
                {presentNetworkTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setNetworkFilter(type)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-medium transition-colors capitalize",
                      networkFilter === type
                        ? "bg-muted text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1" />

          {hasFilters && (
            <button
              onClick={() => { setSearch(""); setStatusFilter("all"); setNetworkFilter("all"); }}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}

          <div className="flex items-center bg-card border border-border rounded-lg p-0.5">
            {(["grid", "list"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors capitalize",
                  viewMode === mode ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {mode === "grid" ? <LayoutGrid className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {hasFilters && (
          <p className="text-xs text-muted-foreground -mt-2">
            Showing {filtered.length} of {stations.length} stations
          </p>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 relative">
        {filtered.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50">
            <Search className="w-8 h-8 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No stations match your filters</p>
            <button
              onClick={() => { setSearch(""); setStatusFilter("all"); setNetworkFilter("all"); }}
              className="mt-3 text-xs text-[oklch(0.65_0.20_240)] hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="h-full overflow-y-auto pr-2 pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {filtered.map((station) => (
                <StationCard
                  key={station.id}
                  station={station}
                  meta={metaMap[station.id]}
                  onViewDetails={setSelectedId}
                />
              ))}
            </div>
          </div>
        ) : (
          <StationListView
            stations={filtered}
            metaMap={metaMap}
            onViewDetails={setSelectedId}
          />
        )}
      </div>

      {selectedId && (
        <StationDetailPanel
          stationId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}