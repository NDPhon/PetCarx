import { useState } from 'react';
import type { Appointment } from '../../types/appointment';
import { updateAppointmentStatus } from '../../api/appointmentApi';

interface AppointmentItemProps {
  appointment: Appointment;
  onStatusUpdate?: () => void;
}

export default function AppointmentItem({
  appointment,
  onStatusUpdate,
}: AppointmentItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState(appointment.status);

  const handleStatusChange = async (newStatus: string) => {
    if (!appointment.appointment_id) return;

    setIsUpdating(true);
    setError(null);

    try {
      await updateAppointmentStatus({
        appointment_id: appointment.appointment_id,
        status: newStatus,
      });
      setCurrentStatus(newStatus);
      if (onStatusUpdate) {
        onStatusUpdate();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="appointment-item">
      <div className="appointment-header">
        <h3>Appointment #{appointment.appointment_id}</h3>
        <span className={`status-badge status-${currentStatus}`}>
          {currentStatus}
        </span>
      </div>

      <div className="appointment-details">
        <div className="detail-row">
          <span className="label">Customer ID:</span>
          <span className="value">{appointment.customer_id}</span>
        </div>
        <div className="detail-row">
          <span className="label">Pet ID:</span>
          <span className="value">{appointment.pet_id}</span>
        </div>
        <div className="detail-row">
          <span className="label">Branch ID:</span>
          <span className="value">{appointment.branch_id}</span>
        </div>
        <div className="detail-row">
          <span className="label">Employee ID:</span>
          <span className="value">{appointment.employee_id}</span>
        </div>
        <div className="detail-row">
          <span className="label">Time:</span>
          <span className="value">{formatDate(appointment.appointment_time)}</span>
        </div>
        <div className="detail-row">
          <span className="label">Channel:</span>
          <span className="value">{appointment.channel}</span>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="appointment-actions">
        <label htmlFor={`status-${appointment.appointment_id}`}>Update Status:</label>
        <select
          id={`status-${appointment.appointment_id}`}
          value={currentStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={isUpdating}
          className="status-select"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );
}
