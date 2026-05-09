import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { divisions, places } from '../../data/maduraiData'
import './Seller.css'

export default function SellerForm() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    // Owner details
    name: '', mobile: '', address: '', nationality: '',
    // Location
    divisionId: '', placeId: '',
    // Plot details
    title: '', description: '', area: '', price: '', type: 'Residential Plot',
    // Land documents
    pattaNumber: '', surveyNumber: '',
  })

  const [landPhotos, setLandPhotos] = useState([])        // Public — visible to buyers
  const [docCopies, setDocCopies] = useState([])          // Private — patta/pathiram copies
  const [nationalityProof, setNationalityProof] = useState(null) // Private

  const [previews, setPreviews] = useState([])
  const [docPreviews, setDocPreviews] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [aiResult, setAiResult] = useState(null)

  if (!isAuthenticated) {
    return (
      <div className="page page-enter">
        <div className="container">
          <div className="empty-state" style={{ paddingTop: '120px' }}>
            <div className="empty-state-icon">🔒</div>
            <h3>Sign in Required</h3>
            <p>You need to sign in as a Seller to list a property.</p>
            <button className="btn btn-primary" onClick={() => navigate('/signup')} style={{ marginTop: '16px' }}>
              Sign Up / Sign In
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (name === 'divisionId') setForm(prev => ({ ...prev, divisionId: value, placeId: '' }))
  }

  const handleLandPhotos = (e) => {
    const files = Array.from(e.target.files).slice(0, 10)
    setLandPhotos(files)
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  const handleDocCopies = (e) => {
    const files = Array.from(e.target.files).slice(0, 5)
    setDocCopies(files)
    setDocPreviews(files.map(f => URL.createObjectURL(f)))
  }

  const handleNationalityProof = (e) => {
    if (e.target.files[0]) setNationalityProof(e.target.files[0])
  }

  const runAiCheck = () => {
    const checks = []
    const add = (field, pass, msg) => checks.push({ field, pass, msg })

    add('Full Name', !!form.name.trim(), form.name.trim() ? 'Name provided' : 'Name is required')
    add('Mobile', form.mobile.length >= 10, form.mobile.length >= 10 ? 'Valid mobile number' : 'Valid 10-digit mobile required')
    add('Address', !!form.address.trim(), form.address.trim() ? 'Address provided' : 'Address is required')
    add('Nationality Proof', !!nationalityProof, nationalityProof ? 'Document uploaded' : 'Nationality proof required (Aadhaar/Passport)')
    add('Division', !!form.divisionId, form.divisionId ? 'Division selected' : 'Select a division')
    add('Place', !!form.placeId, form.placeId ? 'Place selected' : 'Select a place')
    add('Plot Title', !!form.title.trim(), form.title.trim() ? 'Title provided' : 'Plot title required')
    add('Patta Number', !!form.pattaNumber.trim(), form.pattaNumber.trim() ? 'Patta number provided' : 'Patta number required')
    add('Survey Number', !!form.surveyNumber.trim(), form.surveyNumber.trim() ? 'Survey number provided' : 'Survey number required')
    const area = Number(form.area)
    add('Area', area > 0, area > 0 ? `${area} sq ft valid` : 'Area must be > 0')
    const price = Number(form.price)
    add('Price', price > 0, price > 0 ? `₹${price.toLocaleString('en-IN')}` : 'Price must be > 0')
    add('Land Photos', landPhotos.length > 0, landPhotos.length > 0 ? `${landPhotos.length} photo(s) uploaded` : 'At least 1 land photo required')
    add('Document Copies', docCopies.length > 0, docCopies.length > 0 ? `${docCopies.length} document(s) uploaded` : 'Patta/Pathiram copy required')
    add('Description', form.description.length >= 20, form.description.length >= 20 ? 'Good description' : 'Min 20 characters required')

    const pricePerSqft = price / area
    if (area > 0 && price > 0) {
      add('Price Validity', pricePerSqft >= 50 && pricePerSqft <= 100000,
        pricePerSqft < 50 ? 'Price too low' : pricePerSqft > 100000 ? 'Price too high' : `₹${Math.round(pricePerSqft)}/sq ft — valid`)
    }

    return { checks, allPass: checks.every(c => c.pass) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = runAiCheck()
    setAiResult(result)
    if (!result.allPass) return
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1800))
    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="page page-enter">
        <div className="container">
          <div className="seller-success glass-card">
            <span className="success-icon">✅</span>
            <h2>Listing Submitted!</h2>
            <p>Your listing has passed AI verification and is now <strong>pending owner approval</strong>. The owner will review your documents and approve once verified. You will be notified when it goes live.</p>
            <div className="success-actions">
              <button className="btn btn-primary" onClick={() => navigate('/seller/dashboard')}>View My Listings</button>
              <button className="btn btn-secondary" onClick={() => { setSubmitted(false); setAiResult(null) }}>List Another</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const availablePlaces = form.divisionId ? (places[Number(form.divisionId)] || []) : []

  return (
    <div className="page page-enter">
      <div className="container">
        <div className="page-header">
          <h1>List Your Property</h1>
          <p>Complete all sections. Our AI will verify before sending to owner for approval.</p>
        </div>

        <div className="seller-layout">
          <form className="seller-form glass-card" onSubmit={handleSubmit}>

            {/* SECTION 1: Owner Details */}
            <h2 className="form-section-title">👤 Owner / Seller Details</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input className="form-input" id="name" name="name" value={form.name} onChange={handleChange} placeholder="As per ID proof" />
              </div>
              <div className="form-group">
                <label htmlFor="mobile">Mobile Number *</label>
                <input className="form-input" id="mobile" name="mobile" value={form.mobile} onChange={handleChange} placeholder="+91 98765 43210" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="address">Full Address *</label>
              <textarea className="form-input" id="address" name="address" value={form.address} onChange={handleChange} placeholder="Door no., Street, City, Pincode" rows="2"></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="nationalityProof">Nationality Proof * <span className="field-hint">(Aadhaar / Passport — not shown to buyers)</span></label>
              <input type="file" id="nationalityProof" accept="image/*,.pdf" onChange={handleNationalityProof} className="form-input file-input" />
              {nationalityProof && <p className="file-name-tag">✓ {nationalityProof.name}</p>}
            </div>

            {/* SECTION 2: Location */}
            <h2 className="form-section-title">📍 Plot Location</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="divisionId">Division *</label>
                <select className="form-input" id="divisionId" name="divisionId" value={form.divisionId} onChange={handleChange}>
                  <option value="">Select Division</option>
                  {divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="placeId">Place / Area *</label>
                <select className="form-input" id="placeId" name="placeId" value={form.placeId} onChange={handleChange} disabled={!form.divisionId}>
                  <option value="">Select Place</option>
                  {availablePlaces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>

            {/* SECTION 3: Land Documents */}
            <h2 className="form-section-title">📄 Land Documents <span className="field-hint">(Private — visible only to owner)</span></h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pattaNumber">Patta Number *</label>
                <input className="form-input" id="pattaNumber" name="pattaNumber" value={form.pattaNumber} onChange={handleChange} placeholder="e.g. 1234/2A" />
              </div>
              <div className="form-group">
                <label htmlFor="surveyNumber">Survey Number *</label>
                <input className="form-input" id="surveyNumber" name="surveyNumber" value={form.surveyNumber} onChange={handleChange} placeholder="e.g. 56/2B" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="docCopies">Patta Copy / Pathiram / Land Documents * <span className="field-hint">(Not shown to buyers)</span></label>
              <input type="file" id="docCopies" accept="image/*,.pdf" multiple onChange={handleDocCopies} className="form-input file-input" />
              {docPreviews.length > 0 && (
                <div className="image-previews">
                  {docPreviews.map((src, i) => <img key={i} src={src} alt={`Doc ${i+1}`} className="image-preview" />)}
                </div>
              )}
            </div>

            {/* SECTION 4: Plot Details */}
            <h2 className="form-section-title">🏗️ Plot Details</h2>
            <div className="form-group">
              <label htmlFor="title">Plot Title *</label>
              <input className="form-input" id="title" name="title" value={form.title} onChange={handleChange} placeholder="e.g. DTCP Approved Residential Plot in K.K. Nagar" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="type">Plot Type</label>
                <select className="form-input" id="type" name="type" value={form.type} onChange={handleChange}>
                  <option>Residential Plot</option>
                  <option>Commercial Plot</option>
                  <option>Agricultural Land</option>
                  <option>Villa Plot</option>
                  <option>DTCP Approved Plot</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="area">Area (sq ft) *</label>
                <input className="form-input" id="area" name="area" type="number" value={form.area} onChange={handleChange} placeholder="e.g. 1200" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="price">Price (₹) *</label>
              <input className="form-input" id="price" name="price" type="number" value={form.price} onChange={handleChange} placeholder="e.g. 1500000" />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea className="form-input" id="description" name="description" value={form.description} onChange={handleChange} placeholder="Describe the plot — road access, amenities, nearby landmarks, water/electricity availability..." rows="4"></textarea>
            </div>

            {/* SECTION 5: Land Photos (Public) */}
            <h2 className="form-section-title">📸 Land Photos * <span className="field-hint">(Shown to buyers)</span></h2>
            <div className="form-group">
              <label htmlFor="landPhotos">Upload Land Photos (max 10)</label>
              <input type="file" id="landPhotos" accept="image/*" multiple onChange={handleLandPhotos} className="form-input file-input" />
              {previews.length > 0 && (
                <div className="image-previews">
                  {previews.map((src, i) => <img key={i} src={src} alt={`Land ${i+1}`} className="image-preview" />)}
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 'var(--space-md)' }} disabled={submitting}>
              {submitting ? '⏳ Running AI Check...' : '🤖 Run AI Check & Submit'}
            </button>
          </form>

          {/* AI Result Panel */}
          {aiResult && (
            <div className="ai-result glass-card">
              <h3>🤖 AI Verification Report</h3>
              <div className={`ai-status ${aiResult.allPass ? 'pass' : 'fail'}`}>
                {aiResult.allPass ? '✅ All Checks Passed — Sent for Owner Approval' : '❌ Please fix the issues below'}
              </div>
              <div className="ai-checks">
                {aiResult.checks.map((c, i) => (
                  <div key={i} className={`ai-check ${c.pass ? 'pass' : 'fail'}`}>
                    <span className="ai-check-icon">{c.pass ? '✓' : '✗'}</span>
                    <span className="ai-check-field">{c.field}</span>
                    <span className="ai-check-msg">{c.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
