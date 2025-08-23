import { useEffect } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import API from '../lib/api';
import useSWR from 'swr';
import { ensureLogged } from '../lib/auth';
import { safeCall } from '../lib/endpointGuard';

export default function ReportsPage() {
  const { data, mutate } = useSWR('/reports', async (url) => {
    // Ex.: GET /reports (denúncias) -> [{_id, type, byUser, againstUser, text, createdAt, status}]
    const resp = await safeCall(API.get(url), { data: [] });
    return resp.data || [];
  });

  useEffect(() => { ensureLogged(); }, []);

  const cols = [
    { key: 'type', label: 'Tipo' },
    { key: 'byUser', label: 'Por' },
    { key: 'againstUser', label: 'Contra' },
    { key: 'text', label: 'Descrição' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Data', render: r => new Date(r.createdAt).toLocaleString() },
  ];

  return (
    <Layout>
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-semibold">Denúncias</h1>
        <button className="btn btn-ghost" onClick={()=>mutate()}>Atualizar</button>
      </div>
      <DataTable columns={cols} rows={data || []} empty="Sem denúncias" />
      <p className="text-xs text-gray-500 mt-3">Cria no backend o endpoint <code>GET /reports</code> quando quiseres ativar esta página.</p>
    </Layout>
  );
}