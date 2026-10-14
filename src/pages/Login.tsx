import { useState } from 'react';
import type { FormEvent } from 'react';
import { getApiErrorMessage } from '../api/axiosConfig';
import { authService, isAdminRole, type RegisterRequestDTO } from '../services/auth.service';

const getErrorMessage = (error: unknown, fallback: string): string => {
  return getApiErrorMessage(error, fallback);
};

export const Login = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [registerForm, setRegisterForm] = useState<RegisterRequestDTO>({
    rut: '',
    name: '',
    lastName: '',
    phone: '',
    address: '',
    email: '',
    password: '',
  });

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const session = await authService.login({ email, password });
      window.location.href = isAdminRole(session.rol) ? '/dashboard' : '/assist';
    } catch (err) {
      setError(getErrorMessage(err, 'Credenciales inválidas. Verifica tu correo y contraseña.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      await authService.register(registerForm);
      setSuccess('¡Cuenta registrada exitosamente! Ahora puedes iniciar sesión.');
      setEmail(registerForm.email);
      setPassword('');
      setMode('login');
    } catch (err) {
      setError(getErrorMessage(err, 'No fue posible registrar la cuenta. Verifica que el RUT y correo no estén duplicados.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-sans antialiased text-slate-800 bg-[#f8fafc] flex items-center justify-center relative overflow-hidden p-4 sm:p-6">
      <div
        className="absolute w-[500px] h-[500px] rounded-full bottom-[-100px] right-[10%] sm:right-[20%] pointer-events-none z-0 blur-[40px]"
        style={{
          background:
            'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(209, 250, 229, 0.05) 50%, transparent 70%)',
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full top-[-150px] left-[-100px] opacity-60 pointer-events-none z-0 blur-[40px]"
        style={{
          background:
            'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(209, 250, 229, 0.05) 50%, transparent 70%)',
        }}
      />

      <main className="w-full max-w-md relative z-10 my-8">
        <div className="bg-white rounded-2xl shadow-[0_10px_35px_-4px_rgba(0,0,0,0.06),0_4px_12px_-2px_rgba(0,0,0,0.03)] border border-slate-100 p-8 sm:p-10 transition-all duration-300">
          <header className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-md shadow-emerald-600/25 mb-4 text-white">
              <svg className="w-7 h-7 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">QuimiControl</h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
              Sistema de Control de Asistencia Industrial
            </p>
          </header>

          <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Registrarse
            </button>
          </div>

          {success && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-medium text-emerald-800 text-center" role="status">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-700 text-center" role="alert">
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2" htmlFor="email">
                  Correo Electrónico
                </label>
                <input
                  autoComplete="email"
                  className="block w-full rounded-lg border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors py-2.5 px-3 bg-slate-50/50 hover:bg-white focus:bg-white outline-none border"
                  id="email"
                  name="email"
                  placeholder="empleado@quimicontrol.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2" htmlFor="password">
                  Contraseña
                </label>
                <input
                  autoComplete="current-password"
                  className="block w-full rounded-lg border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors py-2.5 px-3 bg-slate-50/50 hover:bg-white focus:bg-white tracking-widest outline-none border"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 transition-all duration-150 mt-2"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Ingresando...' : 'Iniciar Sesión'}
              </button>
            </form>
          ) : (
            <form className="space-y-3" onSubmit={handleRegister}>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1" htmlFor="reg-rut">
                    RUT *
                  </label>
                  <input
                    id="reg-rut"
                    className="block w-full rounded-lg border-slate-200 text-xs text-slate-800 py-2 px-3 bg-slate-50/50 outline-none border focus:border-emerald-600 focus:bg-white"
                    placeholder="12345678-9"
                    maxLength={12}
                    required
                    value={registerForm.rut}
                    onChange={(e) => setRegisterForm({ ...registerForm, rut: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1" htmlFor="reg-name">
                    Nombre *
                  </label>
                  <input
                    id="reg-name"
                    className="block w-full rounded-lg border-slate-200 text-xs text-slate-800 py-2 px-3 bg-slate-50/50 outline-none border focus:border-emerald-600 focus:bg-white"
                    placeholder="Juan"
                    required
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1" htmlFor="reg-lastName">
                    Apellidos *
                  </label>
                  <input
                    id="reg-lastName"
                    className="block w-full rounded-lg border-slate-200 text-xs text-slate-800 py-2 px-3 bg-slate-50/50 outline-none border focus:border-emerald-600 focus:bg-white"
                    placeholder="Pérez"
                    required
                    value={registerForm.lastName}
                    onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1" htmlFor="reg-phone">
                    Teléfono
                  </label>
                  <input
                    id="reg-phone"
                    className="block w-full rounded-lg border-slate-200 text-xs text-slate-800 py-2 px-3 bg-slate-50/50 outline-none border focus:border-emerald-600 focus:bg-white"
                    placeholder="+56 9 1234 5678"
                    value={registerForm.phone ?? ''}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1" htmlFor="reg-email">
                  Correo Electrónico *
                </label>
                <input
                  id="reg-email"
                  type="email"
                  className="block w-full rounded-lg border-slate-200 text-xs text-slate-800 py-2 px-3 bg-slate-50/50 outline-none border focus:border-emerald-600 focus:bg-white"
                  placeholder="usuario@quimicontrol.com"
                  required
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1" htmlFor="reg-password">
                  Contraseña * (mínimo 8 caracteres)
                </label>
                <input
                  id="reg-password"
                  type="password"
                  minLength={8}
                  className="block w-full rounded-lg border-slate-200 text-xs text-slate-800 py-2 px-3 bg-slate-50/50 outline-none border focus:border-emerald-600 focus:bg-white"
                  placeholder="••••••••"
                  required
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1" htmlFor="reg-address">
                  Dirección
                </label>
                <input
                  id="reg-address"
                  className="block w-full rounded-lg border-slate-200 text-xs text-slate-800 py-2 px-3 bg-slate-50/50 outline-none border focus:border-emerald-600 focus:bg-white"
                  placeholder="Av. Industrial 1234, Santiago"
                  value={registerForm.address ?? ''}
                  onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
                />
              </div>

              <button
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 focus:outline-none transition-all duration-150 mt-3"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registrando...' : 'Crear Cuenta'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};
