export type Truck = {
  id: string;
  label: string;
  lat: number;
  lng: number;
  status: "collecting" | "en_route" | "idle";
  zone: string;
};
