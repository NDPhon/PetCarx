import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function MedicalExamForm() {
  const navigate = useNavigate()
  const [examData, setExamData] = useState({
    petName: '',
    ownerName: '',
    symptoms: '',
    diagnosis: '',
    treatment: '',
    medications: '',
    notes: '',
    followUpDate: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setExamData({
      ...examData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/medical-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          petName: examData.petName,
          ownerName: examData.ownerName,
          symptoms: examData.symptoms,
          diagnosis: examData.diagnosis,
          treatment: examData.treatment,
          medications: examData.medications,
          notes: examData.notes,
          followUpDate: examData.followUpDate,
          veterinarian: examData.veterinarian
        })
      });

      if (response.ok) {
        alert('Lưu hồ sơ khám bệnh thành công!');
        navigate('/');
      } else {
        alert('Có lỗi xảy ra khi lưu hồ sơ!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Không thể kết nối đến server!');
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-100 via-teal-50 to-cyan-100 relative overflow-hidden">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors z-20"
      >
        ← Quay lại
      </button>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-teal-200 rounded-full opacity-15 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-cyan-200 rounded-full opacity-25 animate-pulse"></div>

      <div className="container mx-auto px-4 py-8 pt-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-center text-green-800 mb-4 drop-shadow-lg">
            🩺 Khám bệnh & Hồ sơ y tế
          </h1>
          <p className="text-xl text-gray-700 text-center mb-12">
            Ghi nhận kết quả khám và tạo hồ sơ y tế
          </p>

          <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-200">
            {/* Patient Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-green-800 mb-4">📋 Thông tin bệnh nhân</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Tên thú cưng</label>
                  <input
                    type="text"
                    name="petName"
                    value={examData.petName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Tên chủ nuôi</label>
                  <input
                    type="text"
                    name="ownerName"
                    value={examData.ownerName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Examination Details */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-green-800 mb-4">🔍 Chi tiết khám</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Triệu chứng</label>
                  <textarea
                    name="symptoms"
                    value={examData.symptoms}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Mô tả triệu chứng của thú cưng..."
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Chẩn đoán</label>
                  <textarea
                    name="diagnosis"
                    value={examData.diagnosis}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Kết quả chẩn đoán..."
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phương pháp điều trị</label>
                  <textarea
                    name="treatment"
                    value={examData.treatment}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Phương pháp điều trị được áp dụng..."
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Thuốc kê đơn</label>
                  <textarea
                    name="medications"
                    value={examData.medications}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Danh sách thuốc và liều lượng..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Ghi chú</label>
                  <textarea
                    name="notes"
                    value={examData.notes}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ghi chú thêm..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Ngày tái khám</label>
                  <input
                    type="date"
                    name="followUpDate"
                    value={examData.followUpDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg rounded-lg shadow-lg transition-colors font-semibold"
            >
              💾 Lưu hồ sơ khám bệnh
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default MedicalExamForm