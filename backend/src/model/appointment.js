"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = void 0;
class Appointment {
    constructor(customer_id, pet_id, branch_id, employee_id, appointment_time, status, channel, service_ids, appointment_id = null) {
        this.appointment_id = appointment_id;
        this.customer_id = customer_id;
        this.pet_id = pet_id;
        this.branch_id = branch_id;
        this.employee_id = employee_id;
        this.appointment_time = appointment_time;
        this.status = status;
        this.channel = channel;
        this.service_ids = service_ids;
    }
}
exports.Appointment = Appointment;
//# sourceMappingURL=appointment.js.map