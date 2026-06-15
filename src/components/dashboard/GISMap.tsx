import { useEffect, useRef } from "react";
import { MapPin, Zap, AlertTriangle, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { stations } from "@/data/mockData";
import type { Station } from "@/data/mockData";
import { useTheme } from "@/hook/useTheme";

// ─── Leaflet dynamic import (avoids SSR issues) ───────────────────────────────

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    L: any;
  }
}

const STATUS_COLOR = {
  healthy:  { hex: "#4ade80", label: "Healthy",  shadow: "0 0 10px #4ade8088" },
  warning:  { hex: "#facc15", label: "Warning",  shadow: "0 0 10px #facc1588" },
  critical: { hex: "#f87171", label: "Critical", shadow: "0 0 10px #f8717188" },
  offline:  { hex: "#6b7280", label: "Offline",  shadow: "0 0 10px #6b728088" },
};

function getStationStatus(s: Station): keyof typeof STATUS_COLOR {
  if (s.offlineChargers === s.totalChargers) return "offline";
  if (s.faultChargers > 1) return "critical";
  if (s.faultChargers > 0 || s.uptime < 90) return "warning";
  return "healthy";
}

function makeMarkerIcon(color: string, shadow: string, L: typeof window.L) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <path filter="url(#glow)" d="M14 0C6.27 0 0 6.27 0 14c0 9.33 14 22 14 22s14-12.67 14-22C28 6.27 21.73 0 14 0z"
        fill="${color}" opacity="0.95"/>
      <circle cx="14" cy="13" r="6" fill="white" opacity="0.95"/>
      <text x="14" y="17.5" text-anchor="middle" font-size="9" font-weight="bold" fill="${color}">EV</text>
    </svg>`;
  return L.divIcon({
    html: `<div style="filter:drop-shadow(${shadow})">${svg}</div>`,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
    className: "",
  });
}

function buildPopupHTML(s: Station, status: keyof typeof STATUS_COLOR): string {
  const utilPct = Math.round((s.currentLoadKW / s.powerCapacityKW) * 100);
  const statusInfo = STATUS_COLOR[status];
  // Format revenue in INR — use lakhs for amounts ≥ 1,00,000
  const revenueFormatted =
    s.revenue24h >= 100000
      ? `₹${(s.revenue24h / 100000).toFixed(2)}L`
      : `₹${s.revenue24h.toLocaleString("en-IN")}`;

  return `
    <div style="font-family:system-ui,sans-serif;min-width:200px;padding:2px">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px">
        <span style="width:8px;height:8px;border-radius:50%;background:${statusInfo.hex};display:inline-block;flex-shrink:0"></span>
        <span style="font-weight:700;font-size:13px;line-height:1.2">${s.name}</span>
      </div>
      <div style="font-size:11px;color:#888;margin-bottom:8px">${s.location}, ${s.city}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px">
        <div style="background:#ffffff10;border:1px solid #ffffff15;border-radius:6px;padding:6px">
          <div style="font-size:10px;color:#888;margin-bottom:2px">Chargers</div>
          <div style="font-size:14px;font-weight:700">${s.activeChargers}<span style="font-size:10px;font-weight:400;color:#888">/${s.totalChargers}</span></div>
        </div>
        <div style="background:#ffffff10;border:1px solid #ffffff15;border-radius:6px;padding:6px">
          <div style="font-size:10px;color:#888;margin-bottom:2px">Load</div>
          <div style="font-size:14px;font-weight:700">${utilPct}<span style="font-size:10px;font-weight:400;color:#888">%</span></div>
        </div>
        <div style="background:#ffffff10;border:1px solid #ffffff15;border-radius:6px;padding:6px">
          <div style="font-size:10px;color:#888;margin-bottom:2px">Revenue 24h</div>
          <div style="font-size:13px;font-weight:700">${revenueFormatted}</div>
        </div>
        <div style="background:#ffffff10;border:1px solid #ffffff15;border-radius:6px;padding:6px">
          <div style="font-size:10px;color:#888;margin-bottom:2px">Uptime</div>
          <div style="font-size:13px;font-weight:700">${s.uptime}%</div>
        </div>
      </div>
      ${s.faultChargers > 0 ? `<div style="background:#f8717120;border:1px solid #f8717140;border-radius:6px;padding:6px;font-size:11px;color:#f87171">${s.faultChargers} charger${s.faultChargers > 1 ? "s" : ""} in fault state</div>` : ""}
    </div>`;
}

export function GISMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamically load Leaflet CSS + JS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      const L = window.L;

      // Centred on India, zoom level 5 covers the full subcontinent
      const map = L.map(mapRef.current!, {
        center: [21.5, 78.9],
        zoom: 5,
        zoomControl: false,
        attributionControl: true,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      stations.forEach((s) => {
        const status = getStationStatus(s);
        const color = STATUS_COLOR[status];
        const icon = makeMarkerIcon(color.hex, color.shadow, L);

        L.marker([s.lat, s.lng], { icon })
          .addTo(map)
          .bindPopup(buildPopupHTML(s, status), {
            maxWidth: 240,
            className: "altrex-popup",
          });
      });

      mapInstanceRef.current = map;
    };
    document.head.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Re-apply tile filter when theme changes
  useEffect(() => {
    const tiles = document.querySelectorAll<HTMLElement>(".leaflet-tile");
    tiles.forEach((tile) => {
      tile.style.filter =
        theme === "dark"
          ? "invert(1) hue-rotate(180deg) brightness(0.82) saturate(0.85)"
          : "none";
    });
  }, [theme]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Station Network</h2>
          <p className="text-xs text-muted-foreground mt-0.5">India · {stations.length} stations</p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-3">
          {Object.entries(STATUS_COLOR).map(([key, val]) => (
            <div key={key} className="flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: val.hex }}
              />
              <span className="text-[10px] text-muted-foreground capitalize hidden sm:inline">{val.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map container */}
      <div className="flex-1 px-4 pb-4 min-h-0">
        <div
          ref={mapRef}
          className="w-full h-full rounded-lg overflow-hidden border border-border"
          style={{ minHeight: 240 }}
        />
      </div>

      {/* Station summary strip */}
      <div className="grid grid-cols-4 border-t border-border shrink-0">
        {[
          { icon: MapPin,        label: "Total",    value: stations.length,                                                                    color: "text-muted-foreground" },
          { icon: Zap,           label: "Healthy",  value: stations.filter(s => getStationStatus(s) === "healthy").length,                     color: "text-[oklch(0.65_0.18_145)]" },
          { icon: AlertTriangle, label: "Warning",  value: stations.filter(s => ["warning","critical"].includes(getStationStatus(s))).length,   color: "text-[oklch(0.72_0.16_75)]" },
          { icon: WifiOff,       label: "Offline",  value: stations.filter(s => getStationStatus(s) === "offline").length,                     color: "text-muted-foreground" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="flex flex-col items-center py-2.5 gap-0.5 border-r border-border last:border-r-0">
            <Icon className={cn("w-3.5 h-3.5", color)} />
            <span className={cn("text-base font-bold tabular-nums", color)}>{value}</span>
            <span className="text-[10px] text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}