import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import type { Issue } from "../../types/issue";
import type { Truck } from "../../types/fleet";

type LatLngPick = {
  lat: number;
  lng: number;
};

type IssueMapProps = {
  title: string;
  subtitle: string;
  issues: Issue[];
  trucks?: Truck[];
  selectedLocation?: LatLngPick | null;
  selectable?: boolean;
  onMapClick?: (point: LatLngPick) => void;
  fullBleed?: boolean;
};

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function truckColor(status: Truck["status"]): string {
  if (status === "collecting") return "#16a34a";
  if (status === "en_route") return "#f59e0b";
  return "#6b7280";
}

// FIX: Backend latitude/longitude aur legacy lat/lng dono support karo
function getIssueLat(issue: Issue): number {
  return issue.latitude ?? issue.lat ?? 0;
}
function getIssueLng(issue: Issue): number {
  return issue.longitude ?? issue.lng ?? 0;
}

export function IssueMap({
  title,
  subtitle,
  issues,
  trucks = [],
  selectedLocation,
  selectable = false,
  onMapClick,
  fullBleed = false,
}: IssueMapProps): JSX.Element {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const issueLayerRef = useRef<L.LayerGroup | null>(null);
  const truckLayerRef = useRef<L.LayerGroup | null>(null);
  const pickMarkerRef = useRef<L.Marker | null>(null);
  const didAutoFitRef = useRef(false);

  // FIX: latitude/longitude use karo
  const boundsPoints = useMemo(
    () => [
      ...issues.map((i) => [getIssueLat(i), getIssueLng(i)] as [number, number]),
      ...trucks.map((t) => [t.lat, t.lng] as [number, number]),
    ],
    [issues, trucks]
  );

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, { zoomControl: true, scrollWheelZoom: false }).setView([28.6139, 77.209], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const issueLayer = L.layerGroup().addTo(map);
    const truckLayer = L.layerGroup().addTo(map);

    if (selectable && onMapClick) {
      map.on("click", (event: L.LeafletMouseEvent) => {
        onMapClick({ lat: event.latlng.lat, lng: event.latlng.lng });
      });
    }

    mapRef.current = map;
    issueLayerRef.current = issueLayer;
    truckLayerRef.current = truckLayer;

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(() => { map.invalidateSize({ animate: false }); });
    });
    ro.observe(mapContainerRef.current!);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      issueLayerRef.current = null;
      truckLayerRef.current = null;
      pickMarkerRef.current = null;
    };
  }, [onMapClick, selectable]);

  useEffect(() => {
    if (!mapRef.current || !issueLayerRef.current) return;

    issueLayerRef.current.clearLayers();
    issues.forEach((issue) => {
      const issueLat = getIssueLat(issue);
      const issueLng = getIssueLng(issue);

      // Invalid coordinates skip karo
      if (!issueLat || !issueLng) return;

      let color = "#2563eb";
      if (issue.status === "open" || issue.status === "pending") color = "#dc2626";
      else if (issue.status === "in_progress") color = "#f59e0b";
      else if (issue.status === "resolved") color = "#16a34a";
      else if (issue.status === "assigned") color = "#4b5563";

      const issueIcon = L.divIcon({
        className: "custom-issue-marker",
        html: `<div style="display:flex;align-items:center;justify-content:center;color:${color};filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));transform:translate(0,-8px)"><svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="white" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="white"/></svg></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      const marker = L.marker([issueLat, issueLng], { icon: issueIcon });
      // FIX: locationLabel optional hai, fallback description use karo
      const label = issue.locationLabel || issue.description?.slice(0, 60) || "";
      marker.bindPopup(
        `<strong>${issue.title}</strong><br/>${issue.category} · ${issue.status}${label ? `<br/>${label}` : ""}`
      );
      marker.addTo(issueLayerRef.current!);
    });
  }, [issues]);

  useEffect(() => {
    if (!mapRef.current || !truckLayerRef.current) return;

    truckLayerRef.current.clearLayers();
    trucks.forEach((truck) => {
      const color = truckColor(truck.status);
      const truckIcon = L.divIcon({
        className: "custom-truck-marker",
        html: `<div style="display:flex;align-items:center;justify-content:center;background:${color};color:white;width:28px;height:28px;border-radius:6px;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z"/></svg></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([truck.lat, truck.lng], { icon: truckIcon });
      marker.bindTooltip(`${truck.label} · ${truck.zone} · ${truck.status.replace("_", " ")}`, { direction: "top", offset: [0, -14] });
      marker.addTo(truckLayerRef.current!);
    });
  }, [trucks]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (pickMarkerRef.current) {
      pickMarkerRef.current.remove();
      pickMarkerRef.current = null;
    }

    if (selectedLocation) {
      const pickIcon = L.divIcon({
        className: "custom-pick-marker",
        html: `<div style="color:#dc2626;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.3));transform:translate(-50%,-100%);display:flex;align-items:center;justify-content:center"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      pickMarkerRef.current = L.marker([selectedLocation.lat, selectedLocation.lng], { icon: pickIcon }).addTo(mapRef.current);
      pickMarkerRef.current.bindPopup("Selected report location").openPopup();
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (!mapRef.current || didAutoFitRef.current || boundsPoints.length === 0) return;
    const validPoints = boundsPoints.filter(([lat, lng]) => lat !== 0 && lng !== 0);
    if (validPoints.length === 0) return;
    const bounds = L.latLngBounds(validPoints);
    mapRef.current.fitBounds(bounds.pad(0.2));
    didAutoFitRef.current = true;
  }, [boundsPoints]);

  if (fullBleed) {
    return <div ref={mapContainerRef} style={{ width: "100%", height: "100%", minHeight: "280px", zIndex: 0 }} />;
  }

  return (
    <section className="card" style={{ height: "100%", display: "flex", flexDirection: "column", border: "1px solid rgba(0,0,0,0.04)" }}>
      <h3 style={{ marginBottom: "0.4rem", fontSize: "1.4rem" }}>{title}</h3>
      <p style={{ marginBottom: "1.5rem" }}>{subtitle}</p>
      <div className="map-live-box" ref={mapContainerRef} style={{ flex: 1, minHeight: "400px", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "16px" }} />
      {selectable && <p className="map-help-text">Tip: click anywhere on the map to prefill report coordinates.</p>}
    </section>
  );
}
