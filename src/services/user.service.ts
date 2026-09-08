import axios from 'axios';

export interface User {
  id: number;
  rut: string;
  name: string;
  lastName: string;
  phone?: string;
  address?: string;
  createAt?: string;
  updateAt?: string;
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

const API_URL = 'http://localhost:3040/api/users';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const userService = {
  async getAllUsers(estado: string = 'activo'): Promise<User[]> {
    const response = await axios.get<User[]>(`${API_URL}?estado=${estado}`, getAuthHeader());
    return response.data;
  },

  async getUserById(id: number): Promise<User> {
    const response = await axios.get<User[]>(`${API_URL}/${id}`, getAuthHeader());
    return response.data as unknown as User;
  },

  async createUser(userData: UserCreateDTO): Promise<User> {
    const response = await axios.post<User>(API_URL, userData, getAuthHeader());
    return response.data;
  },

  async updateUser(id: number, userData: UserUpdateDTO): Promise<User> {
    const response = await axios.put<User>(`${API_URL}/${id}`, userData, getAuthHeader());
    return response.data;
  },

  async deleteUser(id: number): Promise<void> {
    await axios.delete(`${API_URL}/${id}`, getAuthHeader());
  }
};