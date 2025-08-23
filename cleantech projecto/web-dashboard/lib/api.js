import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' }
});

API.interceptors.request.use(cfg => {
  if (typeof window !== 'undefined') {
    const t = localStorage.getItem('ct_token');
    if (t) cfg.headers['Authorization'] = `Bearer ${t}`;
  }
  return cfg;
});

export default API;