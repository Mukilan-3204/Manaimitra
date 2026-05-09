import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import './Header.css'

export default function Header() {
  const { user, role, isOwner, signOut, isAuthenticated } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const canGoBack = location.pathname !== '/'

  return (
    <header className="header">
      <div className="header-inner container">
        {/* Logo */}
        <Link to="/" className="header-logo" onClick={() => setMenuOpen(false)}>
          <div className="logo-icon-wrap">
            <svg width="38" height="32" viewBox="0 0 38 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 28V6L14 18L19 10L24 18L34 6V28" stroke="none"/>
              {/* Blue figure */}
              <circle cx="6" cy="4" r="3.5" fill="#1a3a6b"/>
              <path d="M2 28V14C2 12 4 10 6 10C7.5 10 9 11 10 12.5L14 18" fill="#1a3a6b"/>
              {/* Green figure */}
              <circle cx="32" cy="4" r="3.5" fill="#3a7d44"/>
              <path d="M36 28V14C36 12 34 10 32 10C30.5 10 29 11 28 12.5L24 18" fill="#3a7d44"/>
              {/* Handshake */}
              <path d="M12 20C14 22 16 23 19 23C22 23 24 22 26 20" stroke="#1a3a6b" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M14 21.5C16 23.5 17.5 24.5 19 24.5C20.5 24.5 22 23.5 24 21.5" stroke="#3a7d44" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="logo-text-wrap">
            <span className="logo-name">MANAI<span className="logo-accent">M</span>ITRA</span>
            <span className="logo-tagline">ONE COMMITMENT. LIMITLESS REACH.</span>
          </div>
        </Link>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span className={`hline ${menuOpen ? 'open' : ''}`}></span>
        </button>

        <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
          {canGoBack && (
            <button className="nav-link nav-back" onClick={() => { navigate(-1); setMenuOpen(false) }}>
              ← Back
            </button>
          )}

          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Home</Link>

          {/* Role-specific nav items */}
          {isAuthenticated && role === 'buyer' && (
            <Link to="/buyer" className={`nav-link ${location.pathname.startsWith('/buyer') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Browse Plots</Link>
          )}
          {isAuthenticated && role === 'seller' && (
            <>
              <Link to="/seller" className={`nav-link ${location.pathname === '/seller' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>List Property</Link>
              <Link to="/seller/dashboard" className={`nav-link ${location.pathname === '/seller/dashboard' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>My Listings</Link>
            </>
          )}
          {isOwner && (
            <Link to="/admin" className={`nav-link nav-admin ${location.pathname.startsWith('/admin') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>👑 Owner Panel</Link>
          )}

          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>About</Link>

          {isAuthenticated ? (
            <div className="nav-user">
              <Link to="/profile" className="nav-avatar-link" onClick={() => setMenuOpen(false)}>
                <img
                  src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email || 'U')}&background=1a3a6b&color=fff&size=64`}
                  alt="Profile"
                  className="nav-avatar"
                />
              </Link>
              <button className="btn btn-secondary btn-sm" onClick={() => { signOut(); setMenuOpen(false) }}>Sign Out</button>
            </div>
          ) : (
            <Link to="/signup" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Sign Up</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
