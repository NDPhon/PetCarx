import React, { useState } from "react";
import {
  PawPrint,
  Settings,
  ArrowRight,
  LayoutDashboard,
  CalendarDays,
  Users,
  Database,
  ShieldCheck,
  ClipboardList,
  HeartPulse,
  BarChart3,
  Layers,
  Box,
  Receipt,
} from "lucide-react";
import DoctorSchedulePage from "./DoctorSchedulePage";
import CustomerPetsPage from "./CustomerPetsPage";
import StaffAppointmentsPage from "./StaffAppointmentsPage";
import MedicalRecordsManagement from "./MedicalRecordsManagement";
import StatisticsPage from "./StatisticsPage";
import InventoryManagement from "./InventoryManagement";
import InvoiceManagement from "./InvoiceManagement";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<
    | "home"
    | "schedule"
    | "customer"
    | "staff"
    | "medical"
    | "statistics"
    | "inventory"
    | "invoice"
  >("home");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Universal Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setCurrentPage("home")}
          >
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
              <PawPrint className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-violet-600">
              PetCarx
            </span>
          </div>

          <nav className="hidden md:flex space-x-6">
            <button
              onClick={() => setCurrentPage("home")}
              className={`font-medium transition-colors ${
                currentPage === "home"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              Trang chủ
            </button>
            <button
              onClick={() => setCurrentPage("schedule")}
              className={`font-medium transition-colors ${
                currentPage === "schedule"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              Lịch bác sĩ
            </button>
            <button
              onClick={() => setCurrentPage("customer")}
              className={`font-medium transition-colors ${
                currentPage === "customer"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              Khách hàng
            </button>
            <button
              onClick={() => setCurrentPage("medical")}
              className={`font-medium transition-colors ${
                currentPage === "medical"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              Bệnh án
            </button>
            <button
              onClick={() => setCurrentPage("invoice")}
              className={`font-medium transition-colors ${
                currentPage === "invoice"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              Hóa đơn
            </button>
            <button
              onClick={() => setCurrentPage("inventory")}
              className={`font-medium transition-colors ${
                currentPage === "inventory"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              Kho & Dịch vụ
            </button>
            <button
              onClick={() => setCurrentPage("statistics")}
              className={`font-medium transition-colors ${
                currentPage === "statistics"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              Thống kê
            </button>
            <button
              onClick={() => setCurrentPage("staff")}
              className={`font-medium transition-colors ${
                currentPage === "staff"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              Lịch hẹn nhân viên
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="h-9 w-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              AD
            </div>
          </div>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {currentPage === "home" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-indigo-700 rounded-3xl p-8 md:p-16 mb-12 shadow-2xl shadow-indigo-200">
              <div className="relative z-10 max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                  Xin chào đã đến với PetCarx
                </h1>
                <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
                  Hệ thống quản lý phòng khám thú y toàn diện, giúp tối ưu hóa
                  lịch trình và hồ sơ bệnh án cho các thú cưng thân yêu.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => setCurrentPage("invoice")}
                    className="bg-white text-indigo-700 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-lg"
                  >
                    Lập hóa đơn thanh toán <Receipt className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage("medical")}
                    className="bg-indigo-600/50 backdrop-blur-sm border border-indigo-400 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-lg"
                  >
                    Hồ sơ bệnh án <HeartPulse className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-600 rounded-full opacity-50 blur-3xl"></div>
              <div className="absolute bottom-0 right-0 mr-20 -mb-20 w-64 h-64 bg-violet-600 rounded-full opacity-30 blur-3xl"></div>
            </div>

            {/* Quick Access Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div
                onClick={() => setCurrentPage("customer")}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-50/50 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                  <Users className="text-indigo-600 group-hover:text-white w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Khách hàng
                </h3>
                <p className="text-slate-500 text-sm">
                  Tra cứu thông tin chủ nuôi và vật nuôi liên quan.
                </p>
              </div>

              <div
                onClick={() => setCurrentPage("invoice")}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-50/50 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                  <Receipt className="text-indigo-600 group-hover:text-white w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Hóa đơn
                </h3>
                <p className="text-slate-500 text-sm">
                  Lập hóa đơn, quản lý thanh toán và chiết khấu.
                </p>
              </div>

              <div
                onClick={() => setCurrentPage("medical")}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-50/50 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                  <ClipboardList className="text-indigo-600 group-hover:text-white w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Bệnh án
                </h3>
                <p className="text-slate-500 text-sm">
                  Xem lịch sử khám bệnh và đơn thuốc chi tiết.
                </p>
              </div>

              <div
                onClick={() => setCurrentPage("inventory")}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-50/50 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                  <Box className="text-indigo-600 group-hover:text-white w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Kho & Dịch vụ
                </h3>
                <p className="text-slate-500 text-sm">
                  Quản lý thuốc, thức ăn và các gói dịch vụ.
                </p>
              </div>
            </div>

            {/* Status Footer */}
            <div className="mt-12 bg-white rounded-2xl p-6 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 overflow-hidden"
                    >
                      <img
                        src={`https://i.pravatar.cc/100?u=${i}`}
                        alt="User"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-600">
                  Đội ngũ bác sĩ đang trực tuyến: <strong>12 bác sĩ</strong>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  Hệ thống ổn định
                </span>
              </div>
            </div>
          </div>
        )}

        {currentPage === "schedule" && (
          <DoctorSchedulePage onBack={() => setCurrentPage("home")} />
        )}

        {currentPage === "customer" && (
          <CustomerPetsPage onBack={() => setCurrentPage("home")} />
        )}

        {currentPage === "staff" && (
          <StaffAppointmentsPage onBack={() => setCurrentPage("home")} />
        )}

        {currentPage === "medical" && (
          <MedicalRecordsManagement onBack={() => setCurrentPage("home")} />
        )}

        {currentPage === "statistics" && (
          <StatisticsPage onBack={() => setCurrentPage("home")} />
        )}

        {currentPage === "inventory" && (
          <InventoryManagement onBack={() => setCurrentPage("home")} />
        )}

        {currentPage === "invoice" && (
          <InvoiceManagement onBack={() => setCurrentPage("home")} />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} PetCarx Veterinary Clinic. Nền
            tảng chăm sóc thú cưng hiện đại.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
