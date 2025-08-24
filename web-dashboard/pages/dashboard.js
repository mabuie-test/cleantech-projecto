// pages/dashboard.js
import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import API from '../lib/api';
import { initSocket } from '../lib/socket';
import { ensureLogged } from '../lib/auth';
import { safeCall } from '../lib/endpointGuard';

// Carrega MapView apenas no client (evita erro "window is not defined")
const MapView = dynamic(() => import('../components/MapView'), { ssr: false });

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [collectors, setCollectors] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const o = await safeCall(API.get('/orders/admin'), { data: [] });
      const c = await safeCall(API.get('/collectors'), { data: [] });
      setOrders(o.data || []);
      setCollectors(c.data || []);
    } catch (err) {
      console.error('Erro ao buscar dados do dashboard:', err);
    }
  }, []);

  useEffect(() => {
    if (!ensureLogged()) return;
    fetchData();

    const s = initSocket();
    // handlers definidos separadamente para poder removê-los depois
    const onNewOrder = (ev) => setOrders(prev => [ev.order, ...prev]);
    const onPaymentConfirmed = () => fetchData();
    const onOrderUpdate = (ev) => setOrders(prev => prev.map(x => x._id === ev.order._id ? ev.order : x));

    s.on('connect', () => console.log('socket connected:', s.id));
    s.on('new_order', onNewOrder);
    s.on('payment_confirmed', onPaymentConfirmed);
    s.on('order_update', onOrderUpdate);

    return () => {
      try {
        s.off('connect');
        s.off('new_order', onNewOrder);
        s.off('payment_confirmed', onPaymentConfirmed);
        s.off('order_update', onOrderUpdate);
        // não desconectar socket global se for usado por outras páginas; se quiseres desconectar:
        // s.disconnect();
      } catch (e) {
        console.warn('Erro ao remover listeners do socket:', e);
      }
    };
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

      {/* MapView só roda no client */}
      <MapView collectors={collectors} orders={orders} />
    </Layout>
  );
      }
