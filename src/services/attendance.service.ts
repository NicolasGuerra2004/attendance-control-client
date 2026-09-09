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

export interface AttendanceRecordDTO {
  id: number;
  userId: number;
  typeAttendance: 'ENTRADA' | 'SALIDA';
  date: string;
  ipOrigin?: string;
}

export interface DashboardMetricsDTO {
  presentToday: number;
  lateToday: number;
  absentToday: number;
}

export interface DailyRecordDTO {
  userId: number;
  fullName: string;
  entryTime: string | null;
  departureTime: string | null;
  status: string;
}

export interface WeeklyHistoryDTO {
  date: string;
  entryTime: string;
  departureTime: string;
  status: string;
}

export interface LateArrivalReportDTO {
  userId: number;
  rut: string;
  fullName: string;
  entry: string;
  delay: number;
}

export interface EarlyDepartureReportDTO {
  userId: number;
  rut: string;
  fullName: string;
  departure: string;
  delay: number;
}

export interface AbsenteeismReportDTO {
  userId: number;
  rut: string;
  fullName: string;
  date: string;
}

const API_URL = '/api/attendance';

export const attendanceService = {
  async checkIn(): Promise<AttendanceRecordDTO> {
    const response = await api.post<AttendanceRecordDTO>(`${API_URL}/check-in`);
    return response.data;
  },

  async checkOut(): Promise<AttendanceRecordDTO> {
    const response = await api.post<AttendanceRecordDTO>(`${API_URL}/check-out`);
    return response.data;
  },

  async getMyWeeklyHistory(): Promise<WeeklyHistoryDTO[]> {
    const response = await api.get<WeeklyHistoryDTO[]>(`${API_URL}/my-weekly-history`);
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

  async getTodayRecords(): Promise<DailyRecordDTO[]> {
    const response = await api.get<DailyRecordDTO[]>(`${API_URL}/today`);
    return Array.isArray(response.data) ? response.data : [];
  },

  async getLateArrivals(date: string): Promise<LateArrivalReportDTO[]> {
    const response = await api.get<LateArrivalReportDTO[]>(`${API_URL}/reports/late-arrivals`, { params: { date } });
    return Array.isArray(response.data) ? response.data : [];
  },

  async getEarlyDepartures(date: string): Promise<EarlyDepartureReportDTO[]> {
    const response = await api.get<EarlyDepartureReportDTO[]>(`${API_URL}/reports/early-departures`, { params: { date } });
    return Array.isArray(response.data) ? response.data : [];
  },

  async getAbsenteeism(date: string): Promise<AbsenteeismReportDTO[]> {
    const response = await api.get<AbsenteeismReportDTO[]>(`${API_URL}/reports/absenteeism`, { params: { date } });
    return Array.isArray(response.data) ? response.data : [];
  },
};