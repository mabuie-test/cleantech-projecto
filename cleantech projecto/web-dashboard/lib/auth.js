export function requireAuth(ctx) {
  // simple SSR guard (optional). For CSR only, we check in pages.
  return { props: {} };
}

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ct_token');
}

export function ensureLogged() {
  const t = getToken();
  if (!t) { window.location.href = '/'; return false; }
  return true;
}

export function logout() {
  localStorage.removeItem('ct_token');
  window.location.href = '/';
}