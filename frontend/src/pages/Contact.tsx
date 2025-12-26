import { Button, Label, TextInput, Textarea, Card } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'

function Contact() {
  const navigate = useNavigate()

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
        style={{backgroundImage: 'url(https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=1200)'}}
      ></div>
      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">Liên hệ</h1>
        <p className="text-center text-gray-700 mb-12">
          Thông tin liên hệ với PetCarx.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Card className="bg-blue-100 border-blue-300 shadow-lg">
              <h5 className="text-2xl font-bold tracking-tight text-blue-900 dark:text-white">
                Thông tin liên hệ
              </h5>
              <p className="font-normal text-blue-700 dark:text-gray-400 mb-4">
                Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM<br />
                Điện thoại: (028) 1234-5678<br />
                Email: info@petcarx.com<br />
                Giờ làm việc: 8:00 - 18:00 (Thứ 2 - Chủ nhật)
              </p>
            </Card>
          </div>

          <div>
            <Card className="bg-green-100 border-green-300 shadow-lg">
              <h5 className="text-2xl font-bold tracking-tight text-green-900 dark:text-white mb-4">
                Gửi tin nhắn
              </h5>
              <form className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="name">Tên của bạn</Label>
                  <TextInput id="name" type="text" placeholder="Nhập tên" required className="bg-white" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <TextInput id="email" type="email" placeholder="Nhập email" required className="bg-white" />
                </div>
                <div>
                  <Label htmlFor="message">Tin nhắn</Label>
                  <Textarea id="message" placeholder="Nhập tin nhắn" required rows={4} className="bg-white" />
                </div>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Gửi</Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Contact