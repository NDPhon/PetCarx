
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Stethoscope, 
  Search, 
  Loader2, 
  PawPrint, 
  Calendar, 
  FileText, 
  ChevronRight, 
  Info, 
  Pill, 
  Clock, 
  Activity,
  X,
  ClipboardCheck,
  User
} from 'lucide-react';

interface Branch {
  branch_id: number;
  name: string;
}

interface Doctor {
  employee_id: number;
  full_name: string;
}

interface PetExamined {
  pet_id: number;
  pet_name: string;
  species: string;
  breed: string;
  last_exam_date: string;
}

interface MedicalRecordSummary {
  medical_record_id: number;
  exam_date: string;
  diagnosis: string;
}

interface MedicalDetail {
  medical_record_id: number;
  exam_date: string;
  diagnosis: string;
  pet_id: number;
  pet_name: string;
  doctor_name: string;
}

interface PrescriptionDetail {
  prescription_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit: string;
  usage_instruction: string;
  notes: string;
  created_at: string;
}

const API_BASE = 'http://localhost:8000/api';

interface MedicalRecordsManagementProps {
  onBack: () => void;
}

const MedicalRecordsManagement: React.FC<MedicalRecordsManagementProps> = ({ onBack }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [pets, setPets] = useState<PetExamined[]>([]);
  
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [selectedPet, setSelectedPet] = useState<PetExamined | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecordSummary[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecordSummary | null>(null);
  const [recordSummary, setRecordSummary] = useState<MedicalDetail | null>(null);
  const [recordDetails, setRecordDetails] = useState<PrescriptionDetail[]>([]);

  const [loading, setLoading] = useState({
    branches: false,
    doctors: false,
    pets: false,
    records: false,
    details: false
  });

  // Fetch Branches on Mount
  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(prev => ({ ...prev, branches: true }));
      try {
        const res = await fetch(`${API_BASE}/branches/get-branch-list`);
        const json = await res.json();
        if (json.code === 200) setBranches(json.data);
      } catch (err) {
        console.error("Error fetching branches", err);
      } finally {
        setLoading(prev => ({ ...prev, branches: false }));
      }
    };
    fetchBranches();
  }, []);

  // Fetch Doctors when Branch changes
  useEffect(() => {
    if (!selectedBranchId) {
      setDoctors([]);
      setSelectedDoctorId('');
      return;
    }
    const fetchDoctors = async () => {
      setLoading(prev => ({ ...prev, doctors: true }));
      try {
        const res = await fetch(`${API_BASE}/employees/get-employee-doctor-list/${selectedBranchId}`);
        const json = await res.json();
        if (json.code === 200) setDoctors(json.data);
      } catch (err) {
        console.error("Error fetching doctors", err);
      } finally {
        setLoading(prev => ({ ...prev, doctors: false }));
      }
    };
    fetchDoctors();
  }, [selectedBranchId]);

  // Fetch Pets when Doctor changes
  useEffect(() => {
    if (!selectedDoctorId) {
      setPets([]);
      setSelectedPet(null);
      return;
    }
    const fetchPets = async () => {
      setLoading(prev => ({ ...prev, pets: true }));
      try {
        const res = await fetch(`${API_BASE}/pets/get-pets-examined-by-doctor/${selectedDoctorId}`);
        const json = await res.json();
        if (json.code === 200) setPets(json.data);
      } catch (err) {
        console.error("Error fetching pets", err);
      } finally {
        setLoading(prev => ({ ...prev, pets: false }));
      }
    };
    fetchPets();
  }, [selectedDoctorId]);

  // Fetch Medical Records when Pet is selected
  const handleSelectPet = async (pet: PetExamined) => {
    setSelectedPet(pet);
    setSelectedRecord(null);
    setLoading(prev => ({ ...prev, records: true }));
    try {
      const res = await fetch(`${API_BASE}/medical/get-medical-records-by-pet-id-and-doctor-id/${pet.pet_id}/${selectedDoctorId}`);
      const json = await res.json();
      if (json.code === 200) setMedicalRecords(json.data);
    } catch (err) {
      console.error("Error fetching medical records", err);
    } finally {
      setLoading(prev => ({ ...prev, records: false }));
    }
  };

  // Fetch Record Details when a Record is clicked
  const handleSelectRecord = async (record: MedicalRecordSummary) => {
    setSelectedRecord(record);
    setLoading(prev => ({ ...prev, details: true }));
    try {
      // Fetch Summary and Details in parallel
      const [sumRes, detRes] = await Promise.all([
        fetch(`${API_BASE}/medical/get-medical-details-by-record-id/${record.medical_record_id}`),
        fetch(`${API_BASE}/medical/get-medical-record-details-by-record-id/${record.medical_record_id}`)
      ]);
      const sumJson = await sumRes.json();
      const detJson = await detRes.json();
      
      if (sumJson.code === 200) setRecordSummary(sumJson.data[0]);
      if (detJson.code === 200) setRecordDetails(detJson.data);
    } catch (err) {
      console.error("Error fetching record details", err);
    } finally {
      setLoading(prev => ({ ...prev, details: false }));
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-7xl mx-auto pb-20">
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 mb-2 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Quay lại
        </button>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hồ sơ Bệnh án & Khám bệnh</h1>
        <p className="text-slate-500 text-sm mt-1">Quản lý lịch sử khám bệnh theo chi nhánh, bác sĩ và thú cưng.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-indigo-500" /> Chi nhánh
          </label>
          <select 
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer hover:bg-white"
          >
            <option value="">Chọn chi nhánh...</option>
            {branches.map(b => <option key={b.branch_id} value={b.branch_id}>{b.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Stethoscope className="w-3 h-3 text-indigo-500" /> Bác sĩ phụ trách
          </label>
          <select 
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            disabled={!selectedBranchId}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">{selectedBranchId ? "Chọn bác sĩ..." : "Vui lòng chọn chi nhánh"}</option>
            {doctors.map(d => <option key={d.employee_id} value={d.employee_id}>{d.full_name}</option>)}
          </select>
        </div>

        <div className="md:col-span-2 flex items-center gap-4 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
          <div className="bg-indigo-600 p-2 rounded-xl text-white">
            <Info className="w-5 h-5" />
          </div>
          <p className="text-xs text-indigo-700 font-medium leading-relaxed">
            Hệ thống sẽ tự động lọc danh sách thú cưng đã được bác sĩ này thăm khám tại chi nhánh đã chọn.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Pets List Area */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col min-h-[400px]">
            <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <PawPrint className="w-4 h-4 text-indigo-500" /> Thú cưng ({pets.length})
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loading.pets ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-2" />
                  <span className="text-xs font-bold uppercase tracking-widest">Đang tải...</span>
                </div>
              ) : pets.length > 0 ? (
                pets.map((pet) => (
                  <button
                    key={pet.pet_id}
                    onClick={() => handleSelectPet(pet)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                      selectedPet?.pet_id === pet.pet_id 
                        ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100' 
                        : 'bg-white border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        selectedPet?.pet_id === pet.pet_id ? 'bg-white/20 text-white' : 'bg-slate-100 text-indigo-600'
                      }`}>
                        <PawPrint className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className={`font-bold text-sm ${selectedPet?.pet_id === pet.pet_id ? 'text-white' : 'text-slate-900'}`}>{pet.pet_name}</h4>
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${selectedPet?.pet_id === pet.pet_id ? 'text-indigo-100' : 'text-slate-400'}`}>
                          {pet.species} • {pet.breed}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                      selectedPet?.pet_id === pet.pet_id ? 'text-white' : 'text-slate-300'
                    }`} />
                  </button>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-center px-6">
                  <Search className="w-12 h-12 opacity-10 mb-4" />
                  <p className="text-xs font-bold uppercase tracking-widest">Không có dữ liệu</p>
                  <p className="text-[10px] mt-1">Chọn bác sĩ để xem danh sách thú cưng đã khám.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Medical History & Details Area */}
        <div className="lg:col-span-8 space-y-8">
          {selectedPet ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm mb-8">
                <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
                   <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-500" /> Lịch sử khám: {selectedPet.pet_name}
                  </h3>
                </div>
                <div className="p-6">
                  {loading.records ? (
                    <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
                  ) : medicalRecords.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {medicalRecords.map((rec) => (
                        <button
                          key={rec.medical_record_id}
                          onClick={() => handleSelectRecord(rec)}
                          className={`flex flex-col text-left p-5 rounded-2xl border transition-all ${
                            selectedRecord?.medical_record_id === rec.medical_record_id
                            ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                            : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-indigo-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-mono font-black text-indigo-600 bg-white px-2 py-1 rounded-lg border border-indigo-100">
                              #{rec.medical_record_id}
                            </span>
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Calendar className="w-3 h-3" />
                              <span className="text-[10px] font-bold">{formatDate(rec.exam_date)}</span>
                            </div>
                          </div>
                          <p className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                            {rec.diagnosis}
                          </p>
                          <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                            Xem chi tiết <ChevronRight className="w-3 h-3" />
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-400 italic text-sm">Chưa có hồ sơ bệnh án nào được ghi nhận bởi bác sĩ này.</div>
                  )}
                </div>
              </div>

              {/* Record Detail Overlay/Drawer (Conditional Rendering) */}
              {selectedRecord && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500 bg-white rounded-3xl border border-indigo-200 shadow-xl overflow-hidden ring-4 ring-indigo-50">
                  <div className="px-8 py-6 bg-indigo-600 text-white flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-5 h-5" />
                        <h3 className="text-xl font-black">Chi tiết Bệnh án #{selectedRecord.medical_record_id}</h3>
                      </div>
                      <p className="text-indigo-100 text-xs font-medium">Khám ngày {formatDate(selectedRecord.exam_date)}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedRecord(null)}
                      className="p-2 hover:bg-white/10 rounded-full transition-all"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="p-8">
                    {loading.details ? (
                      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                        <p className="text-sm font-bold uppercase tracking-widest">Đang trích xuất dữ liệu...</p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {/* Summary Card */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Bác sĩ khám</label>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                {recordSummary?.doctor_name.charAt(0)}
                              </div>
                              <p className="text-sm font-bold text-slate-900">{recordSummary?.doctor_name || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="md:col-span-2 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Chẩn đoán tổng quát</label>
                            <div className="flex items-start gap-2">
                              <ClipboardCheck className="w-4 h-4 text-indigo-500 mt-0.5" />
                              <p className="text-sm font-bold text-slate-900 leading-relaxed">{recordSummary?.diagnosis}</p>
                            </div>
                          </div>
                        </div>

                        {/* Prescriptions List */}
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <Pill className="w-5 h-5 text-indigo-600" />
                            <h4 className="text-lg font-black text-slate-900">Đơn thuốc & Vật tư</h4>
                          </div>
                          <div className="space-y-4">
                            {recordDetails.length > 0 ? (
                              recordDetails.map((det) => (
                                <div key={det.prescription_id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all">
                                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                        <Pill className="w-6 h-6" />
                                      </div>
                                      <div>
                                        <h5 className="font-black text-slate-900 uppercase tracking-tight">{det.product_name}</h5>
                                        <p className="text-xs font-bold text-slate-400">ID Sản phẩm: #{det.product_id}</p>
                                      </div>
                                    </div>
                                    <div className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                                      SL: {det.quantity} {det.unit}
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                    <div>
                                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> Hướng dẫn sử dụng
                                      </label>
                                      <p className="text-sm text-slate-700 leading-relaxed italic">"{det.usage_instruction}"</p>
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                        <FileText className="w-3 h-3" /> Ghi chú bác sĩ
                                      </label>
                                      <p className="text-sm text-slate-700 leading-relaxed">{det.notes || 'Không có ghi chú thêm.'}</p>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-400 italic">
                                Không có danh mục đơn thuốc đính kèm cho hồ sơ này.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-20 text-slate-400 text-center">
               <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm">
                  <Activity className="w-12 h-12 opacity-10" />
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-2">Chưa chọn thú cưng</h3>
               <p className="text-sm max-w-xs leading-relaxed">Vui lòng chọn một thú cưng từ danh sách bên trái để bắt đầu truy xuất lịch sử bệnh án.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordsManagement;
