import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Landing.css'

export default function Landing() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="page page-enter">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-particles"></div>
        <div className="container hero-content">
          <div className="hero-badge">🏠 Madurai's Premium Real Estate Platform</div>
          <h1 className="hero-title">
            <span className="hero-title-line">Manai</span>
            <span className="hero-title-line gold">Mitra</span>
          </h1>
          <p className="hero-subtitle">
            Discover, list, and invest in premium plots across all divisions of Madurai district.
            Your trusted partner for seamless property transactions.
          </p>
          <div className="hero-cta">
            <Link to={isAuthenticated ? "/buyer" : "/signup?role=buyer"} className="btn btn-primary btn-lg" id="hero-buyer-btn">
              🔍 Browse as Buyer
            </Link>
            <Link to={isAuthenticated ? "/seller" : "/signup?role=seller"} className="btn btn-secondary btn-lg" id="hero-seller-btn">
              📝 List as Seller
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-number">5</span>
              <span className="hero-stat-label">Divisions</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">50</span>
              <span className="hero-stat-label">Locations</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">500+</span>
              <span className="hero-stat-label">Plots Listed</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">100%</span>
              <span className="hero-stat-label">Verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection */}
      <section className="role-section container">
        <h2 className="section-title">Choose Your Path</h2>
        <p className="section-desc">Whether you're looking to buy or sell, we have you covered.</p>
        <div className="role-cards">
          <Link to={isAuthenticated ? "/buyer" : "/signup?role=buyer"} className="role-card" id="role-buyer">
            <div className="role-card-icon">🏡</div>
            <h3>Buyer</h3>
            <p>Browse plots across 5 Madurai divisions. Explore by area, compare prices, and find your dream plot.</p>
            <span className="role-card-arrow">Explore →</span>
          </Link>
          <Link to={isAuthenticated ? "/seller" : "/signup?role=seller"} className="role-card" id="role-seller">
            <div className="role-card-icon">💼</div>
            <h3>Seller</h3>
            <p>List your property with details and images. AI-verified listings get approved fast and reach genuine buyers.</p>
            <span className="role-card-arrow">Start Listing →</span>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="features-section container">
        <h2 className="section-title">Why Manai Mitra?</h2>
        <div className="features-grid">
          <div className="feature-card glass-card">
            <span className="feature-icon">🤖</span>
            <h4>AI Verification</h4>
            <p>Every listing passes through our AI pipeline for authenticity checks before approval.</p>
          </div>
          <div className="feature-card glass-card">
            <span className="feature-icon">🔒</span>
            <h4>Secure Auth</h4>
            <p>Google authentication ensures only verified users can list and transact on the platform.</p>
          </div>
          <div className="feature-card glass-card">
            <span className="feature-icon">📍</span>
            <h4>Local Expertise</h4>
            <p>Deep coverage of all 5 Madurai divisions with 50+ neighbourhoods mapped.</p>
          </div>
          <div className="feature-card glass-card">
            <span className="feature-icon">✅</span>
            <h4>Owner Approved</h4>
            <p>Every listing is personally reviewed by our team before going live.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
