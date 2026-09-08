import { useEffect, useState } from 'react';
import { attendanceService, type DashboardMetricsDTO } from '../services/attendance.service';

export const AttendanceView = () => {
  const [metrics, setMetrics] = useState<DashboardMetricsDTO | null>(null);
  const [checkedIn, setCheckedIn] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAttendanceData = async (): Promise<[DashboardMetricsDTO, boolean]> => {
    const [dashboardData, status] = await Promise.all([
      attendanceService.getDashboardMetrics(),
      attendanceService.hasCheckedInToday(),
    ]);

    return [dashboardData, status];
  };

  const loadAttendanceData = async () => {
    try {
      const [dashboardData, status] = await fetchAttendanceData();
      setMetrics(dashboardData);
      setCheckedIn(status);
    } catch {
      setMessage('No se pudieron cargar los datos de asistencia.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        const [dashboardData, status] = await fetchAttendanceData();
        if (isMounted) {
          setMetrics(dashboardData);
          setCheckedIn(status);
        }
      } catch {
        if (isMounted) {
          setMessage('No se pudieron cargar los datos de asistencia.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadInitialData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCheckIn = async () => {
    setIsSubmitting(true);
    try {
      await attendanceService.checkIn();
      setMessage('¡Entrada registrada con éxito!');
      await loadAttendanceData();
    } catch {
      setMessage('Error al registrar la entrada.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckOut = async () => {
    setIsSubmitting(true);
    try {
      await attendanceService.checkOut();
      setMessage('¡Salida registrada con éxito!');
      await loadAttendanceData();
    } catch {
      setMessage('Error al registrar la salida.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Control de Asistencia</h2>
      {isLoading && <p>Cargando datos...</p>}
      {metrics && !isLoading && (
        <div>
          <p>Presentes hoy: {metrics.presentToday}</p>
          <p>Atrasos hoy: {metrics.lateToday}</p>
          <p>Ausentes hoy: {metrics.absentToday}</p>
        </div>
      )}

      <div>
        {!checkedIn ? (
          <button onClick={handleCheckIn} disabled={isSubmitting || isLoading}>
            {isSubmitting ? 'Procesando...' : 'Marcar Entrada'}
          </button>
        ) : (
          <button onClick={handleCheckOut} disabled={isSubmitting || isLoading}>
            {isSubmitting ? 'Procesando...' : 'Marcar Salida'}
          </button>
        )}
      </div>

      {message && <p>{message}</p>}
    </div>
  );
};