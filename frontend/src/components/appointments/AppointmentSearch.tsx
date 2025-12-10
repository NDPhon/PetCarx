import { useState, FormEvent } from 'react';
import type { Appointment } from '../../types/appointment';
import { findAppointmentByPhone } from '../../api/appointmentApi';
import AppointmentItem from './AppointmentItem';

export default function AppointmentSearch() {
  const [phone, setPhone] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSearched(false);

    try {
      const response = await findAppointmentByPhone({ phone });
      setAppointments(response.data);
      setSearched(true);
    } catch (err: any) {
      setError(err.message || 'Failed to search appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (phone) {
      setLoading(true);
      try {
        const response = await findAppointmentByPhone({ phone });
        setAppointments(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to refresh appointments');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="appointment-search-container">
      <h2>Search Appointments by Phone</h2>
      
      <form onSubmit={handleSubmit} className="search-form">
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
            required
          />
        </div>
        <button type="submit" disabled={loading} className="search-btn">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {searched && !loading && (
        <div className="search-results">
          <h3>Search Results</h3>
          {appointments.length === 0 ? (
            <p className="no-appointments">No appointments found for this phone number.</p>
          ) : (
            <div className="appointment-list">
              {appointments.map((appointment) => (
                <AppointmentItem
                  key={appointment.appointment_id}
                  appointment={appointment}
                  onStatusUpdate={handleRefresh}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
