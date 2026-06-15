import { useRef, useEffect } from "react";
import { Bell, X, CheckCheck, Trash2, AlertTriangle, Info, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import type { Notification, NotificationSeverity } from "@/data/notificationData";
import { Link } from "react-router-dom";

// ─── Severity config ──────────────────────────────────────────────────────────

const SEVERITY: Record<
  NotificationSeverity,
  { icon: React.ElementType; dot: string; bg: string; border: string; iconColor: string; label: string }
> = {
  critical: {
    icon: AlertTriangle,
    dot:       "bg-[oklch(0.65_0.22_25)]",
    bg:        "bg-[oklch(0.65_0.22_25)/8]",
    border:    "border-[oklch(0.65_0.22_25)/30]",
    iconColor: "text-[oklch(0.65_0.22_25)]",
    label:     "Critical",
  },
  warning: {
    icon: Zap,
    dot:       "bg-[oklch(0.72_0.16_75)]",
    bg:        "bg-[oklch(0.72_0.16_75)/8]",
    border:    "border-[oklch(0.72_0.16_75)/30]",
    iconColor: "text-[oklch(0.72_0.16_75)]",
    label:     "Warning",
  },
  info: {
    icon: Info,
    dot:       "bg-[oklch(0.65_0.20_240)]",
    bg:        "bg-transparent",
    border:    "border-border",
    iconColor: "text-[oklch(0.65_0.20_240)]",
    label:     "Info",
  },
};

// ─── Individual notification row ──────────────────────────────────────────────

interface NotificationRowProps {
  notification: Notification;
  onRead:    (id: string) => void;
  onDismiss: (id: string) => void;
}

function NotificationRow({ notification: n, onRead, onDismiss }: NotificationRowProps) {
  const cfg = SEVERITY[n.severity];
  const Icon = cfg.icon;

  return (
    <div
      className={cn(
        "group relative flex gap-3 px-4 py-3 border-b border-border transition-colors",
        !n.read && cn(cfg.bg, "hover:brightness-[0.97]"),
        n.read  && "opacity-60 hover:opacity-80 hover:bg-muted/20",
      )}
    >
      {/* Unread dot */}
      {!n.read && (
        <span className={cn("absolute left-1.5 top-4 w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)} />
      )}

      {/* Severity icon */}
      <div className={cn(
        "flex items-center justify-center w-7 h-7 rounded-lg shrink-0 mt-0.5 border",
        !n.read ? cn(cfg.bg, cfg.border) : "bg-muted/40 border-border"
      )}>
        <Icon className={cn("w-3.5 h-3.5", !n.read ? cfg.iconColor : "text-muted-foreground")} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className={cn("text-xs font-semibold leading-tight", !n.read ? "text-foreground" : "text-muted-foreground")}>
              {n.title}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug line-clamp-2">
              {n.message}
            </p>
          </div>

          {/* Dismiss button — visible on hover */}
          <button
            onClick={(e) => { e.stopPropagation(); onDismiss(n.id); }}
            className="shrink-0 opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            aria-label="Dismiss"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className={cn(
            "text-[9px] font-semibold uppercase tracking-wider",
            !n.read ? cfg.iconColor : "text-muted-foreground"
          )}>
            {cfg.label}
          </span>
          <span className="text-[9px] text-muted-foreground/60">·</span>
          <span className="text-[10px] text-muted-foreground truncate">{n.station}</span>
          {n.chargerId && (
            <>
              <span className="text-[9px] text-muted-foreground/60">·</span>
              <span className="text-[9px] font-mono text-muted-foreground">{n.chargerId}</span>
            </>
          )}
        </div>

        <p className="text-[10px] text-muted-foreground/50 mt-1">
          {formatDistanceToNow(n.timestamp, { addSuffix: true })}
        </p>

        {/* Mark as read — only on unread items */}
        {!n.read && (
          <button
            onClick={(e) => { e.stopPropagation(); onRead(n.id); }}
            className="mt-1.5 text-[10px] text-[oklch(0.65_0.20_240)] hover:underline"
          >
            Mark as read
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main notification panel component ───────────────────────────────────────

interface NotificationPanelProps {
  open:          boolean;
  onClose:       () => void;
  notifications: Notification[];
  unreadCount:   number;
  onMarkAsRead:  (id: string) => void;
  onMarkAllRead: () => void;
  onDismiss:     (id: string) => void;
  onClearAll:    () => void;
}

export function NotificationPanel({
  open,
  onClose,
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllRead,
  onDismiss,
  onClearAll,
}: NotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    // Delay so the opening click doesn't immediately close
    const t = setTimeout(() => document.addEventListener("mousedown", handleClick), 0);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", handleClick); };
  }, [open, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const unread = notifications.filter((n) => !n.read);
  const read   = notifications.filter((n) =>  n.read);

  return (
    <div
      ref={panelRef}
      className={cn(
        // Position: right-aligned below the bell, above other content
        "absolute right-0 top-[calc(100%+8px)] z-50",
        "w-[380px] max-h-[520px] flex flex-col",
        "rounded-xl border border-border bg-card shadow-2xl shadow-black/20",
        // Entry animation (Tailwind v4 / tw-animate-css compatible)
        "animate-in fade-in slide-in-from-top-2 duration-150",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-foreground" />
          <span className="text-sm font-semibold text-foreground">Notifications</span>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[oklch(0.65_0.22_25)/15] text-[oklch(0.65_0.22_25)] border border-[oklch(0.65_0.22_25)/25]">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted"
              title="Clear all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-muted-foreground">
            <Bell className="w-8 h-8 mb-3 opacity-20" />
            <p className="text-sm font-medium">All caught up</p>
            <p className="text-xs mt-1 opacity-60">No notifications right now</p>
          </div>
        ) : (
          <>
            {/* Unread section */}
            {unread.length > 0 && (
              <>
                <div className="px-4 py-1.5 bg-muted/30 border-b border-border">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Unread · {unread.length}
                  </span>
                </div>
                {unread.map((n) => (
                  <NotificationRow
                    key={n.id}
                    notification={n}
                    onRead={onMarkAsRead}
                    onDismiss={onDismiss}
                  />
                ))}
              </>
            )}

            {/* Read section */}
            {read.length > 0 && (
              <>
                <div className="px-4 py-1.5 bg-muted/30 border-b border-border">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Earlier · {read.length}
                  </span>
                </div>
                {read.map((n) => (
                  <NotificationRow
                    key={n.id}
                    notification={n}
                    onRead={onMarkAsRead}
                    onDismiss={onDismiss}
                  />
                ))}
              </>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <Link to="/alarms" className="border-t border-border px-4 py-2.5 shrink-0">
          <button onClick={onClose} className="w-full text-xs font-medium text-[oklch(0.65_0.20_240)] hover:text-[oklch(0.55_0.20_240)] transition-colors text-center">
            View all notifications →
          </button>
        </Link>
      )}
    </div>
  );
}

// ─── Bell button with badge (self-contained, drop into TopBar) ────────────────

interface NotificationBellProps {
  open:         boolean;
  onToggle:     () => void;
  unreadCount:  number;
  hasUnread:    boolean;
}

export function NotificationBell({ open, onToggle, unreadCount, hasUnread }: NotificationBellProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={`Notifications${hasUnread ? ` — ${unreadCount} unread` : ""}`}
      aria-expanded={open}
      className={cn(
        "relative flex items-center justify-center w-7 h-7 rounded-md transition-colors",
        open
          ? "bg-[oklch(0.60_0.20_240)/15] text-[oklch(0.68_0.18_240)]"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
    >
      <Bell className={cn("w-3.5 h-3.5 transition-transform", open && "scale-110")} />

      {/* Badge */}
      {hasUnread && (
        <span
          className={cn(
            "absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full",
            "flex items-center justify-center",
            "text-[9px] font-bold leading-none text-white",
            // Red for any critical, amber for warning-only, blue for info-only
            "bg-[oklch(0.65_0.22_25)]",
            // Pulse animation for urgency
            "animate-pulse",
          )}
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}