import axios from 'axios';

export interface AttendanceRequestDTO {
  userId: number;
  type: 'ENTRADA' | 'SALIDA';
  ipOrigin?: string;
}

export interface AttendanceResponseDTO {
  id: number;
  userId: number;
  userFullName: string;
  type: string;
  date: string;
  ipOrigin: string;
}

export interface DashboardMetricsDTO {
  presentToday: number;
  lateToday: number;
  absentToday: number;
}

const API_URL = 'http://localhost:3040/api/attendance';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const attendanceService = {
  async checkIn(): Promise<any> {
    const response = await axios.post(`${API_URL}/check-in`, {}, getAuthHeader());
    return response.data;
  },

  async checkOut(): Promise<any> {
    const response = await axios.post(`${API_URL}/check-out`, {}, getAuthHeader());
    return response.data;
  },

  async hasCheckedInToday(): Promise<boolean> {
    const response = await axios.get<boolean>(`${API_URL}/has-checked-in-today`, getAuthHeader());
    return response.data;
  },

  async getDashboardMetrics(): Promise<DashboardMetricsDTO> {
    const response = await axios.get<DashboardMetricsDTO>(`${API_URL}/dashboard`, getAuthHeader());
    return response.data;
  }
};