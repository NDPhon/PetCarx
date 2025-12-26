import { useEffect, useState } from 'react'
import { API_BASE } from '../lib/api'
import { useNavigate } from 'react-router-dom'

const Inventory = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState<any[]>([])
  const [branches, setBranches] = useState<any[]>([])
  const [branchId, setBranchId] = useState<string>('')
  const [itemType, setItemType] = useState<'all' | 'vaccine' | 'product'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const r = await fetch(`${API_BASE}/api/branches/get-branch-list`)
        if (r.ok) {
          const json = await r.json()
          setBranches(json.data || json)
          if (json.data && json.data.length > 0) {
            setBranchId(json.data[0].branch_id.toString())
          }
        }
      } catch (e) {
        console.warn('Error fetching branches:', e)
      }
    }
    fetchBranches()
  }, [])

  useEffect(() => {
    if (branchId) {
      loadItems()
    }
  }, [branchId, itemType])

  const loadItems = async () => {
    if (!branchId) return
    setLoading(true)
    try {
      let url = ''
      if (itemType === 'vaccine' || itemType === 'all') {
        const r = await fetch(`${API_BASE}/api/products/get-vaccines-by-branch/${branchId}`)
        if (r.ok) {
          const json = await r.json()
          const vaccines = json.data || json
          setItems(Array.isArray(vaccines) ? vaccines : [])
        }
      } else if (itemType === 'product') {
        const r = await fetch(`${API_BASE}/api/products/get-product-by-branch/${branchId}`)
        if (r.ok) {
          const json = await r.json()
          const products = json.data || json
          setItems(Array.isArray(products) ? products : [])
        }
      }
    } catch (e) {
      console.error('Error loading items:', e)
    }
    setLoading(false)
  }

  const filteredItems = items.filter(item => {
    const name = (item.product_name || item.name || '').toLowerCase()
    return name.includes(searchQuery.toLowerCase())
  })

  const isExpiringSoon = (date: any) => {
    if (!date) return false
    const expiryDate = new Date(date)
    const today = new Date()
    const daysUntilExpiry = (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0
  }

  const isExpired = (date: any) => {
    if (!date) return false
    const expiryDate = new Date(date)
    const today = new Date()
    return expiryDate < today
  }

  const getExpiryBadge = (date: any) => {
    if (isExpired(date)) {
      return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">⚠️ Hết hạn</span>
    } else if (isExpiringSoon(date)) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">⏰ Sắp hết</span>
    }
    return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">✅ Còn hạn</span>
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-lime-100 via-yellow-50 to-amber-100 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-lime-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-yellow-200 rounded-full opacity-15 animate-pulse"></div>

      {/* Header with back button */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-green-700 to-green-600 shadow-2xl border-b-4 border-green-900">
        <div className="container mx-auto px-4 py-7 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-yellow-300 hover:bg-yellow-200 text-green-900 px-10 py-4 rounded-lg shadow-2xl transition-all font-black text-xl hover:scale-110"
          >
            ← Quay lại
          </button>
          <h1 className="text-5xl font-black text-white drop-shadow-xl">💊 Kho / Vắc-xin</h1>
          <div className="w-24"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-7xl mx-auto">

          {/* Filter Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-lime-200 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Chi nhánh</label>
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                >
                  {branches.map(b => (
                    <option key={b.branch_id} value={b.branch_id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Loại sản phẩm</label>
                <select
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                >
                  <option value="all">-- Tất cả --</option>
                  <option value="vaccine">🛡️ Vắc-xin</option>
                  <option value="product">💊 Sản phẩm khác</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Tìm kiếm</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tên sản phẩm..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={loadItems}
                  disabled={loading}
                  className="w-full bg-lime-600 hover:bg-lime-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
                >
                  {loading ? '⏳' : '🔄'} Cập nhật
                </button>
              </div>
            </div>
          </div>

          {/* Items Count */}
          <div className="bg-lime-50 border border-lime-200 rounded-lg p-4 mb-6">
            <p className="text-gray-700">
              Tìm thấy <span className="font-bold text-lime-700">{filteredItems.length}</span> sản phẩm
            </p>
          </div>

          {/* Items Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600"></div>
              <p className="mt-4 text-lg text-gray-600">Đang tải dữ liệu...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-lime-200 text-center">
              <p className="text-lg text-gray-600">Không tìm thấy sản phẩm nào</p>
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-lime-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-lime-600 text-white">
                      <th className="px-6 py-3 text-left">Tên sản phẩm</th>
                      <th className="px-6 py-3 text-left">Loại</th>
                      <th className="px-6 py-3 text-right">Giá</th>
                      <th className="px-6 py-3 text-right">Tồn kho</th>
                      <th className="px-6 py-3 text-left">Hạn sử dụng</th>
                      <th className="px-6 py-3 text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item: any, idx: number) => (
                      <tr key={idx} className="border-b hover:bg-lime-50 transition">
                        <td className="px-6 py-4 font-semibold text-gray-800">
                          {item.product_name || item.name}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {item.product_type || 'Vắc-xin'}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-lime-600">
                          {parseFloat(item.price || 0).toLocaleString('vi-VN')} VND
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`px-3 py-1 rounded-lg font-bold ${
                            (item.total_stock || item.stock_quantity) < 10
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {item.total_stock || item.stock_quantity || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {item.expiry_date
                            ? new Date(item.expiry_date).toLocaleDateString('vi-VN')
                            : '∞'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {getExpiryBadge(item.expiry_date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Summary Cards */}
          {filteredItems.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-lime-200 text-center">
                <div className="text-3xl mb-2">📦</div>
                <h3 className="font-semibold text-gray-700">Tổng tồn kho</h3>
                <p className="text-2xl font-bold text-lime-600">
                  {filteredItems.reduce((sum, item) => sum + (item.total_stock || item.stock_quantity || 0), 0)}
                </p>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-lime-200 text-center">
                <div className="text-3xl mb-2">⏰</div>
                <h3 className="font-semibold text-gray-700">Sắp hết hạn</h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredItems.filter(item => isExpiringSoon(item.expiry_date)).length}
                </p>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-lime-200 text-center">
                <div className="text-3xl mb-2">⚠️</div>
                <h3 className="font-semibold text-gray-700">Hết hạn</h3>
                <p className="text-2xl font-bold text-red-600">
                  {filteredItems.filter(item => isExpired(item.expiry_date)).length}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default Inventory
