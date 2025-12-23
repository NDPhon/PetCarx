import { useEffect, useState } from 'react'
import { API_BASE } from '../lib/api'
import { useNavigate } from 'react-router-dom'

function DemoLists() {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState<any[]>([])
  const [sales, setSales] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const [invRes, salesRes, apptRes] = await Promise.all([
          fetch(`${API_BASE}/api/demo/invoices`),
          fetch(`${API_BASE}/api/demo/sales`),
          fetch(`${API_BASE}/api/demo/appointments`)
        ])
        if (invRes.ok) setInvoices(await invRes.json())
        if (salesRes.ok) setSales(await salesRes.json())
        if (apptRes.ok) setAppointments(await apptRes.json())
      } catch (err) {
        console.error('Failed to fetch demo lists', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  return (
    <main className="container mx-auto px-4 py-8 pt-16 relative">
      <button onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-gray-600 text-white px-4 py-2 rounded">← Quay lại</button>
      <h1 className="text-3xl font-bold mb-6">Demo Data</h1>

      {loading && <div>Đang tải...</div>}

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Hóa đơn</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2">Mã</th>
                <th className="px-4 py-2">Khách</th>
                <th className="px-4 py-2">Ngày</th>
                <th className="px-4 py-2">Tổng</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((i) => (
                <tr key={i.id} className="border-b">
                  <td className="px-4 py-2">{i.invoiceNumber || i.invoicenumber}</td>
                  <td className="px-4 py-2">{i.customerName || i.customername}</td>
                  <td className="px-4 py-2">{i.date ? new Date(i.date).toLocaleDateString() : ''}</td>
                  <td className="px-4 py-2">{i.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Bán hàng</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2">Khách</th>
                <th className="px-4 py-2">Sản phẩm</th>
                <th className="px-4 py-2">SL</th>
                <th className="px-4 py-2">Tổng</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="px-4 py-2">{s.customerName || s.customername}</td>
                  <td className="px-4 py-2">{s.productName || s.productname}</td>
                  <td className="px-4 py-2">{s.quantity}</td>
                  <td className="px-4 py-2">{s.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Đặt lịch</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2">Thú cưng</th>
                <th className="px-4 py-2">Chủ</th>
                <th className="px-4 py-2">Dịch vụ</th>
                <th className="px-4 py-2">Ngày</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="border-b">
                  <td className="px-4 py-2">{a.petName || a.petname}</td>
                  <td className="px-4 py-2">{a.ownerName || a.ownername}</td>
                  <td className="px-4 py-2">{a.service}</td>
                  <td className="px-4 py-2">{a.date ? new Date(a.date).toLocaleDateString() : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default DemoLists
