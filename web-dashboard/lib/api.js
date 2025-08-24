// lib/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://cleantech-projecto.onrender.com/api',
  withCredentials: false, // true só se precisares enviar cookies
  timeout: 10000,
});

API.interceptors.request.use(cfg => {
  const token = typeof window !== 'undefined' && localStorage.getItem('ct_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
}, err => Promise.reject(err));

export default API;
