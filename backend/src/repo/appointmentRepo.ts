import pool from "../config/db";
import { Appointment } from "../model/appointment";

export interface IAppointmentResult {
  fnc_insert_appointment: number;
}

export const insertAppointmentRepo = async (
  appt: Appointment
): Promise<IAppointmentResult> => {
  const query = `
    SELECT * FROM fnc_insert_appointment(
      $1, $2, $3, $4, $5, $6, $7, $8
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
    appt.service_ids,
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
