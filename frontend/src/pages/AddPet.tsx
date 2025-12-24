import { Button, Label, TextInput, Select } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'

function AddPet() {
  const navigate = useNavigate()

  return (
    <main className="container mx-auto px-4 py-8 pt-16 relative">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors z-10"
      >
        ← Quay lại
      </button>

      <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">Thêm thú cưng mới</h1>
      <p className="text-center text-gray-700 mb-12">
        Đăng ký thú cưng mới vào hệ thống.
      </p>

      <div className="max-w-md mx-auto">
        <form className="flex flex-col gap-4">
          <div>
            <Label htmlFor="name">Tên thú cưng</Label>
            <TextInput id="name" type="text" placeholder="Nhập tên thú cưng" required />
          </div>
          <div>
            <Label htmlFor="type">Loại thú cưng</Label>
            <Select id="type" required>
              <option value="">Chọn loại</option>
              <option value="dog">Chó</option>
              <option value="cat">Mèo</option>
              <option value="bird">Chim</option>
              <option value="other">Khác</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="age">Tuổi</Label>
            <TextInput id="age" type="number" placeholder="Nhập tuổi" required />
          </div>
          <div>
            <Label htmlFor="owner">Chủ sở hữu</Label>
            <TextInput id="owner" type="text" placeholder="Nhập tên chủ" required />
          </div>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Thêm thú cưng</Button>
        </form>
      </div>
    </main>
  )
}

export default AddPet