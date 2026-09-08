import { useState } from 'react';
import type { FormEvent } from 'react';
import { Layout } from '../components/Layout';

// Datos de prueba (luego vendrán del backend)
const mockUsers = [
  { id: 'Q001', nombre: 'Sofía Vergara', email: 'sofia.v@quimicontrol.com', estado: 'Activo' },
  { id: 'Q002', nombre: 'Carlos Mendoza', email: 'carlos.m@quimicontrol.com', estado: 'Activo' },
  { id: 'Q003', nombre: 'Alejandro Ruiz', email: 'a.ruiz@quimicontrol.com', estado: 'Activo' },
  { id: 'Q004', nombre: 'Valentina Gómez', email: 'v.gomez@quimicontrol.com', estado: 'Activo' },
  { id: 'Q005', nombre: 'Mateo Herrera', email: 'm.herrera@quimicontrol.com', estado: 'Activo' },
  { id: 'Q006', nombre: 'Javier Martínez', email: 'j.martinez@quimicontrol.com', estado: 'Inactivo' },
  { id: 'Q007', nombre: 'Elena Silva', email: 'e.silva@quimicontrol.com', estado: 'Activo' },
];

export const Users = () => {
  // Estado para controlar si el modal está abierto o cerrado
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarios] = useState(mockUsers);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Aquí irá la lógica para enviar el POST a Spring Boot
    console.log('Creando usuario...');
    setIsModalOpen(false); // Cerramos el modal al terminar
  };

  return (
    <Layout>
      <div className="p-8 max-w-7xl w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Gestión de Usuarios</h2>
            <p className="text-xs text-slate-500 mt-0.5">Lista general de empleados activos e inactivos en QuimiControl</p>
          </div>
          <div>
            {/* BOTÓN QUE ABRE EL MODAL */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-xs rounded-lg shadow-sm shadow-emerald-700/20 transition duration-150 ease-in-out" 
              type="button"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Nuevo Usuario</span>
            </button>
          </div>
        </div>

        <section className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  <th className="py-3.5 px-6 font-medium" scope="col">ID</th>
                  <th className="py-3.5 px-6 font-medium" scope="col">Nombre</th>
                  <th className="py-3.5 px-6 font-medium" scope="col">Correo Electrónico</th>
                  <th className="py-3.5 px-6 font-medium text-center" scope="col">Estado</th>
                  <th className="py-3.5 px-6 font-medium text-center" scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-normal text-slate-600">
                {usuarios.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-500">{user.id}</td>
                    <td className="py-4 px-6 font-semibold text-slate-800">{user.nombre}</td>
                    <td className="py-4 px-6 text-slate-500">{user.email}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                        user.estado === 'Activo' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {user.estado}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex items-center justify-center gap-2">
                        <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors" type="button">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                        <button className="p-1 text-red-400 hover:text-red-600 transition-colors" type="button">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* VENTANA EMERGENTE (MODAL) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center p-4 sm:p-6">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
            
            <div className="px-6 pt-6 pb-4 flex items-start justify-between border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-6">Crear Nuevo Usuario</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Ingresa los datos para registrar la ficha de asistencia.</p>
                </div>
              </div>
              
              {/* BOTÓN CERRAR MODAL (La "X") */}
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-1.5 transition-colors focus:outline-none" type="button">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </button>
            </div>
            
            <form className="px-6 py-5 space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="user-rut">
                    RUT <span className="text-red-500">*</span>
                  </label>
                  <input className="w-full text-xs rounded-lg border-slate-300 placeholder-slate-400 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-3 py-2.5 transition outline-none border" id="user-rut" name="rut" placeholder="Ej: 12.345.678-9" required type="text" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="user-nombre">
                    Nombre y Apellidos <span className="text-red-500">*</span>
                  </label>
                  <input className="w-full text-xs rounded-lg border-slate-300 placeholder-slate-400 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-3 py-2.5 transition outline-none border" id="user-nombre" name="nombre" placeholder="Ingresar nombre completo" required type="text" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="user-email">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                    </div>
                    <input className="w-full pl-9 text-xs rounded-lg border-slate-300 placeholder-slate-400 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 py-2.5 transition outline-none border" id="user-email" name="email" placeholder="usuario@quimicontrol.com" required type="email" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="user-password">
                    Contraseña temporal <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                    </div>
                    <input className="w-full pl-9 text-xs rounded-lg border-slate-300 placeholder-slate-400 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 py-2.5 transition outline-none border" id="user-password" name="password" placeholder="••••••••" required type="password" />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                <p className="text-[11px] text-slate-400 text-center sm:text-left">
                  *Todos los campos marcados con (*) son obligatorios
                </p>
                <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
                  {/* BOTÓN CERRAR MODAL (Cancelar) */}
                  <button onClick={() => setIsModalOpen(false)} className="w-1/2 sm:w-auto px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-slate-300" type="button">
                    Cancelar
                  </button>
                  <button className="w-1/2 sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm transition flex items-center justify-center space-x-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1" type="submit">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                    <span>Crear Usuario</span>
                  </button>
                </div>
              </div>
            </form>
            
          </div>
        </div>
      )}

    </Layout>
  );
};