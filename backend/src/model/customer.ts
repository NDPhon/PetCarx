export class Customer {
  customer_id: number;
  full_name: string;
  gender?: "M" | "F" | "O";
  date_of_birth?: Date;
  phone: string;
  email?: string;
  national_id?: string;
  join_date: Date;
  total_spending: number;
  tier_id: number;
  loyalty_points: number;

  constructor(data: Partial<Customer>) {
    this.customer_id = data.customer_id ?? 0;
    this.full_name = data.full_name ?? "";
    this.gender = data.gender;
    this.date_of_birth = data.date_of_birth
      ? new Date(data.date_of_birth)
      : undefined;
    this.phone = data.phone ?? "";
    this.email = data.email;
    this.national_id = data.national_id;
    this.join_date = data.join_date ? new Date(data.join_date) : new Date();
    this.total_spending = data.total_spending ?? 0;
    this.tier_id = data.tier_id ?? 1;
    this.loyalty_points = data.loyalty_points ?? 0;
  }
}
