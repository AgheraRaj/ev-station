import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Search, LayoutGrid, List, Filter, X } from "lucide-react";
import { allChargers } from "@/data/chargerData";
import { stations } from "@/data/mockData";
import type { ChargerStatus, ConnectorType } from "@/data/mockData";
import { ChargerSummaryBar } from "@/components/chargers/ChargerSummaryBar";
import { ChargerTable } from "@/components/chargers/ChargerTable";
import { ChargerCard } from "@/components/chargers/ChargerCard";
import { ChargerDetailPanel } from "@/components/chargers/ChargerDetailPanel";
import { useLiveChargerStatus } from "@/hook/useLiveData";

// ─── Filter types ─────────────────────────────────────────────────────────────

type ViewMode      = "table" | "grid";
type StatusFilter  = "all" | ChargerStatus;
type ConnFilter    = "all" | ConnectorType;

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ChargersPage() {
  const liveStatuses = useLiveChargerStatus();

  const [viewMode,      setViewMode]      = useState<ViewMode>("table");
  const [search,        setSearch]        = useState("");
  const [statusFilter,  setStatusFilter]  = useState<StatusFilter>("all");
  const [connFilter,    setConnFilter]    = useState<ConnFilter>("all");
  const [stationFilter, setStationFilter] = useState<string>("all");
  const [selectedId,    setSelectedId]    = useState<string | null>(null);

  // Build a stable station id→name map once
  const stationMap = useMemo(
    () => Object.fromEntries(stations.map((s) => [s.id, s.name])),
    []
  );

  // Apply all active filters
  const filtered = useMemo(() => {
    return allChargers.filter((c) => {
      const stationName = stationMap[c.stationId] ?? c.stationId;

      const matchSearch =
        !search ||
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.label.toLowerCase().includes(search.toLowerCase()) ||
        stationName.toLowerCase().includes(search.toLowerCase()) ||
        c.connectorType.toLowerCase().includes(search.toLowerCase()) ||
        c.firmwareVersion.toLowerCase().includes(search.toLowerCase());

      const matchStatus  = statusFilter === "all"  || c.status        === statusFilter;
      const matchConn    = connFilter   === "all"  || c.connectorType === connFilter;
      const matchStation = stationFilter === "all" || c.stationId     === stationFilter;

      return matchSearch && matchStatus && matchConn && matchStation;
    });
  }, [search, statusFilter, connFilter, stationFilter, stationMap]);

  const hasFilters =
    search || statusFilter !== "all" || connFilter !== "all" || stationFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setConnFilter("all");
    setStationFilter("all");
  };

  // ─── Config for status + connector filter pills ───────────────────────────

  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: "all",       label: "All" },
    { value: "charging",  label: "Charging" },
    { value: "available", label: "Available" },
    { value: "fault",     label: "Fault" },
    { value: "offline",   label: "Offline" },
  ];

  const connOptions: { value: ConnFilter; label: string }[] = [
    { value: "all",      label: "All types" },
    { value: "CCS2",     label: "CCS2" },
    { value: "CHAdeMO",  label: "CHAdeMO" },
    { value: "Type2",    label: "Type 2" },
  ];

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="p-4 md:p-6 space-y-5">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Chargers</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {allChargers.length} chargers across {stations.length} stations · India network
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card border border-border rounded-lg px-3 py-2 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.72_0.18_145)] animate-pulse inline-block" />
          Live telemetry
        </div>
      </div>

      {/* Summary bar */}
      <ChargerSummaryBar chargers={allChargers} />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">

        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ID, station, connector..."
            className="w-full h-8 pl-8 pr-8 text-xs rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.60_0.20_240)/40] transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-0.5">
          {statusOptions.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                statusFilter === value
                  ? "bg-[oklch(0.60_0.20_240)] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Connector type filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-0.5">
            {connOptions.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setConnFilter(value)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                  connFilter === value
                    ? "bg-muted text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Station dropdown */}
        <select
          value={stationFilter}
          onChange={(e) => setStationFilter(e.target.value)}
          className="h-8 px-2 text-xs rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.60_0.20_240)/40] transition-all"
        >
          <option value="all">All stations</option>
          {stations.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <div className="flex-1" />

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}

        {/* View toggle */}
        <div className="flex items-center bg-card border border-border rounded-lg p-0.5">
          {([
            { mode: "table" as ViewMode, icon: <List className="w-3.5 h-3.5" />,       label: "Table" },
            { mode: "grid"  as ViewMode, icon: <LayoutGrid className="w-3.5 h-3.5" />, label: "Grid"  },
          ]).map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                viewMode === mode
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Result count when filters are active */}
      {hasFilters && (
        <p className="text-xs text-muted-foreground -mt-2">
          Showing {filtered.length} of {allChargers.length} chargers
        </p>
      )}

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-20">
          <Search className="w-8 h-8 text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No chargers match your filters</p>
          <button
            onClick={clearFilters}
            className="mt-3 text-xs text-[oklch(0.65_0.20_240)] hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : viewMode === "table" ? (
        /* ── Table view ── */
        <ChargerTable
          chargers={filtered}
          liveStatuses={liveStatuses}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId(selectedId === id ? null : id)}
        />
      ) : (
        /* ── Grid view ── */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map((charger) => {
            const live = liveStatuses[charger.id] ?? {
              power: charger.currentPowerKW,
              temp:  charger.temperature,
            };
            return (
              <ChargerCard
                key={charger.id}
                charger={charger}
                livePower={live.power}
                liveTemp={live.temp}
                selected={selectedId === charger.id}
                onClick={() => setSelectedId(selectedId === charger.id ? null : charger.id)}
              />
            );
          })}
        </div>
      )}

      {/* Slide-in detail panel */}
      {selectedId && (
        <ChargerDetailPanel
          chargerId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}