export default function Toast({ show, title = 'Info', message = '', onClose }) {
  if (!show) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white border shadow-soft rounded-xl p-4 min-w-[260px]">
        <div className="font-semibold mb-1">{title}</div>
        <div className="text-sm text-gray-700">{message}</div>
        <div className="text-right mt-3">
          <button className="btn btn-primary" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
}