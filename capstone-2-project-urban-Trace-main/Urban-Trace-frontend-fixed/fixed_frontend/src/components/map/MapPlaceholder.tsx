type MapPlaceholderProps = {
  title: string;
  subtitle: string;
};

export function MapPlaceholder({ title, subtitle }: MapPlaceholderProps): JSX.Element {
  return (
    <section className="card map-placeholder">
      <h3>{title}</h3>
      <p>{subtitle}</p>
      <div className="map-box">Map integration slot (Leaflet / Google Maps)</div>
    </section>
  );
}
