import { useParams, Link, useNavigate } from 'react-router-dom'
import { getPlace, getPlots, getDivisionForPlace } from '../../data/maduraiData'
import './Buyer.css'

export default function PlacePlots() {
  const { placeId } = useParams()
  const navigate = useNavigate()
  const place = getPlace(placeId)
  const plots = getPlots(placeId)
  const division = getDivisionForPlace(placeId)

  if (!place) {
    return <div className="page"><div className="container"><div className="empty-state"><h3>Place not found</h3></div></div></div>
  }

  const formatPrice = (p) => {
    if (p >= 10000000) return `₹${(p / 10000000).toFixed(1)} Cr`
    if (p >= 100000) return `₹${(p / 100000).toFixed(1)} L`
    return `₹${p.toLocaleString('en-IN')}`
  }

  return (
    <div className="page page-enter">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back to {division?.name || 'Division'}
        </button>
        <div className="page-header" style={{ paddingTop: 0 }}>
          <h1>📍 {place.name}</h1>
          <p>{place.description} — {plots.length} plots available</p>
        </div>

        <div className="plots-grid">
          {plots.map((plot, index) => (
            <Link
              to={`/buyer/plot/${plot.id}`}
              key={plot.id}
              className="plot-card glass-card"
              id={`plot-${plot.id}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="plot-card-image">
                <img src={plot.images[0]} alt={plot.title} loading="lazy" />
                <span className="plot-card-type">{plot.type}</span>
              </div>
              <div className="plot-card-body">
                <h3>{plot.title}</h3>
                <div className="plot-card-meta">
                  <span>📐 {plot.area.toLocaleString()} sq ft</span>
                  <span>📍 {place.name}</span>
                </div>
                <div className="plot-card-price">{formatPrice(plot.price)}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
