import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { divisions } from '../../data/maduraiData'
import './Buyer.css'

export default function BuyerHome() {
  const navigate = useNavigate()
  return (
    <div className="page page-enter">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/')}>← Back to Home</button>
        <div className="page-header">
          <h1>Explore Madurai Divisions</h1>
          <p>Select a division to browse verified plots in that area</p>
        </div>
        <div className="div-grid">
          {divisions.map((div, i) => (
            <Link
              to={`/buyer/division/${div.id}`}
              key={div.id}
              className="div-card"
              id={`div-${div.id}`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="div-card-img" style={{ backgroundImage: `url(${div.image})` }}>
                <div className="div-card-overlay" style={{ background: `linear-gradient(to top, ${div.color}cc, transparent)` }}/>
              </div>
              <div className="div-card-body">
                <div className="div-card-top">
                  <span className="div-icon">{div.icon}</span>
                  <span className="div-badge">10 Areas</span>
                </div>
                <h3>{div.name}</h3>
                <p>{div.description}</p>
                <span className="div-cta">Explore Areas →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
