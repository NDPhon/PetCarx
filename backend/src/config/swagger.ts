import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PetCarx API Documentation",
      version: "1.0.0",
      description: "API documentation cho hệ thống quản lý PetCarx",
      contact: {
        name: "PetCarx Team",
        url: "https://github.com/NDPhon/PetCarx",
      },
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Development server",
      },
    ],
    tags: [
      {
        name: "Appointments",
        description: "Quản lý lịch hẹn",
      },
      {
        name: "Customers",
        description: "Quản lý khách hàng",
      },
      {
        name: "Employees",
        description: "Quản lý nhân viên",
      },
      {
        name: "Branches",
        description: "Quản lý chi nhánh",
      },
      {
        name: "Products",
        description: "Quản lý sản phẩm và vaccine",
      },
      {
        name: "Invoices",
        description: "Quản lý hóa đơn",
      },
      {
        name: "Analyze",
        description: "Phân tích và thống kê",
      },
    ],
    components: {
      schemas: {
        // Response Schema
        ApiResponse: {
          type: "object",
          properties: {
            code: {
              type: "integer",
              description: "HTTP status code",
            },
            message: {
              type: "string",
              description: "Response message",
            },
            data: {
              type: "object",
              nullable: true,
              description: "Response data",
            },
          },
        },
        // Appointment Schema
        Appointment: {
          type: "object",
          properties: {
            appointment_id: {
              type: "integer",
              nullable: true,
              description: "ID lịch hẹn",
            },
            customer_id: {
              type: "integer",
              description: "ID khách hàng",
            },
            pet_id: {
              type: "integer",
              description: "ID thú cưng",
            },
            branch_id: {
              type: "integer",
              description: "ID chi nhánh",
            },
            employee_id: {
              type: "integer",
              description: "ID nhân viên",
            },
            appointment_time: {
              type: "string",
              format: "date-time",
              description: "Thời gian hẹn",
            },
            status: {
              type: "string",
              description: "Trạng thái lịch hẹn",
            },
            channel: {
              type: "string",
              description: "Kênh đặt lịch",
            },
          },
          required: [
            "customer_id",
            "pet_id",
            "branch_id",
            "employee_id",
            "appointment_time",
            "status",
            "channel",
          ],
        },
        // Customer Schema
        Customer: {
          type: "object",
          properties: {
            customer_id: {
              type: "integer",
              description: "ID khách hàng",
            },
            full_name: {
              type: "string",
              description: "Họ tên khách hàng",
            },
            gender: {
              type: "string",
              enum: ["M", "F", "O"],
              description: "Giới tính",
            },
            date_of_birth: {
              type: "string",
              format: "date",
              description: "Ngày sinh",
            },
            phone: {
              type: "string",
              description: "Số điện thoại",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email",
            },
            national_id: {
              type: "string",
              description: "CMND/CCCD",
            },
            join_date: {
              type: "string",
              format: "date",
              description: "Ngày tham gia",
            },
            total_spending: {
              type: "number",
              description: "Tổng chi tiêu",
            },
            tier_id: {
              type: "integer",
              description: "ID hạng thành viên",
            },
            loyalty_points: {
              type: "integer",
              description: "Điểm tích lũy",
            },
          },
        },
        // Employee Schema
        Employee: {
          type: "object",
          properties: {
            employee_id: {
              type: "integer",
              description: "ID nhân viên",
            },
            branch_id: {
              type: "integer",
              description: "ID chi nhánh",
            },
            full_name: {
              type: "string",
              description: "Họ tên nhân viên",
            },
            gender: {
              type: "string",
              enum: ["M", "F", "O"],
              description: "Giới tính",
            },
            date_of_birth: {
              type: "string",
              format: "date",
              description: "Ngày sinh",
            },
            hire_date: {
              type: "string",
              format: "date",
              description: "Ngày vào làm",
            },
            base_salary: {
              type: "number",
              description: "Lương cơ bản",
            },
            position: {
              type: "string",
              enum: [
                "Doctor",
                "Sales",
                "Receptionist",
                "BranchManager",
                "Assistant",
              ],
              description: "Vị trí công việc",
            },
            status: {
              type: "string",
              description: "Trạng thái",
            },
          },
        },
        // Branch Schema
        Branch: {
          type: "object",
          properties: {
            branch_id: {
              type: "integer",
              description: "ID chi nhánh",
            },
            name: {
              type: "string",
              description: "Tên chi nhánh",
            },
            address: {
              type: "string",
              description: "Địa chỉ",
            },
            phone: {
              type: "string",
              description: "Số điện thoại",
            },
            open_time: {
              type: "string",
              format: "time",
              description: "Giờ mở cửa (HH:MM:SS)",
            },
            close_time: {
              type: "string",
              format: "time",
              description: "Giờ đóng cửa (HH:MM:SS)",
            },
            is_active: {
              type: "boolean",
              description: "Trạng thái hoạt động",
            },
          },
        },
        // Product Schema
        Product: {
          type: "object",
          properties: {
            product_id: {
              type: "integer",
              description: "ID sản phẩm",
            },
            product_name: {
              type: "string",
              description: "Tên sản phẩm",
            },
            product_type: {
              type: "string",
              description: "Loại sản phẩm",
            },
            unit: {
              type: "string",
              description: "Đơn vị",
            },
            price: {
              type: "number",
              description: "Giá",
            },
            expiry_date: {
              type: "string",
              format: "date",
              description: "Ngày hết hạn",
            },
            description: {
              type: "string",
              description: "Mô tả",
            },
            is_active: {
              type: "boolean",
              description: "Trạng thái hoạt động",
            },
          },
        },
        // Invoice Schema
        Invoice: {
          type: "object",
          properties: {
            invoice_id: {
              type: "integer",
              description: "ID hóa đơn",
            },
            branch_id: {
              type: "integer",
              description: "ID chi nhánh",
            },
            customer_id: {
              type: "integer",
              description: "ID khách hàng",
            },
            employee_id: {
              type: "integer",
              description: "ID nhân viên",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Ngày tạo",
            },
            total_amount: {
              type: "number",
              description: "Tổng tiền",
            },
            discount_amount: {
              type: "number",
              description: "Tiền giảm giá",
            },
            final_amount: {
              type: "number",
              description: "Tiền cuối cùng",
            },
            promotion_id: {
              type: "integer",
              nullable: true,
              description: "ID khuyến mãi",
            },
            payment_status: {
              type: "string",
              description: "Trạng thái thanh toán",
            },
          },
        },
        // Invoice Details Schema
        InvoiceDetails: {
          type: "object",
          properties: {
            invoice_id: {
              type: "integer",
              description: "ID hóa đơn",
            },
            item_type: {
              type: "string",
              description: "Loại item (product/service)",
            },
            service_id: {
              type: "integer",
              nullable: true,
              description: "ID dịch vụ",
            },
            product_id: {
              type: "integer",
              nullable: true,
              description: "ID sản phẩm",
            },
            quantity: {
              type: "integer",
              description: "Số lượng",
            },
          },
          required: ["invoice_id", "item_type", "quantity"],
        },
      },
    },
  },
  apis: ["./src/controller/*.ts", "./src/routes/*.ts", "./src/docs/*.yaml"],
};

export const swaggerSpec = swaggerJsdoc(options);
