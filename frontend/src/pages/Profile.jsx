import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, role, updateRole, signOut, isOwner } = useAuth()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  const switchRole = async (newRole) => {
    setSaving(true)
    await updateRole(newRole)
    setSaving(false); setDone(true)
    setTimeout(() => setDone(false), 2000)
  }

  if (!user) return null

  return (
    <div className="page page-enter">
      <div className="container" style={{ maxWidth: '520px' }}>
        <div className="page-header"><h1>My Profile</h1></div>

        <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
              src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email || 'U')}&background=2563eb&color=fff&size=80`}
              alt="Avatar"
              style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid var(--blue)' }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{user?.user_metadata?.full_name || 'User'}</div>
              <div style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>{user?.email}</div>
              <span className={`badge ${role === 'owner' ? 'badge-dtcp' : role === 'seller' ? 'badge-pending' : 'badge-approved'}`} style={{ marginTop: '6px' }}>
                {role === 'owner' ? '👑 Owner' : role === 'seller' ? '🏷️ Seller' : '🏠 Buyer'}
              </span>
            </div>
          </div>

          {/* Role switch — only for non-owners */}
          {!isOwner && (
            <div style={{ background: 'var(--surface-h)', borderRadius: 'var(--r-lg)', padding: '20px', border: '1px solid var(--border2)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>Switch Role</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className={`btn ${role === 'buyer' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ flex: 1 }}
                  onClick={() => switchRole('buyer')}
                  disabled={saving || role === 'buyer'}
                >🏠 Buyer</button>
                <button
                  className={`btn ${role === 'seller' ? 'btn-green' : 'btn-ghost'}`}
                  style={{ flex: 1 }}
                  onClick={() => switchRole('seller')}
                  disabled={saving || role === 'seller'}
                >🏷️ Seller</button>
              </div>
              {done && <p style={{ color: 'var(--success)', fontSize: '0.85rem', marginTop: '10px', textAlign: 'center' }}>✅ Role updated! Please navigate to your section.</p>}
            </div>
          )}

          {/* Go to dashboard */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {role === 'buyer' && <button className="btn btn-primary" onClick={() => navigate('/buyer')}>Browse Plots →</button>}
            {role === 'seller' && <button className="btn btn-green" onClick={() => navigate('/seller/dashboard')}>My Listings →</button>}
            {isOwner && <button className="btn btn-primary" onClick={() => navigate('/admin')}>Admin Dashboard →</button>}
            <button className="btn btn-danger" onClick={() => { signOut(); navigate('/') }}>Sign Out</button>
          </div>
        </div>
      </div>
    </div>
  )
}
