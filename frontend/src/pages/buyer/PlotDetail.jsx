import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getPlot, getPlace, getDivisionForPlace } from '../../data/maduraiData'
import './Buyer.css'

const OWNER_WA = '919566874744'
const fmt = (p) => p >= 10000000 ? `₹${(p/10000000).toFixed(2)} Cr` : `₹${(p/100000).toFixed(1)} L`

export default function PlotDetail() {
  const { plotId } = useParams()
  const navigate = useNavigate()
  const { isOwner } = useAuth()

  const plot = getPlot(plotId)
  const place = plot ? getPlace(plot.placeId) : null
  const division = place ? getDivisionForPlace(place.id) : null

  if (!plot) return (
    <div className="page"><div className="container"><div className="empty-state" style={{paddingTop:'120px'}}>
      <div className="empty-state-icon">🔍</div><h3>Plot not found</h3>
      <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Go Back</button>
    </div></div></div>
  )

  const waMsg = encodeURIComponent(`Hi! I'm interested in the plot: "${plot.title}" in ${place?.name}, ${division?.name}. Please share more details.`)
  const waUrl = `https://wa.me/${OWNER_WA}?text=${waMsg}`
  const ppsf = Math.round(plot.price / plot.area)

  return (
    <div className="page page-enter">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back to Plots</button>

        <div className="detail-layout">
          {/* LEFT */}
          <div className="detail-left">
            {/* Gallery */}
            <div className="detail-gallery">
              <img src={plot.images?.[0]} alt={plot.title} className="gallery-main"/>
              {plot.images?.length > 1 && (
                <div className="gallery-thumbs">
                  {plot.images.slice(1).map((img, i) => (
                    <img key={i} src={img} alt={`view ${i+2}`} className="gallery-thumb"/>
                  ))}
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="detail-badges">
              {plot.dtcp_approved && <span className="badge badge-dtcp">✓ DTCP Approved</span>}
              <span className="badge badge-verified">✓ Verified by ManaiMitra</span>
              <span className="badge badge-approved">{plot.type}</span>
            </div>

            {/* Title & Location */}
            <h1 className="detail-title">{plot.title}</h1>
            <div className="detail-location">
              <span>📍 {place?.name}</span>
              <span>•</span>
              <span>{division?.name}</span>
            </div>
            <p className="detail-desc">{plot.description}</p>
          </div>

          {/* RIGHT */}
          <div className="detail-right">
            {/* Price card */}
            <div className="price-card glass-card">
              <div className="price-main">{fmt(plot.price)}</div>
              <div className="price-psf">₹{ppsf.toLocaleString()} per sq.ft</div>

              <div className="spec-grid">
                <div className="spec-item">
                  <span className="spec-label">Area</span>
                  <span className="spec-val">{plot.area.toLocaleString()} sq.ft</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Facing</span>
                  <span className="spec-val">🧭 {plot.facing}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Road Size</span>
                  <span className="spec-val">🛣️ {plot.road_size}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">DTCP</span>
                  <span className="spec-val">{plot.dtcp_approved ? '✅ Approved' : '❌ No'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Division</span>
                  <span className="spec-val">{division?.name}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Place</span>
                  <span className="spec-val">{place?.name}</span>
                </div>
              </div>

              {!isOwner && (
                <div className="wa-section">
                  <p className="wa-note">📌 Contact us on WhatsApp to get seller details and schedule a visit.</p>
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp" id="whatsapp-cta" style={{width:'100%', marginTop:'8px'}}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    I'm Interested — WhatsApp
                  </a>
                  <p style={{fontSize:'0.75rem',color:'var(--text3)',textAlign:'center',marginTop:'8px'}}>
                    Business No: +91 95668 74744
                  </p>
                </div>
              )}
            </div>

            {/* Owner-only private details */}
            {isOwner && (
              <div className="owner-card glass-card">
                <h3>👑 Private Details (Owner Only)</h3>
                <div className="private-rows">
                  {[
                    ['Seller Name', plot.seller_name],
                    ['Patta No.', plot.patta_number],
                    ['Chitta No.', plot.chitta_number],
                    ['Address', plot.address],
                  ].map(([k, v]) => (
                    <div key={k} className="private-row">
                      <span className="private-key">{k}</span>
                      <span className="private-val">{v || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
