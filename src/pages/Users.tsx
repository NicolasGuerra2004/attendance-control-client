import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Layout } from '../components/Layout';
import {
  userService,
  type UserCreateDTO,
  type UserManagementDTO,
  type UserUpdateDTO,
} from '../services/user.service';

type UserForm = UserCreateDTO;

const emptyForm: UserForm = {
  rut: '',
  name: '',
  lastName: '',
  phone: '',
  address: '',
  email: '',
  password: '',
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { data?: unknown } }).response;
    if (response && response.data) {
      const data = response.data;
      if (typeof data === 'string' && data.trim()) return data;
      if (typeof data === 'object') {
        const obj = data as Record<string, unknown>;
        if (typeof obj.message === 'string' && obj.message.trim()) return obj.message;
        if (typeof obj.error === 'string' && obj.error.trim()) return obj.error;
      }
    }
  }
  return fallback;
};

export const Users = () => {
  const [users, setUsers] = useState<UserManagementDTO[]>([]);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<'TODOS' | 'ACTIVO' | 'INACTIVO'>('TODOS');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      setError('');
      const data = await userService.getManagementUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'No se pudieron cargar los usuarios.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchInitialUsers = async () => {
      try {
        const data = await userService.getManagementUsers();
        if (isMounted) {
          setUsers(Array.isArray(data) ? data : []);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(getErrorMessage(requestError, 'No se pudieron cargar los usuarios.'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchInitialUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setIsSaving(false);
  };

  const openCreateModal = () => {
    setError('');
    setSuccess('');
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = async (id: number) => {
    setError('');
    setSuccess('');
    setEditingId(id);
    setIsModalOpen(true);
    setIsSaving(true);

    try {
      const user = await userService.getUserById(id);
      setForm({
        rut: user.rut,
        name: user.name,
        lastName: user.lastName,
        phone: user.phone ?? '',
        address: user.address ?? '',
        email: '',
        password: '',
      });
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'No se pudo cargar el usuario para edición.'));
      setIsModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (field: keyof UserForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      if (editingId === null) {
        await userService.createUser(form);
        setSuccess('Usuario creado exitosamente.');
      } else {
        const updateData: UserUpdateDTO = {
          rut: form.rut,
          name: form.name,
          lastName: form.lastName,
          phone: form.phone,
          address: form.address,
        };
        await userService.updateUser(editingId, updateData);
        setSuccess('Usuario actualizado exitosamente.');
      }
      closeModal();
      await loadUsers();
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'No se pudo procesar la solicitud. Verifica los datos.'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (user: UserManagementDTO) => {
    if (!window.confirm(`¿Deseas dar de baja a ${user.fullName}?`)) return;

    setDeletingId(user.id);
    setError('');
    setSuccess('');
    try {
      await userService.deleteUser(user.id);
      setSuccess(`Usuario ${user.fullName} desactivado correctamente.`);
      await loadUsers();
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'No se pudo desactivar el usuario.'));
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    const normalizedStatus = user.status.toUpperCase().trim();
    if (statusFilter === 'TODOS') return true;
    return normalizedStatus === statusFilter;
  });

  return (
    <Layout>
      <div className="p-8 max-w-7xl w-full mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Gestión de Usuarios</h2>
            <p className="text-xs text-slate-500 mt-0.5">Administra las cuentas y datos del personal</p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 text-white font-semibold text-xs rounded-lg shadow-sm transition-all"
            type="button"
            disabled={isLoading}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span>Nuevo Usuario</span>
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800" role="status">
            {success}
          </div>
        )}

        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium text-slate-600">
              {(['TODOS', 'ACTIVO', 'INACTIVO'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    statusFilter === filter
                      ? 'bg-white font-semibold text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {filter === 'TODOS' ? 'Todos' : filter === 'ACTIVO' ? 'Activos' : 'Inactivos'}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 text-xs rounded-lg border border-slate-200 bg-slate-50/50 py-1.5 pl-8 pr-3 outline-none focus:border-emerald-600 focus:bg-white transition-colors"
              />
              <svg
                className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-xs text-slate-400">Cargando colaboradores...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                  />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-700">No se encontraron usuarios</p>
              <p className="text-xs text-slate-400 mt-1">
                {searchTerm
                  ? 'No hay registros que coincidan con el término de búsqueda.'
                  : 'No hay usuarios registrados con el filtro seleccionado.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    <th className="py-3 px-6">ID</th>
                    <th className="py-3 px-6">Nombre Completo</th>
                    <th className="py-3 px-6">Correo Electrónico</th>
                    <th className="py-3 px-6 text-center">Estado</th>
                    <th className="py-3 px-6 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {filteredUsers.map((user) => {
                    const isActive = user.status.toUpperCase().trim() === 'ACTIVO';
                    return (
                      <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-6 font-mono text-slate-400">{user.id}</td>
                        <td className="py-3.5 px-6 font-semibold text-slate-800">{user.fullName}</td>
                        <td className="py-3.5 px-6 font-mono text-slate-600">{user.email}</td>
                        <td className="py-3.5 px-6 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border-slate-200'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-center">
                          <button
                            onClick={() => void openEditModal(user.id)}
                            className="text-xs font-semibold text-slate-600 hover:text-emerald-700 mr-3.5 transition-colors disabled:opacity-50"
                            type="button"
                            disabled={deletingId !== null}
                          >
                            Editar
                          </button>
                          {isActive && (
                            <button
                              onClick={() => void handleDelete(user)}
                              className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors disabled:opacity-50"
                              type="button"
                              disabled={deletingId !== null}
                            >
                              {deletingId === user.id ? 'Desactivando...' : 'Desactivar'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 sm:p-7 border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingId === null ? 'Registrar Nuevo Usuario' : 'Editar Usuario'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {editingId === null
                    ? 'Completa los datos de acceso y del colaborador'
                    : 'Actualiza los datos personales del colaborador'}
                </p>
              </div>
              <button
                onClick={closeModal}
                type="button"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                disabled={isSaving}
              >
                ✕
              </button>
            </div>

            <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="user-rut">
                    RUT *
                  </label>
                  <input
                    id="user-rut"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                    value={form.rut}
                    onChange={(e) => handleFieldChange('rut', e.target.value)}
                    placeholder="12345678-9"
                    maxLength={12}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="user-name">
                    Nombre *
                  </label>
                  <input
                    id="user-name"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                    value={form.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    placeholder="Juan"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="user-last-name">
                    Apellidos *
                  </label>
                  <input
                    id="user-last-name"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                    value={form.lastName}
                    onChange={(e) => handleFieldChange('lastName', e.target.value)}
                    placeholder="Pérez"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="user-phone">
                    Teléfono
                  </label>
                  <input
                    id="user-phone"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                    value={form.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    placeholder="+56 9 1234 5678"
                  />
                </div>
              </div>

              {editingId === null && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="user-email">
                      Correo Electrónico *
                    </label>
                    <input
                      id="user-email"
                      type="email"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                      value={form.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      placeholder="usuario@quimicontrol.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="user-password">
                      Contraseña * (mínimo 8 caracteres)
                    </label>
                    <input
                      id="user-password"
                      type="password"
                      minLength={8}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                      value={form.password}
                      onChange={(e) => handleFieldChange('password', e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="user-address">
                  Dirección
                </label>
                <textarea
                  id="user-address"
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-colors resize-none"
                  value={form.address}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  placeholder="Av. Industrial 1234, Santiago"
                />
              </div>

              <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors disabled:opacity-60"
                >
                  {isSaving ? 'Guardando...' : editingId === null ? 'Crear Usuario' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};
