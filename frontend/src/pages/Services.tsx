import { Card } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'

function Services() {
  const navigate = useNavigate()
  const services = [
    { id: 1, name: 'Grooming cơ bản', price: '200.000 VND', duration: '30 phút' },
    { id: 2, name: 'Khám tổng quát', price: '150.000 VND', duration: '45 phút' },
    { id: 3, name: 'Tiêm phòng', price: '100.000 VND', duration: '15 phút' },
  ]

  return (
    <main className="container mx-auto px-4 py-8 pt-16 relative">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors z-20"
      >
        ← Quay lại
      </button>

      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-5 rounded-lg"
        style={{backgroundImage: 'url(https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200)'}}
      ></div>
      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">Dịch vụ</h1>
        <p className="text-center text-gray-700 mb-12">
          Các dịch vụ chăm sóc thú cưng của chúng tôi.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-blue-100 border-blue-300 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/services/grooming')}>
            <h5 className="text-2xl font-bold tracking-tight text-blue-900 dark:text-white">
              Grooming
            </h5>
            <p className="font-normal text-blue-700 dark:text-gray-400">
              Cắt tỉa, tắm rửa và chăm sóc ngoại hình chuyên nghiệp.
            </p>
          </Card>

          <Card className="bg-green-100 border-green-300 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/services/exam')}>
            <h5 className="text-2xl font-bold tracking-tight text-green-900 dark:text-white">
              Khám chữa bệnh
            </h5>
            <p className="font-normal text-green-700 dark:text-gray-400">
              Tư vấn và điều trị bệnh cho thú cưng.
            </p>
          </Card>

          <Card className="bg-purple-100 border-purple-300 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/services/vaccine')}>
            <h5 className="text-2xl font-bold tracking-tight text-purple-900 dark:text-white">
              Tiêm phòng
            </h5>
            <p className="font-normal text-purple-700 dark:text-gray-400">
              Lịch tiêm phòng định kỳ cho thú cưng.
            </p>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-blue-800">Danh sách dịch vụ</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Tên dịch vụ</th>
                <th scope="col" className="px-6 py-3">Giá</th>
                <th scope="col" className="px-6 py-3">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr key={service.id} className={`border-b dark:border-gray-700 ${index % 2 === 0 ? 'bg-white' : 'bg-green-50'} dark:bg-gray-800`}>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {service.id}
                  </td>
                  <td className="px-6 py-4">{service.name}</td>
                  <td className="px-6 py-4">{service.price}</td>
                  <td className="px-6 py-4">{service.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

export default Services