"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertAppointmentService = void 0;
const appointmentRepo_1 = require("../repo/appointmentRepo");
const insertAppointmentService = async (appt) => {
    return await (0, appointmentRepo_1.insertAppointmentRepo)(appt);
};
exports.insertAppointmentService = insertAppointmentService;
//# sourceMappingURL=appointmentService.js.map