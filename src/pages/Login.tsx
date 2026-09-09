import { useState } from 'react';
import type { FormEvent } from 'react';
import { authService, isAdminRole } from '../services/auth.service';

export const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleLogin = async (event: FormEvent) => {
		event.preventDefault();
		setError('');
		setIsSubmitting(true);

		try {
				const session = await authService.login({ email, password });
				window.location.href = isAdminRole(session.rol) ? '/dashboard' : '/assist';
		} catch {
			setError('No fue posible iniciar sesión. Verifica tus credenciales.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen font-sans antialiased text-slate-800 bg-[#f8fafc] flex items-center justify-center relative overflow-hidden p-4 sm:p-6">
			<div className="absolute w-[500px] h-[500px] rounded-full bottom-[-100px] right-[10%] sm:right-[20%] pointer-events-none z-0 blur-[40px]" style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(209, 250, 229, 0.05) 50%, transparent 70%)' }} />
			<div className="absolute w-[500px] h-[500px] rounded-full top-[-150px] left-[-100px] opacity-60 pointer-events-none z-0 blur-[40px]" style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(209, 250, 229, 0.05) 50%, transparent 70%)' }} />

			<main className="w-full max-w-md relative z-10">
				<div className="bg-white rounded-2xl shadow-[0_10px_35px_-4px_rgba(0,0,0,0.06),0_4px_12px_-2px_rgba(0,0,0,0.03)] border border-slate-100 p-8 sm:p-10 transition-all duration-300">
					<header className="flex flex-col items-center text-center mb-8">
						<div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-md shadow-emerald-600/25 mb-4 text-white">
							<svg className="w-7 h-7 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</div>
						<h1 className="text-2xl font-bold tracking-tight text-slate-900">QuimiControl</h1>
						<p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Sistema de Control de Asistencia</p>
					</header>

					<form className="space-y-5" onSubmit={handleLogin}>
						<div>
							<label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2" htmlFor="email">Correo Electrónico</label>
							<input autoComplete="email" className="block w-full rounded-lg border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors py-2.5 px-3 bg-slate-50/50 hover:bg-white focus:bg-white outline-none border" id="email" name="email" placeholder="empleado@quimicontrol.com" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
						</div>
						<div>
							<label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2" htmlFor="password">Contraseña</label>
							<input autoComplete="current-password" className="block w-full rounded-lg border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors py-2.5 px-3 bg-slate-50/50 hover:bg-white focus:bg-white tracking-widest outline-none border" id="password" name="password" placeholder="••••••••" required type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
						</div>
						{error && <p className="text-sm text-rose-600" role="alert">{error}</p>}
						<button className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 transition-all duration-150" type="submit" disabled={isSubmitting}>
							{isSubmitting ? 'Ingresando...' : 'Iniciar Sesión'}
						</button>
					</form>
				</div>
			</main>
		</div>
	);
};
