import { useState } from 'react';
import { Layout } from '../components/Layout';

// --- MOCK DATA (Luego vendrá de Spring Boot) ---
const mockAtrasos = [
  { id: 'Q002', nombre: 'Carlos Mendoza', rut: '12.345.678-9', fecha: '30 Oct, 2026', hora: '08:42 AM', tiempo: '12 minutos' },
  { id: 'Q006', nombre: 'Javier Martínez', rut: '15.678.901-2', fecha: '29 Oct, 2026', hora: '08:55 AM', tiempo: '25 minutos' },
  { id: 'Q003', nombre: 'Alejandro Ruiz', rut: '18.234.567-K', fecha: '28 Oct, 2026', hora: '08:35 AM', tiempo: '5 minutos' },
  { id: 'Q005', nombre: 'Mateo Herrera', rut: '14.567.890-3', fecha: '25 Oct, 2026', hora: '08:48 AM', tiempo: '18 minutos' },
];

const mockSalidas = [
  { id: 'Q002', rut: '12.345.678-9', nombre: 'Carlos Mendoza', fecha: '30 Oct, 2026', hora: '04:15 PM', minutos: '15 minutos' },
  { id: 'Q006', rut: '15.678.901-2', nombre: 'Javier Martínez', fecha: '29 Oct, 2026', hora: '03:45 PM', minutos: '45 minutos' },
  { id: 'Q003', rut: '18.234.567-K', nombre: 'Alejandro Ruiz', fecha: '28 Oct, 2026', hora: '04:00 PM', minutos: '30 minutos' },
  { id: 'Q007', rut: '15.876.543-1', nombre: 'Elena Silva', fecha: '27 Oct, 2026', hora: '04:20 PM', minutos: '10 minutos' },
];

const mockInasistencias = [
  { id: 'Q004', rut: '16.789.012-3', nombre: 'Valentina Gómez', fecha: '30 Oct, 2026' },
  { id: 'Q006', rut: '15.678.901-2', nombre: 'Javier Martínez', fecha: '28 Oct, 2026' },
  { id: 'Q008', rut: '20.123.456-7', nombre: 'Lucía Fernández', fecha: '27 Oct, 2026' },
  { id: 'Q003', rut: '18.234.567-K', nombre: 'Alejandro Ruiz', fecha: '25 Oct, 2026' },
];

export const Reports = () => {
  // Estado para controlar qué pestaña está activa
  const [activeTab, setActiveTab] = useState<'atrasos' | 'salidas' | 'inasistencias'>('atrasos');

  const handleExport = () => {
    console.log(`Exportando reporte de ${activeTab}...`);
  };

  return (
    <Layout>
      
      <div className="max-w-7xl w-full mx-auto space-y-6 p-8">
          
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Reportes de Asistencia</h2>
              <p className="text-xs text-slate-500 mt-1">Consulta y exportación de incidencias del personal</p>
            </div>
            <div>
              <button onClick={handleExport} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600" type="button">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Exportar CSV</span>
              </button>
            </div>
          </header>

          {/* TABS DE NAVEGACIÓN */}
          <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
            <div className="inline-flex p-1 bg-slate-100 border border-slate-200/80 rounded-xl shadow-xs space-x-1">
              <button 
                onClick={() => setActiveTab('atrasos')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${activeTab === 'atrasos' ? 'bg-white text-emerald-800 border border-slate-200/60 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Atrasos
              </button>
              <button 
                onClick={() => setActiveTab('salidas')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${activeTab === 'salidas' ? 'bg-white text-emerald-800 border border-slate-200/60 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Salidas Anticipadas
              </button>
              <button 
                onClick={() => setActiveTab('inasistencias')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${activeTab === 'inasistencias' ? 'bg-white text-emerald-800 border border-slate-200/60 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Inasistencias
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Rango: <strong className="text-slate-700 font-semibold">Octubre 2026</strong></span>
            </div>
          </section>

          {/* TABLA DINÁMICA */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                {activeTab === 'atrasos' && 'Reporte General de Atrasos'}
                {activeTab === 'salidas' && 'Reporte General de Salidas Anticipadas'}
                {activeTab === 'inasistencias' && 'Reporte General de Inasistencias'}
              </h3>
              <span className="text-[11px] text-slate-400 font-normal bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                {activeTab === 'atrasos' && 'Umbral: Entradas después de las 08:30 AM'}
                {activeTab === 'salidas' && 'Umbral: Salidas antes de las 17:30 PM'}
                {activeTab === 'inasistencias' && 'Sin justificación registrada'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                
                {/* CABECERAS DINÁMICAS */}
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-6" scope="col">ID Usuario</th>
                    <th className="py-3 px-6" scope="col">{activeTab === 'atrasos' ? 'Nombre' : 'RUT'}</th>
                    <th className="py-3 px-6" scope="col">{activeTab === 'atrasos' ? 'RUT' : 'Nombre Completo'}</th>
                    <th className={`py-3 px-6 ${activeTab === 'inasistencias' ? 'text-right' : ''}`} scope="col">Fecha</th>
                    
                    {activeTab !== 'inasistencias' && (
                      <th className="py-3 px-6" scope="col">{activeTab === 'atrasos' ? 'Hora Entrada' : 'Hora Salida'}</th>
                    )}
                    {activeTab !== 'inasistencias' && (
                      <th className="py-3 px-6 text-right" scope="col">{activeTab === 'atrasos' ? 'Tiempo de Atraso' : 'Minutos Anticipados'}</th>
                    )}
                  </tr>
                </thead>

                {/* CUERPO DE LA TABLA DINÁMICO */}
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  
                  {activeTab === 'atrasos' && mockAtrasos.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-500">{item.id}</td>
                      <td className="py-4 px-6 font-semibold text-slate-900">{item.nombre}</td>
                      <td className="py-4 px-6 text-slate-600">{item.rut}</td>
                      <td className="py-4 px-6 text-slate-600">{item.fecha}</td>
                      <td className="py-4 px-6 text-slate-600 font-medium">{item.hora}</td>
                      <td className="py-4 px-6 text-right font-medium">
                        <span className="inline-flex items-center text-amber-600 font-semibold">{item.tiempo}</span>
                      </td>
                    </tr>
                  ))}

                  {activeTab === 'salidas' && mockSalidas.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-600">{item.id}</td>
                      <td className="py-4 px-6 text-slate-500 font-mono">{item.rut}</td>
                      <td className="py-4 px-6 font-semibold text-slate-800">{item.nombre}</td>
                      <td className="py-4 px-6 text-slate-500">{item.fecha}</td>
                      <td className="py-4 px-6 text-slate-600 font-medium">{item.hora}</td>
                      <td className="py-4 px-6 text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600 border border-amber-200/60">{item.minutos}</span>
                      </td>
                    </tr>
                  ))}

                  {activeTab === 'inasistencias' && mockInasistencias.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-900">{item.id}</td>
                      <td className="py-4 px-6 text-slate-600">{item.rut}</td>
                      <td className="py-4 px-6 text-slate-800 font-medium">{item.nombre}</td>
                      <td className="py-4 px-6 text-right text-slate-500 font-normal">{item.fecha}</td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-slate-50/40 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Mostrando registros de incidencias</span>
              <span>QuimiControl System</span>
            </div>
          </section>

      </div>
    </Layout>
  );
};