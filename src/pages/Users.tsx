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
    const response = error.response;
    if (response && typeof response === 'object' && 'data' in response) {
      const data = response.data;
      if (typeof data === 'string' && data.trim()) return data;
      if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') return data.message;
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsers = async (): Promise<UserManagementDTO[]> => {
    const allUsers = await userService.getManagementUsers();
    return allUsers.filter((user) => user.status.trim().toLowerCase() === 'activo');
  };

  const loadUsers = async () => {
    try {
      setError('');
      setUsers(await fetchUsers());
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'No se pudieron cargar los usuarios.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialUsers = async () => {
      try {
        setUsers(await fetchUsers());
      } catch (requestError) {
        setError(getErrorMessage(requestError, 'No se pudieron cargar los usuarios.'));
      } finally {
        setIsLoading(false);
      }
    };

    void loadInitialUsers();
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
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
      setError(getErrorMessage(requestError, 'No se pudo cargar el usuario.'));
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
        setSuccess('Usuario creado correctamente.');
      } else {
        const updateData: UserUpdateDTO = {
          rut: form.rut,
          name: form.name,
          lastName: form.lastName,
          phone: form.phone,
          address: form.address,
        };
        await userService.updateUser(editingId, updateData);
        setSuccess('Usuario actualizado correctamente.');
      }
      closeModal();
      await loadUsers();
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'No se pudo guardar el usuario.'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (user: UserManagementDTO) => {
    if (!window.confirm(`¿Deseas desactivar a ${user.fullName}?`)) return;

    setDeletingId(user.id);
    setError('');
    setSuccess('');
    try {
      await userService.deleteUser(user.id);
      setSuccess('Usuario eliminado correctamente.');
      await loadUsers();
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'No se pudo eliminar el usuario.'));
    } finally {
      setDeletingId(null);
    }
  };


  return (
    <Layout>
      <div className="p-8 max-w-7xl w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Gestión de Usuarios</h2>
            <p className="text-xs text-slate-500 mt-0.5">Administra las cuentas y datos del personal.</p>
          </div>
          <button onClick={openCreateModal} className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-medium text-xs rounded-lg" type="button" disabled={isLoading}>
            + Nuevo Usuario
          </button>
        </div>

        {error && <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">{error}</p>}
        {success && <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">{success}</p>}

        <section className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          {isLoading ? <p className="p-6 text-sm text-slate-500">Cargando usuarios...</p> : users.length === 0 ? <p className="p-6 text-sm text-slate-500">No hay usuarios activos registrados.</p> : <div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead><tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold"><th className="py-3.5 px-6">ID</th><th className="py-3.5 px-6">Nombre</th><th className="py-3.5 px-6">Correo Electrónico</th><th className="py-3.5 px-6 text-center">Estado</th><th className="py-3.5 px-6 text-center">Acciones</th></tr></thead><tbody className="divide-y divide-slate-100 text-xs text-slate-600">{users.map((user) => <tr key={user.id} className="hover:bg-slate-50/60"><td className="py-4 px-6">{user.id}</td><td className="py-4 px-6 font-semibold text-slate-800">{user.fullName}</td><td className="py-4 px-6">{user.email}</td><td className="py-4 px-6 text-center"><span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium border bg-emerald-50 text-emerald-600 border-emerald-100">{user.status}</span></td><td className="py-4 px-6 text-center"><button onClick={() => void openEditModal(user.id)} className="text-slate-500 hover:text-slate-800 mr-3 disabled:opacity-50" type="button" disabled={deletingId !== null} aria-label={`Editar ${user.fullName}`}>Editar</button><button onClick={() => void handleDelete(user)} className="text-rose-500 hover:text-rose-700 disabled:opacity-50" type="button" disabled={deletingId !== null} aria-label={`Eliminar ${user.fullName}`}>{deletingId === user.id ? 'Procesando...' : 'Eliminar'}</button></td></tr>)}</tbody></table></div>}
        </section>
      </div>

      {isModalOpen && <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="user-modal-title"><div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6"><div className="flex items-center justify-between mb-5"><div><h3 id="user-modal-title" className="text-lg font-bold text-slate-900">{editingId === null ? 'Crear Nuevo Usuario' : 'Editar Usuario'}</h3><p className="text-xs text-slate-500 mt-1">{editingId === null ? 'Ingresa los datos de acceso y del trabajador.' : 'Actualiza los datos personales del trabajador.'}</p></div><button onClick={closeModal} type="button" aria-label="Cerrar modal" disabled={isSaving}>X</button></div><form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><label className="text-xs font-semibold text-slate-700" htmlFor="user-rut">RUT<input id="user-rut" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" value={form.rut} onChange={(event) => handleFieldChange('rut', event.target.value)} required /></label><label className="text-xs font-semibold text-slate-700" htmlFor="user-name">Nombre<input id="user-name" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" value={form.name} onChange={(event) => handleFieldChange('name', event.target.value)} required /></label></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><label className="text-xs font-semibold text-slate-700" htmlFor="user-last-name">Apellidos<input id="user-last-name" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" value={form.lastName} onChange={(event) => handleFieldChange('lastName', event.target.value)} required /></label><label className="text-xs font-semibold text-slate-700" htmlFor="user-email">Email<input id="user-email" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" value={form.email} onChange={(event) => handleFieldChange('email', event.target.value)} type="email" required={editingId === null} disabled={editingId !== null} /></label></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><label className="text-xs font-semibold text-slate-700" htmlFor="user-phone">Teléfono<input id="user-phone" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" value={form.phone} onChange={(event) => handleFieldChange('phone', event.target.value)} /></label><label className="text-xs font-semibold text-slate-700" htmlFor="user-password">Contraseña {editingId === null && '(mínimo 8 caracteres)'}<input id="user-password" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" value={form.password} onChange={(event) => handleFieldChange('password', event.target.value)} type="password" minLength={8} required={editingId === null} disabled={editingId !== null} /></label></div><label className="block text-xs font-semibold text-slate-700" htmlFor="user-address">Dirección<textarea id="user-address" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" value={form.address} onChange={(event) => handleFieldChange('address', event.target.value)} rows={2} /></label><div className="flex justify-end gap-3 pt-4 border-t border-slate-100"><button onClick={closeModal} className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50" type="button" disabled={isSaving}>Cancelar</button><button className="px-4 py-2 text-sm text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:opacity-50" type="submit" disabled={isSaving}>{isSaving ? 'Guardando...' : editingId === null ? 'Crear Usuario' : 'Guardar Cambios'}</button></div></form></div></div>}
    </Layout>
  );
};
