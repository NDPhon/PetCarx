import {
  insertAppointmentRepo,
  IAppointmentResult,
} from "../repo/appointmentRepo";
import { Appointment } from "../model/appointment";

export const insertAppointmentService = async (
  appt: Appointment
): Promise<IAppointmentResult> => {
  return await insertAppointmentRepo(appt);
};
