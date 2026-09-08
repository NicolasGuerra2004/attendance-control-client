import { api } from '../api/axiosConfig';

export interface AttendanceRequestDTO {
  userId: number;
  type: 'ENTRADA' | 'SALIDA';
  ipOrigin?: string;
}

export interface AttendanceResponseDTO {
  id: number;
  userId: number;
  userFullName: string;
  type: 'ENTRADA' | 'SALIDA';
  date: string;
  ipOrigin?: string;
}

export interface DashboardMetricsDTO {
  presentToday: number;
  lateToday: number;
  absentToday: number;
}

const API_URL = '/api/attendance';

export const attendanceService = {
  async checkIn(): Promise<AttendanceResponseDTO> {
    const response = await api.post<AttendanceResponseDTO>(`${API_URL}/check-in`);
    return response.data;
  },

  async checkOut(): Promise<AttendanceResponseDTO> {
    const response = await api.post<AttendanceResponseDTO>(`${API_URL}/check-out`);
    return response.data;
  },

  async hasCheckedInToday(): Promise<boolean> {
    const response = await api.get<boolean>(`${API_URL}/has-checked-in-today`);
    return response.data;
  },

  async getDashboardMetrics(): Promise<DashboardMetricsDTO> {
    const response = await api.get<DashboardMetricsDTO>(`${API_URL}/dashboard`);
    return response.data;
  },
};