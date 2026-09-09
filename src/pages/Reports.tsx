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
  const timeOnly = value.match(/^(\d{2}):(\d{2})(?::\d{2})?/);
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
        setError('No se pudo cargar el reporte. Verifica la conexión con el backend.');
      } finally {
        if (currentRequestId === requestId.current) setIsLoading(false);
      }
    };

    void loadInitialReport();
  }, [activeTab, selectedDate]);

  const changeTab = (tab: ReportTab) => {
    setActiveTab(tab);
  };

  const handleExport = () => {
    const headers = activeTab === 'late'
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

  const title = activeTab === 'late' ? 'Reporte de Atrasos' : activeTab === 'early' ? 'Reporte de Salidas Anticipadas' : 'Reporte de Inasistencias';

  return (
    <Layout>
      <div className="max-w-7xl w-full mx-auto space-y-6 p-8">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div><h2 className="text-xl font-bold text-slate-900 tracking-tight">Reportes de Asistencia</h2><p className="text-xs text-slate-500 mt-1">Consulta las incidencias registradas por fecha.</p></div>
          <button onClick={handleExport} disabled={isLoading || data.length === 0} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold" type="button">Exportar CSV</button>
        </header>
        <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1"><div className="inline-flex p-1 bg-slate-100 border border-slate-200/80 rounded-xl space-x-1"><button onClick={() => changeTab('late')} className={`px-4 py-2 text-xs font-semibold rounded-lg ${activeTab === 'late' ? 'bg-white text-emerald-800 border border-slate-200/60 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`} type="button">Atrasos</button><button onClick={() => changeTab('early')} className={`px-4 py-2 text-xs font-semibold rounded-lg ${activeTab === 'early' ? 'bg-white text-emerald-800 border border-slate-200/60 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`} type="button">Salidas Anticipadas</button><button onClick={() => changeTab('absenteeism')} className={`px-4 py-2 text-xs font-semibold rounded-lg ${activeTab === 'absenteeism' ? 'bg-white text-emerald-800 border border-slate-200/60 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`} type="button">Inasistencias</button></div><label className="flex items-center gap-2 text-xs text-slate-500 font-medium">Fecha<input className="bg-white border border-slate-200 px-3 py-2 rounded-lg text-slate-700" type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} /></label></section>
        {error && <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">{error}</p>}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"><div className="px-6 py-4 border-b border-slate-100"><h3 className="text-sm font-bold text-slate-900">{title}</h3></div>{isLoading ? <p className="p-6 text-sm text-slate-500">Cargando reporte...</p> : data.length === 0 ? <p className="p-6 text-sm text-slate-500">No hay registros para la fecha seleccionada.</p> : <div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead><tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50"><th className="py-3 px-6">ID Usuario</th><th className="py-3 px-6">RUT</th><th className="py-3 px-6">Nombre</th><th className="py-3 px-6">{activeTab === 'late' ? 'Entrada' : activeTab === 'early' ? 'Salida' : 'Fecha'}</th>{activeTab !== 'absenteeism' && <th className="py-3 px-6 text-right">Minutos</th>}</tr></thead><tbody className="divide-y divide-slate-100 text-xs text-slate-700">{data.map((item, index) => { const report = item as LateArrivalReportDTO & EarlyDepartureReportDTO & AbsenteeismReportDTO; return <tr key={`${report.userId ?? 'user'}-${report.rut ?? 'rut'}-${report.entry ?? report.departure ?? report.date ?? index}`}><td className="py-4 px-6">{report.userId ?? '-'}</td><td className="py-4 px-6">{report.rut ?? '-'}</td><td className="py-4 px-6 font-semibold text-slate-800">{report.fullName ?? '-'}</td><td className="py-4 px-6">{activeTab === 'late' ? formatDateTime(report.entry) : activeTab === 'early' ? formatDateTime(report.departure) : report.date ?? '--/--/----'}</td>{activeTab !== 'absenteeism' && <td className="py-4 px-6 text-right font-semibold text-amber-600">{report.delay ?? '-'}</td>}</tr>; })}</tbody></table></div>}</section>
      </div>
    </Layout>
  );
};
