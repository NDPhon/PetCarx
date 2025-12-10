export interface Appointment {
  appointment_id: number | null;
  customer_id: number;
  pet_id: number;
  branch_id: number;
  employee_id: number;
  appointment_time: string;
  status: string;
  channel: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface AppointmentFormData {
  customer_id: number;
  pet_id: number;
  branch_id: number;
  employee_id: number;
  appointment_time: string;
  status: string;
  channel: string;
  service_ids?: number[]; // Optional for creation only
}

export interface UpdateStatusData {
  appointment_id: number;
  status: string;
}

export interface FindByPhoneData {
  phone: string;
}
