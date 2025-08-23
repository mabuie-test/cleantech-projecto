import { useEffect } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import MapView from '../components/MapView';
import API from '../lib/api';
import useSWR from 'swr';
import { ensureLogged } from '../lib/auth';
import { safeCall } from '../lib/endpointGuard';

export default function CollectorsPage() {
  const { data, mutate } = useSWR('/collectors', async (url) => {
    const resp = await safeCall(API.get(url), { data: [] });
    return resp.data || [];
  }, { refreshInterval: 15000 });

  useEffect(() => { ensureLogged(); }, []);

  const cols = [
    { key: 'name', label: 'Nome' },
    { key: 'phone', label: 'Telefone' },
    { key: 'rating', label: 'Rating' }
  ];

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MapView collectors={data || []} orders={[]} />
        <div>
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-semibold">Recolhedores</h1>
            <button className="btn btn-ghost" onClick={()=>mutate()}>Atualizar</button>
          </div>
          <DataTable columns={cols} rows={data || []} empty="Sem recolhedores" />
        </div>
      </div>
    </Layout>
  );
}