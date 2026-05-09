import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * ProtectedRoute — guards routes by auth + role.
 * role prop: 'buyer' | 'seller' | 'owner' | undefined (just auth required)
 */
export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, role: userRole, loading } = useAuth()

  if (loading) {
    return (
      <div className="page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
        </div>
      </div>
    )
  }

  // Not logged in → go to signup
  if (!isAuthenticated) {
    return <Navigate to="/signup" replace />
  }

  // Owner can access everything
  if (userRole === 'owner') return children

  // If no role yet (new user), default to buyer access
  const effectiveRole = userRole || 'buyer'

  // Role required and doesn't match → redirect to landing with message
  if (role && effectiveRole !== role) {
    return (
      <div className="page page-enter">
        <div className="container">
          <div className="empty-state" style={{ paddingTop: '120px' }}>
            <div className="empty-state-icon">🚫</div>
            <h3>Access Restricted</h3>
            <p style={{ marginBottom: '16px' }}>
              This section is only for <strong>{role}s</strong>.<br />
              You are signed in as a <strong>{userRole}</strong>.
            </p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              To switch roles, go to your Profile page.
            </p>
            <a href="/profile" className="btn btn-primary" style={{ marginTop: '24px', display: 'inline-flex' }}>
              Go to Profile
            </a>
          </div>
        </div>
      </div>
    )
  }

  return children
}
