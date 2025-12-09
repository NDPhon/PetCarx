import type {
  Appointment,
  ApiResponse,
  AppointmentFormData,
  UpdateStatusData,
  FindByPhoneData,
} from '../types/appointment';
import { getApiUrl, handleApiError } from '../utils/api';

/**
 * Add a new appointment
 */
export const addAppointment = async (
  appointmentData: AppointmentFormData
): Promise<ApiResponse<Appointment>> => {
  try {
    const response = await fetch(getApiUrl('/api/appointments/add-appointment'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get all appointments
 */
export const getAppointments = async (): Promise<ApiResponse<Appointment[]>> => {
  try {
    const response = await fetch(getApiUrl('/api/appointments/get-appointments'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Update appointment status
 */
export const updateAppointmentStatus = async (
  updateData: UpdateStatusData
): Promise<ApiResponse<UpdateStatusData>> => {
  try {
    const response = await fetch(getApiUrl('/api/appointments/update-status'), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Find appointments by phone number
 */
export const findAppointmentByPhone = async (
  phoneData: FindByPhoneData
): Promise<ApiResponse<Appointment[]>> => {
  try {
    const response = await fetch(getApiUrl('/api/appointments/find-by-phone'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(phoneData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
