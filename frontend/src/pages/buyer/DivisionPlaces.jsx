import { useParams, Link, useNavigate } from 'react-router-dom'
import { getDivision, getPlaces } from '../../data/maduraiData'
import './Buyer.css'

export default function DivisionPlaces() {
  const { divisionId } = useParams()
  const navigate = useNavigate()
  const division = getDivision(divisionId)
  const placesList = getPlaces(divisionId)

  if (!division) {
    return <div className="page"><div className="container"><div className="empty-state"><h3>Division not found</h3></div></div></div>
  }

  return (
    <div className="page page-enter">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/buyer')}>← Back to Divisions</button>
        <div className="page-header" style={{ paddingTop: 0 }}>
          <h1>{division.icon} {division.name} Division</h1>
          <p>{division.description}</p>
        </div>

        <div className="places-grid">
          {placesList.map((place, index) => (
            <Link
              to={`/buyer/place/${place.id}`}
              key={place.id}
              className="place-card glass-card"
              id={`place-${place.id}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="place-card-number">{String(index + 1).padStart(2, '0')}</div>
              <h3>{place.name}</h3>
              <p>{place.description}</p>
              <span className="place-card-link">View 10 plots →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
