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

export interface RegisterRequestDTO {
	rut: string;
	name: string;
	lastName: string;
	phone?: string;
	address?: string;
	email: string;
	password: string;
}

const normalizeLoginResponse = (data: LoginResponseDTO | LoginResponseDTO[]): LoginResponseDTO => {
	const session = Array.isArray(data) ? data[0] : data;

	if (!session || typeof session.token !== 'string' || !session.token.trim()) {
		throw new Error('El servidor devolvió una sesión de login inválida.');
	}

	return session;
};

const SESSION_KEY = 'auth_session';

export const isAdminRole = (role: string | undefined): boolean => {
	const normalizedRole = role?.trim().toUpperCase().replace(/^ROLE_/, '');
	return normalizedRole === 'ADMIN';
};

export const authService = {
	async login(credentials: LoginRequestDTO): Promise<LoginResponseDTO> {
		this.clearSession();
		const response = await api.post<LoginResponseDTO | LoginResponseDTO[]>('/api/auth/login', credentials);
		const session = normalizeLoginResponse(response.data);
		localStorage.setItem('token', session.token);
		localStorage.setItem(SESSION_KEY, JSON.stringify(session));
		return session;
	},

	async register(userData: RegisterRequestDTO): Promise<unknown> {
		const response = await api.post('/api/auth/register', userData);
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