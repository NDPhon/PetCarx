
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Package, 
  Settings2, 
  Search, 
  Loader2, 
  Building2, 
  Tag, 
  Filter, 
  ShoppingCart, 
  Stethoscope, 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  ChevronRight,
  Info,
  Calendar,
  Layers,
  ShoppingBag
} from 'lucide-react';

interface Branch {
  branch_id: number;
  name: string;
}

interface Product {
  product_id: number;
  product_name: string;
  price: string;
  expiry_date: string | null;
  total_stock?: number;
  stock_quantity?: number;
  branch_id?: number;
  branch_name?: string;
}

interface Service {
  service_id: number;
  service_name: string;
  service_type: string;
  base_price?: string;
  final_price?: string;
  price?: string;
  description?: string;
  is_available: boolean;
  branch_id?: number;
  branch_name?: string;
}

const API_BASE = 'http://localhost:8000/api';

interface InventoryManagementProps {
  onBack: () => void;
}

const InventoryManagement: React.FC<InventoryManagementProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'services'>('products');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [searchName, setSearchName] = useState('');
  
  const [items, setItems] = useState<(Product | Service)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const productTypes = ['Medicine', 'Food', 'Toy', 'Accessory'];
  const serviceTypes = ['Vaccination', 'Exam', 'Other'];

  // Fetch branches on mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await fetch(`${API_BASE}/branches/get-branch-list`);
        const json = await res.json();
        if (json.code === 200) setBranches(json.data);
      } catch (err) {
        console.error("Error fetching branches");
      }
    };
    fetchBranches();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '';
      let options: RequestInit = { method: 'GET' };

      if (activeTab === 'products') {
        if (searchName.trim()) {
          // Search by name
          url = `${API_BASE}/products/search-product-by-name-in-branch`;
          options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: searchName,
              ...(selectedBranchId ? { branch_id: parseInt(selectedBranchId) } : {})
            })
          };
        } else if (selectedBranchId) {
          // Search by branch (+ type)
          url = `${API_BASE}/products/get-products-by-branch-id/${selectedBranchId}${selectedType ? `?product_type=${selectedType}` : ''}`;
        } else {
          // Get all
          url = `${API_BASE}/products/get-all-products`;
        }
      } else {
        // Services tab
        if (searchName.trim()) {
          url = `${API_BASE}/services/search-service-by-name-in-branch`;
          options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: searchName,
              ...(selectedBranchId ? { branch_id: parseInt(selectedBranchId) } : {})
            })
          };
        } else if (selectedBranchId) {
          url = `${API_BASE}/services/get-services-by-branch-id/${selectedBranchId}${selectedType ? `?service_type=${selectedType}` : ''}`;
        } else {
          url = `${API_BASE}/services/get-all-services`;
        }
      }

      const res = await fetch(url, options);
      const json = await res.json();
      if (json.code === 200) {
        setItems(json.data);
      } else {
        setItems([]);
        setError(json.message || "Không tìm thấy kết quả phù hợp.");
      }
    } catch (err) {
      setError("Lỗi kết nối máy chủ khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, selectedBranchId, selectedType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(amount));
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Vô thời hạn';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 mb-2 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Quay lại trang chủ
        </button>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <Layers className="w-8 h-8 text-indigo-600" /> Quản lý Danh mục & Tồn kho
        </h1>
        <p className="text-slate-500 text-sm mt-1">Tra cứu sản phẩm và các dịch vụ thú y trên toàn hệ thống.</p>
      </div>

      {/* Control Panel */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 mb-8 space-y-6">
        {/* Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-2xl w-full sm:w-fit">
          <button 
            onClick={() => { setActiveTab('products'); setSelectedType(''); setItems([]); }}
            className={`flex-1 sm:flex-none px-8 py-3 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${activeTab === 'products' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <ShoppingBag className="w-4 h-4" /> Sản phẩm
          </button>
          <button 
            onClick={() => { setActiveTab('services'); setSelectedType(''); setItems([]); }}
            className={`flex-1 sm:flex-none px-8 py-3 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${activeTab === 'services' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Stethoscope className="w-4 h-4" /> Dịch vụ
          </button>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          <div className="flex-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Building2 className="w-3 h-3 text-indigo-500" /> Chi nhánh
            </label>
            <select 
              value={selectedBranchId}
              onChange={(e) => { setSelectedBranchId(e.target.value); setSelectedType(''); }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer hover:bg-slate-100/50"
            >
              <option value="">Toàn hệ thống</option>
              {branches.map(b => <option key={b.branch_id} value={b.branch_id}>{b.name}</option>)}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Tag className="w-3 h-3 text-indigo-500" /> Phân loại
            </label>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer hover:bg-slate-100/50"
            >
              <option value="">Tất cả loại</option>
              {(activeTab === 'products' ? productTypes : serviceTypes).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Search className="w-3 h-3 text-indigo-500" /> Tìm kiếm theo tên
            </label>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder={activeTab === 'products' ? "VD: Vaccine, Food..." : "VD: Khám tổng quát, Tiêm..."}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <button 
                type="submit"
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                Tìm
              </button>
            </form>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-100 text-amber-700 rounded-2xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Display Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
            <p className="font-bold uppercase tracking-widest text-xs">Đang truy xuất dữ liệu...</p>
          </div>
        ) : items.length > 0 ? (
          items.map((item, idx) => {
            const isProduct = activeTab === 'products';
            const prod = item as Product;
            const serv = item as Service;
            const price = isProduct ? prod.price : (serv.final_price || serv.price || '0');
            const stock = isProduct ? (prod.total_stock ?? prod.stock_quantity ?? 0) : null;
            const branch = isProduct ? prod.branch_name : serv.branch_name;

            return (
              <div key={idx} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all overflow-hidden group">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${isProduct ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                      {isProduct ? <ShoppingCart className="w-6 h-6" /> : <Stethoscope className="w-6 h-6" />}
                    </div>
                    {branch && (
                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100/50 flex items-center gap-1 uppercase tracking-tighter">
                        <Building2 className="w-3 h-3" /> {branch}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                    {isProduct ? prod.product_name : serv.service_name}
                  </h3>
                  
                  <div className="space-y-3 pt-4 border-t border-slate-50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Đơn giá</span>
                      <span className="text-sm font-black text-slate-900">{formatCurrency(price)}</span>
                    </div>

                    {isProduct ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tồn kho</span>
                          <span className={`text-sm font-black ${stock! > 10 ? 'text-green-600' : 'text-amber-600'}`}>{stock} đơn vị</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hết hạn</span>
                          <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {formatDate(prod.expiry_date)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loại dịch vụ</span>
                          <span className="text-xs font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md uppercase">{serv.service_type}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Khả dụng</span>
                          {serv.is_available ? (
                            <span className="text-green-600 flex items-center gap-1 text-xs font-bold">
                              <CheckCircle2 className="w-3 h-3" /> Đang cung cấp
                            </span>
                          ) : (
                            <span className="text-red-600 flex items-center gap-1 text-xs font-bold">
                              <XCircle className="w-3 h-3" /> Tạm ngưng
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="bg-slate-50/50 p-4 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
                     Chi tiết <ChevronRight className="w-3 h-3" />
                   </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
            <Info className="w-16 h-16 opacity-10 mb-4" />
            <p className="text-lg font-bold">Không tìm thấy dữ liệu</p>
            <p className="text-sm">Hãy thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;
