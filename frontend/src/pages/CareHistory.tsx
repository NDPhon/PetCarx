import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { API_BASE } from '../lib/api'

function CareHistory() {
  const navigate = useNavigate()
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE}/api/demo/medical-records`)
        if (res.ok) {
          const data = await res.json()
          setRecords(data)
        } else {
          setRecords([])
        }
      } catch (err) {
        console.error('Failed to fetch medical records:', err)
        setRecords([])
      } finally {
        setLoading(false)
      }
    }
    fetchRecords()
  }, [])

  return (
    <main className="container mx-auto px-4 py-8 pt-16 relative">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors z-10"
      >
        ← Quay lại
      </button>

      <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">Lịch sử chăm sóc</h1>
      <p className="text-center text-gray-700 mb-12">
        Theo dõi lịch sử khám và điều trị.
      </p>

      {loading ? (
        <div className="text-center py-12">Đang tải...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Thú cưng</th>
                <th className="px-6 py-3">Chủ nuôi</th>
                <th className="px-6 py-3">Ngày</th>
                <th className="px-6 py-3">Chẩn đoán</th>
                <th className="px-6 py-3">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={r.id || i} className={`border-b ${i % 2 === 0 ? 'bg-white' : 'bg-blue-50'}`}>
                  <td className="px-6 py-4">{r.id}</td>
                  <td className="px-6 py-4">{r.petName}</td>
                  <td className="px-6 py-4">{r.ownerName}</td>
                  <td className="px-6 py-4">{r.followUpDate || (r.created_at ? new Date(r.created_at).toLocaleDateString() : '')}</td>
                  <td className="px-6 py-4">{r.diagnosis}</td>
                  <td className="px-6 py-4">{r.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

export default CareHistory