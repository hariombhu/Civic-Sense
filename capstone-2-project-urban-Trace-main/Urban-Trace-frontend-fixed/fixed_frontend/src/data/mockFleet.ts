import type { Truck } from "../types/fleet";

export const mockGarbageTrucks: Truck[] = [
  { id: "GT-21", label: "Truck 21", lat: 28.6153, lng: 77.2107, status: "collecting", zone: "Zone A" },
  { id: "GT-34", label: "Truck 34", lat: 28.6112, lng: 77.2176, status: "en_route",   zone: "Zone B" },
  { id: "GT-09", label: "Truck 09", lat: 28.6198, lng: 77.2054, status: "idle",       zone: "Zone C" },
  { id: "GT-17", label: "Truck 17", lat: 28.6141, lng: 77.2088, status: "collecting", zone: "Zone A" },
  { id: "GT-42", label: "Truck 42", lat: 28.6175, lng: 77.2140, status: "en_route",   zone: "Zone D" },
  { id: "GT-05", label: "Truck 05", lat: 28.6120, lng: 77.2060, status: "idle",       zone: "Zone B" },
];
