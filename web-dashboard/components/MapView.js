// components/MapView.js
"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapView({ collectors = [], orders = [], center = [-25.97, 32.57], zoom = 12 }) {
  const [mapCenter, setMapCenter] = useState(center);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Correção dos ícones do Leaflet (somente no cliente)
    import('leaflet').then(L => {
      try {
        // remove getter antigo (evita warnings)
        delete L.Icon.Default.prototype._getIconUrl;

        // Tenta resolver imagens via require (funciona quando o componente é client-only)
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
          iconUrl: require('leaflet/dist/images/marker-icon.png'),
          shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        });
      } catch (err) {
        // fallback: usa assets públicos (copie images para /public/leaflet se preferir)
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: '/leaflet/marker-icon-2x.png',
          iconUrl: '/leaflet/marker-icon.png',
          shadowUrl: '/leaflet/marker-shadow.png',
        });
      } finally {
        setReady(true);
      }
    }).catch(err => {
      console.error('Erro ao carregar leaflet dinamicamente:', err);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (orders?.length) {
      setMapCenter([orders[0].lat ?? center[0], orders[0].lng ?? center[1]]);
    }
  }, [orders, center]);

  if (!ready) {
    return (
      <div className="h-[420px] rounded-2xl overflow-hidden card flex items-center justify-center">
        Carregando mapa…
      </div>
    );
  }

  return (
    <div className="h-[420px] rounded-2xl overflow-hidden card">
      <MapContainer center={mapCenter} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {(collectors || []).map(c => (
          <Marker key={`col-${c._id}`} position={[c.lat ?? 0, c.lng ?? 0]}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{c.name}</div>
                <div>{c.phone}</div>
                <div>Rating: {c.rating ?? 0}</div>
                <div className="text-xs text-gray-500">Collector</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {(orders || []).map(o => (
          <Marker key={`ord-${o._id ?? o.id}`} position={[o.lat ?? 0, o.lng ?? 0]}>
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
