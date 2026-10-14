import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import {
  attendanceService,
  type DailyRecordDTO,
  type DashboardMetricsDTO,
} from '../services/attendance.service';

const formatTime = (value: string | null | undefined): string => {
  if (!value) return '--:--';
  const match = value.match(/^(\d{2}):(\d{2})/);
  return match ? `${match[1]}:${match[2]}` : value;
};

const getStatusBadge = (status: string) => {
  const normalized = status.toUpperCase().trim();
  switch (normalized) {
    case 'PRESENTE':
      return {
        label: 'Presente',
        classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
      };
    case 'ATRASADO':
      return {
        label: 'Atrasado',
        classes: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'SALIDA_ANTICIPADA':
      return {
        label: 'Salida Anticipada',
        classes: 'bg-orange-50 text-orange-700 border-orange-200',
        dot: 'bg-orange-500',
      };
    case 'INASISTENTE':
    case 'AUSENTE':
    default:
      return {
        label: 'Inasistente',
        classes: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
      };
  }
};

export const Dashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetricsDTO | null>(null);
  const [todayRecords, setTodayRecords] = useState<DailyRecordDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    setError('');

    const [metricsResult, recordsResult] = await Promise.allSettled([
      attendanceService.getDashboardMetrics(),
      attendanceService.getTodayRecords(),
    ]);

    if (metricsResult.status === 'fulfilled') {
      setMetrics(metricsResult.value);
    } else {
      setMetrics(null);
      setError('No se pudieron cargar las métricas en tiempo real.');
    }

    if (recordsResult.status === 'fulfilled') {
      setTodayRecords(recordsResult.value);
    } else {
      setTodayRecords([]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchInitialData = async () => {
      const [metricsResult, recordsResult] = await Promise.allSettled([
        attendanceService.getDashboardMetrics(),
        attendanceService.getTodayRecords(),
      ]);

      if (!isMounted) return;

      if (metricsResult.status === 'fulfilled') {
        setMetrics(metricsResult.value);
      } else {
        setMetrics(null);
        setError('No se pudieron cargar las métricas en tiempo real.');
      }

      if (recordsResult.status === 'fulfilled') {
        setTodayRecords(recordsResult.value);
      } else {
        setTodayRecords([]);
      }

      setIsLoading(false);
    };

    void fetchInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  const total = metrics ? metrics.presentToday + metrics.absentToday : 0;
  const attendanceRate = total > 0 && metrics ? Math.round((metrics.presentToday / total) * 100) : 0;
  const absentRate = total > 0 && metrics ? Math.round((metrics.absentToday / total) * 100) : 0;

  const filteredRecords = todayRecords.filter((record) => {
    const matchesSearch = record.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter === 'TODOS') return true;
    if (statusFilter === 'PRESENTES') return record.status === 'PRESENTE';
    if (statusFilter === 'ATRASADOS') return record.status === 'ATRASADO';
    if (statusFilter === 'INASISTENTES') return record.status === 'INASISTENTE' || record.status === 'AUSENTE';
    return true;
  });

  return (
    <Layout>
      <div className="p-8 max-w-7xl w-full mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Panel de Control</h2>
            <p className="text-xs text-slate-500 mt-0.5">Monitoreo de asistencia y personal en tiempo real</p>
          </div>
          <div>
            <button
              onClick={() => void loadData()}
              disabled={isLoading}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 border border-slate-200 shadow-sm text-xs font-semibold rounded-lg text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-60 transition-colors"
              type="button"
            >
              <svg
                className={`w-3.5 h-3.5 text-slate-500 ${isLoading ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              <span>{isLoading ? 'Actualizando...' : 'Actualizar'}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-600">Total Empleados</span>
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                {isLoading ? '...' : total}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">Planta Completa Activa</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-600">Presentes Hoy</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
                </svg>
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                {isLoading ? '...' : metrics?.presentToday ?? 0}
              </span>
            </div>
            <p className="text-[11px] text-emerald-600 mt-1 font-semibold">{attendanceRate}% de asistencia</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-600">Atrasos Hoy</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                {isLoading ? '...' : metrics?.lateToday ?? 0}
              </span>
            </div>
            <p className="text-[11px] text-amber-600 mt-1 font-medium">Ingreso después de 09:30</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-600">Inasistencias</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                {isLoading ? '...' : metrics?.absentToday ?? 0}
              </span>
            </div>
            <p className="text-[11px] text-rose-600 mt-1 font-medium">{absentRate}% ausencias</p>
          </div>
        </div>

        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Registros de Asistencia del Día</h3>
              <p className="text-xs text-slate-400 mt-0.5">Control de entradas y salidas de la jornada actual</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium text-slate-600">
                {(['TODOS', 'PRESENTES', 'ATRASADOS', 'INASISTENTES'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setStatusFilter(filter)}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      statusFilter === filter
                        ? 'bg-white font-semibold text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {filter === 'TODOS'
                      ? 'Todos'
                      : filter === 'PRESENTES'
                      ? 'Presentes'
                      : filter === 'ATRASADOS'
                      ? 'Atrasos'
                      : 'Inasistencias'}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar colaborador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-56 text-xs rounded-lg border border-slate-200 bg-slate-50/50 py-1.5 pl-8 pr-3 outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                />
                <svg
                  className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-xs text-slate-400">Cargando registros del día...</div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-700">No se encontraron registros</p>
              <p className="text-xs text-slate-400 mt-1">
                {searchTerm
                  ? 'No hay colaboradores que coincidan con la búsqueda.'
                  : 'Aún no hay colaboradores activos registrados para hoy.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    <th className="py-3 px-6">Colaborador</th>
                    <th className="py-3 px-6 text-center">Hora Entrada</th>
                    <th className="py-3 px-6 text-center">Hora Salida</th>
                    <th className="py-3 px-6 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {filteredRecords.map((record) => {
                    const badge = getStatusBadge(record.status);
                    return (
                      <tr key={record.userId} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-6 font-semibold text-slate-800">
                          {record.fullName}
                        </td>
                        <td className="py-3.5 px-6 text-center font-mono text-slate-700">
                          {formatTime(record.entryTime)}
                        </td>
                        <td className="py-3.5 px-6 text-center font-mono text-slate-700">
                          {formatTime(record.departureTime)}
                        </td>
                        <td className="py-3.5 px-6 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badge.classes}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
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
        </section>
      </div>
    </Layout>
  );
};
