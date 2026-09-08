import { useState, useEffect } from 'react';

const mockHistorial = [
  { id: 1, fecha: 'Viernes, 27 Oct', entrada: '08:10 AM', salida: '17:40 PM', estado: 'Presente' },
  { id: 2, fecha: 'Jueves, 26 Oct', entrada: '08:42 AM', salida: '17:30 PM', estado: 'Atraso' },
  { id: 3, fecha: 'Miércoles, 25 Oct', entrada: '08:35 AM', salida: '17:31 PM', estado: 'Presente' },
  { id: 4, fecha: 'Martes, 24 Oct', entrada: '08:15 AM', salida: '17:42 PM', estado: 'Presente' },
  { id: 5, fecha: 'Lunes, 23 Oct', entrada: '08:24 AM', salida: '17:35 PM', estado: 'Presente' },
];

export const Assist = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-700 antialiased bg-[#f8fafc]">
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-700/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M10 2v7.31"></path>
                <path d="M14 9.3V2"></path>
                <path d="M8.5 2h7"></path>
                <path d="M14 9.3a6.5 6.5 0 1 1-4 0"></path>
                <path d="M5.52 16h12.96"></path>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 text-lg leading-tight tracking-tight">QuimiControl</span>
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Gestión & Asistencia</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800 leading-none">Héctor Silva</p>
              <p className="text-xs text-slate-500 mt-1 leading-none">Analista Químico de Laboratorio</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-slate-600 font-semibold text-xs overflow-hidden">
              <span className="text-slate-700 font-medium">HS</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          <section className="lg:col-span-5 flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 sm:p-10 transition-all hover:shadow-md">
            <div className="text-center">
              <span className="inline-block text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                REGISTRO DIARIO
              </span>
              <h2 className="text-base sm:text-lg font-medium text-slate-600 mt-1">
                Lunes, 30 de Octubre
              </h2>
              <div className="my-8 sm:my-10">
                <span className="text-5xl sm:text-6xl font-extrabold text-slate-800 tracking-tight" style={{ fontFamily: 'monospace' }}>
                  {time}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3.5">
                <button className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-medium text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2" type="button">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Registrar Entrada</span>
                </button>
                <button className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl font-medium text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2" type="button">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Registrar Salida</span>
                </button>
              </div>

              <div className="rounded-xl bg-emerald-50/80 border border-emerald-200/70 p-3.5 flex items-center justify-center gap-2 text-emerald-800 text-xs sm:text-sm font-medium">
                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Entrada registrada hoy a las 08:14 AM</span>
              </div>
            </div>
          </section>

          <section className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 flex flex-col justify-between transition-all hover:shadow-md">
            <div>
              <div className="mb-5">
                <h3 className="text-base sm:text-lg font-bold text-slate-800">
                  Historial Reciente <span className="text-slate-400 font-normal text-sm sm:text-base">(Últimos 5 Días)</span>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200/70 text-slate-400 font-semibold text-[11px] tracking-wider uppercase">
                      <th className="pb-3 pl-1 font-semibold" scope="col">Fecha</th>
                      <th className="pb-3 text-center font-semibold" scope="col">Hora Entrada</th>
                      <th className="pb-3 text-center font-semibold" scope="col">Hora Salida</th>
                      <th className="pb-3 text-right pr-2 font-semibold" scope="col">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {mockHistorial.map((registro) => (
                      <tr key={registro.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 pl-1 font-medium text-slate-800 whitespace-nowrap">
                          <div>{registro.fecha}</div>
                        </td>
                        <td className={`py-3.5 text-center ${registro.estado === 'Atraso' ? 'text-amber-700 font-medium' : 'text-slate-600 font-normal'}`}>
                          {registro.entrada}
                        </td>
                        <td className="py-3.5 text-center text-slate-600 font-normal">
                          {registro.salida}
                        </td>
                        <td className="py-3.5 text-right pr-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            registro.estado === 'Presente' 
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                              : 'bg-amber-100 text-amber-800 border-amber-200'
                          }`}>
                            {registro.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Horario laboral oficial: 08:30 AM - 17:30 PM</span>
              <span>Tolerancia: 10 min</span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};