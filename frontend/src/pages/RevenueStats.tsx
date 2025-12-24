import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE } from '../lib/api'

function RevenueStats() {
  const navigate = useNavigate()

  const [branches, setBranches] = useState<any[]>([])
  const [selectedBranch, setSelectedBranch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [payments, setPayments] = useState<any[]>([])
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [loading, setLoading] = useState(false)

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
    fetchBranches()

    // Set default date range (last 30 days)
    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    setEndDate(today.toISOString().split('T')[0])
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0])
  }, [])

  const fetchRevenue = async () => {
    setLoading(true)
    try {
      const payload: any = {
        start_date: startDate,
        end_date: endDate
      }
      if (selectedBranch) {
        payload.branch_id = Number(selectedBranch)
      }

      const r = await fetch(`${API_BASE}/api/analyze/total-revenue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (r.ok) {
        const json = await r.json()
        const data = json.data

        if (data.payments) {
          setPayments(data.payments)
        }

        if (typeof data.revenue === 'string') {
          setTotalRevenue(parseFloat(data.revenue))
        } else if (data.revenue?.total_revenue) {
          setTotalRevenue(parseFloat(data.revenue.total_revenue))
        }
      }
    } catch (e) {
      console.error('Error fetching revenue:', e)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (startDate && endDate) {
      fetchRevenue()
    }
  }, [])

  const getStatusBadge = (status: string) => {
    const lower = status?.toLowerCase()
    if (lower === 'completed') return 'bg-green-100 text-green-800'
    if (lower === 'pending') return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-green-200 rounded-full opacity-15 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-teal-200 rounded-full opacity-25 animate-pulse"></div>

      {/* Header with back button */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-emerald-600 to-green-500 shadow-xl border-b-4 border-emerald-800">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-white hover:bg-gray-100 text-emerald-700 px-8 py-3 rounded-lg shadow-xl transition-all font-bold text-lg hover:scale-105"
          >
            ← Quay lại
          </button>
          <h1 className="text-4xl font-black text-white drop-shadow-lg">
            💰 Thống kê doanh thu
          </h1>
          <div className="w-24"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Filter Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-emerald-200 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Chi nhánh</label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Tất cả chi nhánh --</option>
                  {branches.map(b => (
                    <option key={b.branch_id} value={b.branch_id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Từ ngày</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Đến ngày</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={fetchRevenue}
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
                >
                  {loading ? '⏳' : '🔍'} Xem
                </button>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-gradient-to-br from-orange-500 via-red-500 to-red-600 rounded-3xl p-12 shadow-2xl text-white mb-8 border-4 border-white">
            <h2 className="text-4xl font-black mb-6 drop-shadow-xl">💰 TỔNG DOANH THU</h2>
            <p className="text-6xl font-black mb-6 drop-shadow-xl">{totalRevenue.toLocaleString('vi-VN')} VND</p>
            <p className="text-lg font-bold opacity-95">Từ {new Date(startDate).toLocaleDateString('vi-VN')} đến {new Date(endDate).toLocaleDateString('vi-VN')}</p>
          </div>

          {/* Payments Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              <p className="mt-4 text-lg text-gray-600">Đang tải dữ liệu...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-emerald-200 text-center">
              <p className="text-lg text-gray-600">Không có dữ liệu thanh toán trong khoảng thời gian này</p>
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-emerald-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-emerald-600 text-white">
                      <th className="px-6 py-3 text-left">Hóa đơn</th>
                      <th className="px-6 py-3 text-left">Chi nhánh</th>
                      <th className="px-6 py-3 text-left">Khách hàng</th>
                      <th className="px-6 py-3 text-right">Số tiền</th>
                      <th className="px-6 py-3 text-left">Phương thức</th>
                      <th className="px-6 py-3 text-left">Thời gian</th>
                      <th className="px-6 py-3 text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment: any, idx: number) => (
                      <tr key={idx} className="border-b hover:bg-emerald-50 transition">
                        <td className="px-6 py-4 font-semibold text-gray-800">
                          #{payment.invoice_id}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {payment.branch_name}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {payment.customer_name}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-emerald-600">
                          {parseFloat(payment.paid_amount).toLocaleString('vi-VN')} VND
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {payment.payment_method}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(payment.paid_at).toLocaleString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(payment.status)}`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Summary Stats */}
          {payments.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-emerald-200 text-center">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-semibold text-gray-700">Tổng giao dịch</h3>
                <p className="text-2xl font-bold text-emerald-600">{payments.length}</p>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-emerald-200 text-center">
                <div className="text-3xl mb-2">✅</div>
                <h3 className="font-semibold text-gray-700">Thanh toán thành công</h3>
                <p className="text-2xl font-bold text-green-600">
                  {payments.filter(p => p.status?.toLowerCase() === 'completed').length}
                </p>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-emerald-200 text-center">
                <div className="text-3xl mb-2">💵</div>
                <h3 className="font-semibold text-gray-700">Trung bình/giao dịch</h3>
                <p className="text-2xl font-bold text-emerald-600">
                  {(totalRevenue / payments.length).toLocaleString('vi-VN')} VND
                </p>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-emerald-200 text-center">
                <div className="text-3xl mb-2">📈</div>
                <h3 className="font-semibold text-gray-700">Giao dịch cao nhất</h3>
                <p className="text-2xl font-bold text-emerald-600">
                  {Math.max(...payments.map(p => parseFloat(p.paid_amount))).toLocaleString('vi-VN')} VND
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default RevenueStats