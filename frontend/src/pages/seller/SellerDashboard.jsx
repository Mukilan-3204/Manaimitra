import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import './Seller.css'

export default function SellerDashboard() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { if (user) fetch() }, [user])

  const fetch = async () => {
    setLoading(true)
    const { data, error: e } = await supabase
      .from('plots')
      .select('id,title,area_sqft,price,status,created_at,division,place,type,views')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false })
    if (!e) setListings(data || [])
    else setError(e.message)
    setLoading(false)
  }

  const del = async (id) => {
    if (!confirm('Delete this listing?')) return
    await supabase.from('plots').delete().eq('id', id)
    setListings(l => l.filter(x => x.id !== id))
  }

  if (!isAuthenticated) return (
    <div className="page page-enter"><div className="container"><div className="empty-state" style={{paddingTop:'120px'}}>
      <div className="empty-state-icon">🔒</div><h3>Sign in to view listings</h3>
      <button className="btn btn-primary" onClick={() => navigate('/signup')}>Sign In</button>
    </div></div></div>
  )

  const fmt = (p) => p >= 100000 ? `₹${(p/100000).toFixed(1)}L` : `₹${p?.toLocaleString('en-IN')}`
  const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'})
  const approved = listings.filter(l => l.status === 'approved').length
  const pending = listings.filter(l => l.status === 'pending').length
  const rejected = listings.filter(l => l.status === 'rejected').length

  return (
    <div className="page page-enter"><div className="container">
      <div className="dash-header">
        <h1>My Listings</h1>
        <button className="btn btn-green" onClick={() => navigate('/seller')}>+ New Listing</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><span className="stat-num">{listings.length}</span><span className="stat-label">Total</span></div>
        <div className="stat-card"><span className="stat-num" style={{color:'var(--success)'}}>{approved}</span><span className="stat-label">Approved</span></div>
        <div className="stat-card"><span className="stat-num" style={{color:'var(--gold)'}}>{pending}</span><span className="stat-label">Pending</span></div>
        <div className="stat-card"><span className="stat-num" style={{color:'var(--danger)'}}>{rejected}</span><span className="stat-label">Rejected</span></div>
      </div>

      {error && <div className="form-error">{error}</div>}

      {loading ? <div className="loading-container"><div className="spinner"/></div>
      : listings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏞️</div>
          <h3>No listings yet</h3>
          <p>Submit your first property to get started.</p>
          <button className="btn btn-green btn-lg" onClick={() => navigate('/seller')} style={{marginTop:'16px'}}>+ List Your First Property</button>
        </div>
      ) : (
        <div className="dash-table-wrap">
          <table className="data-table">
            <thead><tr><th>Property</th><th>Location</th><th>Area</th><th>Price</th><th>Views</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
            <tbody>
              {listings.map(l => (
                <tr key={l.id}>
                  <td style={{fontWeight:600,maxWidth:'200px'}}>{l.title}</td>
                  <td style={{color:'var(--text2)'}}>{l.place}, {l.division}</td>
                  <td>{(l.area_sqft||0).toLocaleString()} sqft</td>
                  <td style={{color:'var(--blue2)',fontWeight:700}}>{fmt(l.price)}</td>
                  <td>{l.views || 0}</td>
                  <td>
                    <span className={`badge badge-${l.status}`}>
                      <span className={`status-dot ${l.status}`}/>
                      {l.status}
                    </span>
                  </td>
                  <td style={{color:'var(--text2)'}}>{fmtDate(l.created_at)}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => del(l.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div></div>
  )
}
