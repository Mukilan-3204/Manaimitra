import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Admin.css'

const DEMO_PENDING = [
  { id: 'p1', title: 'Residential Plot in Anna Nagar', seller: 'Rajesh Kumar', email: 'rajesh@gmail.com', area: 1500, price: 2250000, division: 'North', place: 'Anna Nagar', date: '2026-05-06', aiPass: true },
  { id: 'p2', title: 'Commercial Plot in Teppakulam', seller: 'Priya Devi', email: 'priya@gmail.com', area: 800, price: 3200000, division: 'Central', place: 'Teppakulam', date: '2026-05-07', aiPass: true },
  { id: 'p3', title: 'Farm Land in Vadipatti', seller: 'Senthil M.', email: 'senthil@gmail.com', area: 5000, price: 1500000, division: 'West', place: 'Vadipatti', date: '2026-05-07', aiPass: false },
]

const DEMO_USERS = [
  { id: 'u1', name: 'Rajesh Kumar', email: 'rajesh@gmail.com', role: 'seller', joined: '2026-03-10' },
  { id: 'u2', name: 'Priya Devi', email: 'priya@gmail.com', role: 'seller', joined: '2026-04-01' },
  { id: 'u3', name: 'Karthik S.', email: 'karthik@gmail.com', role: 'buyer', joined: '2026-04-15' },
  { id: 'u4', name: 'Meena R.', email: 'meena@gmail.com', role: 'buyer', joined: '2026-05-01' },
]

export default function AdminDashboard() {
  const { isOwner } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('pending')
  const [pending, setPending] = useState(DEMO_PENDING)
  const [users, setUsers] = useState(DEMO_USERS)

  if (!isOwner) {
    return (
      <div className="page page-enter">
        <div className="container">
          <div className="empty-state" style={{ paddingTop: '120px' }}>
            <div className="empty-state-icon">👑</div>
            <h3>Owner Access Only</h3>
            <p>This dashboard is restricted to the platform owner.</p>
            <button className="btn btn-secondary" onClick={() => navigate('/')} style={{ marginTop: '16px' }}>Go Home</button>
          </div>
        </div>
      </div>
    )
  }

  const approve = (id) => setPending(prev => prev.filter(p => p.id !== id))
  const reject = (id) => setPending(prev => prev.filter(p => p.id !== id))
  const deleteUser = (id) => setUsers(prev => prev.filter(u => u.id !== id))

  const formatPrice = (p) => p >= 100000 ? `₹${(p / 100000).toFixed(1)} L` : `₹${p.toLocaleString('en-IN')}`

  return (
    <div className="page page-enter">
      <div className="container">
        <div className="page-header">
          <h1>👑 Owner Dashboard</h1>
          <p>Manage listings, approvals, and users</p>
        </div>

        <div className="admin-stats">
          <div className="glass-card admin-stat">
            <span className="admin-stat-num">{pending.length}</span>
            <span className="admin-stat-label">Pending Approvals</span>
          </div>
          <div className="glass-card admin-stat">
            <span className="admin-stat-num" style={{ color: 'var(--color-success)' }}>{users.filter(u => u.role === 'seller').length}</span>
            <span className="admin-stat-label">Sellers</span>
          </div>
          <div className="glass-card admin-stat">
            <span className="admin-stat-num" style={{ color: 'var(--color-info)' }}>{users.filter(u => u.role === 'buyer').length}</span>
            <span className="admin-stat-label">Buyers</span>
          </div>
          <div className="glass-card admin-stat">
            <span className="admin-stat-num">{users.length}</span>
            <span className="admin-stat-label">Total Users</span>
          </div>
        </div>

        <div className="admin-tabs">
          <button className={`admin-tab ${tab === 'pending' ? 'active' : ''}`} onClick={() => setTab('pending')}>
            Pending Listings ({pending.length})
          </button>
          <button className={`admin-tab ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>
            Manage Users ({users.length})
          </button>
        </div>

        {tab === 'pending' && (
          <div className="admin-cards">
            {pending.length === 0 ? (
              <div className="empty-state"><h3>No pending listings 🎉</h3></div>
            ) : pending.map(p => (
              <div key={p.id} className="admin-listing-card glass-card">
                <div className="admin-listing-header">
                  <h3>{p.title}</h3>
                  <span className={`badge ${p.aiPass ? 'badge-approved' : 'badge-rejected'}`}>
                    AI: {p.aiPass ? 'Passed' : 'Failed'}
                  </span>
                </div>
                <div className="admin-listing-details">
                  <div><strong>Seller:</strong> {p.seller} ({p.email})</div>
                  <div><strong>Location:</strong> {p.place}, {p.division} Division</div>
                  <div><strong>Area:</strong> {p.area.toLocaleString()} sq ft</div>
                  <div><strong>Price:</strong> {formatPrice(p.price)}</div>
                  <div><strong>Submitted:</strong> {p.date}</div>
                </div>
                <div className="admin-listing-actions">
                  <button className="btn btn-success btn-sm" onClick={() => approve(p.id)}>✓ Approve</button>
                  <button className="btn btn-danger btn-sm" onClick={() => reject(p.id)}>✗ Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'users' && (
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ color: 'var(--color-text)', fontWeight: 500 }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge ${u.role === 'seller' ? 'badge-pending' : 'badge-approved'}`}>{u.role}</span></td>
                  <td>{u.joined}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => deleteUser(u.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
