import { useParams, Link, useNavigate } from 'react-router-dom'
import { getPlace, getPlots, getDivisionForPlace } from '../../data/maduraiData'
import './Buyer.css'

const fmt = (p) => p >= 10000000 ? `₹${(p/10000000).toFixed(1)} Cr` : p >= 100000 ? `₹${(p/100000).toFixed(1)} L` : `₹${p.toLocaleString('en-IN')}`

export default function PlacePlots() {
  const { placeId } = useParams()
  const navigate = useNavigate()
  const place = getPlace(placeId)
  const plots = getPlots(placeId)
  const division = getDivisionForPlace(placeId)

  if (!place) return <div className="page"><div className="container"><div className="empty-state"><h3>Place not found</h3></div></div></div>

  return (
    <div className="page page-enter">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back to Areas</button>
        <div className="page-header">
          <h1>📍 {place.name}</h1>
          <p>{place.description} · {plots.length} plots available</p>
        </div>
        {plots.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">🏞️</div><p>No approved plots in this area yet.</p></div>
        ) : (
          <div className="plots-grid">
            {plots.map((plot, i) => (
              <Link to={`/buyer/plot/${plot.id}`} key={plot.id} className="plot-card glass-card" id={`plot-${plot.id}`} style={{ animationDelay: `${i * 0.04}s` }}>
                <div className="plot-card-img">
                  {plot.images?.[0]
                    ? <img src={plot.images[0]} alt={plot.title} loading="lazy"/>
                    : <div className="plot-img-ph">🏞️</div>
                  }
                  <span className="plot-type-badge">{plot.type}</span>
                  {plot.dtcp_approved && <span className="plot-dtcp-badge">✓ DTCP</span>}
                </div>
                <div className="plot-card-body">
                  <h3>{plot.title}</h3>
                  <div className="plot-meta">
                    <span>📐 {plot.area.toLocaleString()} sq.ft</span>
                    <span>🧭 {plot.facing} Facing</span>
                    <span>🛣️ {plot.road_size}</span>
                  </div>
                  <div className="plot-price">{fmt(plot.price)}</div>
                  <span className="plot-cta-link">View Details →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
