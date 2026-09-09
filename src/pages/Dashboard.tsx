import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { attendanceService, type DashboardMetricsDTO } from '../services/attendance.service';

export const Dashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetricsDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState('');

  const fetchMetrics = async (): Promise<DashboardMetricsDTO> => {
    return attendanceService.getDashboardMetrics();
  };

  const loadMetrics = async () => {
    setIsLoading(true);
    setMetricsError('');
    const metricsResult = await Promise.allSettled([fetchMetrics()]);

    if (metricsResult[0].status === 'fulfilled') {
      setMetrics(metricsResult[0].value);
    } else {
      setMetrics(null);
      setMetricsError('No se pudieron cargar las métricas.');
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const loadInitialMetrics = async () => {
      setIsLoading(true);
      setMetricsError('');
      const metricsResult = await Promise.allSettled([fetchMetrics()]);

      if (metricsResult[0].status === 'fulfilled') {
        setMetrics(metricsResult[0].value);
      } else {
        setMetrics(null);
        setMetricsError('No se pudieron cargar las métricas.');
      }

      setIsLoading(false);
    };

    void loadInitialMetrics();
  }, []);

  const handleActualizar = () => {
    setIsLoading(true);
    void loadMetrics();
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

        </div>
    </Layout>
  );
};

