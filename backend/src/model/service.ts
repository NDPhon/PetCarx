export class Service {
  service_id: number;
  service_name: string;
  service_type: "Exam" | "Vaccination" | "Other";
  base_price: number;
  description?: string | null;
  is_active: boolean;

  constructor(
    service_id: number,
    service_name: string,
    service_type: "Exam" | "Vaccination" | "Other",
    base_price: number,
    description?: string | null,
    is_active: boolean = true
  ) {
    this.service_id = service_id;
    this.service_name = service_name;
    this.service_type = service_type;
    this.base_price = base_price;
    this.description = description || null;
    this.is_active = is_active;
  }
}
