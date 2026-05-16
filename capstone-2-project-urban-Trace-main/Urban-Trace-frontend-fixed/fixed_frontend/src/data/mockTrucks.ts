import type { Truck } from "../types/truck";

export const mockTrucks: Truck[] = [
  {
    id: "TRK-07",
    driver: "Ravi Kumar",
    status: "collecting",
    lat: 28.6162,
    lng: 77.2082,
    zone: "Ward A"
  },
  {
    id: "TRK-12",
    driver: "Anita Das",
    status: "en-route",
    lat: 28.6117,
    lng: 77.2143,
    zone: "Ward B"
  },
  {
    id: "TRK-18",
    driver: "Farhan Ali",
    status: "idle",
    lat: 28.6196,
    lng: 77.2027,
    zone: "Ward C"
  }
];
