import { useEffect, useState, useCallback } from 'react';
import Layout from '../components/Layout';
import MapView from '../components/MapView';
import API from '../lib/api';
import { initSocket } from '../lib/socket';
import { ensureLogged } from '../lib/auth';
import { safeCall } from '../lib/endpointGuard';

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [collectors, setCollectors] = useState([]);

  const fetchData = useCallback(async () => {
    const o = await safeCall(API.get('/orders/admin'), { data: [] });  // se não existir, retorna vazio
    const c = await safeCall(API.get('/collectors'), { data: [] });
    setOrders(o.data || []);
    setCollectors(c.data || []);
  }, []);

  useEffect(() => {
    if (!ensureLogged()) return;
    fetchData();
    const s = initSocket();
    s.on('new_order', (ev) => setOrders(prev => [ev.order, ...prev]));
    s.on('payment_confirmed', () => fetchData());
    s.on('order_update', (ev) => setOrders(prev => prev.map(x => x._id === ev.order._id ? ev.order : x)));
    return () => { try { s.off('new_order'); s.off('payment_confirmed'); s.off('order_update'); } catch(_){} };
  }, [fetchData]);

  const total = orders.length;
  const pending = orders.filter(o => o.status === 'pending').length;
  const inProgress = orders.filter(o => o.status === 'in_progress').length;

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card p-4">
          <div className="text-sm text-gray-500">Pedidos</div>
          <div className="text-2xl font-semibold">{total}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-500">Pendentes</div>
          <div className="text-2xl font-semibold">{pending}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-500">Em progresso</div>
          <div className="text-2xl font-semibold">{inProgress}</div>
        </div>
      </div>

      <MapView collectors={collectors} orders={orders} />
    </Layout>
  );
}