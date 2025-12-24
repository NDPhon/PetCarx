import { useEffect, useState } from 'react'
import { API_BASE } from '../lib/api'
import { useNavigate } from 'react-router-dom'

const MedicalHistory = () => {
  const navigate = useNavigate()
  const [pets, setPets] = useState<any[]>([])
  const [petId, setPetId] = useState<string>('')
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const r = await fetch(`${API_BASE}/api/pets`)
        if (r.ok) setPets(await r.json())
      } catch (e) { console.warn(e) }
    }
    fetchPets()
  }, [])

  const loadHistory = async () => {
    if (!petId) return
    setLoading(true)
    try {
      const r = await fetch(`${API_BASE}/api/medical-records/pet/${encodeURIComponent(petId)}`)
      if (r.ok) {
        const j = await r.json()
        setHistory(j.data || j)
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  return (
    <main className="min-h-screen container mx-auto p-6">
      <button onClick={() => navigate(-1)} className="mb-4 bg-gray-600 text-white px-3 py-1 rounded">← Quay lại</button>
      <h1 className="text-2xl font-bold mb-4">Lịch sử khám bệnh</h1>
      <div className="mb-4 flex gap-2 items-center">
        <select value={petId} onChange={e => setPetId(e.target.value)} className="p-2 border rounded">
          <option value="">Chọn thú cưng</option>
          {pets.map(p => <option key={p.id || p.petid} value={p.id || p.petid}>{p.name || p.petname}</option>)}
        </select>
        <button onClick={loadHistory} className="bg-blue-600 text-white px-3 py-1 rounded">Tải</button>
      </div>
      {loading ? <div>Đang tải...</div> : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Ngày</th>
              <th className="p-2">Bác sĩ</th>
              <th className="p-2">Chẩn đoán</th>
              <th className="p-2">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i} className="border-b">
                <td className="p-2">{h.exam_date ? new Date(h.exam_date).toLocaleString() : ''}</td>
                <td className="p-2">{h.doctor_name || ''}</td>
                <td className="p-2">{h.diagnosis || ''}</td>
                <td className="p-2">{h.notes || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}

export default MedicalHistory
