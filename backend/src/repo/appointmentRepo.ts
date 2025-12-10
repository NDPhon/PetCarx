import pool from "../config/db";
import { Appointment } from "../model/appointment";

export interface IAppointmentResult {
  fnc_insert_appointment: number;
}

export const insertAppointmentRepo = async (
  appt: Appointment & { service_ids?: number[] }
): Promise<IAppointmentResult> => {
  const query = `
    SELECT * FROM fnc_insert_appointment(
      $1, $2, $3, $4, $5, $6, $7
    )
  `;

  const values = [
    appt.customer_id,
    appt.pet_id,
    appt.branch_id,
    appt.employee_id,
    appt.appointment_time,
    appt.status,
    appt.channel,
  ];

  const res = await pool.query(query, values);
  return res.rows[0];
};

export const getAppointmentsRepo = async (): Promise<Appointment[]> => {
  const query = `SELECT * FROM fnc_get_appointments()`;
  const res = await pool.query(query);
  return res.rows;
};

export const updateAppointmentStatusRepo = async (
  appointment_id: number,
  status: string
): Promise<void> => {
  const query = `
    SELECT * FROM fnc_update_appointment_status($1, $2) 
  `;

  const values = [appointment_id, status];
  await pool.query(query, values);
};

export const findAppointmentByPhoneRepo = async (
  phone: string
): Promise<Appointment[]> => {
  const query = `
    SELECT * FROM fnc_find_appointments_by_phone($1)
  `;
  const values = [phone];

  const res = await pool.query(query, values);
  return res.rows;
};
