import { useEffect } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import API from '../lib/api';
import useSWR from 'swr';
import { ensureLogged } from '../lib/auth';
import { safeCall } from '../lib/endpointGuard';

export default function UsersPage() {
  const { data, mutate } = useSWR('/users', async (url) => {
    const resp = await safeCall(API.get(url), { data: [] });
    return resp.data || [];
  });

  useEffect(() => { ensureLogged(); }, []);

  const cols = [
    { key: 'name', label: 'Nome' },
    { key: 'phone', label: 'Telefone' },
    { key: 'role', label: 'Perfil' },
    { key: 'rating', label: 'Rating' },
  ];

  return (
    <Layout>
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-semibold">Usuários</h1>
        <button className="btn btn-ghost" onClick={()=>mutate()}>Atualizar</button>
      </div>
      <DataTable columns={cols} rows={data || []} empty="Sem usuários" />
      <p className="text-xs text-gray-500 mt-3">Se o endpoint <code>/users</code> não existir, esta lista fica vazia até expores no backend.</p>
    </Layout>
  );
}