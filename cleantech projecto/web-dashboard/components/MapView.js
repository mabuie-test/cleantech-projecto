import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';

export default function MapView({ collectors = [], orders = [], center = [-25.97, 32.57], zoom = 12 }) {
  const [mapCenter, setMapCenter] = useState(center);

  useEffect(() => {
    if (orders?.length) {
      setMapCenter([orders[0].lat || center[0], orders[0].lng || center[1]]);
    }
  }, [orders]);

  return (
    <div className="h-[420px] rounded-2xl overflow-hidden card">
      <MapContainer center={mapCenter} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {(collectors || []).map(c => (
          <Marker key={`col-${c._id}`} position={[c.lat || 0, c.lng || 0]}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{c.name}</div>
                <div>{c.phone}</div>
                <div>Rating: {c.rating || 0}</div>
                <div className="text-xs text-gray-500">Collector</div>
              </div>
            </Popup>
          </Marker>
        ))}
        {(orders || []).map(o => (
          <Marker key={`ord-${o._id || o.id}`} position={[o.lat || 0, o.lng || 0]}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{o.type} — {o.price} MT</div>
                <div>{o.address}</div>
                <div>qty: {o.quantityKg} kg</div>
                <div className="text-xs text-gray-500">status: {o.status}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}