import React, { useEffect, useState } from 'react';
import { userService, type User } from '../services/user.service';

export const UserListView: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAllUsers('activo');
        setUsers(data);
      } catch (err) {
        setError('No se pudieron cargar los usuarios.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Lista de Usuarios Activos</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} {user.lastName} - RUT: {user.rut}
          </li>
        ))}
      </ul>
    </div>
  );
};