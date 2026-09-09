import { api } from '../api/axiosConfig';

export interface LoginRequestDTO {
	email: string;
	password: string;
}

export interface LoginResponseDTO {
	token: string;
	email: string;
	fullName: string;
	rol: string;
}

const SESSION_KEY = 'auth_session';

export const isAdminRole = (role: string | undefined): boolean => {
	const normalizedRole = role?.trim().toUpperCase().replace(/^ROLE_/, '');
	return normalizedRole === 'ADMIN';
};

export const authService = {
	async login(credentials: LoginRequestDTO): Promise<LoginResponseDTO> {
		this.clearSession();
		const response = await api.post<LoginResponseDTO>('/api/auth/login', credentials);
		localStorage.setItem('token', response.data.token);
		localStorage.setItem(SESSION_KEY, JSON.stringify(response.data));
		return response.data;
	},

	logout(): void {
		localStorage.removeItem('token');
		localStorage.removeItem(SESSION_KEY);
		void api.post('/api/auth/logout').catch(() => undefined);
	},

	getSession(): LoginResponseDTO | null {
		const session = localStorage.getItem(SESSION_KEY);
		if (!session) return null;

		try {
			return JSON.parse(session) as LoginResponseDTO;
		} catch {
			localStorage.removeItem(SESSION_KEY);
			return null;
		}
	},

	isAdmin(): boolean {
		return isAdminRole(this.getSession()?.rol);
	},

	clearSession(): void {
		localStorage.removeItem('token');
		localStorage.removeItem(SESSION_KEY);
	},

	isAuthenticated(): boolean {
		return Boolean(localStorage.getItem('token'));
	},
};