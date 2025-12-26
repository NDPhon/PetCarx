
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  Search, 
  Loader2, 
  AlertCircle,
  Clock,
  ClipboardList,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Phone,
  User,
  MapPin,
  Stethoscope,
  Globe,
  Monitor,
  CheckCircle2
} from 'lucide-react';

interface AppointmentRecord {
  appointment_id: number;
  customer_name: string;
  customer_phone: string;
  pet_name: string;
  branch_name: string;
  employee_name?: string; // from list api
  doctor_name?: string;   // from search api
  appointment_status?: string; // from list api
  status?: string;             // from search api
  appointment_time: string;
  appointment_channel?: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const API_BASE = 'http://localhost:8000/api';

interface StaffAppointmentsPageProps {
  onBack: () => void;
}

const StaffAppointmentsPage: React.FC<StaffAppointmentsPageProps> = ({ onBack }) => {
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchPhone, setSearchPhone] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchAppointments = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    setIsSearching(false);
    try {
      const response = await fetch(`${API_BASE}/appointments/get-appointments?page=${page}&limit=20`);
      const json = await response.json();
      if (json.code === 200) {
        setAppointments(json.data);
        setPagination(json.pagination);
      } else {
        setError(json.message || "Không thể tải danh sách lịch hẹn.");
      }
    } catch (err) {
      setError("Lỗi kết nối máy chủ khi tải danh sách.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePhoneSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchPhone.trim()) {
      fetchAppointments(1);
      return;
    }

    setLoading(true);
    setError(null);
    setIsSearching(true);
    try {
      const response = await fetch(`${API_BASE}/appointments/find-by-phone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: searchPhone })
      });
      const json = await response.json();
      if (json.code === 200) {
        setAppointments(json.data);
        setPagination(null); // No pagination for search results
      } else {
        setError(json.message || "Không tìm thấy lịch hẹn cho số điện thoại này.");
      }
    } catch (err) {
      setError("Lỗi kết nối khi tìm kiếm.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await fetch(`${API_BASE}/appointments/update-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointment_id: id,
          status: newStatus
        })
      });
      const json = await response.json();
      if (json.code === 200) {
        setSuccessMessage(`Đã cập nhật lịch #${id} thành ${newStatus}`);
        setTimeout(() => setSuccessMessage(null), 3000);
        
        // Refresh data locally instead of full refetch to keep scroll/state better
        setAppointments(prev => prev.map(appt => 
          appt.appointment_id === id 
            ? { ...appt, appointment_status: newStatus, status: newStatus } 
            : appt
        ));
      } else {
        setError(json.message || "Cập nhật trạng thái thất bại.");
      }
    } catch (err) {
      setError("Lỗi kết nối khi cập nhật trạng thái.");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchAppointments(currentPage);
  }, [currentPage, fetchAppointments]);

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-500';
      case 'Confirmed': return 'bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-500';
      case 'Completed': return 'bg-green-50 text-green-700 border-green-200 focus:ring-green-500';
      case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200 focus:ring-red-500';
      default: return 'bg-slate-50 text-slate-700 border-slate-200 focus:ring-slate-500';
    }
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('vi-VN'),
      time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 mb-2 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Quay lại trang chủ
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Lịch hẹn Toàn hệ thống</h1>
          <p className="text-slate-500 text-sm">Xem, tra cứu và cập nhật trạng thái lịch đặt của khách hàng.</p>
        </div>

        <form onSubmit={handlePhoneSearch} className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm theo SĐT..."
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <button 
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4" /> Tra cứu
          </button>
        </form>
      </div>

      {(error || successMessage) && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${error ? 'bg-red-50 border border-red-100 text-red-700' : 'bg-green-50 border border-green-100 text-green-700'}`}>
          {error ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
          <p className="text-sm font-medium">{error || successMessage}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-indigo-500" />
            {isSearching ? `Kết quả tìm kiếm cho: ${searchPhone}` : 'Danh sách lịch hẹn mới nhất'}
          </h3>
          {!isSearching && pagination && (
            <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md uppercase tracking-tighter">
              Tổng số: {pagination.total.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex-1 overflow-x-auto">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center p-20 text-slate-400">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-500" />
              <p className="font-medium">Đang tải dữ liệu...</p>
            </div>
          ) : appointments.length > 0 ? (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mã lịch</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Thời gian</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Khách hàng / Thú cưng</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chi nhánh / Bác sĩ</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Trạng thái (Cập nhật)</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Kênh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {appointments.map((appt) => {
                  const { date, time } = formatDateTime(appt.appointment_time);
                  const currentStatus = appt.appointment_status || appt.status || 'Unknown';
                  const staff = appt.employee_name || appt.doctor_name || 'Chưa phân công';
                  
                  return (
                    <tr key={appt.appointment_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          #{appt.appointment_id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-indigo-400" />
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-tight">{time}</p>
                            <p className="text-[10px] text-slate-400">{date}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3 h-3 text-slate-300" />
                            <span className="text-sm font-semibold text-slate-700">{appt.customer_name}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-300" />
                            <span className="text-[10px] text-slate-500">{appt.customer_phone}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-indigo-600">
                            <div className="w-3.5 h-3.5 bg-indigo-50 rounded flex items-center justify-center">
                              <span className="text-[8px] font-bold uppercase">P</span>
                            </div>
                            <span className="text-xs font-bold">{appt.pet_name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-slate-300" />
                            <span className="text-xs text-slate-600">{appt.branch_name}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Stethoscope className="w-3 h-3 text-slate-300" />
                            <span className="text-xs text-slate-600 italic">BS. {staff}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="relative inline-flex items-center">
                          <select 
                            value={currentStatus}
                            onChange={(e) => handleUpdateStatus(appt.appointment_id, e.target.value)}
                            disabled={updatingId === appt.appointment_id}
                            className={`appearance-none px-3 py-1.5 rounded-full text-[10px] font-bold border uppercase tracking-wider outline-none transition-all cursor-pointer pr-8 ${getStatusColorClass(currentStatus)}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <div className="pointer-events-none absolute right-2.5 flex items-center">
                            {updatingId === appt.appointment_id ? (
                              <Loader2 className="w-3 h-3 animate-spin text-slate-400" />
                            ) : (
                              <svg className="w-2.5 h-2.5 text-current opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {appt.appointment_channel === 'Online' ? (
                          <div className="inline-flex items-center gap-1 text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                            <Globe className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase">Online</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 text-slate-600 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                            <Monitor className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase">Offline</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-20 text-slate-400">
              <Calendar className="w-16 h-16 opacity-10 mb-4" />
              <p className="text-lg font-medium">Không có dữ liệu hiển thị</p>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {!isSearching && pagination && (
          <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Đang hiển thị trang <strong>{pagination.page}</strong> trên <strong>{pagination.totalPages}</strong>
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1 || loading}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={currentPage === pagination.totalPages || loading}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffAppointmentsPage;
