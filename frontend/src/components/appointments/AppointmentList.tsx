import { useState, useEffect } from 'react';
import type { Appointment } from '../../types/appointment';
import { getAppointments } from '../../api/appointmentApi';
import AppointmentItem from './AppointmentItem';

interface AppointmentListProps {
  refreshTrigger?: number;
}

export default function AppointmentList({ refreshTrigger }: AppointmentListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAppointments();
      setAppointments(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [refreshTrigger]);

  const handleStatusUpdate = () => {
    fetchAppointments();
  };

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="appointment-list-container">
      <h2>Appointments</h2>
      {appointments.length === 0 ? (
        <p className="no-appointments">No appointments found.</p>
      ) : (
        <div className="appointment-list">
          {appointments.map((appointment) => (
            <AppointmentItem
              key={appointment.appointment_id}
              appointment={appointment}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
