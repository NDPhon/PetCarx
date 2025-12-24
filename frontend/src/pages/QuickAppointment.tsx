import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE } from '../lib/api'

function QuickAppointment() {
  const navigate = useNavigate()
  const [data, setData] = useState({ petName: '', ownerName: '', phone: '', service: 'vet', date: '', time: '', notes: '', branchId: '' })
  const [branches, setBranches] = useState<any[]>([])
  
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const r = await fetch(`${API_BASE}/api/branches/get-branch-list`)
        if (r.ok) setBranches((await r.json()).data || await r.json())
      } catch (e) { console.warn('fetch branches failed', e) }
    }
    fetchBranches()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {

      // try find customer by phone, if not exists create one
      let customer_id = null
      try {
        const r = await fetch(`${API_BASE}/api/customers/get-customer-by-phone/${encodeURIComponent(data.phone)}`)
        if (r.ok) {
          const json = await r.json()
          if (json && json.data && json.data.customer_id) customer_id = json.data.customer_id
        }
      } catch (e) { /* ignore */ }
      if (!customer_id && data.ownerName) {
        try {
          const create = await fetch(`${API_BASE}/api/customers`, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ name: data.ownerName, phone: data.phone }) })
          if (create.ok) {
            const cj = await create.json()
            customer_id = cj.data?.customer_id || cj.customer_id || null
          }
        } catch (e) { /* ignore */ }
      }

      const payload = {
        customer_id,
        pet_id: null,
        branch_id: data.branchId ? Number(data.branchId) : null,
        employee_id: null,
        appointment_time: data.date && data.time ? new Date(data.date + 'T' + data.time).toISOString() : null,
        status: 'Pending',
        channel: 'Online',
        service_ids: []
      }

      const res = await fetch(`${API_BASE}/api/appointments/add-appointment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        showModal({ title: 'Thành công', message: 'Đặt lịch nhanh thành công', onConfirm: () => navigate('/demo') })
      } else {
        // try parse JSON error
        let msg = 'Lỗi server'
        try {
          const j = await res.json()
          msg = j.error || j.message || JSON.stringify(j)
        } catch (e) {
          msg = await res.text().catch(() => 'Lỗi server')
        }
        if (String(msg).toLowerCase().includes('conflict')) {
          showModal({ title: 'Xung đột lịch', message: String(msg), onConfirm: () => navigate('/appointment'), cancelText: 'Đóng' })
        } else {
          showModal({ title: 'Lỗi', message: 'Đặt lịch thất bại: ' + msg })
        }
      }
    } catch (err) {
      console.error(err)
      showModal({ title: 'Lỗi', message: 'Không thể kết nối đến server' })
    }
  }

  // Simple modal state
  const [modal, setModal] = React.useState<{show:boolean,title?:string,message?:string,onConfirm?:()=>void,cancelText?:string}>({show:false})
  const showModal = (opts:{title?:string,message?:string,onConfirm?:()=>void,cancelText?:string}) => setModal({ show:true, title:opts.title, message:opts.message, onConfirm:opts.onConfirm, cancelText:opts.cancelText })
  const hideModal = () => setModal({ show:false })

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Đặt lịch nhanh</h2>
        <div className="grid grid-cols-1 gap-4">
          <input name="petName" value={data.petName} onChange={handleChange} placeholder="Tên thú cưng" className="p-2 border rounded" required />
          <input name="ownerName" value={data.ownerName} onChange={handleChange} placeholder="Tên chủ" className="p-2 border rounded" required />
          <input name="phone" value={data.phone} onChange={handleChange} placeholder="SĐT" className="p-2 border rounded" />
          <select name="service" value={data.service} onChange={handleChange} className="p-2 border rounded">
            <option value="vet">Khám thú y</option>
            <option value="grooming">Grooming</option>
            <option value="vaccination">Tiêm phòng</option>
          </select>
          <select name="branchId" value={data.branchId} onChange={handleChange} className="p-2 border rounded">
            <option value="">Chọn chi nhánh</option>
            {branches.map(b => <option key={b.branch_id || b.id || b.branchid} value={b.branch_id || b.id || b.branchid}>{b.name}</option>)}
          </select>
          <div className="flex gap-2">
            <input type="date" name="date" value={data.date} onChange={handleChange} className="p-2 border rounded flex-1" required />
            <input type="time" name="time" value={data.time} onChange={handleChange} className="p-2 border rounded w-32" required />
          </div>
          <textarea name="notes" value={data.notes} onChange={handleChange} placeholder="Ghi chú" className="p-2 border rounded" rows={3} />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Đặt lịch nhanh</button>
        </div>
      </form>
      {modal.show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-2">{modal.title}</h3>
            <p className="mb-4 whitespace-pre-wrap">{modal.message}</p>
            <div className="flex justify-end gap-2">
              {modal.cancelText && <button className="px-4 py-2" onClick={() => { hideModal() }}>{modal.cancelText}</button>}
              <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => { hideModal(); modal.onConfirm && modal.onConfirm() }}>{modal.onConfirm ? 'OK' : 'Đóng'}</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default QuickAppointment
