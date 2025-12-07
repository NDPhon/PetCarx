export class Appointment {
  appointment_id: number | null;
  customer_id: number;
  pet_id: number;
  branch_id: number;
  employee_id: number;
  appointment_time: Date;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  channel: "Online" | "Offline";
  service_ids: number[];

  constructor(
    customer_id: number,
    pet_id: number,
    branch_id: number,
    employee_id: number,
    appointment_time: Date,
    status: "Pending" | "Confirmed" | "Completed" | "Cancelled",
    channel: "Online" | "Offline",
    service_ids: number[],
    appointment_id: number | null = null
  ) {
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
