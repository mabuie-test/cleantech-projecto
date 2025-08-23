import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { ensureLogged } from '../lib/auth';

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState(process.env.NEXT_PUBLIC_API_URL || '');
  const [socketUrl, setSocketUrl] = useState(process.env.NEXT_PUBLIC_SOCKET_URL || '');

  useEffect(()=>{ ensureLogged(); }, []);

  return (
    <Layout>
      <h1 className="text-xl font-semibold mb-4">Configurações</h1>
      <div className="card p-4 max-w-xl space-y-4">
        <div>
          <label className="text-sm text-gray-600">API URL</label>
          <input className="w-full border rounded-xl px-3 py-2 mt-1" value={apiUrl} onChange={e=>setApiUrl(e.target.value)} readOnly />
          <p className="text-xs text-gray-500 mt-1">Definido em <code>.env.local</code> (NEXT_PUBLIC_API_URL)</p>
        </div>
        <div>
          <label className="text-sm text-gray-600">Socket URL</label>
          <input className="w-full border rounded-xl px-3 py-2 mt-1" value={socketUrl} onChange={e=>setSocketUrl(e.target.value)} readOnly />
          <p className="text-xs text-gray-500 mt-1">Definido em <code>.env.local</code> (NEXT_PUBLIC_SOCKET_URL)</p>
        </div>
      </div>
    </Layout>
  );
}