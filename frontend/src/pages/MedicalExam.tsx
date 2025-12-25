import { useNavigate } from 'react-router-dom'

function MedicalExam() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-100 via-orange-50 to-pink-100 relative overflow-hidden">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors z-20"
      >
        ← Quay lại
      </button>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-red-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-orange-200 rounded-full opacity-15 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-200 rounded-full opacity-25 animate-pulse"></div>

      <div className="container mx-auto px-4 py-8 pt-16 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-red-800 mb-4 drop-shadow-lg">
            🏥 Khám chữa bệnh
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Dịch vụ khám và điều trị chuyên nghiệp cho thú cưng của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Services Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-red-200">
            <h2 className="text-3xl font-bold mb-6 text-red-800 flex items-center">
              <span className="mr-3">⚕️</span> Dịch vụ khám chữa
            </h2>
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <h3 className="font-semibold text-red-800">Khám tổng quát</h3>
                <p className="text-gray-600">Kiểm tra sức khỏe toàn diện</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                <h3 className="font-semibold text-orange-800">Khám chuyên khoa</h3>
                <p className="text-gray-600">Khám sâu các bộ phận cụ thể</p>
              </div>
              <div className="bg-pink-50 p-4 rounded-lg border-l-4 border-pink-500">
                <h3 className="font-semibold text-pink-800">Chữa trị bệnh</h3>
                <p className="text-gray-600">Điều trị bệnh hiệu quả</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                <h3 className="font-semibold text-purple-800">Phẫu thuật nhỏ</h3>
                <p className="text-gray-600">Các thủ thuật ngoại khoa đơn giản</p>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-red-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-64 h-64 mx-auto mb-6 bg-gradient-to-br from-red-200 to-orange-200 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-8xl">🐾</span>
              </div>
              <p className="text-gray-600 italic">
                "Chăm sóc sức khỏe kịp thời cho thú cưng"
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-red-200 text-center">
          <h2 className="text-3xl font-bold mb-6 text-red-800">Bảng giá tham khảo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800">Khám tổng quát</h3>
              <p className="text-2xl font-bold text-red-600">150.000 VND</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800">Chữa trị</h3>
              <p className="text-2xl font-bold text-orange-600">Tùy bệnh</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
            <button onClick={() => navigate('/appointment-form')} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-lg rounded-lg shadow-lg transition-colors">📅 Đặt lịch (online)</button>
            <button onClick={() => navigate('/appointment-list')} className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 text-lg rounded-lg shadow-lg transition-colors">🗂️ Xem lịch đã đặt</button>
            <button onClick={() => navigate('/walk-in')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 text-lg rounded-lg shadow-lg transition-colors">🚶 Tiếp khách walk-in</button>
            <button onClick={() => navigate('/medical-history')} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 text-lg rounded-lg shadow-lg transition-colors">🩺 Lịch sử khám</button>
            <button onClick={() => navigate('/inventory')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-lg rounded-lg shadow-lg transition-colors">🧪 Kho / Vắc-xin</button>
            <button onClick={() => navigate('/stats')} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg rounded-lg shadow-lg transition-colors">💰 Doanh thu</button>
          </div>
          <p className="text-red-600 font-black text-3xl mt-4 bg-yellow-200 py-3 px-6 rounded-xl inline-block">📞 Hotline: (028) 1234-5678</p>
        </div>
      </div>
    </main>
  )
}

export default MedicalExam