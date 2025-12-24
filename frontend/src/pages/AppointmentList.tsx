import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE } from '../lib/api'

function AppointmentList() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [filterPhone, setFilterPhone] = useState('')
  const [filterBranch, setFilterBranch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [branches, setBranches] = useState<any[]>([])

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const r = await fetch(`${API_BASE}/api/branches/get-branch-list`)
        if (r.ok) {
          const json = await r.json()
          setBranches(json.data || json)
        }
      } catch (e) {
        console.warn('fetch branches failed', e)
      }
    }
    fetchBranches()
    loadAppointments()
  }, [])

  const loadAppointments = async (phone?: string) => {
    setLoading(true)
    try {
      let url = `${API_BASE}/api/appointments/get-appointments`
      if (phone) {
        const r = await fetch(`${API_BASE}/api/appointments/find-by-phone`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone })
        })
        if (r.ok) {
          const json = await r.json()
          setAppointments(json.data || json)
        }
      } else {
        const r = await fetch(url)
        if (r.ok) {
          const json = await r.json()
          setAppointments(json.data || json)
        }
      }
    } catch (e) {
      console.error('Error loading appointments:', e)
    }
    setLoading(false)
  }

  const handleSearch = async () => {
    if (filterPhone.trim()) {
      await loadAppointments(filterPhone)
    } else {
      await loadAppointments()
    }
  }

  const handleUpdateStatus = async (appointmentId: number, newStatus: string) => {
    try {
      const r = await fetch(`${API_BASE}/api/appointments/update-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointment_id: appointmentId,
          status: newStatus
        })
      })
      if (r.ok) {
        alert('Cập nhật trạng thái thành công')
        await loadAppointments(filterPhone)
      } else {
        alert('Lỗi cập nhật trạng thái')
      }
    } catch (e) {
      console.error('Error updating status:', e)
      alert('Lỗi: Không thể cập nhật trạng thái')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredAppointments = appointments.filter(apt => {
    const statusMatch = !filterStatus || apt.appointment_status?.toLowerCase() === filterStatus.toLowerCase() || apt.status?.toLowerCase() === filterStatus.toLowerCase()
    const branchMatch = !filterBranch || apt.branch_name?.includes(filterBranch)
    return statusMatch && branchMatch
  })

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-50 to-teal-100 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-cyan-200 rounded-full opacity-15 animate-pulse"></div>

      {/* Header with back button */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-800 to-blue-700 shadow-2xl border-b-4 border-blue-900">
        <div className="container mx-auto px-4 py-7 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-yellow-300 hover:bg-yellow-200 text-blue-900 px-10 py-4 rounded-lg shadow-2xl transition-all font-black text-xl hover:scale-110"
          >
            ← Quay lại
          </button>
          <h1 className="text-5xl font-black text-white drop-shadow-xl">📅 Danh sách lịch khám</h1>
          <div className="w-24"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-7xl mx-auto">

          {/* Filter Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-blue-200 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Số điện thoại</label>
                <input
                  type="text"
                  value={filterPhone}
                  onChange={(e) => setFilterPhone(e.target.value)}
                  placeholder="Nhập SĐT khách..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Chi nhánh</label>
                <select
                  value={filterBranch}
                  onChange={(e) => setFilterBranch(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Tất cả --</option>
                  {branches.map((b: any) => (
                    <option key={b.branch_id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Trạng thái</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Tất cả --</option>
                  <option value="Pending">Chờ xác nhận</option>
                  <option value="Confirmed">Đã xác nhận</option>
                  <option value="Cancelled">Đã hủy</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
                >
                  🔍 Tìm kiếm
                </button>
              </div>
            </div>
          </div>

          {/* Appointments Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-lg text-gray-600">Đang tải dữ liệu...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-200 text-center">
              <p className="text-lg text-gray-600">Không có lịch khám nào</p>
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-blue-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="px-6 py-3 text-left">Khách hàng</th>
                      <th className="px-6 py-3 text-left">SĐT</th>
                      <th className="px-6 py-3 text-left">Thú cưng</th>
                      <th className="px-6 py-3 text-left">Chi nhánh</th>
                      <th className="px-6 py-3 text-left">Bác sĩ</th>
                      <th className="px-6 py-3 text-left">Thời gian khám</th>
                      <th className="px-6 py-3 text-left">Trạng thái</th>
                      <th className="px-6 py-3 text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((apt: any, idx: number) => (
                      <tr key={idx} className="border-b hover:bg-blue-50 transition">
                        <td className="px-6 py-4 font-semibold text-gray-800">
                          {apt.customer_name}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {apt.customer_phone}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {apt.pet_name}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {apt.branch_name}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {apt.employee_name}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(apt.appointment_time).toLocaleString('vi-VN')}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(apt.appointment_status || apt.status)}`}>
                            {apt.appointment_status || apt.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <select
                            onChange={(e) => handleUpdateStatus(apt.appointment_id, e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                            defaultValue=""
                          >
                            <option value="">Cập nhật...</option>
                            <option value="Confirmed">Xác nhận</option>
                            <option value="Cancelled">Hủy</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4 justify-center">
            <button
              onClick={() => navigate('/appointment-form')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
            >
              ➕ Đặt lịch mới
            </button>
            <button
              onClick={() => navigate('/quick-appointment')}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
            >
              ⚡ Đặt lịch nhanh
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default AppointmentList
