import { logout } from '../lib/auth';

export default function Topbar() {
  return (
    <div className="w-full h-16 bg-white border-b flex items-center justify-between px-5">
      <div className="flex items-center gap-3">
        <img src="/logo.svg" alt="logo" className="w-7 h-7" />
        <span className="font-semibold text-primary">CleanTech Admin</span>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={logout} className="btn btn-ghost">Sair</button>
      </div>
    </div>
  );
}