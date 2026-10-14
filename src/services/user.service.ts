import { api } from '../api/axiosConfig';

export interface User {
  id: number;
  rut: string;
  name: string;
  lastName: string;
  phone?: string;
  address?: string;
  createAt?: string;
  updateAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
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

export interface UserManagementDTO {
  id: number;
  fullName: string;
  email: string;
  status: string;
}

const API_URL = '/api/users';

export const userService = {
  async getManagementUsers(): Promise<UserManagementDTO[]> {
    const response = await api.get<UserManagementDTO[]>(`${API_URL}/management`);
    return response.data;
  },

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

  async getUsersPaginated(page: number = 0, size: number = 10, sort: string = 'name'): Promise<Page<User>> {
    const response = await api.get<Page<User>>(`${API_URL}/paginated`, {
      params: { page, size, sort },
    });
    return response.data;
  },
};