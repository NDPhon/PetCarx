import { useEffect, useState } from 'react'
import { API_BASE } from '../lib/api'
import { useNavigate } from 'react-router-dom'

const MedicalHistory = () => {
  const navigate = useNavigate()
  const [pets, setPets] = useState<any[]>([])
  const [petId, setPetId] = useState<string>('')
  const [petName, setPetName] = useState<string>('')
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const r = await fetch(`${API_BASE}/api/pets`)
        if (r.ok) {
          const pets = await r.json()
          setPets(Array.isArray(pets) ? pets : pets.data || [])
        }
      } catch (e) {
        console.warn('Error fetching pets:', e)
      }
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
    } catch (e) {
      console.error('Error loading medical history:', e)
    }
    setLoading(false)
  }

  const handleSelectPet = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value
    setPetId(selected)
    const pet = pets.find(p => (p.id || p.pet_id || p.petid) === selected)
    setPetName(pet?.name || pet?.pet_name || pet?.petname || '')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-rose-100 relative overflow-hidden">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors z-20"
      >
        ← Quay lại
      </button>

      <div className="absolute top-10 left-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-pink-200 rounded-full opacity-15 animate-pulse"></div>

      <div className="container mx-auto px-4 py-8 pt-16 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl font-bold text-center text-purple-800 mb-4 drop-shadow-lg">
            📋 Lịch sử khám bệnh
          </h1>
          <p className="text-xl text-gray-700 text-center mb-8">
            Tra cứu lịch sử khám bệnh chi tiết của thú cưng
          </p>

          {/* Pet Selection */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-200 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Chọn thú cưng</label>
                <select
                  value={petId}
                  onChange={handleSelectPet}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">-- Chọn thú cưng --</option>
                  {pets.map(p => (
                    <option key={p.id || p.pet_id || p.petid} value={p.id || p.pet_id || p.petid}>
                      {p.name || p.pet_name || p.petname}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={loadHistory}
                  disabled={!petId || loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition-colors font-semibold"
                >
                  📂 Xem lịch sử
                </button>
              </div>
            </div>
          </div>

          {/* Medical History */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-lg text-gray-600">Đang tải dữ liệu...</p>
            </div>
          ) : petId && history.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-purple-200 text-center">
              <p className="text-lg text-gray-600">Chưa có lịch sử khám bệnh cho thú cưng này</p>
            </div>
          ) : petId ? (
            <div className="space-y-4">
              {history.map((record: any, idx: number) => (
                <div key={idx} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-l-4 border-purple-500 hover:shadow-2xl transition">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-bold text-purple-800 mb-2">📅 Ngày khám</h3>
                      <p className="text-gray-700">
                        {new Date(record.exam_date || record.examination_date).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-purple-800 mb-2">👨‍⚕️ Bác sĩ</h3>
                      <p className="text-gray-700">{record.doctor_name || record.employee_name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-bold text-purple-800 mb-2">🔬 Chẩn đoán</h3>
                    <p className="text-gray-700 bg-purple-50 p-3 rounded">
                      {record.diagnosis || record.diagnostic || 'Không có thông tin'}
                    </p>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-bold text-purple-800 mb-2">📝 Ghi chú / Kết luận</h3>
                    <p className="text-gray-700 bg-pink-50 p-3 rounded">
                      {record.notes || record.treatment_notes || 'Không có ghi chú'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-purple-200 text-center">
              <p className="text-lg text-gray-600">Vui lòng chọn thú cưng để xem lịch sử khám</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default MedicalHistory
