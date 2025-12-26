
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Building2, 
  DollarSign, 
  CreditCard, 
  ArrowLeft, 
  ChevronRight, 
  Loader2, 
  Search, 
  Filter,
  Download,
  TrendingUp,
  History,
  ChevronLeft,
  User,
  ExternalLink
} from 'lucide-react';

interface BranchRevenue {
  branch_id: number;
  branch_name: string;
  total_revenue: string;
  total_payment: string;
}

interface PaymentTransaction {
  payment_id: number;
  invoice_id: number;
  branch_id: number;
  branch_name: string;
  customer_name: string;
  paid_amount: string;
  payment_method: string;
  paid_at: string;
  status: string;
}

const API_BASE = 'http://localhost:8000/api';

interface StatisticsPageProps {
  onBack: () => void;
}

const StatisticsPage: React.FC<StatisticsPageProps> = ({ onBack }) => {
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-12-31');
  const [branchRevenue, setBranchRevenue] = useState<BranchRevenue[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<BranchRevenue | null>(null);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  const [loading, setLoading] = useState({
    summary: false,
    details: false
  });
  const [error, setError] = useState<string | null>(null);

  const fetchRevenueSummary = async () => {
    setLoading(prev => ({ ...prev, summary: true }));
    setError(null);
    setSelectedBranch(null);
    try {
      const response = await fetch(`${API_BASE}/analyze/total-revenue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start_date: startDate, end_date: endDate })
      });
      const json = await response.json();
      if (json.code === 200) {
        setBranchRevenue(json.data.revenue);
      } else {
        setError(json.message || "Không thể tải dữ liệu thống kê.");
      }
    } catch (err) {
      setError("Lỗi kết nối máy chủ khi tải thống kê doanh thu.");
    } finally {
      setLoading(prev => ({ ...prev, summary: false }));
    }
  };

  const fetchTransactions = async (branchId: number, page: number) => {
    setLoading(prev => ({ ...prev, details: true }));
    try {
      // The user prompt specified GET but showed a request body. 
      // In many APIs with body requirements, POST is actually used, or query params.
      // I will use POST as the example provided a JSON request block.
      const response = await fetch(`${API_BASE}/analyze/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate,
          branch_id: branchId,
          page: page,
          page_size: pageSize
        })
      });
      const json = await response.json();
      if (json.code === 200) {
        setTransactions(json.data);
      }
    } catch (err) {
      console.error("Error fetching transactions", err);
    } finally {
      setLoading(prev => ({ ...prev, details: false }));
    }
  };

  useEffect(() => {
    fetchRevenueSummary();
  }, []);

  const handleBranchClick = (branch: BranchRevenue) => {
    setSelectedBranch(branch);
    setCurrentPage(1);
    fetchTransactions(branch.branch_id, 1);
  };

  const handlePageChange = (newPage: number) => {
    if (!selectedBranch) return;
    setCurrentPage(newPage);
    fetchTransactions(selectedBranch.branch_id, newPage);
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(amount));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 mb-2 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Quay lại trang chủ
          </button>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-indigo-600" /> Thống kê Doanh thu
          </h1>
          <p className="text-slate-500 text-sm mt-1">Phân tích hiệu suất kinh doanh theo chi nhánh và thời gian.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              className="text-xs font-bold text-slate-700 bg-slate-50 border-none rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <span className="text-slate-300 font-bold">→</span>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              className="text-xs font-bold text-slate-700 bg-slate-50 border-none rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <button 
            onClick={fetchRevenueSummary}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-indigo-100"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center gap-3">
          <TrendingUp className="w-5 h-5 flex-shrink-0 rotate-180" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-1 space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Building2 className="w-3 h-3" /> Danh sách chi nhánh
          </h3>
          
          {loading.summary ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-2" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Đang tính toán...</p>
            </div>
          ) : branchRevenue.length > 0 ? (
            branchRevenue.map((branch) => (
              <button
                key={branch.branch_id}
                onClick={() => handleBranchClick(branch)}
                className={`w-full text-left p-5 rounded-2xl border transition-all relative overflow-hidden group ${
                  selectedBranch?.branch_id === branch.branch_id
                    ? 'bg-indigo-600 border-indigo-600 shadow-xl shadow-indigo-100 text-white'
                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <div className="relative z-10 flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-black text-sm uppercase tracking-tight line-clamp-1">{branch.branch_name}</h4>
                    <p className={`text-[10px] font-bold ${selectedBranch?.branch_id === branch.branch_id ? 'text-indigo-100' : 'text-slate-400'}`}>
                      ID: #{branch.branch_id}
                    </p>
                  </div>
                  <div className={`p-2 rounded-xl ${selectedBranch?.branch_id === branch.branch_id ? 'bg-white/20' : 'bg-indigo-50 text-indigo-600'}`}>
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                
                <div className="relative z-10 space-y-1">
                  <div className="flex items-center gap-2">
                    <DollarSign className={`w-4 h-4 ${selectedBranch?.branch_id === branch.branch_id ? 'text-indigo-200' : 'text-slate-400'}`} />
                    <span className="text-lg font-black tracking-tighter">{formatCurrency(branch.total_revenue)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <History className={`w-3 h-3 ${selectedBranch?.branch_id === branch.branch_id ? 'text-indigo-200' : 'text-slate-400'}`} />
                    <span className="text-[10px] font-bold opacity-80">{branch.total_payment} giao dịch thành công</span>
                  </div>
                </div>

                {/* Decorative background circle */}
                <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl transition-opacity ${
                  selectedBranch?.branch_id === branch.branch_id ? 'bg-white/10 opacity-100' : 'bg-indigo-500/5 opacity-0'
                }`}></div>
              </button>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 text-slate-400">
               <BarChart3 className="w-12 h-12 opacity-10 mx-auto mb-4" />
               <p className="text-xs font-bold">Không có dữ liệu</p>
            </div>
          )}
        </div>

        {/* Transaction Details Area */}
        <div className="lg:col-span-2">
          {selectedBranch ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <History className="w-5 h-5 text-indigo-600" />
                    Chi tiết giao dịch: {selectedBranch.branch_name}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    Từ {startDate} đến {endDate}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-black text-slate-700">{selectedBranch.total_payment}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-x-auto relative">
                {loading.details ? (
                  <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Đang tải lịch sử...</p>
                  </div>
                ) : null}

                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/30 border-b border-slate-100">
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID / Hóa đơn</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Khách hàng</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Số tiền</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Phương thức</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày thanh toán</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {transactions.length > 0 ? transactions.map((tx) => (
                      <tr key={tx.payment_id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-8 py-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-slate-900">#{tx.payment_id}</span>
                            <span className="text-[10px] text-slate-400">Inv: {tx.invoice_id}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-black">
                              {tx.customer_name.charAt(0)}
                            </div>
                            <span className="text-sm font-bold text-slate-700">{tx.customer_name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <span className="text-sm font-black text-indigo-600 tracking-tight">{formatCurrency(tx.paid_amount)}</span>
                        </td>
                        <td className="px-8 py-4">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                            <CreditCard className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{tx.payment_method}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <span className="text-xs text-slate-500 font-medium">{formatDate(tx.paid_at)}</span>
                        </td>
                        <td className="px-8 py-4 text-center">
                          <span className="inline-flex px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-700 border border-green-200">
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="px-8 py-20 text-center text-slate-400 italic text-sm">
                          Không có giao dịch nào được ghi nhận trong khoảng thời gian này.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Detail Pagination */}
              <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Trang <span className="text-slate-900 font-black">{currentPage}</span> • Hiển thị tối đa {pageSize} bản ghi
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading.details}
                    className="p-2 border border-slate-200 rounded-xl hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={transactions.length < pageSize || loading.details}
                    className="p-2 border border-slate-200 rounded-xl hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-20 text-slate-400 text-center">
               <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm">
                  <BarChart3 className="w-12 h-12 opacity-10" />
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-2">Chọn chi nhánh</h3>
               <p className="text-sm max-w-xs leading-relaxed">Vui lòng chọn một chi nhánh từ danh sách bên trái để xem chi tiết các giao dịch thanh toán.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
