import { Bell, Search, Sun, Moon, RefreshCw, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { kpiData } from "@/data/mockData";
import { useState, useEffect } from "react";
import { useTheme } from "@/hook/useTheme";

export function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const [time, setTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  return (
    <header className="h-14 shrink-0 border-b border-border bg-background flex items-center px-4 gap-3">
      {/* Search */}
      <div className="flex-1 max-w-xs">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search stations, chargers..."
            className="w-full h-8 pl-8 pr-3 text-sm rounded-md border border-border bg-muted/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.60_0.20_240)/40] transition-all"
          />
        </div>
      </div>

      <div className="flex-1" />

      {/* Network status */}
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[oklch(0.72_0.18_145)/12] border border-[oklch(0.72_0.18_145)/20]">
        <Wifi className="w-3 h-3 text-[oklch(0.65_0.18_145)]" />
        <span className="text-[11px] font-medium text-[oklch(0.65_0.18_145)]">
          {kpiData.totalStations} stations live
        </span>
      </div>

      {/* Live time */}
      <div className="hidden md:flex items-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.72_0.18_145)] animate-pulse" />
        <span className="text-xs font-mono text-muted-foreground tabular-nums">
          {time.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </span>
      </div>

      {/* Refresh */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleRefresh}
        className="text-muted-foreground hover:text-foreground"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
      </Button>

      {/* Alarm bell */}
      <div className="relative">
        <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
          <Bell className="w-3.5 h-3.5" />
        </Button>
        {kpiData.activeAlarms > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 text-[9px] h-4 min-w-4 px-1 leading-none"
          >
            {kpiData.activeAlarms}
          </Badge>
        )}
      </div>

      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={toggleTheme}
        className="text-muted-foreground hover:text-foreground"
      >
        {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
      </Button>

      {/* User avatar */}
      <div className="flex items-center gap-2 pl-1">
        <div className="w-7 h-7 rounded-full bg-[oklch(0.60_0.20_240)] flex items-center justify-center text-[11px] font-bold text-white shrink-0">
          OP
        </div>
        <div className="hidden md:block leading-none">
          <p className="text-xs font-medium text-foreground">Operator</p>
          <p className="text-[10px] text-muted-foreground">Admin</p>
        </div>
      </div>
    </header>
  );
}