"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertAppointmentRepo = void 0;
const db_1 = __importDefault(require("../config/db"));
const insertAppointmentRepo = async (appt) => {
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
    const res = await db_1.default.query(query, values);
    return res.rows[0];
};
exports.insertAppointmentRepo = insertAppointmentRepo;
//# sourceMappingURL=appointmentRepo.js.map