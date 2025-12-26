import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE } from '../lib/api'

function WalkInAppointment() {
  const navigate = useNavigate()
  
  // Step 1: Search customer by phone
  const [step, setStep] = useState(1) // 1: search, 2: select/create pet, 3: appointment, 4: add services
  const [phone, setPhone] = useState('')
  const [customer, setCustomer] = useState<any>(null)
  const [searching, setSearching] = useState(false)

  // Step 2: Pet selection
  const [petsList, setPetsList] = useState<any[]>([])
  const [selectedPetId, setSelectedPetId] = useState('')
  const [newPetData, setNewPetData] = useState({ name: '', type: '', breed: '' })
  const [createNewPet, setCreateNewPet] = useState(false)

  // Step 3: Appointment data
  const [branches, setBranches] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [appointmentData, setAppointmentData] = useState({
    branchId: '',
    employeeId: '',
    date: '',
    time: '',
    notes: ''
  })
  const [submitting, setSubmitting] = useState(false)
  
  // Step 4: Add services
  const [appointmentId, setAppointmentId] = useState<number | null>(null)
  const [selectedServices, setSelectedServices] = useState<number[]>([])
  const [addingServices, setAddingServices] = useState(false)

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const r = await fetch(`${API_BASE}/api/branches/get-branch-list`)
        if (r.ok) {
          const json = await r.json()
          setBranches(json.data || json)
        }
      } catch (e) {
        console.warn('Error fetching branches:', e)
      }
    }
    const fetchServices = async () => {
      try {
        const r = await fetch(`${API_BASE}/api/services`)
        if (r.ok) {
          const json = await r.json()
          setServices(Array.isArray(json) ? json : json.data || [])
        }
      } catch (e) {
        console.warn('Error fetching services:', e)
      }
    }
    fetchBranches()
    fetchServices()
  }, [])

  // Step 1: Search customer
  const searchCustomer = async () => {
    if (!phone.trim()) {
      alert('Vui lòng nhập số điện thoại')
      return
    }
    setSearching(true)
    try {
      const r = await fetch(`${API_BASE}/api/customers/get-customer-by-phone/${encodeURIComponent(phone)}`)
      if (r.ok) {
        const json = await r.json()
        setCustomer(json.data || json)
        // Load pets of this customer
        const petsR = await fetch(`${API_BASE}/api/pets?customerId=${json.data?.customer_id || json.customer_id}`)
        if (petsR.ok) {
          const petsJson = await petsR.json()
          setPetsList(Array.isArray(petsJson) ? petsJson : petsJson.data || [])
        }
        setStep(2)
      } else {
        alert('Không tìm thấy khách hàng. Vui lòng tạo mới.')
        setCustomer(null)
      }
    } catch (e) {
      console.error('Error searching customer:', e)
      alert('Lỗi tìm kiếm khách hàng')
    }
    setSearching(false)
  }

  // Step 2: Handle pet selection
  const handlePetSelected = () => {
    if (!selectedPetId && !createNewPet) {
      alert('Vui lòng chọn thú cưng hoặc tạo mới')
      return
    }
    setStep(3)
  }

  // Handle create new pet
  const handleCreatePet = async () => {
    if (!newPetData.name.trim()) {
      alert('Vui lòng nhập tên thú cưng')
      return
    }
    try {
      const r = await fetch(`${API_BASE}/api/pets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pet_name: newPetData.name,
          pet_type: newPetData.type,
          breed: newPetData.breed,
          customer_id: customer.customer_id || customer.id
        })
      })
      if (r.ok) {
        const json = await r.json()
        const newPetId = json.data?.pet_id || json.pet_id || json.id
        setSelectedPetId(newPetId)
        setCreateNewPet(false)
        setNewPetData({ name: '', type: '', breed: '' })
        alert('Thêm thú cưng thành công')
        setStep(3)
      } else {
        alert('Lỗi thêm thú cưng')
      }
    } catch (e) {
      console.error('Error creating pet:', e)
      alert('Lỗi: Không thể tạo thú cưng')
    }
  }

  // Handle employee fetch when branch changes
  useEffect(() => {
    if (!appointmentData.branchId) return
    const fetchEmployees = async () => {
      try {
        const r = await fetch(`${API_BASE}/api/employees/get-employee-receptionist/${appointmentData.branchId}`)
        if (r.ok) {
          const json = await r.json()
          setEmployees(json.data || json)
        }
      } catch (e) {
        console.warn('Error fetching employees:', e)
      }
    }
    fetchEmployees()
  }, [appointmentData.branchId])

  // Step 3: Submit appointment
  const submitAppointment = async () => {
    if (!appointmentData.branchId || !appointmentData.date || !appointmentData.time) {
      alert('Vui lòng điền đầy đủ thông tin')
      return
    }

    setSubmitting(true)
    try {
      const appointmentTime = new Date(appointmentData.date + 'T' + appointmentData.time).toISOString()
      const payload = {
        customer_id: customer.customer_id || customer.id,
        pet_id: selectedPetId ? Number(selectedPetId) : null,
        branch_id: Number(appointmentData.branchId),
        employee_id: appointmentData.employeeId ? Number(appointmentData.employeeId) : null,
        appointment_time: appointmentTime,
        status: 'Pending',
        channel: 'Walk-in',
        service_ids: []
      }

      const r = await fetch(`${API_BASE}/api/appointments/add-appointment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (r.ok) {
        alert('✅ Đặt lịch walk-in thành công!')
        const json = await r.json()
        const apptId = json.data?.fnc_insert_appointment || json.data?.appointment_id || json.appointmentId || null
        setAppointmentId(apptId)
        setStep(4) // Go to service selection step
      } else {
        const errJson = await r.json().catch(() => ({}))
        alert('Lỗi: ' + (errJson.message || 'Không thể đặt lịch'))
      }
    } catch (e) {
      console.error('Error submitting appointment:', e)
      alert('Lỗi: Không thể kết nối server')
    }
    setSubmitting(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-cyan-100 relative overflow-hidden">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors z-20"
      >
        ← Quay lại
      </button>

      <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-200 rounded-full opacity-15 animate-pulse"></div>

      <div className="container mx-auto px-4 py-8 pt-16 relative z-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-center text-indigo-800 mb-4 drop-shadow-lg">
            🚶 Tiếp nhận khách đến trực tiếp
          </h1>
          <p className="text-xl text-gray-700 text-center mb-8">
            Đặt lịch khám cho khách hàng mới hoặc khách hàng cũ
          </p>

          {/* Step Indicator */}
          <div className="flex justify-between items-center mb-8">
            <div className={`flex-1 h-1 rounded ${step >= 1 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{background: step >= 1 ? '#4F46E5' : '#D1D5DB'}}>1</div>
            <div className={`flex-1 h-1 rounded ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{background: step >= 2 ? '#4F46E5' : '#D1D5DB'}}>2</div>
            <div className={`flex-1 h-1 rounded ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{background: step >= 3 ? '#4F46E5' : '#D1D5DB'}}>3</div>
          </div>

          {/* STEP 1: Search Customer */}
          {step === 1 && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-indigo-200">
              <h2 className="text-3xl font-bold text-indigo-800 mb-6">📱 Bước 1: Tìm kiếm khách hàng</h2>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Số điện thoại</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchCustomer()}
                    placeholder="Nhập số điện thoại khách..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={searchCustomer}
                    disabled={searching}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold disabled:bg-gray-400"
                  >
                    {searching ? '🔄' : '🔍'} Tìm
                  </button>
                </div>
              </div>
              {customer && (
                <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
                  <p className="font-semibold text-indigo-800">✅ Tìm thấy khách hàng:</p>
                  <p className="text-gray-700">Tên: <span className="font-bold">{customer.full_name || customer.name}</span></p>
                  <p className="text-gray-700">SĐT: <span className="font-bold">{customer.phone}</span></p>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Select or Create Pet */}
          {step === 2 && customer && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-indigo-200">
              <h2 className="text-3xl font-bold text-indigo-800 mb-6">🐾 Bước 2: Chọn thú cưng</h2>
              
              {!createNewPet && petsList.length > 0 && (
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">Thú cưng có sẵn</label>
                  <select
                    value={selectedPetId}
                    onChange={(e) => setSelectedPetId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">-- Chọn thú cưng --</option>
                    {petsList.map(p => (
                      <option key={p.id || p.pet_id} value={p.id || p.pet_id}>
                        {p.name || p.pet_name} ({p.type || p.pet_type || 'N/A'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={() => setCreateNewPet(!createNewPet)}
                className="mb-6 text-indigo-600 hover:text-indigo-700 font-semibold underline"
              >
                {createNewPet ? '❌ Hủy tạo mới' : '➕ Tạo thú cưng mới'}
              </button>

              {createNewPet && (
                <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-300 mb-6">
                  <h3 className="font-bold text-indigo-800 mb-4">Thêm thú cưng mới</h3>
                  <input
                    type="text"
                    value={newPetData.name}
                    onChange={(e) => setNewPetData({...newPetData, name: e.target.value})}
                    placeholder="Tên thú cưng"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={newPetData.type}
                    onChange={(e) => setNewPetData({...newPetData, type: e.target.value})}
                    placeholder="Loại (Chó/Mèo/...)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={newPetData.breed}
                    onChange={(e) => setNewPetData({...newPetData, breed: e.target.value})}
                    placeholder="Giống (tùy chọn)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleCreatePet}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
                  >
                    ✅ Tạo thú cưng
                  </button>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-3 rounded-lg transition-colors font-semibold"
                >
                  ← Quay lại
                </button>
                <button
                  onClick={handlePetSelected}
                  disabled={!selectedPetId && !newPetData.name}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition-colors font-semibold"
                >
                  Tiếp tục →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Create Appointment */}
          {step === 3 && customer && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-indigo-200">
              <h2 className="text-3xl font-bold text-indigo-800 mb-6">📅 Bước 3: Tạo lịch khám</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Chi nhánh</label>
                  <select
                    value={appointmentData.branchId}
                    onChange={(e) => setAppointmentData({...appointmentData, branchId: e.target.value, employeeId: ''})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">-- Chọn chi nhánh --</option>
                    {branches.map(b => (
                      <option key={b.branch_id} value={b.branch_id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Bác sĩ (tùy chọn)</label>
                  <select
                    value={appointmentData.employeeId}
                    onChange={(e) => setAppointmentData({...appointmentData, employeeId: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">-- Chọn bác sĩ --</option>
                    {employees.map(e => (
                      <option key={e.employee_id} value={e.employee_id}>{e.full_name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Ngày khám</label>
                    <input
                      type="date"
                      value={appointmentData.date}
                      onChange={(e) => setAppointmentData({...appointmentData, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Giờ khám</label>
                    <input
                      type="time"
                      value={appointmentData.time}
                      onChange={(e) => setAppointmentData({...appointmentData, time: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Ghi chú</label>
                  <textarea
                    value={appointmentData.notes}
                    onChange={(e) => setAppointmentData({...appointmentData, notes: e.target.value})}
                    placeholder="Ghi chú thêm về lịch khám..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-3 rounded-lg transition-colors font-semibold"
                >
                  ← Quay lại
                </button>
                <button
                  onClick={submitAppointment}
                  disabled={submitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition-colors font-semibold"
                >
                  {submitting ? '⏳' : '✅'} Tạo lịch khám
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Add Services */}
          {step === 4 && appointmentId && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-indigo-200">
              <h2 className="text-3xl font-bold text-indigo-800 mb-6">📋 Bước 4: Thêm dịch vụ</h2>
              
              <p className="text-gray-700 mb-4">Chọn dịch vụ muốn thêm cho lịch khám này:</p>
              
              <div className="mb-6 max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-4 bg-gray-50">
                {services.length === 0 ? (
                  <p className="text-gray-500">Không có dịch vụ nào</p>
                ) : (
                  services.map(s => (
                    <label key={s.service_id || s.id || s.serviceid} className="flex items-center mb-3 cursor-pointer hover:bg-white p-2 rounded transition">
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(Number(s.service_id || s.id || s.serviceid))}
                        onChange={(e) => {
                          const id = Number(s.service_id || s.id || s.serviceid)
                          if (e.target.checked) {
                            setSelectedServices([...selectedServices, id])
                          } else {
                            setSelectedServices(selectedServices.filter(x => x !== id))
                          }
                        }}
                        className="w-5 h-5 text-indigo-600 rounded cursor-pointer"
                      />
                      <span className="ml-3 text-gray-700 font-medium">{s.name || s.servicename}</span>
                    </label>
                  ))
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/appointment-list')}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-3 rounded-lg transition-colors font-semibold"
                >
                  ⏭️ Bỏ qua
                </button>
                <button
                  onClick={async () => {
                    if (selectedServices.length === 0) {
                      navigate('/appointment-list')
                      return
                    }
                    setAddingServices(true)
                    try {
                      const res = await fetch(`${API_BASE}/api/appointments/${appointmentId}/add-services`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ service_ids: selectedServices })
                      })
                      if (res.ok) {
                        alert('✅ Đã thêm dịch vụ thành công!')
                        navigate('/appointment-list')
                      } else {
                        alert('Lỗi thêm dịch vụ, nhưng lịch đã được tạo')
                        navigate('/appointment-list')
                      }
                    } catch (e) {
                      alert('Lỗi kết nối server, nhưng lịch đã được tạo')
                      navigate('/appointment-list')
                    }
                    setAddingServices(false)
                  }}
                  disabled={addingServices}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition-colors font-semibold"
                >
                  {addingServices ? '⏳' : '✅'} Thêm dịch vụ
                </button>
              </div>
            </div>
          )}        </div>
      </div>
    </main>
  )
}

export default WalkInAppointment