import { useState, useCallback } from 'react';

export default function useToast() {
  const [toast, setToast] = useState({ show: false, title: '', message: '' });
  const show = useCallback((title, message) => setToast({ show: true, title, message }), []);
  const hide = useCallback(() => setToast(t => ({ ...t, show: false })), []);
  return { toast, show, hide };
}