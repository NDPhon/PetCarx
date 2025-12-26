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

  try {
    const res = await pool.query(query, values);
    return res.rows[0];
  } catch (err) {
    // Fallback: insert into demo_appointments for local testing
    const petName = appt.pet_id ? `pet-${appt.pet_id}` : 'pet-NA';
    const ownerName = appt.customer_id ? `cust-${appt.customer_id}` : 'cust-NA';
    const notes = JSON.stringify({ status: appt.status || 'Pending', channel: appt.channel || 'Online' });
    const demo = await pool.query(
      'INSERT INTO demo_appointments (pet_name, owner_name, phone, service, date, time, notes) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
      [petName, ownerName, null, Array.isArray(appt.service_ids) ? appt.service_ids.join(',') : null, appt.appointment_time || null, null, notes]
    );
    return { fnc_insert_appointment: demo.rows[0]?.id } as IAppointmentResult;
  }
};

export const getAppointmentsRepo = async (page: number, limit: number) => {
  const offset = (page - 1) * limit;

  const dataQuery = `
    SELECT * FROM fnc_get_appointments_paging($1, $2)
  `;

  const countQuery = `
    SELECT COUNT(*) FROM appointment
  `;

  const [dataRes, countRes] = await Promise.all([
    pool.query(dataQuery, [limit, offset]),
    pool.query(countQuery),
  ]);

  return {
    data: dataRes.rows,
    total: Number(countRes.rows[0].count),
  };
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
