import { Card } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'

function ViewProfile() {
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
        className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors z-10"
      >
        ← Quay lại
      </button>

      <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">Xem hồ sơ thú cưng</h1>
      <p className="text-center text-gray-700 mb-12">
        Xem và cập nhật thông tin thú cưng.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <Card key={pet.id} className="bg-blue-100 border-blue-300 shadow-lg">
            <h5 className="text-2xl font-bold tracking-tight text-blue-900">
              {pet.name}
            </h5>
            <p className="font-normal text-blue-700">
              Loại: {pet.type}<br />
              Tuổi: {pet.age}<br />
              Chủ: {pet.owner}
            </p>
          </Card>
        ))}
      </div>
    </main>
  )
}

export default ViewProfile