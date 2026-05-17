import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { useState, useEffect } from 'react'
import './Header.css'

export default function Header() {
  const { user, role, isOwner, signOut, isAuthenticated } = useAuth()
  const { lang, toggleLang } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setMenuOpen(false)

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-inner container">
        {/* Logo */}
        <Link to="/" className="header-logo" onClick={close}>
          <div className="logo-mark">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="url(#lg1)"/>
              <path d="M8 26V16l7-6 7 6v10" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 26v-6h4v6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="28" cy="12" r="4" fill="#10b981" stroke="#fff" strokeWidth="1.5"/>
              <path d="M26.5 12l1 1 2-2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="lg1" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2563eb"/>
                  <stop offset="1" stopColor="#1d4ed8"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-name">Manai<span className="logo-accent">Mitra</span></span>
            <span className="logo-tag">One Commitment. Limitless Reach.</span>
          </div>
        </Link>

        {/* Hamburger */}
        <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span/><span/><span/>
        </button>

        {/* Nav */}
        <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={close}>Home</Link>

          {isAuthenticated && role === 'buyer' && (
            <Link to="/buyer" className={`nav-link ${location.pathname.startsWith('/buyer') ? 'active' : ''}`} onClick={close}>Browse Plots</Link>
          )}
          {isAuthenticated && role === 'seller' && (
            <>
              <Link to="/seller" className={`nav-link ${location.pathname === '/seller' ? 'active' : ''}`} onClick={close}>New Listing</Link>
              <Link to="/seller/dashboard" className={`nav-link ${location.pathname === '/seller/dashboard' ? 'active' : ''}`} onClick={close}>My Listings</Link>
            </>
          )}
          {isOwner && (
            <Link to="/admin" className={`nav-link nav-admin ${location.pathname.startsWith('/admin') ? 'active' : ''}`} onClick={close}>👑 Admin</Link>
          )}

          {/* Language Toggle */}
          <button className="lang-toggle" onClick={toggleLang} title="Switch Language">
            {lang === 'en' ? 'தமிழ்' : 'EN'}
          </button>

          {isAuthenticated ? (
            <div className="nav-user">
              <Link to="/profile" className="nav-avatar-wrap" onClick={close}>
                <img
                  src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email || 'U')}&background=2563eb&color=fff&size=64`}
                  alt="Profile"
                  className="nav-avatar"
                />
              </Link>
              <button className="btn btn-ghost btn-sm" onClick={() => { signOut(); close() }}>Sign Out</button>
            </div>
          ) : (
            <Link to="/signup" className="btn btn-primary btn-sm" onClick={close}>Sign Up</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
