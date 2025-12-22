import { Card } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'

function Pets() {
  const navigate = useNavigate()
  const pets = [
    { id: 1, name: 'Mèo Mimi', type: 'Mèo', age: 2, owner: 'Nguyễn Văn A' },
    { id: 2, name: 'Chó Max', type: 'Chó', age: 3, owner: 'Trần Thị B' },
    { id: 3, name: 'Chim Kiwi', type: 'Chim', age: 1, owner: 'Lê Văn C' },
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
        style={{backgroundImage: 'url(https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1200)'}}
      ></div>
      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">Thú cưng</h1>
        <p className="text-center text-gray-700 mb-12">
          Quản lý hồ sơ thú cưng của bạn.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-blue-100 border-blue-300 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/pets/add')}>
            <h5 className="text-2xl font-bold tracking-tight text-blue-900 dark:text-white">
              Thêm thú cưng mới
            </h5>
            <p className="font-normal text-blue-700 dark:text-gray-400">
              Đăng ký thú cưng mới vào hệ thống.
            </p>
          </Card>

          <Card className="bg-green-100 border-green-300 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/pets/view')}>
            <h5 className="text-2xl font-bold tracking-tight text-green-900 dark:text-white">
              Xem hồ sơ
            </h5>
            <p className="font-normal text-green-700 dark:text-gray-400">
              Xem và cập nhật thông tin thú cưng.
            </p>
          </Card>

          <Card className="bg-purple-100 border-purple-300 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/pets/history')}>
            <h5 className="text-2xl font-bold tracking-tight text-purple-900 dark:text-white">
              Lịch sử chăm sóc
            </h5>
            <p className="font-normal text-purple-700 dark:text-gray-400">
              Theo dõi lịch sử khám và điều trị.
            </p>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-blue-800">Danh sách thú cưng</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Tên</th>
                <th scope="col" className="px-6 py-3">Loại</th>
                <th scope="col" className="px-6 py-3">Tuổi</th>
                <th scope="col" className="px-6 py-3">Chủ sở hữu</th>
              </tr>
            </thead>
            <tbody>
              {pets.map((pet, index) => (
                <tr key={pet.id} className={`border-b dark:border-gray-700 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} dark:bg-gray-800`}>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {pet.id}
                  </td>
                  <td className="px-6 py-4">{pet.name}</td>
                  <td className="px-6 py-4">{pet.type}</td>
                  <td className="px-6 py-4">{pet.age}</td>
                  <td className="px-6 py-4">{pet.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

export default Pets