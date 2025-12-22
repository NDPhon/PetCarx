import { useNavigate } from 'react-router-dom'

function CareHistory() {
  const navigate = useNavigate()

  const history = [
    { id: 1, pet: 'Mèo Mimi', date: '2025-12-20', service: 'Khám tổng quát', notes: 'Khỏe mạnh' },
    { id: 2, pet: 'Chó Max', date: '2025-12-18', service: 'Tiêm phòng', notes: 'Hoàn thành' },
    { id: 3, pet: 'Chim Kiwi', date: '2025-12-15', service: 'Cắt tỉa', notes: 'Lông mượt' },
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

      <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">Lịch sử chăm sóc</h1>
      <p className="text-center text-gray-700 mb-12">
        Theo dõi lịch sử khám và điều trị.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">ID</th>
              <th scope="col" className="px-6 py-3">Thú cưng</th>
              <th scope="col" className="px-6 py-3">Ngày</th>
              <th scope="col" className="px-6 py-3">Dịch vụ</th>
              <th scope="col" className="px-6 py-3">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr key={item.id} className={`border-b dark:border-gray-700 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} dark:bg-gray-800`}>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {item.id}
                </td>
                <td className="px-6 py-4">{item.pet}</td>
                <td className="px-6 py-4">{item.date}</td>
                <td className="px-6 py-4">{item.service}</td>
                <td className="px-6 py-4">{item.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default CareHistory