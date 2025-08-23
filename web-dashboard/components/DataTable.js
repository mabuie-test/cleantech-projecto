export default function DataTable({ columns = [], rows = [], empty = 'Sem dados', actions }) {
  return (
    <div className="card p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              {columns.map(c => <th key={c.key} className="py-2 pr-4">{c.label}</th>)}
              {actions && <th className="py-2">Ações</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={r._id || idx} className="border-b last:border-b-0">
                {columns.map(c => (
                  <td key={c.key} className="py-2 pr-4">{typeof c.render === 'function' ? c.render(r) : r[c.key]}</td>
                ))}
                {actions && <td className="py-2">{actions(r)}</td>}
              </tr>
            ))}
            {!rows.length && (
              <tr><td className="py-6 text-center text-gray-500" colSpan={columns.length + (actions ? 1 : 0)}>{empty}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}