
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  User, 
  Search, 
  Loader2, 
  AlertCircle,
  Clock,
  ClipboardList,
  ArrowLeft,
  CalendarCheck
} from 'lucide-react';

interface Branch {
  branch_id: number;
  name: string;
}

interface Doctor {
  employee_id: number;
  full_name: string;
}

interface AppointmentRecord {
  appointment_id: number;
  appointment_time: string;
  status: string;
  branch_id: number;
  branch_name: string;
}

const API_BASE = 'http://localhost:8000/api';

interface DoctorSchedulePageProps {
  onBack: () => void;
}

const DoctorSchedulePage: React.FC<DoctorSchedulePageProps> = ({ onBack }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('2025-01-31');
  const [endDate, setEndDate] = useState<string>('2025-12-10');

  const [loadingBranches, setLoadingBranches] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [results, setResults] = useState<AppointmentRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBranches = async () => {
      setLoadingBranches(true);
      try {
        const response = await fetch(`${API_BASE}/branches/get-branch-list`);
        const json = await response.json();
        if (json.code === 200) setBranches(json.data);
      } catch (err) {
        setError("Không thể kết nối đến server chi nhánh.");
      } finally {
        setLoadingBranches(false);
      }
    };
    fetchBranches();
  }, []);

  useEffect(() => {
    if (!selectedBranch) {
      setDoctors([]);
      setSelectedDoctor('');
      return;
    }
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const response = await fetch(`${API_BASE}/employees/get-employee-doctor-list/${selectedBranch}`);
        const json = await response.json();
        if (json.code === 200) setDoctors(json.data);
      } catch (err) {
        setError("Lỗi khi lấy danh sách bác sĩ.");
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, [selectedBranch]);

  const handleFetchSchedule = async () => {
    if (!selectedDoctor) return;
    setLoadingSchedule(true);
    setResults([]);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/appointments/get-appointments-by-doctor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctor_id: parseInt(selectedDoctor),
          start_date: startDate,
          end_date: endDate
        })
      });
      const json = await response.json();
      if (json.code === 200) {
        setResults(json.data);
      } else {
        setError(json.message || "Lỗi truy vấn.");
      }
    } catch (err) {
      setError("Lỗi kết nối API lịch trình.");
    } finally {
      setLoadingSchedule(false);
    }
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('vi-VN'),
      time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
      'Completed': 'bg-green-100 text-green-700 border-green-200',
      'Cancelled': 'bg-red-100 text-red-700 border-red-200'
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 mb-2 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Quay lại trang chủ
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Lịch bận Bác sĩ</h1>
          <p className="text-slate-500 text-sm">Tra cứu danh sách lịch hẹn trong khoảng thời gian xác định.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filter */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-600" />
              Bộ lọc
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Chi nhánh
                </label>
                <select 
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  <option value="">Chọn chi nhánh...</option>
                  {branches.map(b => (
                    <option key={b.branch_id} value={b.branch_id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1">
                  <User className="w-3 h-3" /> Bác sĩ
                </label>
                <select 
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  disabled={!selectedBranch}
                >
                  <option value="">Chọn bác sĩ...</option>
                  {doctors.map(d => (
                    <option key={d.employee_id} value={d.employee_id}>{d.full_name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Từ ngày</label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Đến ngày</label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <button 
                onClick={handleFetchSchedule}
                disabled={!selectedDoctor || loadingSchedule}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 mt-2 shadow-md shadow-indigo-100"
              >
                {loadingSchedule ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarCheck className="w-4 h-4" />}
                Lấy lịch hẹn
              </button>
            </div>
          </div>
        </div>

        {/* Results Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-indigo-500" />
                Danh sách lịch bận
              </h3>
              <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full uppercase tracking-wider">
                {results.length} Lịch hẹn
              </span>
            </div>

            {loadingSchedule ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-500" />
                <p className="font-medium">Đang truy vấn dữ liệu từ hệ thống...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID Lịch</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Thời gian</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Chi nhánh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {results.map((item) => {
                      const { date, time } = formatDateTime(item.appointment_time);
                      return (
                        <tr key={item.appointment_id} className="hover:bg-indigo-50/30 transition-colors group">
                          <td className="px-6 py-4">
                            <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded group-hover:bg-white transition-colors">
                              #{item.appointment_id}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                                <Clock className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{time}</p>
                                <p className="text-xs text-slate-500">{date}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(item.status)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-slate-600">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-sm font-medium">{item.branch_name}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <Calendar className="w-10 h-10 opacity-20 text-slate-900" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">Không có lịch bận</h4>
                <p className="text-sm text-slate-500 max-w-xs text-center">
                  Vui lòng chọn bác sĩ và khoảng thời gian để xem danh sách lịch hẹn đang có trên hệ thống.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedulePage;
