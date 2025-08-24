// pages/collectors.js
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import API from '../lib/api';
import useSWR from 'swr';
import { ensureLogged } from '../lib/auth';
import { safeCall } from '../lib/endpointGuard';

// Importa o MapView de forma dinâmica para rodar apenas no client
const MapView = dynamic(() => import('../components/MapView'), {
  ssr: false,
});

export default function CollectorsPage() {
  const { data, mutate } = useSWR(
    '/collectors',
    async (url) => {
      const resp = await safeCall(API.get(url), { data: [] });
      return resp.data || [];
    },
    { refreshInterval: 15000 }
  );

  useEffect(() => {
    ensureLogged();
  }, []);

  const cols = [
    { key: 'name', label: 'Nome' },
    { key: 'phone', label: 'Telefone' },
    { key: 'rating', label: 'Rating' },
  ];

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MapView collectors={data || []} orders={[]} />
        <div>
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-semibold">Recolhedores</h1>
            <button className="btn btn-ghost" onClick={() => mutate()}>
              Atualizar
            </button>
          </div>
          <DataTable columns={cols} rows={data || []} empty="Sem recolhedores" />
        </div>
      </div>
    </Layout>
  );
}
