export class Branch {
  branch_id: number;
  name: string;
  address: string;
  phone: string;
  open_time: string; // HH:MM:SS
  close_time: string; // HH:MM:SS
  is_active: boolean;

  constructor(data: Partial<Branch>) {
    this.branch_id = data.branch_id!;
    this.name = data.name!;
    this.address = data.address!;
    this.phone = data.phone!;
    this.open_time = data.open_time!;
    this.close_time = data.close_time!;
    this.is_active = data.is_active !== undefined ? data.is_active : true;
  }
}
