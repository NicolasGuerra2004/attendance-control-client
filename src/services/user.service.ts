import { api } from '../api/axiosConfig';

export interface User {
  id: number;
  rut: string;
  name: string;
  lastName: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserCreateDTO {
  rut: string;
  name: string;
  lastName: string;
  phone?: string;
  address?: string;
  email: string;
  password: string;
}

export interface UserUpdateDTO {
  rut?: string;
  name?: string;
  lastName?: string;
  phone?: string;
  address?: string;
}

const API_URL = '/api/users';

export const userService = {
  async getAllUsers(estado: string = 'activo'): Promise<User[]> {
    const response = await api.get<User[]>(API_URL, { params: { estado } });
    return response.data;
  },

  async getUserById(id: number): Promise<User> {
    const response = await api.get<User>(`${API_URL}/${id}`);
    return response.data;
  },

  async createUser(userData: UserCreateDTO): Promise<User> {
    const response = await api.post<User>(API_URL, userData);
    return response.data;
  },

  async updateUser(id: number, userData: UserUpdateDTO): Promise<User> {
    const response = await api.put<User>(`${API_URL}/${id}`, userData);
    return response.data;
  },

  async deleteUser(id: number): Promise<void> {
    await api.delete(`${API_URL}/${id}`);
  },
};