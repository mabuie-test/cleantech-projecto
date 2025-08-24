// components/MapView.js
"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// NOTE: this file runs only on client (because we import it via dynamic(..., { ssr: false }))
export default function MapView({ collectors = [], orders = [], center = [-25.97, 32.57], zoom = 12 }) {
  const [mapCenter, setMapCenter] = useState(center);
  const [leafletReady, setLeafletReady] = useState(false);

  useEffect(() => {
    // fix default marker icons (client-side only)
    import('leaflet').then(L => {
      try {
        // remove existing getter to avoid issues
        delete L.Icon.Default.prototype._getIconUrl;

        L.Icon.Default.mergeOptions({
          iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
          iconUrl: require('leaflet/dist/images/marker-icon.png'),
          shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        });
      } catch (err) {
        // if require fails for images, fallback to public assets (optional)
        console.warn('Leaflet icon fix warning:', err.message || err);
      } finally {
        setLeafletReady(true);
      }
    }).catch(err => {
      console.error('Failed to load leaflet for icon fix:', err);
      setLeafletReady(true); // still allow map creation attempt
    });
  }, []);

  useEffect(() => {
    if (orders?.length) {
      setMapCenter([orders[0].lat || center[0], orders[0].lng || center[1]]);
    }
  }, [orders, center]);

  // while leaflet assets are being set, show placeholder to avoid errors
  if (!leafletReady) {
    return <div className="h-[420px] rounded-2xl overflow-hidden card flex items-center justify-center">Carregando mapa…</div>;
  }

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
