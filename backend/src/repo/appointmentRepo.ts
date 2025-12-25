import pool from "../config/db";
import { Appointment } from "../model/appointment";
import { Service } from "../model/service";

export interface IAppointmentResult {
  appointment_id: number;
}

export const insertAppointmentRepo = async (
  appt: Appointment
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

export const getServicesByAppointmentIdRepo = async (
  appointment_id: number
): Promise<Service[]> => {
  const query = `
    SELECT * FROM fnc_get_services_by_appointment($1)
  `;
  const values = [appointment_id];
  const res = await pool.query(query, values);
  return res.rows;
};

export const addServiceToAppointmentRepo = async (
  appointment_id: number,
  service_id: number
): Promise<void> => {
  const query = `
    SELECT * FROM fnc_add_service_to_appointment($1, $2)
  `;
  const values = [appointment_id, service_id];
  await pool.query(query, values);
};
