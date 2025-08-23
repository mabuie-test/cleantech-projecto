import { useState } from 'react';
import API from '../lib/api';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { phone, password });
      localStorage.setItem('ct_token', data.token);
      window.location.href = '/dashboard';
    } catch (e) {
      alert(e?.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="card p-8 w-full max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <img src="/logo.svg" className="w-8 h-8" alt="logo"/>
          <h1 className="text-2xl font-bold text-primary">CleanTech Dashboard</h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Telemóvel</label>
            <input className="mt-1 w-full border rounded-xl px-3 py-2" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+25884..." />
          </div>
          <div>
            <label className="text-sm text-gray-600">Senha</label>
            <input type="password" className="mt-1 w-full border rounded-xl px-3 py-2" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <button disabled={loading} className="btn btn-primary w-full">{loading?'Entrando...':'Entrar'}</button>
        </form>
      </div>
    </div>
  );
}