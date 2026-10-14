import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { authService } from '../services/auth.service';

type LayoutProps = {
  children: ReactNode;
};

const navigationItems = [
  { label: 'Dashboard', to: '/dashboard', icon: 'dashboard' },
  { label: 'Usuarios', to: '/users', icon: 'users' },
  { label: 'Reportes', to: '/reports', icon: 'reports' },
  { label: 'Mi Asistencia', to: '/assist', icon: 'assist' },
] as const;

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const session = authService.getSession();

  const fullName = session?.fullName?.trim() || 'Administrador';
  const roleLabel = session?.rol === 'ADMIN' ? 'Administrador' : 'Colaborador';
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AD';

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800 antialiased font-sans">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-screen sticky top-0">
        <div>
          <div className="p-6 pb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 01-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">QuimiControl</h1>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase block mt-1">Asistencia Industrial</span>
              </div>
            </div>
          </div>

          <nav className="px-3 space-y-1" aria-label="Navegación principal">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.to;
              const linkClassName = isActive
                ? 'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600 pl-[10px] transition-colors'
                : 'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors';
              const iconClassName = isActive ? 'w-4 h-4 text-emerald-600' : 'w-4 h-4 text-slate-400';

              return (
                <Link key={item.to} className={linkClassName} to={item.to} aria-current={isActive ? 'page' : undefined}>
                  <svg className={iconClassName} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    {item.icon === 'dashboard' && <><rect height="9" rx="1" width="7" x="3" y="3" /><rect height="5" rx="1" width="7" x="14" y="3" /><rect height="9" rx="1" width="7" x="14" y="12" /><rect height="5" rx="1" width="7" x="3" y="16" /></>}
                    {item.icon === 'users' && <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" />}
                    {item.icon === 'reports' && <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />}
                    {item.icon === 'assist' && <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />}
                  </svg>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-100 border-2 border-white shadow-sm flex items-center justify-center text-emerald-800 font-bold text-xs">
            {initials}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-semibold text-slate-800 truncate leading-snug" title={fullName}>{fullName}</p>
            <p className="text-[11px] text-slate-400 font-normal truncate">{roleLabel}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              authService.logout();
              window.location.href = '/login';
            }}
            className="text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors"
            aria-label="Cerrar sesión"
          >
            Salir
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};