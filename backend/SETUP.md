# Hướng dẫn chạy Backend PetCarx

## Bước 1: Cài đặt MongoDB
1. Tải và cài đặt MongoDB từ https://www.mongodb.com/
2. Khởi động MongoDB service

## Bước 2: Cài đặt dependencies
```bash
cd backend
npm install
```

## Bước 3: Cấu hình environment
Tạo file `.env` trong thư mục backend:
```env
MONGODB_URI=mongodb://localhost:27017/petcarx
PORT=5000
JWT_SECRET=your_secret_key
```

## Bước 4: Seed dữ liệu mẫu
```bash
node seed.js
```

## Bước 5: Chạy server
```bash
npm run dev
```

Backend sẽ chạy trên http://localhost:5000

## API Endpoints chính:
- `/api/appointments` - Quản lý lịch hẹn
- `/api/medical-records` - Hồ sơ y tế
- `/api/sales` - Bán hàng (tự động cập nhật tồn kho)
- `/api/invoices` - Hóa đơn
- `/api/stats` - Thống kê doanh thu
- `/api/search` - Tìm kiếm
- `/api/pets` - Quản lý thú cưng
- `/api/customers` - Quản lý khách hàng
- `/api/vaccines` - Quản lý vaccine

## Frontend Integration
Cập nhật frontend để gọi API thay vì dùng mock data. Ví dụ trong AppointmentForm:

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:5000/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (response.ok) {
      alert('Đặt lịch thành công!');
      navigate('/');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```