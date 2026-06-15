import { useState, useMemo } from "react";
import { allSessions, type SessionStatus } from "@/data/sessionData";
import type { ConnectorType } from "@/data/mockData";
import { SessionKPIBar } from "@/components/sessions/SessionKPIBar";
import { SessionTable } from "@/components/sessions/SessionTable";
import { Search, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SessionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SessionStatus | "all">("all");
  const [connFilter, setConnFilter] = useState<ConnectorType | "all">("all");

  const filtered = useMemo(() => {
    return allSessions.filter((s) => {
      const matchSearch =
        !search ||
        s.id.toLowerCase().includes(search.toLowerCase()) ||
        s.driverName.toLowerCase().includes(search.toLowerCase()) ||
        s.vehicleId.toLowerCase().includes(search.toLowerCase()) ||
        s.stationName.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      const matchConn = connFilter === "all" || s.connectorType === connFilter;

      return matchSearch && matchStatus && matchConn;
    });
  }, [search, statusFilter, connFilter]);

  const hasFilters = search || statusFilter !== "all" || connFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setConnFilter("all");
  };

  const statusOptions: { value: SessionStatus | "all"; label: string }[] = [
    { value: "all", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "interrupted", label: "Interrupted" },
  ];

  const connOptions: { value: ConnectorType | "all"; label: string }[] = [
    { value: "all", label: "All Connectors" },
    { value: "CCS2", label: "CCS2" },
    { value: "CHAdeMO", label: "CHAdeMO" },
    { value: "Type2", label: "Type 2" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-5 h-full flex flex-col">
      <div className="flex items-start justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Charging Sessions</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            History and active charging sessions across the network
          </p>
        </div>
      </div>

      <div className="shrink-0">
        <SessionKPIBar />
      </div>

      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ID, driver, vehicle, or station..."
            className="w-full h-9 pl-9 pr-8 text-sm rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.60_0.20_240)/40] transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
          {statusOptions.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium transition-colors",
                statusFilter === value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
            {connOptions.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setConnFilter(value)}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-medium transition-colors",
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

        <div className="flex-1" />

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" /> Clear Filters
          </button>
        )}
      </div>

      <div className="flex-1 min-h-0 relative">
        {filtered.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50">
            <Search className="w-8 h-8 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No sessions match your filters</p>
            <button
              onClick={clearFilters}
              className="mt-3 text-xs text-[oklch(0.65_0.20_240)] hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <SessionTable sessions={filtered} />
        )}
      </div>
    </div>
  );
}
