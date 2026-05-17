import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { divisions, places } from '../../data/maduraiData'
import './Seller.css'

const TYPES = ['Residential Plot','Commercial Plot','Agricultural Land','Villa Plot','DTCP Approved Plot','Farm Land']
const FACINGS = ['East','West','North','South','Corner Plot']
const STEPS = ['Basic Info','Land Details','Documents','Photos']

export default function SellerForm() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    seller_name:'', dob:'', seller_phone:'', seller_address:'',
    aadhaar_number:'',
    title:'', division_id:'', place_id:'', area_sqft:'', price:'',
    type:'Residential Plot', description:'', facing:'East', road_size:'',
    dtcp_approved: false,
    patta_number:'', chitta_number:'',
    aadhaar_front_files:[], aadhaar_back_files:[], doc_files:[],
    land_photo_files:[], land_photo_previews:[], doc_previews:[],
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const divPlaces = form.division_id ? (places[Number(form.division_id)] || []) : []

  const handleFiles = (e, key, previewKey) => {
    const files = Array.from(e.target.files)
    const previews = files.map(f => URL.createObjectURL(f))
    set(key, files); set(previewKey, previews)
  }

  const uploadFile = async (file, path) => {
    const { error: e } = await supabase.storage.from('plot-images').upload(path, file, { upsert: true })
    if (e) throw e
    const { data } = supabase.storage.from('plot-images').getPublicUrl(path)
    return data.publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const uid = user.id
      const ts = Date.now()

      const landPhotoUrls = await Promise.all(
        form.land_photo_files.map((f, i) => uploadFile(f, `land-photos/${uid}/${ts}-${i}-${f.name}`))
      )
      const docUrls = await Promise.all(
        form.doc_files.map((f, i) => uploadFile(f, `documents/${uid}/${ts}-${i}-${f.name}`))
      )
      const aadhaarFront = form.aadhaar_front_files[0]
        ? await uploadFile(form.aadhaar_front_files[0], `aadhaar/${uid}/${ts}-front`)
        : ''
      const aadhaarBack = form.aadhaar_back_files[0]
        ? await uploadFile(form.aadhaar_back_files[0], `aadhaar/${uid}/${ts}-back`)
        : ''

      const divObj = divisions.find(d => d.id === Number(form.division_id))
      const placeObj = divPlaces.find(p => p.id === Number(form.place_id))

      const { error: dbErr } = await supabase.from('plots').insert({
        seller_id: uid,
        seller_name: form.seller_name,
        seller_phone: form.seller_phone,
        seller_address: form.seller_address,
        dob: form.dob,
        aadhaar_number: form.aadhaar_number,
        title: form.title,
        division: divObj?.name || '',
        place: placeObj?.name || '',
        place_id: Number(form.place_id),
        area_sqft: Number(form.area_sqft),
        price: Number(form.price),
        type: form.type,
        description: form.description,
        facing: form.facing,
        road_size: form.road_size,
        dtcp_approved: form.dtcp_approved,
        patta_number: form.patta_number,
        chitta_number: form.chitta_number,
        land_photos: landPhotoUrls,
        doc_copies: docUrls,
        aadhaar_front: aadhaarFront,
        aadhaar_back: aadhaarBack,
        status: 'pending',
      })
      if (dbErr) throw dbErr
      setSuccess(true)
    } catch (err) { setError(err.message) }
    setLoading(false)
  }

  if (success) return (
    <div className="page page-enter"><div className="container">
      <div className="seller-success glass-card">
        <div className="success-icon">✅</div>
        <h2>Listing Submitted!</h2>
        <p>Your property has been submitted for owner review. You'll be notified once it's approved and goes live.</p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/seller/dashboard')}>View My Listings →</button>
      </div>
    </div></div>
  )

  const next = () => { setError(''); setStep(s => s + 1) }
  const prev = () => { setError(''); setStep(s => s - 1) }

  const validateStep = () => {
    if (step === 0 && (!form.seller_name || !form.seller_phone || !form.seller_address || !form.dob)) { setError('Please fill all required fields'); return false }
    if (step === 1 && (!form.title || !form.division_id || !form.place_id || !form.area_sqft || !form.price)) { setError('Please fill all required fields'); return false }
    setError(''); return true
  }

  return (
    <div className="page page-enter"><div className="container">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <div className="page-header"><h1>📝 List Your Property</h1><p>Fill in your details to submit for approval</p></div>

      {/* Steps */}
      <div className="steps">
        {STEPS.map((s, i) => (
          <div key={s} className={`step ${step === i ? 'active' : ''} ${step > i ? 'done' : ''}`} onClick={() => step > i && setStep(i)}>
            <div className="step-circle">{step > i ? '✓' : i + 1}</div>
            <span className="step-label">{s}</span>
          </div>
        ))}
      </div>

      {error && <div className="form-error" style={{marginBottom:'20px'}}>{error}</div>}

      <form onSubmit={handleSubmit} className="seller-form-card glass-card">

        {/* STEP 0 — Basic Info */}
        {step === 0 && (
          <div className="form-section">
            <div className="form-section-title">👤 Basic Information</div>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input className="form-input" value={form.seller_name} onChange={e => set('seller_name', e.target.value)} placeholder="Your full name" required />
              </div>
              <div className="form-group">
                <label>Date of Birth *</label>
                <input className="form-input" type="date" value={form.dob} onChange={e => set('dob', e.target.value)} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Mobile Number *</label>
                <input className="form-input" type="tel" value={form.seller_phone} onChange={e => set('seller_phone', e.target.value)} placeholder="+91 98765 43210" required />
              </div>
              <div className="form-group">
                <label>Aadhaar Number *</label>
                <input className="form-input" type="text" maxLength={14} value={form.aadhaar_number} onChange={e => set('aadhaar_number', e.target.value.replace(/\D/g,'').replace(/(\d{4})/g,'$1 ').trim())} placeholder="XXXX XXXX XXXX" />
              </div>
            </div>
            <div className="form-group">
              <label>Full Address *</label>
              <textarea className="form-input" rows={3} value={form.seller_address} onChange={e => set('seller_address', e.target.value)} placeholder="Door no, Street, City, Pincode" required />
            </div>
            <button type="button" className="btn btn-primary btn-lg" style={{width:'100%'}} onClick={() => validateStep() && next()}>Next: Land Details →</button>
          </div>
        )}

        {/* STEP 1 — Land Details */}
        {step === 1 && (
          <div className="form-section">
            <div className="form-section-title">🏞️ Land Details</div>
            <div className="form-group">
              <label>Property Title *</label>
              <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Premium Residential Plot in Anna Nagar" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Division *</label>
                <select className="form-input" value={form.division_id} onChange={e => { set('division_id', e.target.value); set('place_id', '') }} required>
                  <option value="">Select Division</option>
                  {divisions.map(d => <option key={d.id} value={d.id}>{d.icon} {d.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Place *</label>
                <select className="form-input" value={form.place_id} onChange={e => set('place_id', e.target.value)} required disabled={!form.division_id}>
                  <option value="">Select Place</option>
                  {divPlaces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Area (sq.ft) *</label>
                <input className="form-input" type="number" value={form.area_sqft} onChange={e => set('area_sqft', e.target.value)} placeholder="e.g. 1200" required />
              </div>
              <div className="form-group">
                <label>Asking Price (₹) *</label>
                <input className="form-input" type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="e.g. 2500000" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Facing Direction</label>
                <select className="form-input" value={form.facing} onChange={e => set('facing', e.target.value)}>
                  {FACINGS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Road Size (feet)</label>
                <input className="form-input" value={form.road_size} onChange={e => set('road_size', e.target.value)} placeholder="e.g. 30 feet" />
              </div>
            </div>
            <div className="form-group">
              <label>Plot Type</label>
              <select className="form-input" value={form.type} onChange={e => set('type', e.target.value)}>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-input" rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe road access, water, electricity, nearby landmarks..." />
            </div>
            <div className="dtcp-row">
              <span className="form-group" style={{flexDirection:'row',alignItems:'center',gap:'12px'}}>
                <label style={{textTransform:'none',fontSize:'0.92rem',fontWeight:600,color:'var(--text)',marginBottom:0}}>DTCP Approved?</label>
                <div className="toggle-grp">
                  <button type="button" className={`toggle-opt ${form.dtcp_approved ? 'on' : ''}`} onClick={() => set('dtcp_approved', true)}>Yes</button>
                  <button type="button" className={`toggle-opt ${!form.dtcp_approved ? 'on' : ''}`} onClick={() => set('dtcp_approved', false)}>No</button>
                </div>
              </span>
            </div>
            <div className="form-btn-row">
              <button type="button" className="btn btn-ghost" onClick={prev}>← Back</button>
              <button type="button" className="btn btn-primary" onClick={() => validateStep() && next()}>Next: Documents →</button>
            </div>
          </div>
        )}

        {/* STEP 2 — Documents */}
        {step === 2 && (
          <div className="form-section">
            <div className="form-section-title">📄 Legal Documents</div>
            <p className="form-note">⚠️ Aadhaar and document copies are <strong>private</strong> — visible only to the admin.</p>
            <div className="form-row">
              <div className="form-group">
                <label>Patta Number</label>
                <input className="form-input" value={form.patta_number} onChange={e => set('patta_number', e.target.value)} placeholder="e.g. 123/4A" />
              </div>
              <div className="form-group">
                <label>Chitta Number</label>
                <input className="form-input" value={form.chitta_number} onChange={e => set('chitta_number', e.target.value)} placeholder="e.g. 456/B" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Aadhaar — Front</label>
                <label className="file-upload-box">
                  <input type="file" accept="image/*" onChange={e => set('aadhaar_front_files', Array.from(e.target.files))} />
                  <div>{form.aadhaar_front_files.length > 0 ? `✅ ${form.aadhaar_front_files[0].name}` : '📎 Upload Aadhaar Front'}</div>
                </label>
              </div>
              <div className="form-group">
                <label>Aadhaar — Back</label>
                <label className="file-upload-box">
                  <input type="file" accept="image/*" onChange={e => set('aadhaar_back_files', Array.from(e.target.files))} />
                  <div>{form.aadhaar_back_files.length > 0 ? `✅ ${form.aadhaar_back_files[0].name}` : '📎 Upload Aadhaar Back'}</div>
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Patta / Pathiram Copies</label>
              <label className="file-upload-box">
                <input type="file" accept="image/*,application/pdf" multiple onChange={e => handleFiles(e, 'doc_files', 'doc_previews')} />
                <div>{form.doc_files.length > 0 ? `✅ ${form.doc_files.length} file(s) selected` : '📎 Upload Document Copies (PDF or Images)'}</div>
              </label>
              {form.doc_previews.length > 0 && (
                <div className="file-preview-grid">{form.doc_previews.map((p, i) => <img key={i} src={p} alt="" className="file-preview-img"/>)}</div>
              )}
            </div>
            <div className="form-btn-row">
              <button type="button" className="btn btn-ghost" onClick={prev}>← Back</button>
              <button type="button" className="btn btn-primary" onClick={next}>Next: Photos →</button>
            </div>
          </div>
        )}

        {/* STEP 3 — Photos */}
        {step === 3 && (
          <div className="form-section">
            <div className="form-section-title">📸 Land Photos</div>
            <p className="form-note">✅ Land photos are <strong>public</strong> — visible to buyers on your listing. Upload up to 20 photos.</p>
            <div className="form-group">
              <label>Upload Land Photos (max 20)</label>
              <label className="file-upload-box">
                <input type="file" accept="image/*" multiple onChange={e => {
                  const files = Array.from(e.target.files).slice(0, 20)
                  set('land_photo_files', files)
                  set('land_photo_previews', files.map(f => URL.createObjectURL(f)))
                }} />
                <div className="upload-placeholder">
                  <span style={{fontSize:'2.5rem'}}>📸</span>
                  <p>{form.land_photo_files.length > 0 ? `${form.land_photo_files.length} photo(s) selected` : 'Click to select land photos'}</p>
                  <span style={{fontSize:'0.8rem',color:'var(--text3)'}}>Up to 20 photos</span>
                </div>
              </label>
              {form.land_photo_previews.length > 0 && (
                <div className="file-preview-grid">{form.land_photo_previews.map((p, i) => <img key={i} src={p} alt="" className="file-preview-img"/>)}</div>
              )}
            </div>
            <div className="form-btn-row">
              <button type="button" className="btn btn-ghost" onClick={prev}>← Back</button>
              <button type="submit" className="btn btn-green btn-lg" disabled={loading}>
                {loading ? '⏳ Uploading & Submitting...' : '✅ Submit for Approval'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div></div>
  )
}
