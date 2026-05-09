import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-brand">
          <span className="footer-logo">🏠 Manai Mitra</span>
          <p className="footer-tagline">Your trusted real estate partner in Madurai</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Platform</h4>
            <Link to="/">Home</Link>
            <Link to="/buyer">Browse Plots</Link>
            <Link to="/seller">List Property</Link>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <a href="mailto:contact@manamitra.com">Contact</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Manai Mitra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
