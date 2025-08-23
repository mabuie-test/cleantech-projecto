import { useEffect, useMemo, useState, useCallback } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import API from '../lib/api';
import { ensureLogged } from '../lib/auth';
import ConfirmModal from '../components/ConfirmModal';
import useSWR from 'swr';
import fetcher from '../lib/swrFetcher';
import { safeCall } from '../lib/endpointGuard';

export default function OrdersPage() {
  const [confirm, setConfirm] = useState({ open: false, action: null, orderId: null });

  const { data, mutate } = useSWR('/orders/admin', async (url) => {
    const resp = await safeCall(API.get(url), { data: [] });
    return resp.data || [];
  }, { refreshInterval: 10000 });

  useEffect(() => { ensureLogged(); }, []);

  const columns = useMemo(() => [
    { key: '_id', label: 'ID', render: r => <span className="text-xs">{r._id}</span> },
    { key: 'type', label: 'Tipo' },
    { key: 'price', label: 'Preço', render: r => `${r.price} MT` },
    { key: 'quantityKg', label: 'Kg' },
    { key: 'address', label: 'Endereço' },
    { key: 'status', label: 'Status' }
  ], []);

  const actions = (row) => (
    <div className="flex gap-2">
      <button className="btn btn-ghost" onClick={() => setConfirm({ open:true, action:'assign', orderId: row._id })}>Atribuir</button>
      <button className="btn btn-primary" onClick={() => setConfirm({ open:true, action:'complete', orderId: row._id })}>Completar</button>
    </div>
  );

  const onConfirm = useCallback(async () => {
    const { action, orderId } = confirm;
    try {
      if (action === 'assign') {
        // exige endpoint no backend: POST /orders/:id/assign { collectorId }
        await safeCall(API.post(`/orders/${orderId}/assign`, { /* collectorId */ }), { data: {} });
      } else if (action === 'complete') {
        await safeCall(API.post(`/orders/${orderId}/complete`), { data: {} });
      }
      await mutate();
    } catch (e) {
      alert(e?.response?.data?.error || e.message);
    } finally {
      setConfirm({ open: false, action: null, orderId: null });
    }
  }, [confirm, mutate]);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Pedidos</h1>
        <button className="btn btn-ghost" onClick={()=>mutate()}>Atualizar</button>
      </div>
      <DataTable columns={columns} rows={data || []} actions={actions} empty="Sem pedidos" />
      <ConfirmModal open={confirm.open} onCancel={()=>setConfirm({open:false})} onConfirm={onConfirm}
        title={confirm.action === 'assign' ? 'Atribuir pedido' : 'Marcar como concluído'}
        message={confirm.action === 'assign' ? 'Deseja atribuir este pedido a um recolhedor?' : 'Deseja marcar este pedido como concluído?'} />
    </Layout>
  );
}