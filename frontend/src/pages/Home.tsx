import { Card } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
  return (
    <main className="container mx-auto px-4 py-8 pt-16 relative">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10 rounded-lg"
        style={{backgroundImage: 'url(https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200)'}}
      ></div>
      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">Chào mừng đến với PetCarx</h1>
        <p className="text-center text-gray-700 mb-12">
          Nơi chăm sóc thú cưng tốt nhất cho bạn và người bạn bốn chân.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-blue-100 border-blue-300 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/pets/view')}>
            <h5 className="text-2xl font-bold tracking-tight text-blue-900 dark:text-white">
              Hồ sơ thú cưng
            </h5>
            <p className="font-normal text-blue-700 dark:text-gray-400">
              Quản lý thông tin và lịch sử chăm sóc cho thú cưng của bạn.
            </p>
          </Card>

          <Card className="bg-green-100 border-green-300 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/services/grooming')}>
            <h5 className="text-2xl font-bold tracking-tight text-green-900 dark:text-white">
              Dịch vụ grooming
            </h5>
            <p className="font-normal text-green-700 dark:text-gray-400">
              Cắt tỉa, tắm rửa và chăm sóc ngoại hình chuyên nghiệp.
            </p>
          </Card>

          <Card className="bg-purple-100 border-purple-300 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/services/vet')}>
            <h5 className="text-2xl font-bold tracking-tight text-purple-900 dark:text-white">
              Tư vấn thú y
            </h5>
            <p className="font-normal text-purple-700 dark:text-gray-400">
              Khám chữa bệnh và tư vấn sức khỏe cho thú cưng.
            </p>
          </Card>
        </div>

        {/* Quick actions for 5 KB flows */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Bắt đầu nhanh</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('/appointment-form')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-colors">📅 Đặt lịch (online)</button>
            <button onClick={() => navigate('/appointment-list')} className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg shadow-lg transition-colors">🗂️ Xem lịch đã đặt</button>
            <button onClick={() => navigate('/walk-in')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-lg transition-colors">🚶 Tiếp khách walk-in</button>
            <button onClick={() => navigate('/medical-history')} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow-lg transition-colors">🩺 Lịch sử khám</button>
            <button onClick={() => navigate('/inventory')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg shadow-lg transition-colors">🧪 Kho / Vắc-xin</button>
            <button onClick={() => navigate('/stats')} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg transition-colors">💰 Doanh thu</button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home