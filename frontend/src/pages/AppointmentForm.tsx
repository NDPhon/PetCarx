import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE } from '../lib/api'

function AppointmentForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<any>({
    customerId: '',
    petId: '',
    branchId: '',
    employeeId: '',
    serviceId: '',
    date: '',
    time: '',
    notes: ''
  })

  const [customers, setCustomers] = useState<any[]>([])
  const [pets, setPets] = useState<any[]>([])
  const [branches, setBranches] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    const fetchRefs = async () => {
      try {
        // customers
        const cR = await fetch(`${API_BASE}/api/customers`)
        if (cR.ok) setCustomers(await cR.json())
      } catch (e) { console.warn('Customers fetch failed', e) }
      try {
        const pR = await fetch(`${API_BASE}/api/pets`)
        if (pR.ok) setPets(await pR.json())
      } catch (e) { console.warn('Pets fetch failed', e) }
      try {
        const bR = await fetch(`${API_BASE}/api/branches/get-branch-list`)
        if (bR.ok) setBranches((await bR.json()).data || await bR.json())
        else setBranches([{ branch_id: 1, name: 'Main Branch' }])
      } catch (e) { setBranches([{ branch_id: 1, name: 'Main Branch' }]) }
      try {
        const sR = await fetch(`${API_BASE}/api/services`)
        if (sR.ok) setServices(await sR.json())
        else setServices([
          { id: 1, name: 'Khám thú y' },
          { id: 2, name: 'Cắt tỉa lông' },
          { id: 3, name: 'Tiêm phòng' }
        ])
      } catch (e) { setServices([{ id: 1, name: 'Khám thú y' }, { id: 2, name: 'Cắt tỉa lông' }, { id: 3, name: 'Tiêm phòng' }]) }
    }
    fetchRefs()
  }, [])

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!formData.branchId) return
      try {
        const r = await fetch(`${API_BASE}/api/employees/get-employee-receptionist/${formData.branchId}`)
        if (r.ok) setEmployees((await r.json()).data || await r.json())
      } catch (e) { console.warn('Employees fetch failed', e) }
    }
    fetchEmployees()
  }, [formData.branchId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // If no customerId selected, try to create customer first
      let customer_id = formData.customerId || null
      if (!customer_id && formData.notes) {
        // attempt to create using notes owner or fallback
        try {
          const create = await fetch(`${API_BASE}/api/customers`, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ name: formData.notes, phone: '' }) })
          if (create.ok) {
            const cj = await create.json()
            customer_id = cj.data?.customer_id || cj.customer_id || customer_id
          }
        } catch (e) {}
      }

      const appointment_time = formData.date && formData.time ? new Date(formData.date + 'T' + formData.time).toISOString() : null
      const payload = {
        customer_id: customer_id ? Number(customer_id) : null,
        pet_id: formData.petId ? Number(formData.petId) : null,
        branch_id: formData.branchId ? Number(formData.branchId) : null,
        employee_id: formData.employeeId ? Number(formData.employeeId) : null,
        appointment_time,
        status: 'Pending',
        channel: 'Online',
        service_ids: formData.serviceId ? [Number(formData.serviceId)] : []
      }

      const response = await fetch(`${API_BASE}/api/appointments/add-appointment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const json = await response.json()
        const appointmentId = json.data?.fnc_insert_appointment || json.data?.appointment_id || json.appointmentId || null
        setAppointmentAdded({ show: true, appointmentId })
      } else {
        let msg = 'Có lỗi xảy ra khi đặt lịch!'
        try {
          const j = await response.json()
          msg = j.error || j.message || msg
        } catch (e) {
          msg = await response.text().catch(() => msg)
        }
        if (String(msg).toLowerCase().includes('conflict')) {
          setModal({ show: true, title: 'Xung đột lịch', message: String(msg), onConfirm: () => navigate('/appointment'), cancelText: 'Đóng' })
        } else {
          setModal({ show: true, title: 'Lỗi', message: String(msg) })
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setModal({ show: true, title: 'Lỗi', message: 'Không thể kết nối đến server!' })
    }
  }

  const [modal, setModal] = useState<{show:boolean,title?:string,message?:string,onConfirm?:()=>void,cancelText?:string}>({show:false})
  const [success, setSuccess] = useState<{show:boolean,message?:string}>({show:false})
  const [appointmentAdded, setAppointmentAdded] = useState<{show:boolean,appointmentId?:number}>({show:false})
  const [selectedServicesForAdd, setSelectedServicesForAdd] = useState<number[]>([])
  const [addingServices, setAddingServices] = useState(false)
  
  const hideModal = () => setModal({show:false})

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 relative overflow-hidden">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors z-20"
      >
        ← Quay lại
      </button>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-indigo-200 rounded-full opacity-15 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-200 rounded-full opacity-25 animate-pulse"></div>

      <div className="container mx-auto px-4 py-8 pt-16 relative z-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-5xl font-bold text-center text-blue-800 mb-4 drop-shadow-lg">
            📅 Đặt lịch hẹn
          </h1>
          <p className="text-xl text-gray-700 text-center mb-12">
            Đặt lịch cho thú cưng của bạn
          </p>

          <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Khách hàng</label>
                <select name="customerId" value={formData.customerId} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required>
                  <option value="">Chọn khách hàng</option>
                  {customers.map(c => <option key={c.id || c.customerid} value={c.id || c.customerid}>{c.name || c.customername}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Thú cưng</label>
                <select name="petId" value={formData.petId} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required>
                  <option value="">Chọn thú cưng</option>
                  {pets.map(p => <option key={p.id || p.petid} value={p.id || p.petid}>{p.name || p.petname}</option>)}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Chi nhánh</label>
              <select name="branchId" value={formData.branchId} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required>
                <option value="">Chọn chi nhánh</option>
                {branches.map(b => <option key={b.branch_id || b.id || b.branchid} value={b.branch_id || b.id || b.branchid}>{b.name || b.address || b.name}</option>)}
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Nhân viên tiếp nhận</label>
              <select name="employeeId" value={formData.employeeId} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg">
                <option value="">Chọn nhân viên (tuỳ chọn)</option>
                {employees.map(emp => <option key={emp.employee_id || emp.id} value={emp.employee_id || emp.id}>{emp.full_name || emp.name}</option>)}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Dịch vụ <span className="text-gray-500 text-sm">(tùy chọn - có thể thêm sau)</span></label>
              <select name="serviceId" value={formData.serviceId} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg">
                <option value="">-- Không chọn (thêm sau) --</option>
                {services.map(s => <option key={s.service_id || s.id || s.serviceid} value={s.service_id || s.id || s.serviceid}>{s.name || s.servicename}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Ngày</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Giờ</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-gray-700 font-semibold mb-2">Ghi chú</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mô tả triệu chứng hoặc yêu cầu đặc biệt..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-lg shadow-lg transition-colors font-semibold"
            >
              📅 Đặt lịch ngay
            </button>
          </form>
                {success.show && (
                  <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded text-green-800 text-center">{success.message}</div>
                )}
                {appointmentAdded.show && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                      <h3 className="text-2xl font-bold mb-4 text-green-600">✅ Đặt lịch thành công!</h3>
                      <p className="mb-6 text-gray-700">Lịch khám đã được tạo. Bạn có muốn thêm dịch vụ không?</p>
                      
                      {/* Service selection */}
                      <div className="mb-4 max-h-48 overflow-y-auto border rounded p-3">
                        {services.map(s => (
                          <label key={s.service_id || s.id || s.serviceid} className="flex items-center mb-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                            <input
                              type="checkbox"
                              checked={selectedServicesForAdd.includes(Number(s.service_id || s.id || s.serviceid))}
                              onChange={(e) => {
                                const id = Number(s.service_id || s.id || s.serviceid)
                                if (e.target.checked) {
                                  setSelectedServicesForAdd([...selectedServicesForAdd, id])
                                } else {
                                  setSelectedServicesForAdd(selectedServicesForAdd.filter(x => x !== id))
                                }
                              }}
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="ml-2 text-gray-700">{s.name || s.servicename}</span>
                          </label>
                        ))}
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setAppointmentAdded({show:false})
                            navigate('/appointment-list')
                          }}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                        >
                          Bỏ qua
                        </button>
                        <button
                          onClick={async () => {
                            if (selectedServicesForAdd.length === 0) {
                              setAppointmentAdded({show:false})
                              navigate('/appointment-list')
                              return
                            }
                            setAddingServices(true)
                            try {
                              const addServicesPayload = {
                                appointment_id: appointmentAdded.appointmentId,
                                service_ids: selectedServicesForAdd
                              }
                              const addRes = await fetch(`${API_BASE}/api/appointments/${appointmentAdded.appointmentId}/add-services`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(addServicesPayload)
                              })
                              if (addRes.ok) {
                                setAppointmentAdded({show:false})
                                setSuccess({ show: true, message: '✅ Đặt lịch và thêm dịch vụ thành công!' })
                                setTimeout(() => navigate('/appointment-list'), 1500)
                              } else {
                                alert('Lỗi thêm dịch vụ, nhưng lịch đã được tạo')
                                setAppointmentAdded({show:false})
                                navigate('/appointment-list')
                              }
                            } catch (e) {
                              alert('Lỗi thêm dịch vụ, nhưng lịch đã được tạo')
                              setAppointmentAdded({show:false})
                              navigate('/appointment-list')
                            }
                            setAddingServices(false)
                          }}
                          disabled={addingServices}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded"
                        >
                          {addingServices ? '⏳' : '✅'} Thêm dịch vụ
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {modal.show && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                      <h3 className="text-xl font-bold mb-2">{modal.title}</h3>
                      <p className="mb-4 whitespace-pre-wrap">{modal.message}</p>
                      <div className="flex justify-end gap-2">
                        {modal.cancelText && <button className="px-4 py-2" onClick={() => { hideModal() }}>{modal.cancelText}</button>}
                        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => { hideModal(); modal.onConfirm && modal.onConfirm() }}>{modal.onConfirm ? 'OK' : 'Đóng'}</button>
                      </div>
                    </div>
                  </div>
                )}
        </div>
      </div>
    </main>
  )
}

export default AppointmentForm