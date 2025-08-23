export default function ConfirmModal({ open, title='Confirmar', message='Tens a certeza?', onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-soft">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-700">{message}</p>
        <div className="flex justify-end gap-2 mt-6">
          <button className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
          <button className="btn btn-primary" onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}