import { useEffect, useState } from 'react';

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
			setTime([now.getHours(), now.getMinutes(), now.getSeconds()]
				.map((value) => String(value).padStart(2, '0'))
				.join(':'));
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
							<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 2v7.31M14 9.3V2M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0M5.52 16h12.96" strokeLinecap="round" strokeLinejoin="round" /></svg>
						</div>
						<div className="flex flex-col">
							<span className="font-bold text-slate-900 text-lg leading-tight tracking-tight">QuimiControl</span>
							<span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Gestión &amp; Asistencia</span>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<div className="text-right hidden sm:block"><p className="text-sm font-semibold text-slate-800 leading-none">Héctor Silva</p><p className="text-xs text-slate-500 mt-1 leading-none">Analista Químico de Laboratorio</p></div>
						<div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-slate-600 font-semibold text-xs">HS</div>
					</div>
				</div>
			</header>

			<main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
					<section className="lg:col-span-5 flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 sm:p-10">
						<div className="text-center"><span className="inline-block text-[11px] font-bold tracking-widest text-slate-400 uppercase">Registro diario</span><h2 className="text-base sm:text-lg font-medium text-slate-600 mt-1">Lunes, 30 de Octubre</h2><div className="my-8 sm:my-10"><span className="text-5xl sm:text-6xl font-extrabold text-slate-800 tracking-tight font-mono">{time}</span></div></div>
						<div className="space-y-4"><div className="grid grid-cols-2 gap-3.5"><button className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm" type="button">Registrar Entrada</button><button className="px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium text-sm" type="button">Registrar Salida</button></div><div className="rounded-xl bg-emerald-50/80 border border-emerald-200/70 p-3.5 text-center text-emerald-800 text-xs sm:text-sm font-medium">Entrada registrada hoy a las 08:14 AM</div></div>
					</section>
					<section className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8"><h3 className="text-base sm:text-lg font-bold text-slate-800 mb-5">Historial Reciente <span className="text-slate-400 font-normal text-sm">(Últimos 5 Días)</span></h3><div className="overflow-x-auto"><table className="w-full text-left text-xs sm:text-sm border-collapse"><thead><tr className="border-b border-slate-200/70 text-slate-400 font-semibold text-[11px] uppercase"><th className="pb-3 pl-1">Fecha</th><th className="pb-3 text-center">Hora Entrada</th><th className="pb-3 text-center">Hora Salida</th><th className="pb-3 text-right">Estado</th></tr></thead><tbody className="divide-y divide-slate-100">{mockHistorial.map((registro) => <tr key={registro.id}><td className="py-3.5 pl-1 font-medium text-slate-800 whitespace-nowrap">{registro.fecha}</td><td className="py-3.5 text-center text-slate-600">{registro.entrada}</td><td className="py-3.5 text-center text-slate-600">{registro.salida}</td><td className="py-3.5 text-right"><span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${registro.estado === 'Presente' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>{registro.estado}</span></td></tr>)}</tbody></table></div><div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400"><span>Horario laboral oficial: 08:30 AM - 17:30 PM</span><span>Tolerancia: 10 min</span></div></section>
				</div>
			</main>
		</div>
	);
};
