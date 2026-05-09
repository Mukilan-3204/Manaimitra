import { Link } from 'react-router-dom'
import { divisions } from '../../data/maduraiData'
import './Buyer.css'

// Division background images — West has no image (icon only)
const DIV_IMAGES = {
  1: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80',
  2: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
  3: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
  4: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
  5: null, // West — no image, icon only
}

// Division accent colours for the no-image card
const DIV_COLORS = {
  5: 'linear-gradient(135deg, #1a3a6b 0%, #0d2040 100%)',
}

export default function BuyerHome() {
  return (
    <div className="page page-enter">
      <div className="container">
        <div className="page-header">
          <h1>Explore Madurai Divisions</h1>
          <p>Select a division to browse available plots in that area</p>
        </div>

        <div className="divisions-grid">
          {divisions.map((div, index) => {
            const hasImage = !!DIV_IMAGES[div.id]
            return (
              <Link
                to={`/buyer/division/${div.id}`}
                key={div.id}
                className={`division-card ${!hasImage ? 'division-card-noimg' : ''}`}
                id={`division-${div.name.toLowerCase()}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {hasImage ? (
                  <>
                    <div className="division-card-bg" style={{ backgroundImage: `url(${DIV_IMAGES[div.id]})` }}></div>
                    <div className="division-card-overlay"></div>
                  </>
                ) : (
                  <div className="division-card-plain" style={{ background: DIV_COLORS[div.id] || 'var(--color-surface)' }}></div>
                )}
                <div className="division-card-content">
                  <span className="division-icon">{div.icon}</span>
                  <h3>{div.name}</h3>
                  <p>{div.description}</p>
                  <span className="division-card-link">Explore 10 areas →</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
