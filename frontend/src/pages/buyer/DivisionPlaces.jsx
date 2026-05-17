import { useParams, Link, useNavigate } from 'react-router-dom'
import { getDivision, getPlaces } from '../../data/maduraiData'
import './Buyer.css'

export default function DivisionPlaces() {
  const { divisionId } = useParams()
  const navigate = useNavigate()
  const division = getDivision(divisionId)
  const placesList = getPlaces(divisionId)

  if (!division) return <div className="page"><div className="container"><div className="empty-state"><h3>Division not found</h3></div></div></div>

  return (
    <div className="page page-enter">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/buyer')}>← Back to Divisions</button>
        <div className="page-header">
          <div className="div-pill" style={{ background: `${division.color}22`, borderColor: `${division.color}55`, color: division.color }}>
            {division.icon} {division.name}
          </div>
          <h1>Browse Areas</h1>
          <p>{division.description}</p>
        </div>
        <div className="places-grid">
          {placesList.map((place, i) => (
            <Link to={`/buyer/place/${place.id}`} key={place.id} className="place-card glass-card glass-card-hov" style={{ animationDelay: `${i * 0.05}s` }} id={`place-${place.id}`}>
              <div className="place-num" style={{ background: `${division.color}22`, color: division.color }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="place-info">
                <h3>{place.name}</h3>
                <p>{place.description}</p>
              </div>
              <span className="place-arrow">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
