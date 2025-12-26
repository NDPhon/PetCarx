import {
  insertAppointmentRepo,
  IAppointmentResult,
  getAppointmentsRepo,
  updateAppointmentStatusRepo,
  findAppointmentByPhoneRepo,
  getServicesByAppointmentIdRepo,
  addServiceToAppointmentRepo,
  getAppointmentByDoctorIdRepo,
} from "../repo/appointmentRepo";
import { Appointment } from "../model/appointment";
import { Service } from "../model/service";

export const insertAppointmentService = async (
  appt: Appointment
): Promise<IAppointmentResult> => {
  return await insertAppointmentRepo(appt);
};

export const getAppointmentsService = async (page: number, limit: number) => {
  return await getAppointmentsRepo(page, limit);
};

export const updateAppointmentStatusService = async (
  appointment_id: number,
  status: string
): Promise<void> => {
  return await updateAppointmentStatusRepo(appointment_id, status);
};

export const findAppointmentByPhoneService = async (
  phone: string
): Promise<Appointment[]> => {
  return await findAppointmentByPhoneRepo(phone);
};

export const getServicesByAppointmentIdService = async (
  appointment_id: number
): Promise<Service[]> => {
  return await getServicesByAppointmentIdRepo(appointment_id);
};

export const addServiceToAppointmentService = async (
  appointment_id: number,
  service_id: number
): Promise<void> => {
  return await addServiceToAppointmentRepo(appointment_id, service_id);
};

export const getAppointmentByDoctorIdService = async (
  doctor_id: number,
  start_date: string | null = null,
  end_date: string | null = null
): Promise<Appointment[]> => {
  return await getAppointmentByDoctorIdRepo(doctor_id, start_date, end_date);
};
