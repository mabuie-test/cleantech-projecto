export function safeCall(promise, fallback = []) {
  return promise.then(r => r).catch(err => {
    const status = err?.response?.status;
    if (status === 404 || status === 501) {
      console.warn('Endpoint não disponível:', err?.config?.url);
      return { data: fallback, _endpointMissing: true };
    }
    throw err;
  });
}