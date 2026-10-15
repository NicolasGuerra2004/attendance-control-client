import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApiErrorMessage } from '../api/axiosConfig';
import { authService } from '../services/auth.service';
import { attendanceService, type WeeklyHistoryDTO } from '../services/attendance.service';

const formatDate = (value: string): string => {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  }).format(date);
};

const formatTime = (value: string | null | undefined): string => {
  if (!value) return '--:--';
  const match = value.match(/^(\d{2}):(\d{2})/);
  if (match) return `${match[1]}:${match[2]}`;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const getStatusBadge = (status: string) => {
  switch (status?.toUpperCase().trim()) {
    case 'PRESENTE':
      return {
        label: 'Presente',
        classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };
    case 'ATRASADO':
      return {
        label: 'Atrasado',
        classes: 'bg-amber-50 text-amber-700 border-amber-200',
      };
    case 'SALIDA_ANTICIPADA':
      return {
        label: 'Salida Anticipada',
        classes: 'bg-orange-50 text-orange-700 border-orange-200',
      };
    case 'AUSENTE':
    case 'INASISTENTE':
    default:
      return {
        label: 'Ausente',
        classes: 'bg-rose-50 text-rose-700 border-rose-200',
      };
  }
};

const getToday = (): string => new Date().toISOString().slice(0, 10);

export const Assist = () => {
  const session = authService.getSession();
  const isAdmin = authService.isAdmin();
  const [time, setTime] = useState('');
  const [history, setHistory] = useState<WeeklyHistoryDTO[]>([]);
  const [attendanceState, setAttendanceState] = useState<'not-started' | 'checked-in' | 'completed'>('not-started');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchAttendance = async (): Promise<[WeeklyHistoryDTO[], boolean]> => {
    return Promise.all([
      attendanceService.getMyWeeklyHistory(),
      attendanceService.hasCheckedInToday(),
    ]);
  };

  const loadAttendance = async () => {
    try {
      const [weeklyHistory, currentStatus] = await fetchAttendance();
      setHistory(weeklyHistory);
      const todayRecord = weeklyHistory.find((record) => record.date.startsWith(getToday()));
      setAttendanceState(todayRecord?.departureTime ? 'completed' : currentStatus ? 'checked-in' : 'not-started');
      setError('');
    } catch {
      setError('No se pudo cargar tu historial de asistencia.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const updateTime = () => {
      const now = new Date();
      setTime([now.getHours(), now.getMinutes(), now.getSeconds()]
        .map((value) => String(value).padStart(2, '0'))
        .join(':'));
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    const loadInitialAttendance = async () => {
      try {
        const [weeklyHistory, currentStatus] = await fetchAttendance();
        if (!isMounted) return;
        setHistory(weeklyHistory);
        const todayRecord = weeklyHistory.find((record) => record.date.startsWith(getToday()));
        setAttendanceState(todayRecord?.departureTime ? 'completed' : currentStatus ? 'checked-in' : 'not-started');
      } catch {
        if (isMounted) {
          setError('No se pudo cargar tu historial de asistencia.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadInitialAttendance();

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const handleAttendance = async (action: 'checkIn' | 'checkOut') => {
    if (
      isLoading ||
      isSubmitting ||
      (action === 'checkIn' && attendanceState !== 'not-started') ||
      (action === 'checkOut' && attendanceState !== 'checked-in')
    ) {
      return;
    }

    setIsSubmitting(true);
    setMessage('');
    setError('');

    try {
      if (action === 'checkIn') {
        await attendanceService.checkIn();
        setMessage('¡Entrada registrada correctamente!');
      } else {
        await attendanceService.checkOut();
        setMessage('¡Salida registrada correctamente!');
      }
      await loadAttendance();
      if (action === 'checkOut') {
        setAttendanceState('completed');
      }
    } catch (err) {
      setError(getApiErrorMessage(
        err,
        action === 'checkIn'
          ? 'No se pudo registrar la entrada. Intenta de nuevo.'
          : 'No se pudo registrar la salida. Intenta de nuevo.',
      ));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  const initials = (session?.fullName || 'T')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-700 antialiased bg-[#f8fafc]">
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-700/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M10 2v7.31M14 9.3V2M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0M5.52 16h12.96" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 text-lg leading-tight tracking-tight">QuimiControl</span>
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Gestión &amp; Asistencia</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Panel Admin</span>
              </Link>
            )}
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800 leading-none">{session?.fullName ?? 'Colaborador'}</p>
              <p className="text-xs text-slate-500 mt-1 leading-none">{session?.email ?? ''}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-100 border-2 border-white shadow-sm flex items-center justify-center text-emerald-800 font-bold text-xs">
              {initials}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-rose-600 transition-colors"
              aria-label="Cerrar sesión"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-stretch">
          <section className="lg:col-span-5 flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 sm:p-10">
            <div className="text-center">
              <span className="inline-block text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                Registro diario
              </span>
              <h2 className="text-base sm:text-lg font-medium text-slate-600 mt-1 capitalize">
                {new Intl.DateTimeFormat('es-CL', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}
              </h2>
              <div className="my-8 sm:my-10">
                <span className="text-5xl sm:text-6xl font-extrabold text-slate-800 tracking-tight font-mono">
                  {time}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3.5">
                <button
                  onClick={() => void handleAttendance('checkIn')}
                  disabled={isLoading || isSubmitting || attendanceState !== 'not-started'}
                  className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm shadow-sm transition-all"
                  type="button"
                >
                  {isSubmitting && attendanceState === 'not-started' ? 'Procesando...' : 'Marcar Entrada'}
                </button>
                <button
                  onClick={() => void handleAttendance('checkOut')}
                  disabled={isLoading || isSubmitting || attendanceState !== 'checked-in'}
                  className="px-4 py-3 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm shadow-sm transition-all"
                  type="button"
                >
                  {isSubmitting && attendanceState === 'checked-in' ? 'Procesando...' : 'Marcar Salida'}
                </button>
              </div>

              {message && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-center text-emerald-800 text-xs sm:text-sm font-medium" role="status">
                  {message}
                </div>
              )}
              {error && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-center text-rose-700 text-xs sm:text-sm font-medium" role="alert">
                  {error}
                </div>
              )}
              {!message && !error && attendanceState === 'checked-in' && (
                <div className="rounded-xl bg-emerald-50/80 border border-emerald-200/70 p-3.5 text-center text-emerald-800 text-xs sm:text-sm font-medium">
                  ✓ Entrada registrada hoy. Recuerda marcar tu salida al finalizar.
                </div>
              )}
              {!message && !error && attendanceState === 'completed' && (
                <div className="rounded-xl bg-slate-100 border border-slate-200 p-3.5 text-center text-slate-700 text-xs sm:text-sm font-medium">
                  ✓ Jornada completada para hoy. Podrás registrar nuevamente mañana.
                </div>
              )}
            </div>
          </section>

          <section className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-5">
                Historial reciente <span className="text-slate-400 font-normal text-sm">(Últimos 7 días)</span>
              </h3>
              {isLoading ? (
                <p className="text-sm text-slate-500 py-6">Cargando historial...</p>
              ) : history.length === 0 ? (
                <p className="text-sm text-slate-500 py-6">Todavía no tienes registros recientes.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200/70 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                        <th className="pb-3 pl-1">Fecha</th>
                        <th className="pb-3 text-center">Hora Entrada</th>
                        <th className="pb-3 text-center">Hora Salida</th>
                        <th className="pb-3 text-right">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {history.map((record) => {
                        const badge = getStatusBadge(record.status);
                        return (
                          <tr key={record.date} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3.5 pl-1 font-medium text-slate-800 whitespace-nowrap capitalize">
                              {formatDate(record.date)}
                            </td>
                            <td className="py-3.5 text-center font-mono text-slate-600">
                              {formatTime(record.entryTime)}
                            </td>
                            <td className="py-3.5 text-center font-mono text-slate-600">
                              {formatTime(record.departureTime)}
                            </td>
                            <td className="py-3.5 text-right">
                              <span
                                className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.classes}`}
                              >
                                {badge.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-2">
              <span>Horario laboral oficial: 09:30 - 17:30</span>
              <span>Límite de entrada: 09:30:00 (luego aplica atraso)</span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
