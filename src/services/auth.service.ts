import { api } from '../api/axiosConfig';

export interface LoginRequestDTO {
	email: string;
	password: string;
}

export interface LoginResponseDTO {
	token: string;
}

export const authService = {
	async login(credentials: LoginRequestDTO): Promise<LoginResponseDTO> {
		const response = await api.post<LoginResponseDTO>('/api/auth/login', credentials);
		localStorage.setItem('token', response.data.token);
		return response.data;
	},

	logout(): void {
		localStorage.removeItem('token');
	},

	isAuthenticated(): boolean {
		return Boolean(localStorage.getItem('token'));
	},
};