import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Seller.css'

export default function SellerDashboard() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Demo listings data
  const listings = [
    { id: 1, title: 'Residential Plot in K.K. Nagar', area: 1200, price: 1800000, status: 'approved', date: '2026-04-15' },
    { id: 2, title: 'Commercial Plot in Goripalayam', area: 2400, price: 5600000, status: 'pending', date: '2026-05-01' },
    { id: 3, title: 'Villa Plot in Pasumalai', area: 3000, price: 4500000, status: 'rejected', date: '2026-05-05' },
  ]

  if (!isAuthenticated) {
    return (
      <div className="page page-enter">
        <div className="container">
          <div className="empty-state" style={{ paddingTop: '120px' }}>
            <div className="empty-state-icon">🔒</div>
            <h3>Sign in to view your listings</h3>
            <button className="btn btn-primary" onClick={() => navigate('/signup')} style={{ marginTop: '16px' }}>Sign In</button>
          </div>
        </div>
      </div>
    )
  }

  const formatPrice = (p) => p >= 100000 ? `₹${(p / 100000).toFixed(1)} L` : `₹${p.toLocaleString('en-IN')}`

  return (
    <div className="page page-enter">
      <div className="container">
        <div className="page-header">
          <h1>My Listings</h1>
          <p>Track the status of your property listings</p>
        </div>

        <div className="dashboard-actions">
          <button className="btn btn-primary" onClick={() => navigate('/seller')}>+ New Listing</button>
        </div>

        <div className="dashboard-stats">
          <div className="dash-stat glass-card">
            <span className="dash-stat-num">{listings.length}</span>
            <span className="dash-stat-label">Total</span>
          </div>
          <div className="dash-stat glass-card">
            <span className="dash-stat-num" style={{ color: 'var(--color-success)' }}>{listings.filter(l => l.status === 'approved').length}</span>
            <span className="dash-stat-label">Approved</span>
          </div>
          <div className="dash-stat glass-card">
            <span className="dash-stat-num" style={{ color: 'var(--color-pending)' }}>{listings.filter(l => l.status === 'pending').length}</span>
            <span className="dash-stat-label">Pending</span>
          </div>
          <div className="dash-stat glass-card">
            <span className="dash-stat-num" style={{ color: 'var(--color-danger)' }}>{listings.filter(l => l.status === 'rejected').length}</span>
            <span className="dash-stat-label">Rejected</span>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Area</th>
              <th>Price</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map(l => (
              <tr key={l.id}>
                <td style={{ color: 'var(--color-text)', fontWeight: 500 }}>{l.title}</td>
                <td>{l.area.toLocaleString()} sq ft</td>
                <td style={{ color: 'var(--color-gold)', fontWeight: 600 }}>{formatPrice(l.price)}</td>
                <td><span className={`badge badge-${l.status}`}>{l.status}</span></td>
                <td>{l.date}</td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn btn-secondary btn-sm">Edit</button>
                    <button className="btn btn-danger btn-sm">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
