
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Receipt, 
  Plus, 
  Search, 
  Loader2, 
  User, 
  Phone, 
  Building2, 
  Briefcase, 
  ShoppingCart, 
  Trash2, 
  CheckCircle2, 
  X, 
  FileText, 
  DollarSign, 
  CreditCard,
  Package,
  Stethoscope,
  ChevronRight,
  AlertCircle,
  // Fix: Added missing imports for Settings2, PawPrint, and MapPin
  Settings2,
  PawPrint,
  MapPin
} from 'lucide-react';

interface Branch {
  branch_id: number;
  name: string;
}

interface Receptionist {
  employee_id: number;
  full_name: string;
}

interface Customer {
  customer_id: number;
  name: string;
  phone: string;
}

interface InvoiceItem {
  item_type: 'Product' | 'Service';
  id: number;
  name: string;
  price: string;
  quantity: number;
}

interface InvoiceSummary {
  invoice_id: number;
  branch_name: string;
  customer_name: string;
  employee_name: string;
  total_amount: string;
  final_amount: string;
  payment_status: string;
  created_at: string;
}

interface InvoiceDetail {
  line_no: number;
  item_type: string;
  service_id: number | null;
  product_id: number | null;
  quantity: number;
  unit_price: string;
  line_total: string;
}

const API_BASE = 'http://localhost:8000/api';

interface InvoiceManagementProps {
  onBack: () => void;
}

