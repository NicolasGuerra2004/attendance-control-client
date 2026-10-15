import { useEffect, useRef, useState } from 'react';
import { Layout } from '../components/Layout';
import {
  attendanceService,
  type AbsenteeismReportDTO,
  type EarlyDepartureReportDTO,
  type LateArrivalReportDTO,
} from '../services/attendance.service';

type ReportTab = 'late' | 'early' | 'absenteeism';
type ReportData = LateArrivalReportDTO[] | EarlyDepartureReportDTO[] | AbsenteeismReportDTO[];

const today = new Date().toISOString().slice(0, 10);

const formatDateTime = (value: string | null | undefined): string => {
  if (!value) return '--:--';
  const timeOnly = value.match(/^(\d{2}):(\d{2})/);
  if (timeOnly) return `${timeOnly[1]}:${timeOnly[2]}`;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('es-CL', { dateStyle: 'short', timeStyle: 'short' }).format(date);
};

const escapeCsv = (value: unknown): string => `"${String(value ?? '').replaceAll('"', '""')}"`;

export const Reports = () => {
  const [activeTab, setActiveTab] = useState<ReportTab>('late');
  const [selectedDate, setSelectedDate] = useState(today);
  const [data, setData] = useState<ReportData>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const requestId = useRef(0);

  const fetchReport = async (tab: ReportTab, date: string): Promise<ReportData> => {
    if (tab === 'late') return attendanceService.getLateArrivals(date);
    if (tab === 'early') return attendanceService.getEarlyDepartures(date);
    return attendanceService.getAbsenteeism(date);
  };

  useEffect(() => {
    const currentRequestId = ++requestId.current;
    const loadInitialReport = async () => {
      setIsLoading(true);
      setError('');
      try {
        const report = await fetchReport(activeTab, selectedDate);
        if (currentRequestId !== requestId.current) return;
        setData(Array.isArray(report) ? report : []);
      } catch {
        if (currentRequestId !== requestId.current) return;
        setData([]);
        setError('No se pudo cargar el reporte. Verifica la conexión con el servidor.');
      } finally {
        if (currentRequestId === requestId.current) setIsLoading(false);
      }
    };

    void loadInitialReport();
  }, [activeTab, selectedDate]);

  const handleExport = () => {
    const headers =
      activeTab === 'late'
        ? ['ID Usuario', 'RUT', 'Nombre', 'Entrada', 'Minutos de atraso']
        : activeTab === 'early'
        ? ['ID Usuario', 'RUT', 'Nombre', 'Salida', 'Minutos anticipados']
        : ['ID Usuario', 'RUT', 'Nombre', 'Fecha'];

    const rows = data.map((item) => {
      if (activeTab === 'late') {
        const report = item as LateArrivalReportDTO;
        return [report.userId, report.rut, report.fullName, formatDateTime(report.entry), report.delay];
      }
      if (activeTab === 'early') {
        const report = item as EarlyDepartureReportDTO;
        return [report.userId, report.rut, report.fullName, formatDateTime(report.departure), report.delay];
      }
      const report = item as AbsenteeismReportDTO;
      return [report.userId, report.rut, report.fullName, report.date];
    });

    const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(';')).join('\n');
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte-${activeTab}-${selectedDate}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const title =
    activeTab === 'late'
      ? 'Reporte de Atrasos'
      : activeTab === 'early'
      ? 'Reporte de Salidas Anticipadas'
      : 'Reporte de Inasistencias';

  return (
    <Layout>
      <div className="max-w-7xl w-full mx-auto space-y-5 sm:space-y-6 p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Reportes de Asistencia</h2>
            <p className="text-xs text-slate-500 mt-0.5">Consulta las incidencias y eventos por fecha</p>
          </div>
          <button
            onClick={handleExport}
            disabled={isLoading || data.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            type="button"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Exportar CSV</span>
          </button>
        </header>

        <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
          <div className="inline-flex max-w-full overflow-x-auto p-1 bg-slate-100 border border-slate-200/80 rounded-xl space-x-1">
            <button
              onClick={() => setActiveTab('late')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'late'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              type="button"
            >
              Atrasos
            </button>
            <button
              onClick={() => setActiveTab('early')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'early'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              type="button"
            >
              Salidas Anticipadas
            </button>
            <button
              onClick={() => setActiveTab('absenteeism')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'absenteeism'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              type="button"
            >
              Inasistencias
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <span>Fecha de consulta:</span>
            <input
              className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-800 text-xs outline-none focus:border-emerald-600 transition-colors"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </label>
        </section>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700" role="alert">
            {error}
          </div>
        )}

        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          </div>

          {isLoading ? (
            <p className="p-8 text-center text-xs text-slate-400">Cargando reporte...</p>
          ) : data.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-700">Sin incidencias registradas</p>
              <p className="text-xs text-slate-400 mt-1">No hay registros para la fecha seleccionada ({selectedDate}).</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/70">
                    <th className="py-3 px-6">ID</th>
                    <th className="py-3 px-6">RUT</th>
                    <th className="py-3 px-6">Nombre Completo</th>
                    <th className="py-3 px-6">
                      {activeTab === 'late' ? 'Hora Entrada' : activeTab === 'early' ? 'Hora Salida' : 'Fecha'}
                    </th>
                    {activeTab !== 'absenteeism' && <th className="py-3 px-6 text-right">Minutos de Desvío</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {data.map((item, index) => {
                    const report = item as LateArrivalReportDTO & EarlyDepartureReportDTO & AbsenteeismReportDTO;
                    return (
                      <tr
                        key={`${report.userId ?? 'user'}-${report.rut ?? 'rut'}-${report.entry ?? report.departure ?? report.date ?? index}`}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        <td className="py-3.5 px-6 font-mono text-slate-400">{report.userId ?? '-'}</td>
                        <td className="py-3.5 px-6 font-mono text-slate-600">{report.rut ?? '-'}</td>
                        <td className="py-3.5 px-6 font-semibold text-slate-800">{report.fullName ?? '-'}</td>
                        <td className="py-3.5 px-6 font-mono text-slate-700">
                          {activeTab === 'late'
                            ? formatDateTime(report.entry)
                            : activeTab === 'early'
                            ? formatDateTime(report.departure)
                            : report.date ?? '--/--/----'}
                        </td>
                        {activeTab !== 'absenteeism' && (
                          <td className="py-3.5 px-6 text-right font-mono font-semibold text-amber-600">
                            {report.delay} min
                          </td>
                        )}
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
