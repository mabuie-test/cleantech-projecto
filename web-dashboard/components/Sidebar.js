import Link from 'next/link';
import { useRouter } from 'next/router';

const items = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/orders', label: 'Pedidos' },
  { href: '/collectors', label: 'Recolhedores' },
  { href: '/users', label: 'Usuários' },
  { href: '/payments', label: 'Pagamentos' },
  { href: '/reports', label: 'Denúncias' },
  { href: '/settings', label: 'Configurações' }
];

export default function Sidebar() {
  const { pathname } = useRouter();
  return (
    <aside className="w-64 bg-white border-r min-h-[calc(100vh-4rem)]">
      <nav className="p-4">
        <ul className="space-y-1">
          {items.map(it => (
            <li key={it.href}>
              <Link href={it.href}>
                <a className={`block px-3 py-2 rounded-xl ${pathname === it.href ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>
                  {it.label}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}