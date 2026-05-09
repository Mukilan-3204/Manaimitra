import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import './Profile.css'

export default function Profile() {
  const { user, role, updateRole, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate('/signup')
  }, [loading, isAuthenticated, navigate])

  if (loading || !user) {
    return <div className="page"><div className="loading-container"><div className="spinner"></div></div></div>
  }

  const meta = user.user_metadata || {}

  return (
    <div className="page page-enter">
      <div className="container profile-container">
        <div className="profile-card glass-card">
          <img
            src={meta.avatar_url || `https://ui-avatars.com/api/?name=${meta.full_name || 'U'}&background=d4a843&color=0a0a0f&size=120`}
            alt={meta.full_name}
            className="profile-avatar"
          />
          <h1 className="profile-name">{meta.full_name || 'User'}</h1>
          <p className="profile-email">{user.email}</p>
          <div className="profile-role-badge">
            <span className={`badge badge-${role === 'owner' ? 'approved' : 'pending'}`}>
              {role === 'owner' ? '👑 Owner' : role === 'seller' ? '💼 Seller' : '🏡 Buyer'}
            </span>
          </div>

          {role !== 'owner' && (
            <div className="profile-role-switch">
              <p className="profile-role-label">Switch Role</p>
              <div className="role-switch-btns">
                <button
                  className={`btn btn-sm ${role === 'buyer' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => updateRole('buyer')}
                >
                  🏡 Buyer
                </button>
                <button
                  className={`btn btn-sm ${role === 'seller' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => updateRole('seller')}
                >
                  💼 Seller
                </button>
              </div>
            </div>
          )}

          <div className="profile-info">
            <div className="profile-info-item">
              <span className="profile-info-label">Member Since</span>
              <span className="profile-info-value">{new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Auth Provider</span>
              <span className="profile-info-value">Google</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
