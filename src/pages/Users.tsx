import { useState } from 'react';
import type { FormEvent } from 'react';
import { Layout } from '../components/Layout';

const mockUsers = [
	{ id: 'Q001', nombre: 'Sofía Vergara', email: 'sofia.v@quimicontrol.com', estado: 'Activo' },
	{ id: 'Q002', nombre: 'Carlos Mendoza', email: 'carlos.m@quimicontrol.com', estado: 'Activo' },
	{ id: 'Q003', nombre: 'Alejandro Ruiz', email: 'a.ruiz@quimicontrol.com', estado: 'Activo' },
	{ id: 'Q004', nombre: 'Valentina Gómez', email: 'v.gomez@quimicontrol.com', estado: 'Activo' },
	{ id: 'Q005', nombre: 'Mateo Herrera', email: 'm.herrera@quimicontrol.com', estado: 'Activo' },
	{ id: 'Q006', nombre: 'Javier Martínez', email: 'j.martinez@quimicontrol.com', estado: 'Inactivo' },
];

export const Users = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [usuarios] = useState(mockUsers);

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		setIsModalOpen(false);
	};

	return (
		<Layout>
			<div className="p-8 max-w-7xl w-full mx-auto"><div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 gap-4"><div><h2 className="text-xl font-bold text-slate-900 tracking-tight">Gestión de Usuarios</h2><p className="text-xs text-slate-500 mt-0.5">Lista general de empleados activos e inactivos en QuimiControl</p></div><button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg" type="button">+ Nuevo Usuario</button></div>
				<section className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead><tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold"><th className="py-3.5 px-6">ID</th><th className="py-3.5 px-6">Nombre</th><th className="py-3.5 px-6">Correo Electrónico</th><th className="py-3.5 px-6 text-center">Estado</th><th className="py-3.5 px-6 text-center">Acciones</th></tr></thead><tbody className="divide-y divide-slate-100 text-xs text-slate-600">{usuarios.map((user) => <tr key={user.id}><td className="py-4 px-6">{user.id}</td><td className="py-4 px-6 font-semibold text-slate-800">{user.nombre}</td><td className="py-4 px-6">{user.email}</td><td className="py-4 px-6 text-center"><span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${user.estado === 'Activo' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{user.estado}</span></td><td className="py-4 px-6 text-center"><button className="text-slate-400 hover:text-slate-700 mr-3" type="button" aria-label={`Editar ${user.nombre}`}>Editar</button><button className="text-red-400 hover:text-red-600" type="button" aria-label={`Eliminar ${user.nombre}`}>Eliminar</button></td></tr>)}</tbody></table></div></section>
			</div>
			{isModalOpen && <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4"><div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6"><div className="flex items-center justify-between mb-5"><div><h3 className="text-lg font-bold text-slate-900">Crear Nuevo Usuario</h3><p className="text-xs text-slate-500 mt-1">Ingresa los datos para registrar la ficha de asistencia.</p></div><button onClick={() => setIsModalOpen(false)} type="button" aria-label="Cerrar modal">X</button></div><form className="space-y-4" onSubmit={handleSubmit}><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><label className="text-xs font-semibold">RUT<input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" name="rut" required /></label><label className="text-xs font-semibold">Nombre y Apellidos<input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" name="nombre" required /></label></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><label className="text-xs font-semibold">Email<input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" name="email" type="email" required /></label><label className="text-xs font-semibold">Contraseña temporal<input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" name="password" type="password" required /></label></div><div className="flex justify-end gap-3 pt-4 border-t border-slate-100"><button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm border rounded-lg" type="button">Cancelar</button><button className="px-4 py-2 text-sm text-white bg-emerald-600 rounded-lg" type="submit">Crear Usuario</button></div></form></div></div>}
		</Layout>
	);
};
