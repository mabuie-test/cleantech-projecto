// pages/_app.js
import '../styles/globals.css';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // global leaflet icon fix in client only
    import('leaflet').then(L => {
      try {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
          iconUrl: require('leaflet/dist/images/marker-icon.png'),
          shadowUrl: require('leaflet/dist/images/marker-shadow.png')
        });
      } catch (e) {
        // ignore if run inside server during build (should not), or if images not found
      }
    }).catch(() => {});
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
