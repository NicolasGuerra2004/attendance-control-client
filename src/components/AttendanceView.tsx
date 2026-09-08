import React, { useEffect, useState } from 'react';
import { attendanceService, type DashboardMetricsDTO } from '../services/attendance.service';

export const AttendanceView: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetricsDTO | null>(null);
  const [checkedIn, setCheckedIn] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    loadAttendanceData();
  }, []);

  const loadAttendanceData = async () => {
    try {
      const dashboardData = await attendanceService.getDashboardMetrics();
      const status = await attendanceService.hasCheckedInToday();
      setMetrics(dashboardData);
      setCheckedIn(status);
    } catch (err) {
      console.error('Error al cargar datos de asistencia', err);
    }
  };

  const handleCheckIn = async () => {
    try {
      await attendanceService.checkIn();
      setMessage('¡Entrada registrada con éxito!');
      loadAttendanceData();
    } catch (err) {
      setMessage('Error al registrar la entrada.');
    }
  };

  const handleCheckOut = async () => {
    try {
      await attendanceService.checkOut();
      setMessage('¡Salida registrada con éxito!');
      loadAttendanceData();
    } catch (err) {
      setMessage('Error al registrar la salida.');
    }
  };

  return (
    <div>
      <h2>Control de Asistencia</h2>
      {metrics && (
        <div>
          <p>Presentes hoy: {metrics.presentToday}</p>
          <p>Atrasos hoy: {metrics.lateToday}</p>
          <p>Ausentes hoy: {metrics.absentToday}</p>
        </div>
      )}

      <div>
        {!checkedIn ? (
          <button onClick={handleCheckIn}>Marcar Entrada</button>
        ) : (
          <button onClick={handleCheckOut}>Marcar Salida</button>
        )}
      </div>

      {message && <p>{message}</p>}
    </div>
  );
};