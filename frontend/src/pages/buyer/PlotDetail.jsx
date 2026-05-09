import { useParams, useNavigate } from 'react-router-dom'
import { getPlot, getPlace } from '../../data/maduraiData'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import './Buyer.css'

const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL || 'owner@manamitra.com'

export default function PlotDetail() {
  const { plotId } = useParams()
  const navigate = useNavigate()
  const { isOwner } = useAuth()
  const plot = getPlot(plotId)
  const [activeImg, setActiveImg] = useState(0)
  const [showContact, setShowContact] = useState(false)

  if (!plot) {
    return <div className="page"><div className="container"><div className="empty-state"><h3>Plot not found</h3></div></div></div>
  }

  const place = getPlace(plot.placeId)

  const formatPrice = (p) => {
    if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`
    if (p >= 100000) return `₹${(p / 100000).toFixed(2)} L`
    return `₹${p.toLocaleString('en-IN')}`
  }

  return (
    <div className="page page-enter">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back to {place?.name || 'Plots'}</button>

        <div className="plot-detail">
          {/* Gallery */}
          <div className="plot-detail-gallery">
            <div className="plot-detail-main-img">
              <img src={plot.images[activeImg]} alt={plot.title} />
            </div>
            {plot.images.length > 1 && (
              <div className="plot-detail-thumbs">
                {plot.images.map((img, i) => (
                  <button key={i} className={`plot-thumb ${i === activeImg ? 'active' : ''}`} onClick={() => setActiveImg(i)}>
                    <img src={img} alt={`View ${i+1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="plot-detail-info glass-card">
            <span className="badge badge-approved">{plot.status}</span>
            <h1>{plot.title}</h1>
            <div className="plot-detail-price">{formatPrice(plot.price)}</div>

            {/* PUBLIC specs — visible to all buyers */}
            <div className="plot-detail-specs">
              <div className="plot-spec">
                <span className="plot-spec-label">Area</span>
                <span className="plot-spec-value">{plot.area.toLocaleString()} sq ft</span>
              </div>
              <div className="plot-spec">
                <span className="plot-spec-label">Type</span>
                <span className="plot-spec-value">{plot.type}</span>
              </div>
              <div className="plot-spec">
                <span className="plot-spec-label">Location</span>
                <span className="plot-spec-value">{place?.name || 'Madurai'}</span>
              </div>
              <div className="plot-spec">
                <span className="plot-spec-label">Price/sqft</span>
                <span className="plot-spec-value">₹{Math.round(plot.price / plot.area).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="plot-detail-section">
              <h3>Description</h3>
              <p>{plot.description}</p>
            </div>

            {/* PRIVATE — patta/survey only for owner */}
            {isOwner && (
              <div className="plot-detail-section owner-only-section">
                <h3>🔒 Owner Only — Land Documents</h3>
                <div className="plot-private-row">
                  <span className="plot-spec-label">Patta No.</span>
                  <span className="plot-spec-value">{plot.pattaNumber || '—'}</span>
                </div>
                <div className="plot-private-row">
                  <span className="plot-spec-label">Survey No.</span>
                  <span className="plot-spec-value">{plot.surveyNumber || '—'}</span>
                </div>
                <div className="plot-private-row">
                  <span className="plot-spec-label">Seller Name</span>
                  <span className="plot-spec-value">{plot.seller}</span>
                </div>
                <div className="plot-private-row">
                  <span className="plot-spec-label">Seller Mobile</span>
                  <span className="plot-spec-value">{plot.sellerPhone || '—'}</span>
                </div>
              </div>
            )}

            {/* Contact Owner button */}
            {!showContact ? (
              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: 'var(--space-lg)' }}
                onClick={() => setShowContact(true)}
                id="contact-owner-btn"
              >
                📞 Contact Owner / Enquire
              </button>
            ) : (
              <div className="contact-owner-card">
                <h4>📞 Contact Manai Mitra</h4>
                <p>Interested in this plot? Reach out to us and we'll connect you with the seller.</p>
                <div className="contact-details">
                  <a href={`mailto:${OWNER_EMAIL}?subject=Enquiry: ${plot.title}&body=Hi, I am interested in the plot: ${plot.title} at ${place?.name}.`} className="btn btn-primary btn-sm">
                    ✉️ Email Us
                  </a>
                  <a href="tel:+919876543210" className="btn btn-secondary btn-sm">
                    📱 Call Us
                  </a>
                </div>
                <p className="contact-note">We'll respond within 24 hours.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
