import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle, Dropdown, DropdownItem } from 'flowbite-react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Pets from './pages/Pets'
import Services from './pages/Services'
import Contact from './pages/Contact'
import AddPet from './pages/AddPet'
import ViewProfile from './pages/ViewProfile'
import CareHistory from './pages/CareHistory'
import Grooming from './pages/Grooming'
import VetConsultation from './pages/VetConsultation'
import MedicalExam from './pages/MedicalExam'
import Vaccination from './pages/Vaccination'
import AppointmentForm from './pages/AppointmentForm'
import QuickAppointment from './pages/QuickAppointment'
import MedicalExamForm from './pages/MedicalExamForm'
import SalesForm from './pages/SalesForm'
import InvoiceForm from './pages/InvoiceForm'
import RevenueStats from './pages/RevenueStats'
import SearchForm from './pages/SearchForm'
import DemoLists from './pages/DemoLists'
import MedicalHistory from './pages/MedicalHistory'
import Inventory from './pages/Inventory'
import Footer from './components/Footer'

function App() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-brown-200 relative overflow-hidden">
      {/* Paw prints decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute bottom-10 left-10 text-4xl opacity-20">🐾</span>
        <span className="absolute bottom-20 right-20 text-3xl opacity-15">🐕</span>
        <span className="absolute bottom-20 left-20 text-4xl opacity-20">🐾</span>
        <span className="absolute bottom-10 right-10 text-3xl opacity-15">🐱</span>
        <span className="absolute bottom-1/2 left-1/4 text-5xl opacity-10">🐾</span>
        <span className="absolute bottom-1/3 right-1/3 text-4xl opacity-20">🐾</span>
        <span className="absolute bottom-2/3 left-1/3 text-3xl opacity-15">🐶</span>
        <span className="absolute bottom-3/4 right-1/4 text-4xl opacity-20">🐾</span>
      </div>
      <Navbar fluid rounded className="sticky top-0 z-50">
        <NavbarBrand href="/">
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            PetCarx
          </span>
        </NavbarBrand>
        <NavbarToggle />
        <NavbarCollapse>
          <NavbarLink href="/" active={location.pathname === '/'}>
            Trang chủ
          </NavbarLink>
          <NavbarLink href="/pets" active={location.pathname === '/pets'}>
            Thú cưng
          </NavbarLink>
          <NavbarLink href="/services" active={location.pathname === '/services'}>
            Dịch vụ
          </NavbarLink>
          <Dropdown label="Quản lý" inline>
            <DropdownItem onClick={() => navigate('/quick-appointment')}>Đặt lịch</DropdownItem>
            <DropdownItem onClick={() => navigate('/exam-form')}>Khám bệnh</DropdownItem>
            <DropdownItem onClick={() => navigate('/sales')}>Bán hàng</DropdownItem>
            <DropdownItem onClick={() => navigate('/invoice')}>Hóa đơn</DropdownItem>
            <DropdownItem onClick={() => navigate('/inventory')}>Kho / Vắc-xin</DropdownItem>
            <DropdownItem onClick={() => navigate('/stats')}>Thống kê</DropdownItem>
            <DropdownItem onClick={() => navigate('/search')}>Tìm kiếm</DropdownItem>
            <DropdownItem onClick={() => navigate('/demo')}>Demo Data</DropdownItem>
          </Dropdown>
          <NavbarLink href="/contact" active={location.pathname === '/contact'}>
            Liên hệ
          </NavbarLink>
        </NavbarCollapse>
      </Navbar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pets" element={<Pets />} />
        <Route path="/pets/add" element={<AddPet />} />
        <Route path="/pets/view" element={<ViewProfile />} />
        <Route path="/pets/history" element={<CareHistory />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/grooming" element={<Grooming />} />
        <Route path="/services/vet" element={<VetConsultation />} />
        <Route path="/services/exam" element={<MedicalExam />} />
        <Route path="/services/vaccine" element={<Vaccination />} />
        <Route path="/appointment" element={<AppointmentForm />} />
        <Route path="/quick-appointment" element={<QuickAppointment />} />
        <Route path="/exam-form" element={<MedicalExamForm />} />
        <Route path="/medical-history" element={<MedicalHistory />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/sales" element={<SalesForm />} />
        <Route path="/invoice" element={<InvoiceForm />} />
        <Route path="/stats" element={<RevenueStats />} />
        <Route path="/search" element={<SearchForm />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/demo" element={<DemoLists />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App
