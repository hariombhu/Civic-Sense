export type Truck = {
  id: string;
  driver: string;
  status: "collecting" | "en-route" | "idle";
  lat: number;
  lng: number;
  zone: string;
};
