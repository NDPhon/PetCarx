import { useState, FormEvent } from 'react';
import type { AppointmentFormData } from '../../types/appointment';
import { addAppointment } from '../../api/appointmentApi';

interface AppointmentFormProps {
  onSuccess?: () => void;
}

export default function AppointmentForm({ onSuccess }: AppointmentFormProps) {
  const [formData, setFormData] = useState<AppointmentFormData>({
    customer_id: 0,
    pet_id: 0,
    branch_id: 0,
    employee_id: 0,
    appointment_time: '',
    status: 'pending',
    channel: 'web',
    service_ids: [],
  });
  const [serviceInput, setServiceInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['customer_id', 'pet_id', 'branch_id', 'employee_id'].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleServiceIdsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServiceInput(e.target.value);
  };

  const handleServiceIdsBlur = () => {
    if (serviceInput.trim()) {
      const ids = serviceInput
        .split(',')
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));
      setFormData((prev) => ({
        ...prev,
        service_ids: ids,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await addAppointment(formData);
      setSuccess(response.message);
      // Reset form
      setFormData({
        customer_id: 0,
        pet_id: 0,
        branch_id: 0,
        employee_id: 0,
        appointment_time: '',
        status: 'pending',
        channel: 'web',
        service_ids: [],
      });
      setServiceInput('');
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="appointment-form-container">
      <h2>Create New Appointment</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="form-group">
          <label htmlFor="customer_id">Customer ID</label>
          <input
            type="number"
            id="customer_id"
            name="customer_id"
            value={formData.customer_id || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="pet_id">Pet ID</label>
          <input
            type="number"
            id="pet_id"
            name="pet_id"
            value={formData.pet_id || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="branch_id">Branch ID</label>
          <input
            type="number"
            id="branch_id"
            name="branch_id"
            value={formData.branch_id || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="employee_id">Employee ID</label>
          <input
            type="number"
            id="employee_id"
            name="employee_id"
            value={formData.employee_id || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="appointment_time">Appointment Time</label>
          <input
            type="datetime-local"
            id="appointment_time"
            name="appointment_time"
            value={formData.appointment_time}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="channel">Channel</label>
          <select
            id="channel"
            name="channel"
            value={formData.channel}
            onChange={handleInputChange}
            required
          >
            <option value="web">Web</option>
            <option value="phone">Phone</option>
            <option value="app">App</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="service_ids">Service IDs (comma-separated, optional)</label>
          <input
            type="text"
            id="service_ids"
            name="service_ids"
            value={serviceInput}
            onChange={handleServiceIdsChange}
            onBlur={handleServiceIdsBlur}
            placeholder="e.g., 1, 2, 3"
          />
          {formData.service_ids && formData.service_ids.length > 0 && (
            <small>Selected: {formData.service_ids.join(', ')}</small>
          )}
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Creating...' : 'Create Appointment'}
        </button>
      </form>
    </div>
  );
}
