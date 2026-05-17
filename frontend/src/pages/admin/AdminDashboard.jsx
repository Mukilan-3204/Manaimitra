import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import './Admin.css'

export default function AdminDashboard() {
  const { isOwner } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('pending')
  const [plots, setPlots] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // useEffect(() => { if (isOwner) fetchAll() }, [isOwner])

  const fetchAll = async () => {
    setLoading(true)
    const [pr, ur] = await Promise.all([
      supabase.from('plots').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    ])
    if (!pr.error) setPlots(pr.data || [])
    if (!ur.error) setUsers(ur.data || [])
    if (pr.error) setError(pr.error.message)
    setLoading(false)
  }

  const updateStatus = async (id, status) => {
    const { error: e } = await supabase.from('plots').update({ status }).eq('id', id)
    if (!e) setPlots(prev => prev.map(p => p.id === id ? { ...p, status } : p))
    else setError(e.message)
  }

  const deletePlot = async (id) => {
    if (!confirm('Delete this plot?')) return
    await supabase.from('plots').delete().eq('id', id)
    setPlots(prev => prev.filter(p => p.id !== id))
  }

  const deleteUser = async (uid) => {
    if (!confirm('Delete this user and all their data?')) return
    await supabase.from('plots').delete().eq('seller_id', uid)
    await supabase.from('profiles').delete().eq('id', uid)
    setUsers(prev => prev.filter(u => u.id !== uid))
  }

  if (!isOwner) return (
    <div className="page page-enter"><div className="container"><div className="empty-state" style={{paddingTop:'120px'}}>
      <div className="empty-state-icon">👑</div><h3>Owner Access Only</h3>
      <button className="btn btn-ghost" onClick={() => navigate('/')}>Go Home</button>
    </div></div></div>
  )

  const fmt = (p) => p >= 100000 ? `₹${(p/100000).toFixed(1)}L` : `₹${p?.toLocaleString('en-IN')}`
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'}) : '—'
  const byStatus = (s) => plots.filter(p => p.status === s)

  const PlotCard = ({ p }) => (
    <div className="admin-plot-card glass-card">
      <div className="apc-header">
        <div>
          <h3>{p.title}</h3>
          <div className="apc-loc">📍 {p.place}, {p.division}</div>
        </div>
        <span className={`badge badge-${p.status}`}>{p.status}</span>
      </div>

      <div className="apc-specs">
        <span>📐 {(p.area_sqft||0).toLocaleString()} sqft</span>
        <span>💰 {fmt(p.price)}</span>
        <span>🧭 {p.facing || '—'}</span>
        <span>🛣️ {p.road_size || '—'}</span>
        <span>DTCP: {p.dtcp_approved ? '✅' : '❌'}</span>
        <span>📅 {fmtDate(p.created_at)}</span>
      </div>

      {/* Private seller info — admin only */}
      <div className="apc-private">
        <div className="apc-private-title">🔒 Private Details</div>
        <div className="apc-private-grid">
          <span><strong>Seller:</strong> {p.seller_name || '—'}</span>
          <span><strong>Phone:</strong> {p.seller_phone || '—'}</span>
          <span><strong>DOB:</strong> {p.dob || '—'}</span>
          <span><strong>Patta:</strong> {p.patta_number || '—'}</span>
          <span><strong>Chitta:</strong> {p.chitta_number || '—'}</span>
          <span><strong>Address:</strong> {p.seller_address || '—'}</span>
        </div>
        {/* Aadhaar */}
        {(p.aadhaar_front || p.aadhaar_back) && (
          <div className="apc-docs">
            {p.aadhaar_front && <a href={p.aadhaar_front} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">📎 Aadhaar Front</a>}
            {p.aadhaar_back && <a href={p.aadhaar_back} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">📎 Aadhaar Back</a>}
            {(p.doc_copies||[]).map((d, i) => <a key={i} href={d} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">📄 Doc {i+1}</a>)}
          </div>
        )}
      </div>

      {/* Land photos */}
      {p.land_photos?.length > 0 && (
        <div className="apc-photos">
          {p.land_photos.slice(0,4).map((img, i) => <img key={i} src={img} alt="land" className="apc-thumb"/>)}
          {p.land_photos.length > 4 && <div className="apc-more">+{p.land_photos.length-4}</div>}
        </div>
      )}

      <div className="apc-actions">
        {p.status !== 'approved' && <button className="btn btn-success btn-sm" onClick={() => updateStatus(p.id,'approved')}>✓ Approve</button>}
        {p.status !== 'rejected' && <button className="btn btn-danger btn-sm" onClick={() => updateStatus(p.id,'rejected')}>✗ Reject</button>}
        <button className="btn btn-ghost btn-sm" onClick={() => deletePlot(p.id)}>🗑 Delete</button>
      </div>
    </div>
  )

  const TABS = [
    { id:'pending', label:`Pending (${byStatus('pending').length})` },
    { id:'approved', label:`Approved (${byStatus('approved').length})` },
    { id:'rejected', label:`Rejected (${byStatus('rejected').length})` },
    { id:'users', label:`Users (${users.length})` },
  ]

  return (
    <div className="page page-enter"><div className="container">
      <div className="page-header"><h1>👑 Owner Dashboard</h1><p>Manage all listings, approvals, and users</p></div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card"><span className="stat-num" style={{color:'var(--gold)'}}>{byStatus('pending').length}</span><span className="stat-label">Pending</span></div>
        <div className="stat-card"><span className="stat-num" style={{color:'var(--success)'}}>{byStatus('approved').length}</span><span className="stat-label">Approved</span></div>
        <div className="stat-card"><span className="stat-num" style={{color:'var(--blue2)'}}>{users.filter(u=>u.role==='buyer').length}</span><span className="stat-label">Buyers</span></div>
        <div className="stat-card"><span className="stat-num">{users.length}</span><span className="stat-label">Total Users</span></div>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="tabs">
        {TABS.map(t => <button key={t.id} className={`tab ${tab===t.id?'active':''}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}
      </div>

      {loading ? <div className="loading-container"><div className="spinner"/></div> : (
        <>
          {tab !== 'users' && (
            <div className="admin-cards">
              {byStatus(tab).length === 0
                ? <div className="empty-state"><h3>No {tab} listings</h3></div>
                : byStatus(tab).map(p => <PlotCard key={p.id} p={p}/>)
              }
            </div>
          )}
          {tab === 'users' && (
            <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',overflow:'hidden'}}>
              <table className="data-table">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Action</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={{fontWeight:600}}>{u.full_name || '—'}</td>
                      <td style={{color:'var(--text2)'}}>{u.email}</td>
                      <td><span className={`badge ${u.role==='seller'?'badge-pending':'badge-approved'}`}>{u.role}</span></td>
                      <td style={{color:'var(--text2)'}}>{fmtDate(u.created_at)}</td>
                      <td><button className="btn btn-danger btn-sm" onClick={()=>deleteUser(u.id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div></div>
  )
}
