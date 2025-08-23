import '../styles/globals.css';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

export default function MyApp({ Component, pageProps }) {
  // Leaflet icon fix
  useEffect(() => {
    import('leaflet').then(L => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png')
      });
    });
  }, []);
  return <Component {...pageProps} />;
}