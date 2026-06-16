import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, MapPin, Zap, Bell,
  ChevronLeft, ChevronRight, Activity, FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { allAlarms } from "@/data/alarmData";
import { useTheme } from "@/hook/useTheme";

// import lightLogo from "@/assets/AltrexLogoTr1.png";
// import darkLogo  from "@/assets/AltrexLogoTr2.png";

const activeAlarmCount = allAlarms.filter(a => a.status === "active").length;

const navItems = [
  { icon: LayoutDashboard, label: "Overview",       to: "/"          },
  { icon: MapPin,          label: "Stations",       to: "/stations"  },
  { icon: Zap,             label: "Chargers",       to: "/chargers"  },
  { icon: Activity,        label: "Sessions",       to: "/sessions"  },
  { icon: Bell,            label: "Alarms",         to: "/alarms",   badge: activeAlarmCount, badgeVariant: "destructive" as const },
  { icon: FileText,        label: "Reports",        to: "/reports"   },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();
  void theme; // suppress unused warning until logos are wired

  return (
    <aside className={cn(
      "relative flex flex-col h-full border-r border-border bg-sidebar transition-all duration-300 ease-in-out shrink-0",
      collapsed ? "w-16" : "w-56"
    )}>
      {/* Logo */}
      <div className={cn(
        "flex items-center border-b border-border h-14 shrink-0",
        collapsed ? "justify-center px-0" : "px-4 gap-2.5"
      )}>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[oklch(0.60_0.20_240)] shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="leading-none">
            <p className="text-sm font-bold text-sidebar-foreground tracking-tight">ALTREX</p>
            <p className="text-[10px] text-sidebar-foreground/50 font-medium tracking-widest uppercase">Platform</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => cn(
                "relative w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-[oklch(0.60_0.20_240)/15] text-[oklch(0.70_0.18_240)] dark:text-[oklch(0.75_0.18_240)]"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                collapsed && "justify-center"
              )}
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn("w-4 h-4 shrink-0", isActive && "text-[oklch(0.60_0.20_240)]")} />
                  {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
                  {!collapsed && item.badge ? (
                    <Badge variant={item.badgeVariant ?? "default"} className="text-[10px] h-4 min-w-4 px-1">
                      {item.badge}
                    </Badge>
                  ) : null}
                  {collapsed && item.badge ? (
                    <span className="absolute right-1 top-1 w-2 h-2 rounded-full bg-destructive" />
                  ) : null}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-border p-2 shrink-0">
        <button
          onClick={() => setCollapsed(c => !c)}
          className="w-full flex items-center justify-center h-8 rounded-md text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-xs gap-1.5"
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4" />
            : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>
          }
        </button>
      </div>
    </aside>
  );
}