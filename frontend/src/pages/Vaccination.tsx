import { useNavigate } from 'react-router-dom'

function Vaccination() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-100 via-green-50 to-lime-100 relative overflow-hidden">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors z-20"
      >
        ← Quay lại
      </button>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-green-200 rounded-full opacity-15 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-lime-200 rounded-full opacity-25 animate-pulse"></div>

      <div className="container mx-auto px-4 py-8 pt-16 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-green-800 mb-4 drop-shadow-lg">
            💉 Tiêm phòng
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Bảo vệ sức khỏe thú cưng với lịch tiêm phòng định kỳ và đầy đủ
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Vaccines Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-200">
            <h2 className="text-3xl font-bold mb-6 text-green-800 flex items-center">
              <span className="mr-3">🛡️</span> Các loại vaccine
            </h2>
            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                <h3 className="font-semibold text-yellow-800">Vaccine dại</h3>
                <p className="text-gray-600">Bảo vệ khỏi bệnh dại nguy hiểm</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <h3 className="font-semibold text-green-800">Vaccine tổng hợp</h3>
                <p className="text-gray-600">Phòng ngừa nhiều bệnh phổ biến</p>
              </div>
              <div className="bg-lime-50 p-4 rounded-lg border-l-4 border-lime-500">
                <h3 className="font-semibold text-lime-800">Vaccine ký sinh trùng</h3>
                <p className="text-gray-600">Phòng ngừa ve, bọ chét, giun sán</p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-500">
                <h3 className="font-semibold text-teal-800">Vaccine hô hấp</h3>
                <p className="text-gray-600">Bảo vệ đường hô hấp</p>
              </div>
            </div>
          </div>

          {/* Schedule Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-200">
            <h2 className="text-3xl font-bold mb-6 text-green-800 flex items-center">
              <span className="mr-3">📅</span> Lịch tiêm phòng
            </h2>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800">Lần đầu (2-3 tháng tuổi)</h3>
                <p className="text-gray-600">Vaccine cơ bản + dại</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800">Tiêm nhắc (hàng năm)</h3>
                <p className="text-gray-600">Tất cả vaccine cần thiết</p>
              </div>
              <div className="bg-lime-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lime-800">Ký sinh trùng (hàng quý)</h3>
                <p className="text-gray-600">Phòng ngừa ve, bọ chét</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-green-100 rounded-lg">
              <p className="text-green-800 font-semibold">💡 Lưu ý:</p>
              <p className="text-gray-600 text-sm">Tiêm phòng đúng lịch giúp thú cưng khỏe mạnh và tránh bệnh tật</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-200 text-center">
          <h2 className="text-3xl font-bold mb-6 text-green-800">Đặt lịch tiêm phòng</h2>
          <p className="text-gray-600 mb-4 max-w-md mx-auto">
            Giá tham khảo: 100.000 VND/lần
          </p>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Hãy liên hệ để được tư vấn lịch tiêm phù hợp cho thú cưng của bạn
          </p>
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg rounded-lg shadow-lg transition-colors">
            📞 Đặt lịch tiêm
          </button>
          <p className="text-gray-600 mt-4">Hotline: (028) 1234-5678</p>
        </div>
      </div>
    </main>
  )
}

export default Vaccination