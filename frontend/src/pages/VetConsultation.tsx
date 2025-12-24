import { useNavigate } from 'react-router-dom'

function VetConsultation() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-teal-100 relative overflow-hidden">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors z-20"
      >
        ← Quay lại
      </button>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-200 rounded-full opacity-15 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-teal-200 rounded-full opacity-25 animate-pulse"></div>

      <div className="container mx-auto px-4 py-8 pt-16 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-green-800 mb-4 drop-shadow-lg">
            🩺 Tư vấn thú y
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Chăm sóc sức khỏe toàn diện cho thú cưng của bạn với đội ngũ bác sĩ thú y chuyên nghiệp
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Services Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-200">
            <h2 className="text-3xl font-bold mb-6 text-green-800 flex items-center">
              <span className="mr-3">🏥</span> Dịch vụ thú y
            </h2>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <h3 className="font-semibold text-green-800">Khám tổng quát</h3>
                <p className="text-gray-600">Kiểm tra sức khỏe định kỳ cho thú cưng</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-semibold text-blue-800">Chẩn đoán bệnh</h3>
                <p className="text-gray-600">Phát hiện và điều trị bệnh kịp thời</p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-500">
                <h3 className="font-semibold text-teal-800">Tư vấn dinh dưỡng</h3>
                <p className="text-gray-600">Lập kế hoạch ăn uống phù hợp</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                <h3 className="font-semibold text-purple-800">Khuyên bảo chăm sóc</h3>
                <p className="text-gray-600">Hướng dẫn chăm sóc hàng ngày</p>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-64 h-64 mx-auto mb-6 bg-gradient-to-br from-green-200 to-blue-200 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-8xl">🐕‍🦺</span>
              </div>
              <p className="text-gray-600 italic">
                "Sức khỏe thú cưng là ưu tiên hàng đầu của chúng tôi"
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-200 text-center">
          <h2 className="text-3xl font-bold mb-6 text-green-800">Đặt lịch tư vấn</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Hãy liên hệ với chúng tôi để được tư vấn và đặt lịch khám cho thú cưng của bạn
          </p>
          <button onClick={() => navigate('/quick-appointment')} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg rounded-lg shadow-lg transition-colors">
            📞 Đặt lịch ngay
          </button>
          <p className="text-gray-600 mt-4">Hotline: (028) 1234-5678</p>
        </div>
      </div>
    </main>
  )
}

export default VetConsultation