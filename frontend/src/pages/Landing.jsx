import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Landing.css'

const STATS = [
  { num: '5', label: 'Divisions' },
  { num: '50+', label: 'Locations' },
  { num: '500+', label: 'Plots Listed' },
  { num: '100%', label: 'Verified' },
]

const FEATURES = [
  { icon: '🤖', title: 'AI Verified', desc: 'Every listing auto-checked by AI before owner review.' },
  { icon: '🔒', title: 'Secure Auth', desc: 'Google sign-in — no passwords, no worries.' },
  { icon: '📍', title: 'Local Expertise', desc: '5 Madurai divisions, 50+ areas fully mapped.' },
  { icon: '👑', title: 'Owner Approved', desc: 'Every listing reviewed before going live.' },
]

export default function Landing() {
  const navigate = useNavigate()
  const { isAuthenticated, role } = useAuth()

  const handleBuyer = () => {
    if (isAuthenticated && role === 'buyer') navigate('/buyer')
    else navigate('/signup?role=buyer')
  }
  const handleSeller = () => {
    if (isAuthenticated && role === 'seller') navigate('/seller/dashboard')
    else navigate('/signup?role=seller')
  }

  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-grid"/>
        <div className="container hero-inner">
          <div className="hero-badge">🏡 Madurai's #1 Real Estate Platform</div>
          <h1 className="hero-title">
            Find Your Perfect<br/>
            <span className="hero-gradient">Plot in Madurai</span>
          </h1>
          <p className="hero-subtitle">
            Browse verified plots across all 5 Madurai divisions. Transparent listings,
            owner-approved, with full legal documentation.
          </p>

          {/* Stats */}
          <div className="hero-stats">
            {STATS.map(s => (
              <div key={s.label} className="hero-stat">
                <span className="hero-stat-num">{s.num}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* CTA Cards */}
          <div className="path-cards">
            {/* Buyer Card */}
            <div className="path-card path-card-buyer" onClick={handleBuyer} id="buyer-card">
              <div className="path-card-glow buyer-glow"/>
              <div className="path-card-icon">🏠</div>
              <h2>I'm a Buyer</h2>
              <p>Browse verified plots across Madurai. Compare prices, view photos, and connect with the owner via WhatsApp.</p>
              <div className="path-card-tags">
                <span>📍 5 Divisions</span>
                <span>✅ Verified</span>
                <span>💬 WhatsApp CTA</span>
              </div>
              <button className="btn btn-primary btn-lg path-card-btn">
                Browse Plots →
              </button>
            </div>

            {/* Seller Card */}
            <div className="path-card path-card-seller" onClick={handleSeller} id="seller-card">
              <div className="path-card-glow seller-glow"/>
              <div className="path-card-icon">🏷️</div>
              <h2>I'm a Seller</h2>
              <p>List your property with full details, photos, and documents. Get owner-verified and reach genuine buyers.</p>
              <div className="path-card-tags">
                <span>📸 20 Photos</span>
                <span>📄 Documents</span>
                <span>👑 Verified</span>
              </div>
              <button onClick={handleSeller} className="btn btn-green btn-lg path-card-btn">
                List Property →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="section-label">WHY MANAI MITRA</div>
          <h2 className="section-heading">Built for Madurai. Built for Trust.</h2>
          <div className="features-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="feature-card glass-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer strip */}
      <div className="landing-footer">
        <div className="container">
          <span>© 2026 ManaiMitra — Madurai Real Estate Platform</span>
          <span>For inquiries: <a href="https://wa.me/919566874744" target="_blank" rel="noreferrer" className="wa-link">WhatsApp +91 95668 74744</a></span>
        </div>
      </div>
    </div>
  )
}