const InvoiceManagement: React.FC<InvoiceManagementProps> = ({ onBack }) => {
  // Step 1: Base Info
  const [branches, setBranches] = useState<Branch[]>([]);
  const [receptionists, setReceptionists] = useState<Receptionist[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [selectedReceptionistId, setSelectedReceptionistId] = useState<string>('');
  
  // Step 2: Customer
  const [customerPhone, setCustomerPhone] = useState('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [searchingCustomer, setSearchingCustomer] = useState(false);

  // Step 3: Invoice Creation
  const [invoiceId, setInvoiceId] = useState<number | null>(null);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  
  // Step 4: Add Items
  const [activeSearchTab, setActiveSearchTab] = useState<'Product' | 'Service'>('Product');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  
  // Step 5: Invoice Content
  const [invoiceSummary, setInvoiceSummary] = useState<InvoiceSummary | null>(null);
  const [invoiceLines, setInvoiceLines] = useState<InvoiceDetail[]>([]);
  const [loadingInvoiceData, setLoadingInvoiceData] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (!selectedBranchId) {
      setReceptionists([]);
      return;
    }
    const fetchReceptionists = async () => {
      try {
        const res = await fetch(`${API_BASE}/employees/get-employee-receptionist-list/${selectedBranchId}`);
        const json = await res.json();
        if (json.code === 200) setReceptionists(json.data);
      } catch (err) {
        console.error("Error fetching receptionists");
      }
    };
    fetchReceptionists();
  }, [selectedBranchId]);

  const handleSearchCustomer = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customerPhone.trim()) return;
    setSearchingCustomer(true);
    setCustomer(null);
    try {
      const res = await fetch(`${API_BASE}/customers/get-customer-by-phone/${customerPhone}`);
      const json = await res.json();
      if (json.code === 200 && json.data) {
        setCustomer(json.data);
      } else {
        setError("Không tìm thấy khách hàng.");
      }
    } catch (err) {
      setError("Lỗi kết nối tìm khách hàng.");
    } finally {
      setSearchingCustomer(false);
    }
  };

  const handleCreateInvoice = async () => {
    if (!customer || !selectedBranchId || !selectedReceptionistId) return;
    setIsCreatingInvoice(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/invoices/add-invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand_id: parseInt(selectedBranchId),
          customer_id: customer.customer_id,
          employee_id: parseInt(selectedReceptionistId)
        })
      });
      const json = await res.json();
      if (json.code === 200) {
        setInvoiceId(json.data.fnc_add_invoice);
        fetchInvoiceData(json.data.fnc_add_invoice);
      } else {
        setError(json.message);
      }
    } catch (err) {
      setError("Lỗi khi khởi tạo hóa đơn.");
    } finally {
      setIsCreatingInvoice(false);
    }
  };

  const fetchInvoiceData = async (id: number) => {
    setLoadingInvoiceData(true);
    try {
      const [sumRes, linesRes] = await Promise.all([
        fetch(`${API_BASE}/invoices/get-invoice-by-id/${id}`),
        fetch(`${API_BASE}/invoices/get-invoice-details-by-id/${id}`)
      ]);
      const sumJson = await sumRes.json();
      const linesJson = await linesRes.json();
      if (sumJson.code === 200) setInvoiceSummary(sumJson.data);
      if (linesJson.code === 200) setInvoiceLines(linesJson.data);
    } catch (err) {
      console.error("Error fetching invoice data");
    } finally {
      setLoadingInvoiceData(false);
    }
  };

  const searchItems = async () => {
    if (!searchTerm.trim()) return;
    setLoadingSearch(true);
    try {
      let url = '';
      let options: RequestInit = { method: 'POST', headers: { 'Content-Type': 'application/json' } };
      
      if (activeSearchTab === 'Product') {
        url = `${API_BASE}/products/search-product-by-name-in-branch`;
        options.body = JSON.stringify({
          branch_id: parseInt(selectedBranchId),
          name: searchTerm
        });
      } else {
        url = `${API_BASE}/services/search-service-by-name-in-branch`;
        options.body = JSON.stringify({
          branch_id: parseInt(selectedBranchId),
          name: searchTerm
        });
      }

      const res = await fetch(url, options);
      const json = await res.json();
      if (json.code === 200) {
        setSearchResults(json.data);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Search error");
    } finally {
      setLoadingSearch(false);
    }
  };

  const addItemToInvoice = async (item: any) => {
    if (!invoiceId) return;
    try {
      const isProduct = activeSearchTab === 'Product';
      const body: any = {
        invoice_id: invoiceId,
        item_type: activeSearchTab,
        quantity: 1
      };
      if (isProduct) body.product_id = item.product_id;
      else body.service_id = item.service_id;

      const res = await fetch(`${API_BASE}/invoices/add-invoice-details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const json = await res.json();
      if (json.code === 200) {
        fetchInvoiceData(invoiceId);
      } else {
        alert(json.message);
      }
    } catch (err) {
      console.error("Add item error");
    }
  };

  const handleUpdatePaymentStatus = async (status: 'Paid' | 'Pending') => {
    if (!invoiceId) return;
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`${API_BASE}/invoices/update-invoice-payment-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoice_id: invoiceId,
          payment_status: status
        })
      });
      const json = await res.json();
      if (json.code === 200) {
        fetchInvoiceData(invoiceId);
      }
    } catch (err) {
      console.error("Update status error");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const formatCurrency = (val: string) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(val));
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 mb-2 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Quay lại
        </button>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <Receipt className="w-8 h-8 text-indigo-600" /> Tạo Hóa đơn mới
        </h1>
        <p className="text-slate-500 text-sm mt-1">Xử lý quy trình lập hóa đơn và thanh toán dịch vụ/sản phẩm.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Configuration */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Settings2 className="w-3 h-3 text-indigo-500" /> Thiết lập cơ bản
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Chi nhánh</label>
                <select 
                  disabled={!!invoiceId}
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
                >
                  <option value="">Chọn chi nhánh...</option>
                  {branches.map(b => <option key={b.branch_id} value={b.branch_id}>{b.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nhân viên lập (Lễ tân)</label>
                <select 
                  disabled={!selectedBranchId || !!invoiceId}
                  value={selectedReceptionistId}
                  onChange={(e) => setSelectedReceptionistId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
                >
                  <option value="">{selectedBranchId ? "Chọn nhân viên..." : "Vui lòng chọn chi nhánh"}</option>
                  {receptionists.map(r => <option key={r.employee_id} value={r.employee_id}>{r.full_name}</option>)}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Tìm khách hàng</label>
               <form onSubmit={handleSearchCustomer} className="flex gap-2">
                 <div className="relative flex-1">
                   <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input 
                    type="tel" 
                    disabled={!!invoiceId}
                    placeholder="SĐT..."
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
                   />
                 </div>
                 <button 
                  type="submit"
                  disabled={searchingCustomer || !!invoiceId}
                  className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-slate-800 disabled:opacity-50"
                 >
                   {searchingCustomer ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                 </button>
               </form>

               {customer && (
                 <div className="mt-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 animate-in zoom-in-95 duration-200">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                        <User className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-xs font-black text-indigo-900">{customer.name}</p>
                        <p className="text-[10px] font-bold text-indigo-500 uppercase">ID: #{customer.customer_id}</p>
                     </div>
                   </div>
                 </div>
               )}
            </div>

            {!invoiceId && (
              <button 
                onClick={handleCreateInvoice}
                disabled={isCreatingInvoice || !customer || !selectedReceptionistId}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2"
              >
                {isCreatingInvoice ? <Loader2 className="w-5 h-5 animate-spin" /> : <Receipt className="w-5 h-5" />}
                Khởi tạo Hóa đơn
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="lg:col-span-8 space-y-8">
          {invoiceId ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Add Items Tool */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex p-1 bg-white rounded-xl border border-slate-200">
                    <button 
                      onClick={() => { setActiveSearchTab('Product'); setSearchResults([]); }}
                      className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${activeSearchTab === 'Product' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400'}`}
                    >
                      Sản phẩm
                    </button>
                    <button 
                      onClick={() => { setActiveSearchTab('Service'); setSearchResults([]); }}
                      className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${activeSearchTab === 'Service' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400'}`}
                    >
                      Dịch vụ
                    </button>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); searchItems(); }} className="flex-1 flex gap-2">
                    <input 
                      type="text"
                      placeholder={`Tìm ${activeSearchTab === 'Product' ? 'sản phẩm' : 'dịch vụ'}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-slate-800 transition-colors">
                      Tìm
                    </button>
                  </form>
                </div>

                <div className="p-6 max-h-[300px] overflow-y-auto custom-scrollbar">
                  {loadingSearch ? (
                    <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
                  ) : searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {searchResults.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => addItemToInvoice(item)}
                          className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all text-left group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600">
                              {activeSearchTab === 'Product' ? <Package className="w-4 h-4" /> : <Stethoscope className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-900 line-clamp-1">{item.product_name || item.service_name}</p>
                              <p className="text-[10px] font-bold text-indigo-600">{formatCurrency(item.price || item.final_price)}</p>
                            </div>
                          </div>
                          <div className="p-1.5 bg-indigo-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus className="w-3 h-3" />
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-400 text-xs italic">Sử dụng thanh tìm kiếm để thêm nội dung hóa đơn.</div>
                  )}
                </div>
              </div>

              {/* Invoice Preview */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
                <div className="px-8 py-10 bg-slate-900 text-white relative">
                  <div className="absolute top-10 right-8 text-right">
                     <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${invoiceSummary?.payment_status === 'Paid' ? 'bg-green-500 border-green-400' : 'bg-amber-500 border-amber-400 animate-pulse'}`}>
                        {invoiceSummary?.payment_status}
                     </span>
                     <h2 className="text-3xl font-black mt-2">HÓA ĐƠN</h2>
                     <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">#{invoiceSummary?.invoice_id}</p>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                       <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                         <PawPrint className="w-7 h-7" />
                       </div>
                       <h3 className="text-xl font-black tracking-tight">PetCarx Clinic</h3>
                     </div>
                     <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 flex items-center gap-2"><MapPin className="w-3 h-3" /> {invoiceSummary?.branch_name}</p>
                        <p className="text-xs font-bold text-slate-400 flex items-center gap-2"><User className="w-3 h-3" /> Nhân viên: {invoiceSummary?.employee_name}</p>
                     </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="mb-8 flex justify-between items-start">
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Thông tin khách hàng</label>
                       <p className="text-lg font-black text-slate-900">{invoiceSummary?.customer_name}</p>
                       <p className="text-xs font-bold text-slate-500">Ngày lập: {invoiceSummary && new Date(invoiceSummary.created_at).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Loại</th>
                          <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID / SKU</th>
                          <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Đơn giá</th>
                          <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">SL</th>
                          <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {invoiceLines.map((line) => (
                          <tr key={line.line_no}>
                            <td className="py-4">
                               <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase ${line.item_type === 'Product' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                  {line.item_type}
                               </span>
                            </td>
                            <td className="py-4">
                               <p className="text-xs font-bold text-slate-900">#{line.product_id || line.service_id}</p>
                            </td>
                            <td className="py-4">
                               <p className="text-xs font-bold text-slate-600">{formatCurrency(line.unit_price)}</p>
                            </td>
                            <td className="py-4 text-center">
                               <p className="text-xs font-black text-slate-900">x{line.quantity}</p>
                            </td>
                            <td className="py-4 text-right">
                               <p className="text-sm font-black text-indigo-600">{formatCurrency(line.line_total)}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col items-end space-y-3">
                    <div className="flex items-center gap-10">
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tổng cộng</span>
                       <span className="text-xl font-black text-slate-900">{invoiceSummary && formatCurrency(invoiceSummary.total_amount)}</span>
                    </div>
                    <div className="flex items-center gap-10">
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chiết khấu</span>
                       <span className="text-sm font-bold text-red-500">-{invoiceSummary && formatCurrency('0.00')}</span>
                    </div>
                    <div className="flex items-center gap-10 py-4 px-6 bg-indigo-50 rounded-2xl">
                       <span className="text-sm font-black text-indigo-900 uppercase tracking-widest">TỔNG THANH TOÁN</span>
                       <span className="text-2xl font-black text-indigo-600">{invoiceSummary && formatCurrency(invoiceSummary.final_amount)}</span>
                    </div>
                  </div>

                  <div className="mt-12 flex gap-4">
                     {invoiceSummary?.payment_status === 'Pending' ? (
                        <button 
                          onClick={() => handleUpdatePaymentStatus('Paid')}
                          disabled={isUpdatingStatus || invoiceLines.length === 0}
                          className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-green-100 flex items-center justify-center gap-3 transition-all"
                        >
                          {isUpdatingStatus ? <Loader2 className="w-5 h-5 animate-spin" /> : <DollarSign className="w-5 h-5" />}
                          Xác nhận Thanh toán
                        </button>
                     ) : (
                        <div className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 border-2 border-dashed border-slate-200">
                           <CheckCircle2 className="w-5 h-5 text-green-500" />
                           Hóa đơn đã hoàn tất
                        </div>
                     )}
                     <button className="px-8 py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-black rounded-2xl flex items-center justify-center gap-2">
                       <Receipt className="w-4 h-4" /> In hóa đơn
                     </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-20 text-slate-400 text-center animate-pulse">
               <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                  <Receipt className="w-12 h-12 opacity-20" />
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-2">Chờ khởi tạo</h3>
               <p className="text-sm max-w-xs leading-relaxed">Vui lòng hoàn tất thông tin cơ bản bên trái để bắt đầu lập hóa đơn mới.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceManagement;
