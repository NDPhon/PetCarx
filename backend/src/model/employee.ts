export class Employee {
  employee_id: number;
  branch_id: number;
  full_name: string;
  gender?: "M" | "F" | "O";
  date_of_birth?: Date;
  hire_date: Date;
  base_salary?: number;
  position: "Doctor" | "Sales" | "Receptionist" | "BranchManager" | "Assistant";
  status: "Active" | string;

  constructor(data: Partial<Employee>) {
    this.employee_id = data.employee_id!;
    this.branch_id = data.branch_id!;
    this.full_name = data.full_name!;
    this.gender = data.gender;
    this.date_of_birth = data.date_of_birth;
    this.hire_date = data.hire_date || new Date();
    this.base_salary = data.base_salary || 0;
    this.position = data.position!;
    this.status = data.status || "Active";
  }
}
