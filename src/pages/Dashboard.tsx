import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { attendanceService, type DailyRecordDTO, type DashboardMetricsDTO } from '../services/attendance.service';
import { userService } from '../services/user.service';

const getRequestErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = error.response;
    if (response && typeof response === 'object' && 'status' in response && response.status === 403) {
      return 'El backend rechazó el acceso al registro diario (403). Verifica los permisos del usuario administrador.';
    }
  }
  return fallback;
};

const formatTime = (value: string): string => {
  if (!value) return '--:--';
  const timeOnly = value.match(/^(\d{2}):(\d{2})(?::\d{2})?/);
  if (timeOnly) return `${timeOnly[1]}:${timeOnly[2]}`;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
};

export const Dashboard = () => {
  const [registros, setRegistros] = useState<DailyRecordDTO[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetricsDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState('');
  const [recordsError, setRecordsError] = useState('');

  const fetchMetrics = async (): Promise<DashboardMetricsDTO> => {
    return attendanceService.getDashboardMetrics();
  };

  const fetchTodayRecords = async (): Promise<DailyRecordDTO[]> => {
    try {
      return await attendanceService.getTodayRecords();
    } catch {
      return getTodayRecordsFallback();
    }
  };

  const loadMetrics = async () => {
    setIsLoading(true);
    setMetricsError('');
    setRecordsError('');
    const [metricsResult, recordsResult] = await Promise.allSettled([
      fetchMetrics(),
      fetchTodayRecords(),
    ]);

    if (metricsResult.status === 'fulfilled') {
      setMetrics(metricsResult.value);
    } else {
      setMetrics(null);
      setMetricsError('No se pudieron cargar las métricas.');
    }

    if (recordsResult.status === 'fulfilled') {
      setRegistros(Array.isArray(recordsResult.value) ? recordsResult.value : []);
    } else {
      setRegistros([]);
      setRecordsError(getRequestErrorMessage(recordsResult.reason, 'No se pudo cargar el registro de asistencia de hoy.'));
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const loadInitialMetrics = async () => {
      setIsLoading(true);
      setMetricsError('');
      setRecordsError('');
      const [metricsResult, recordsResult] = await Promise.allSettled([
        fetchMetrics(),
        fetchTodayRecords(),
      ]);

      if (metricsResult.status === 'fulfilled') {
        setMetrics(metricsResult.value);
      } else {
        setMetrics(null);
        setMetricsError('No se pudieron cargar las métricas.');
      }

      if (recordsResult.status === 'fulfilled') {
        setRegistros(Array.isArray(recordsResult.value) ? recordsResult.value : []);
      } else {
        setRegistros([]);
        setRecordsError(getRequestErrorMessage(recordsResult.reason, 'No se pudo cargar el registro de asistencia de hoy.'));
      }

      setIsLoading(false);
    };

    void loadInitialMetrics();
  }, []);

  const handleActualizar = () => {
    setIsLoading(true);
    void loadMetrics();
  };


  const getBadgeColor = (estado: string) => {
    switch (estado.trim().toUpperCase()) {
      case 'PRESENTE': return 'bg-emerald-50 text-emerald-600 border-emerald-200/60';
      case 'ATRASADO':
      case 'ATRASO': return 'bg-amber-50 text-amber-600 border-amber-200/60';
      case 'AUSENTE': return 'bg-rose-50 text-rose-600 border-rose-200/60';
      default: return 'bg-slate-50 text-slate-600 border-slate-200/60';
    }
  };

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
                onClick={handleActualizar}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-slate-200 shadow-sm text-xs font-medium rounded-md text-slate-600 bg-white hover:bg-slate-50 transition-colors" 
                type="button"
              >
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <span>Actualizar</span>
              </button>
            </div>
          </div>

          {/* METRIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-600">Total Empleados</span>
                <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                  </svg>
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-slate-900 leading-tight">{isLoading ? '...' : metrics ? metrics.presentToday + metrics.absentToday : '-'}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">Planta Completa</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-600">Presentes Hoy</span>
                <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-slate-900 leading-tight">{isLoading ? '...' : metrics?.presentToday ?? '-'}</span>
              </div>
              <p className="text-[11px] text-emerald-600 mt-1 font-medium">88% de asistencia</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-600">Atrasos Hoy</span>
                <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-slate-900 leading-tight">{isLoading ? '...' : metrics?.lateToday ?? '-'}</span>
              </div>
              <p className="text-[11px] text-amber-600 mt-1 font-medium">Atención requerida</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-600">Inasistencias</span>
                <div className="w-7 h-7 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-slate-900 leading-tight">{isLoading ? '...' : metrics?.absentToday ?? '-'}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">0% ausencias</p>
            </div>
          </div>
          {metricsError && <p className="text-sm text-rose-600" role="alert">{metricsError}</p>}

          {/* ATTENDANCE TABLE */}
          <section className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800">Registro de Asistencia de Hoy</h3>
            </div>
            {recordsError && <p className="px-6 py-3 text-sm text-rose-600" role="alert">{recordsError}</p>}
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold text-[11px] bg-slate-50/50">
                    <th className="py-3.5 px-6" scope="col">Empleado</th>
                    <th className="py-3.5 px-6" scope="col">Hora Entrada</th>
                    <th className="py-3.5 px-6" scope="col">Hora Salida</th>
                    <th className="py-3.5 px-6 text-center" scope="col">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  {registros.map((registro) => (
                    <tr key={registro.userId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-800">{registro.fullName}</td>
                      <td className={`py-4 px-6 ${!registro.entryTime ? 'text-slate-400' : 'text-slate-600'}`}>
                        {formatTime(registro.entryTime)}
                      </td>
                      <td className="py-4 px-6 text-slate-400">{formatTime(registro.departureTime)}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${getBadgeColor(registro.status)}`}>
                          {registro.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>
    </Layout>
  );
};

const getToday = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const isToday = (value: string): boolean => {
  const datePart = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  if (datePart === getToday()) return true;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const localDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return localDate === getToday();
};

const getTodayRecordsFallback = async (): Promise<DailyRecordDTO[]> => {
  const users = await userService.getManagementUsers();
  const recordsByUser = await Promise.all(users.map(async (user) => ({
    user,
    records: (await attendanceService.getAttendanceByUser(user.id)).filter((record) => isToday(record.date)),
  })));

  return recordsByUser.map(({ user, records }) => {
    const latestRecord = (type: 'ENTRADA' | 'SALIDA') => records
      .filter((record) => record.typeAttendance.trim().toUpperCase() === type)
      .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())[0];
    const entry = latestRecord('ENTRADA');
    const departure = latestRecord('SALIDA');
    return {
      userId: user.id,
      fullName: user.fullName,
      entryTime: entry?.date ?? '',
      departureTime: departure?.date ?? '',
      status: entry ? 'Presente' : 'Ausente',
    };
  });
};