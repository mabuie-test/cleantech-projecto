import { useEffect } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import API from '../lib/api';
import useSWR from 'swr';
import { ensureLogged } from '../lib/auth';
import { safeCall } from '../lib/endpointGuard';

export default function PaymentsPage() {
  const { data, mutate } = useSWR('/payments', async (url) => {
    // recomenda-se expor GET /payments que retorne transações
    const resp = await safeCall(API.get(url), { data: [] });
    return resp.data || [];
  }, { refreshInterval: 12000 });

  useEffect(() => { ensureLogged(); }, []);

  const cols = [
    { key: '_id', label: 'ID', render: r => <span className="text-xs">{r._id}</span> },
    { key: 'orderId', label: 'Pedido', render: r => r.orderId || '-' },
    { key: 'amount', label: 'Valor', render: r => `${r.amount} MT` },
    { key: 'phone', label: 'Telefone' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Criado', render: r => new Date(r.createdAt).toLocaleString() }
  ];

  return (
    <Layout>
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-semibold">Pagamentos</h1>
        <button className="btn btn-ghost" onClick={()=>mutate()}>Atualizar</button>
      </div>
      <DataTable columns={cols} rows={data || []} empty="Sem transações" />
      <p className="text-xs text-gray-500 mt-3">Se o endpoint <code>/payments</code> não existir, a tabela permanece vazia (compat mode).</p>
    </Layout>
  );
}