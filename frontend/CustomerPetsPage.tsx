
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Search, 
  Loader2, 
  AlertCircle, 
  ArrowLeft, 
  PawPrint, 
  Dna, 
  Calendar, 
  HeartPulse,
  Info,
  CalendarCheck,
  Clock,
  MapPin,
  Stethoscope,
  X,
  CheckCircle2,
  UserPlus,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Plus,
  Dna as BreedIcon
} from 'lucide-react';

interface Customer {
  customer_id: number;
  name: string;
  phone: string;
  email: string;
}

interface Pet {
  pet_id: number;
  pet_name: string;
  species: string;
  breed: string;
  date_of_birth: string;
  gender: 'M' | 'F' | 'O';
  health_status: string;
}

interface Appointment {
  appointment_id: number;
  appointment_time: string;
  status: string;
  customer_name: string;
  customer_phone: string;
  branch_name: string;
  doctor_name: string;
  pet_name: string;
}

interface Branch {
  branch_id: number;
  name: string;
}

interface Doctor {
  employee_id: number;
  full_name: string;
}

const API_BASE = 'http://localhost:8000/api';

interface CustomerPetsPageProps {
  onBack: () => void;
}

const CustomerPetsPage: React.FC<CustomerPetsPageProps> = ({ onBack }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<'pets' | 'appointments'>('pets');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Booking Modal States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPetForBooking, setSelectedPetForBooking] = useState<Pet | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingTime, setBookingTime] = useState<string>('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<number | null>(null);

  // Registration Modal States
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [regStep, setRegStep] = useState(1);
  const [isRegistering, setIsRegistering] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  // Add Additional Pet Modal States
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [addPetSuccess, setAddPetSuccess] = useState(false);
  
  // New Customer Data
  const [newCust, setNewCust] = useState({
    full_name: '',
    gender: 'M',
    date_of_birth: '',
    phone: '',
    email: '',
    national_id: ''
  });
  
  // New Pet Data (Shared for Registration and Add Pet)
  const [newPet, setNewPet] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    date_of_birth: '',
    gender: 'M',
    health_status: 'Good'
  });

  const handleSearch = async (e?: React.FormEvent, forcePhone?: string) => {
    if (e) e.preventDefault();
    const phoneToSearch = forcePhone || phoneNumber;
    if (!phoneToSearch.trim()) return;

    setLoading(true);
    setError(null);
    setCustomer(null);
    setPets([]);
    setAppointments([]);

    try {
      const custRes = await fetch(`${API_BASE}/customers/get-customer-by-phone/${phoneToSearch}`);
      const custJson = await custRes.json();

      if (custJson.code === 200 && custJson.data) {
        setCustomer(custJson.data);
        
        const petsRes = await fetch(`${API_BASE}/pets/get-pets-by-customer-id/${custJson.data.customer_id}`);
        const petsJson = await petsRes.json();
        if (petsJson.code === 200) setPets(petsJson.data);

        const apptRes = await fetch(`${API_BASE}/appointments/find-by-phone`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: phoneToSearch })
        });
        const apptJson = await apptRes.json();
        if (apptJson.code === 200) setAppointments(apptJson.data);
      } else {
        setError("Không tìm thấy khách hàng với số điện thoại này.");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  const openBookingModal = async (pet: Pet) => {
    setSelectedPetForBooking(pet);
    setIsBookingModalOpen(true);
    setBookingSuccess(null);
    setSelectedBranchId('');
    setSelectedDoctorId('');
    setBookingDate('');
    setBookingTime('');
    
    try {
      const res = await fetch(`${API_BASE}/branches/get-branch-list`);
      const json = await res.json();
      if (json.code === 200) setBranches(json.data);
    } catch (e) {
      console.error("Lỗi lấy danh sách chi nhánh");
    }
  };

  useEffect(() => {
    if (!selectedBranchId) {
      setDoctors([]);
      return;
    }
    const fetchDoctors = async () => {
      try {
        const res = await fetch(`${API_BASE}/employees/get-employee-doctor-list/${selectedBranchId}`);
        const json = await res.json();
        if (json.code === 200) setDoctors(json.data);
      } catch (e) {
        console.error("Lỗi lấy danh sách bác sĩ");
      }
    };
    fetchDoctors();
  }, [selectedBranchId]);

  const handleCreateAppointment = async () => {
    if (!customer || !selectedPetForBooking || !selectedBranchId || !selectedDoctorId || !bookingDate || !bookingTime) return;

    setIsBooking(true);
    try {
      const appointment_time = `${bookingDate}T${bookingTime}:00Z`;
      const res = await fetch(`${API_BASE}/appointments/add-appointment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customer.customer_id,
          pet_id: selectedPetForBooking.pet_id,
          branch_id: parseInt(selectedBranchId),
          employee_id: parseInt(selectedDoctorId),
          appointment_time: appointment_time,
          status: 'Pending',
          channel: 'Online'
        })
      });
      const json = await res.json();
      if (json.code === 201) {
        setBookingSuccess(json.data.fnc_insert_appointment);
        handleSearch(undefined, customer.phone);
      } else {
        setError(json.message || "Lỗi khi tạo lịch hẹn.");
      }
    } catch (e) {
      setError("Lỗi kết nối khi đặt lịch.");
    } finally {
      setIsBooking(false);
    }
  };

  const handleRegisterAll = async () => {
    setIsRegistering(true);
    setError(null);
    try {
      const custRes = await fetch(`${API_BASE}/customers/add-customer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCust)
      });
      const custJson = await custRes.json();
      
      if (custJson.code === 201) {
        const newCustomerId = custJson.data.customer_id;
        const petRes = await fetch(`${API_BASE}/pets/add-pet`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...newPet,
            customer_id: newCustomerId
          })
        });
        const petJson = await petRes.json();
        
        if (petJson.code === 201) {
          setRegSuccess(true);
          setPhoneNumber(newCust.phone);
          setTimeout(() => {
            setIsRegisterModalOpen(false);
            handleSearch(undefined, newCust.phone);
            setRegSuccess(false);
            setRegStep(1);
          }, 2000);
        } else {
          setError("Khách hàng đã tạo thành công nhưng lỗi khi thêm thú cưng: " + petJson.message);
        }
      } else {
        setError("Lỗi khi thêm khách hàng: " + custJson.message);
      }
    } catch (e) {
      setError("Lỗi kết nối máy chủ khi đăng ký.");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleAddPetOnly = async () => {
    if (!customer) return;
    setIsAddingPet(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/pets/add-pet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPet,
          customer_id: customer.customer_id
        })
      });
      const json = await res.json();
      if (json.code === 201) {
        setAddPetSuccess(true);
        setTimeout(() => {
          setIsAddPetModalOpen(false);
          setAddPetSuccess(false);
          handleSearch(undefined, customer.phone);
        }, 1500);
      } else {
        setError("Lỗi khi thêm thú cưng: " + json.message);
      }
    } catch (e) {
      setError("Lỗi kết nối khi thêm thú cưng.");
    } finally {
      setIsAddingPet(false);
    }
  };

  const getGenderLabel = (g: string) => {
    if (g === 'M') return 'Đực';
    if (g === 'F') return 'Cái';
    return 'Khác';
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
      'Confirmed': 'bg-blue-100 text-blue-700 border-blue-200',
      'Completed': 'bg-green-100 text-green-700 border-green-200',
      'Cancelled': 'bg-red-100 text-red-700 border-red-200'
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
        {status}
      </span>
    );
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('vi-VN'),
      time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 relative">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 mb-2 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Quay lại trang chủ
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Hồ sơ Khách hàng</h1>
          <p className="text-slate-500 text-sm">Tra cứu thông tin chủ nuôi và quản lý vật nuôi.</p>
        </div>
        
        <button 
          onClick={() => {
            setIsRegisterModalOpen(true);
            setRegStep(1);
            setRegSuccess(false);
          }}
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold rounded-xl text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-all gap-2"
        >
          <UserPlus className="w-4 h-4" /> Đăng ký KH mới
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Nhập số điện thoại khách hàng..."
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all sm:text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !phoneNumber}
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 transition-all gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Tìm kiếm
          </button>
        </form>
      </div>

      {error && !isRegisterModalOpen && !isAddPetModalOpen && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {customer && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
              <div className="bg-indigo-600 h-24 relative">
                <div className="absolute -bottom-10 left-6">
                  <div className="h-20 w-20 rounded-2xl bg-white shadow-lg border-4 border-white flex items-center justify-center text-indigo-600">
                    <User className="w-10 h-10" />
                  </div>
                </div>
              </div>
              <div className="pt-12 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-1">{customer.name}</h2>
                <p className="text-xs font-mono text-slate-400 mb-6 uppercase tracking-wider">Mã KH: #{customer.customer_id}</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600"><Phone className="w-4 h-4" /></div>
                    <span className="text-slate-600 font-medium">{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600"><Mail className="w-4 h-4" /></div>
                    <span className="text-slate-600 truncate">{customer.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
              <div className="flex border-b border-slate-100 bg-slate-50/50">
                <button
                  onClick={() => setActiveTab('pets')}
                  className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 ${
                    activeTab === 'pets' ? 'text-indigo-600 border-indigo-600 bg-white' : 'text-slate-400 border-transparent hover:text-slate-600'
                  }`}
                >
                  <PawPrint className="w-4 h-4" /> Thú cưng ({pets.length})
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 ${
                    activeTab === 'appointments' ? 'text-indigo-600 border-indigo-600 bg-white' : 'text-slate-400 border-transparent hover:text-slate-600'
                  }`}
                >
                  <CalendarCheck className="w-4 h-4" /> Lịch hẹn ({appointments.length})
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'pets' ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Danh sách thú cưng</h4>
                      <button 
                        onClick={() => {
                          setNewPet({ name: '', species: 'Dog', breed: '', date_of_birth: '', gender: 'M', health_status: 'Good' });
                          setIsAddPetModalOpen(true);
                          setError(null);
                        }}
                        className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 flex items-center gap-1.5 transition-all"
                      >
                        <Plus className="w-3 h-3" /> Thêm thú cưng mới
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pets.map((pet) => (
                        <div key={pet.pet_id} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all group relative overflow-hidden">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600">{pet.pet_name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-medium bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{pet.species}</span>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${pet.gender === 'M' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                                  {getGenderLabel(pet.gender)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3 mb-5">
                            <div className="flex items-center gap-2 text-sm text-slate-600"><Dna className="w-4 h-4 text-slate-300" /> {pet.breed}</div>
                            <div className="flex items-center gap-2 text-sm text-slate-600"><Calendar className="w-4 h-4 text-slate-300" /> {new Date(pet.date_of_birth).toLocaleDateString('vi-VN')}</div>
                            <div className="flex items-center gap-2 text-sm">
                              <HeartPulse className="w-4 h-4 text-slate-300" />
                              <span className={`font-semibold ${pet.health_status === 'Under Treatment' ? 'text-amber-600' : 'text-green-600'}`}>{pet.health_status}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => openBookingModal(pet)}
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                          >
                            <CalendarCheck className="w-3.5 h-3.5" /> Đặt lịch ngay
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appt) => {
                      const { date, time } = formatDateTime(appt.appointment_time);
                      return (
                        <div key={appt.appointment_id} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:bg-white transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl"><Clock className="w-6 h-6" /></div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-slate-900">{time}</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-sm font-medium text-slate-500">{date}</span>
                              </div>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                                <div className="flex items-center gap-1 font-semibold text-indigo-600"><PawPrint className="w-3 h-3" /> {appt.pet_name}</div>
                                <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {appt.branch_name}</div>
                                <div className="flex items-center gap-1"><Stethoscope className="w-3 h-3" /> BS. {appt.doctor_name}</div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">{getStatusBadge(appt.status)}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Pet Modal */}
      {isAddPetModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isAddingPet && setIsAddPetModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 bg-indigo-600 text-white flex items-center justify-between">
              <h3 className="text-xl font-black flex items-center gap-2">
                <PawPrint className="w-6 h-6" /> Thêm thú cưng mới
              </h3>
              <button onClick={() => setIsAddPetModalOpen(false)} className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8">
              {addPetSuccess ? (
                <div className="text-center py-8 animate-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-1">Hoàn tất!</h4>
                  <p className="text-slate-500">Thú cưng đã được thêm vào hồ sơ của khách hàng.</p>
                </div>
              ) : (
                <div className="space-y-5">
                   {error && (
                    <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <p className="text-xs font-medium">{error}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Tên thú cưng</label>
                      <input type="text" placeholder="VD: Mochi" value={newPet.name} onChange={e => setNewPet({...newPet, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Loài</label>
                      <select value={newPet.species} onChange={e => setNewPet({...newPet, species: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                        <option value="Dog">Chó</option>
                        <option value="Cat">Mèo</option>
                        <option value="Bird">Chim</option>
                        <option value="Other">Khác</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Giống</label>
                      <input type="text" placeholder="VD: Corgi" value={newPet.breed} onChange={e => setNewPet({...newPet, breed: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Ngày sinh</label>
                      <input type="date" value={newPet.date_of_birth} onChange={e => setNewPet({...newPet, date_of_birth: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Giới tính</label>
                      <select value={newPet.gender} onChange={e => setNewPet({...newPet, gender: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                        <option value="M">Đực</option>
                        <option value="F">Cái</option>
                        <option value="O">Khác</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Tình trạng</label>
                      <input type="text" placeholder="VD: Khỏe mạnh" value={newPet.health_status} onChange={e => setNewPet({...newPet, health_status: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"/>
                    </div>
                  </div>

                  <button 
                    onClick={handleAddPetOnly}
                    disabled={isAddingPet || !newPet.name}
                    className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                  >
                    {isAddingPet ? <Loader2 className="w-5 h-5 animate-spin" /> : "Xác nhận thêm"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isBooking && setIsBookingModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-indigo-600 text-white flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <CalendarCheck className="w-5 h-5" /> Đặt lịch cho {selectedPetForBooking?.pet_name}
              </h3>
              <button onClick={() => setIsBookingModalOpen(false)} className="hover:bg-indigo-500 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {bookingSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Đặt lịch thành công!</h4>
                  <p className="text-slate-500 mb-6">Mã lịch hẹn của bạn là <strong>#{bookingSuccess}</strong>.</p>
                  <button onClick={() => setIsBookingModalOpen(false)} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800">Đóng</button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1"><MapPin className="w-3 h-3" /> Chi nhánh</label>
                    <select value={selectedBranchId} onChange={(e) => setSelectedBranchId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                      <option value="">Chọn chi nhánh...</option>
                      {branches.map(b => <option key={b.branch_id} value={b.branch_id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1"><Stethoscope className="w-3 h-3" /> Bác sĩ</label>
                    <select value={selectedDoctorId} onChange={(e) => setSelectedDoctorId(e.target.value)} disabled={!selectedBranchId} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                      <option value="">{selectedBranchId ? "Chọn bác sĩ..." : "Vui lòng chọn chi nhánh"}</option>
                      {doctors.map(d => <option key={d.employee_id} value={d.employee_id}>{d.full_name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Ngày hẹn</label>
                      <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"/>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Giờ hẹn</label>
                      <input type="time" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"/>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button onClick={handleCreateAppointment} disabled={isBooking || !selectedDoctorId || !bookingDate || !bookingTime} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2">
                      {isBooking ? <Loader2 className="w-5 h-5 animate-spin" /> : "Xác nhận đặt lịch"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => !isRegistering && setIsRegisterModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            
            {/* Modal Header */}
            <div className="relative h-32 bg-indigo-600 flex items-center px-8 text-white">
              <div className="z-10">
                <h3 className="text-2xl font-black flex items-center gap-3">
                  <UserPlus className="w-8 h-8" /> Đăng ký Thành viên mới
                </h3>
                <p className="text-indigo-100 text-sm mt-1">Gia nhập hệ thống PetCarx chỉ trong 2 phút.</p>
              </div>
              <button onClick={() => setIsRegisterModalOpen(false)} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all">
                <X className="w-5 h-5" />
              </button>
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
            </div>

            {/* Step Indicators */}
            {!regSuccess && (
              <div className="flex px-8 py-6 bg-slate-50 border-b border-slate-100">
                <div className={`flex items-center gap-2 flex-1 ${regStep >= 1 ? 'text-indigo-600' : 'text-slate-400'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${regStep === 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : (regStep > 1 ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500')}`}>1</div>
                  <span className="text-xs font-bold uppercase tracking-wider">Thông tin chủ nuôi</span>
                </div>
                <div className="flex items-center justify-center px-4">
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
                <div className={`flex items-center gap-2 flex-1 ${regStep >= 2 ? 'text-indigo-600' : 'text-slate-400'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${regStep === 2 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-200 text-slate-500'}`}>2</div>
                  <span className="text-xs font-bold uppercase tracking-wider">Thông tin thú cưng</span>
                </div>
              </div>
            )}

            <div className="p-8">
              {regSuccess ? (
                <div className="text-center py-12 animate-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-50">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h4 className="text-3xl font-black text-slate-900 mb-2">Chào mừng thành viên mới!</h4>
                  <p className="text-slate-500">Tài khoản và hồ sơ thú cưng đã được thiết lập thành công.</p>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  )}

                  {regStep === 1 && (
                    <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                      <div className="grid grid-cols-2 gap-5">
                        <div className="col-span-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Họ và tên khách hàng</label>
                          <div className="relative">
                             <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                             <input type="text" placeholder="VD: Nguyễn Văn A" value={newCust.full_name} onChange={e => setNewCust({...newCust, full_name: e.target.value})} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"/>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Giới tính</label>
                          <select value={newCust.gender} onChange={e => setNewCust({...newCust, gender: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none">
                            <option value="M">Nam</option>
                            <option value="F">Nữ</option>
                            <option value="O">Khác</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ngày sinh</label>
                          <input type="date" value={newCust.date_of_birth} onChange={e => setNewCust({...newCust, date_of_birth: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"/>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Số điện thoại</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="tel" placeholder="0123..." value={newCust.phone} onChange={e => setNewCust({...newCust, phone: e.target.value})} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"/>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">CCCD / National ID</label>
                          <div className="relative">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="text" placeholder="Số định danh" value={newCust.national_id} onChange={e => setNewCust({...newCust, national_id: e.target.value})} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"/>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="email" placeholder="example@gmail.com" value={newCust.email} onChange={e => setNewCust({...newCust, email: e.target.value})} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {regStep === 2 && (
                    <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                      <div className="grid grid-cols-2 gap-5">
                        <div className="col-span-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tên thú cưng</label>
                          <div className="relative">
                            <PawPrint className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="text" placeholder="VD: Lucky, Mochi..." value={newPet.name} onChange={e => setNewPet({...newPet, name: e.target.value})} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"/>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Loài (Species)</label>
                          <select value={newPet.species} onChange={e => setNewPet({...newPet, species: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none">
                            <option value="Dog">Chó</option>
                            <option value="Cat">Mèo</option>
                            <option value="Bird">Chim</option>
                            <option value="Hamster">Chuột Hamster</option>
                            <option value="Other">Khác</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Giống (Breed)</label>
                          <div className="relative">
                             <BreedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                             <input type="text" placeholder="VD: Golden Retriever" value={newPet.breed} onChange={e => setNewPet({...newPet, breed: e.target.value})} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"/>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ngày sinh thú cưng</label>
                          <input type="date" value={newPet.date_of_birth} onChange={e => setNewPet({...newPet, date_of_birth: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"/>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Giới tính thú cưng</label>
                          <select value={newPet.gender} onChange={e => setNewPet({...newPet, gender: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none">
                            <option value="M">Đực</option>
                            <option value="F">Cái</option>
                            <option value="O">Khác</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tình trạng sức khỏe</label>
                          <div className="relative">
                            <HeartPulse className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="text" placeholder="VD: Khỏe mạnh, Đang theo dõi..." value={newPet.health_status} onChange={e => setNewPet({...newPet, health_status: e.target.value})} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-10 flex gap-4">
                    {regStep === 2 && (
                      <button 
                        onClick={() => setRegStep(1)} 
                        className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                      >
                        <ChevronLeft className="w-5 h-5" /> Quay lại
                      </button>
                    )}
                    <button 
                      onClick={regStep === 1 ? () => setRegStep(2) : handleRegisterAll}
                      disabled={isRegistering || (regStep === 1 && !newCust.full_name) || (regStep === 2 && !newPet.name)}
                      className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                    >
                      {isRegistering ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        regStep === 1 ? (
                          <>Tiếp theo <ChevronRight className="w-5 h-5" /></>
                        ) : (
                          "Hoàn tất đăng ký"
                        )
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {!customer && !loading && !error && (
        <div className="flex flex-col items-center justify-center p-20 text-slate-400">
           <Search className="w-16 h-16 opacity-10 mb-4" />
           <p className="text-lg font-medium">Tra cứu hồ sơ</p>
           <p className="text-sm">Nhập số điện thoại để bắt đầu.</p>
        </div>
      )}
    </div>
  );
};

export default CustomerPetsPage;
