import {
  insertAppointmentRepo,
  IAppointmentResult,
  getAppointmentsRepo,
  updateAppointmentStatusRepo,
  findAppointmentByPhoneRepo,
} from "../repo/appointmentRepo";
import { Appointment } from "../model/appointment";

export const insertAppointmentService = async (
  appt: Appointment & { service_ids?: number[] }
): Promise<IAppointmentResult> => {
  return await insertAppointmentRepo(appt);
};

export const getAppointmentsService = async (): Promise<Appointment[]> => {
  return await getAppointmentsRepo();
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
