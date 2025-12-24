import { useEffect, useState } from 'react'
import { API_BASE } from '../lib/api'
import { useNavigate } from 'react-router-dom'

const Inventory = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState<any[]>([])
  const [branchId, setBranchId] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // load initial inventory (vaccines/products fallback)
    loadItems()
  }, [])

  const loadItems = async () => {
    setLoading(true)
    try {
      const q = branchId ? `?branchId=${encodeURIComponent(branchId)}` : ''
      const r = await fetch(`${API_BASE}/api/vaccines${q}`)
      if (r.ok) {
        const j = await r.json()
        setItems(j)
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  return (
    <main className="min-h-screen container mx-auto p-6">
      <button onClick={() => navigate(-1)} className="mb-4 bg-gray-600 text-white px-3 py-1 rounded">← Quay lại</button>
      <h1 className="text-2xl font-bold mb-4">Tra cứu thuốc / vắc-xin</h1>

      <div className="mb-4 flex gap-2 items-center">
        <input value={branchId} onChange={e => setBranchId(e.target.value)} placeholder="Branch ID (optional)" className="p-2 border rounded" />
        <button onClick={loadItems} className="bg-blue-600 text-white px-3 py-1 rounded">Tải</button>
      </div>

      {loading ? <div>Đang tải...</div> : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Tên sản phẩm</th>
              <th className="p-2">Hạn sử dụng</th>
              <th className="p-2">Số lượng</th>
              <th className="p-2">Giá</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i} className="border-b">
                <td className="p-2">{it.name || it.product_name || it.productName}</td>
                <td className="p-2">{it.expiry_date ? new Date(it.expiry_date).toLocaleDateString() : (it.expiryDate || '-')}</td>
                <td className="p-2">{it.stock ?? it.total_quantity ?? it.quantity ?? '-'}</td>
                <td className="p-2">{it.price ? it.price.toLocaleString() + ' VND' : (it.unit_price ? it.unit_price.toLocaleString() + ' VND' : '-')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}

export default Inventory
