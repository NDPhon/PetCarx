export class Invoice {
  invoice_id: number; // ID hóa đơn
  branch_id: number; // ID chi nhánh
  customer_id: number; // ID khách hàng
  employee_id: number; // ID nhân viên
  created_at: Date; // Ngày tạo hóa đơn
  total_amount: number; // Tổng tiền
  discount_amount: number; // Tiền giảm giá
  final_amount: number; // Tiền cuối cùng
  promotion_id?: number; // ID khuyến mãi (nullable)
  payment_status: string; // Trạng thái thanh toán

  constructor(
    invoice_id: number,
    branch_id: number,
    customer_id: number,
    employee_id: number,
    created_at: Date = new Date(),
    total_amount: number = 0,
    discount_amount: number = 0,
    final_amount: number = 0,
    payment_status: string = "Pending",
    promotion_id?: number
  ) {
    this.invoice_id = invoice_id;
    this.branch_id = branch_id;
    this.customer_id = customer_id;
    this.employee_id = employee_id;
    this.created_at = created_at;
    this.total_amount = total_amount;
    this.discount_amount = discount_amount;
    this.final_amount = final_amount;
    this.payment_status = payment_status;
    this.promotion_id = promotion_id;
  }
}
