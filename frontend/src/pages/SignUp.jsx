import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import './SignUp.css'

export default function SignUp() {
  const { signInWithGoogle, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState('choose')   // 'choose' | 'email' | 'emailsignin'
  const [authType, setAuthType] = useState('') // 'buyer' | 'seller'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  useEffect(() => {
    if (isAuthenticated) navigate('/')
  }, [isAuthenticated, navigate])

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle()
    if (error) setError(error.message)
  }

  const handleEmailSignUp = async (e) => {
    e.preventDefault()
    setLoading(true); setError(''); setInfo('')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role: authType } }
    })
    if (error) { setError(error.message); setLoading(false); return }

    if (data.user) {
      // Save role to profiles table
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name || '',
        role: authType
      })

      // If email confirmation is disabled, user is logged in immediately
      if (data.session) {
        navigate('/')
        return
      }
    }
    setInfo('✅ Account created! Check your email inbox (and spam folder) for a confirmation link.')
    setLoading(false)
  }

  const handleEmailSignIn = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      if (error.message.includes('Email not confirmed')) {
        setError('Please confirm your email first. Check your inbox and spam folder.')
      } else if (error.message.includes('Invalid login')) {
        setError('Wrong email or password. Try again or create a new account.')
      } else {
        setError(error.message)
      }
      setLoading(false)
      return
    }
    setLoading(false)
    navigate('/')
  }

  // STEP 1: Choose buyer or seller
  if (mode === 'choose') {
    return (
      <div className="page page-enter signup-bg">
        <div className="signup-wrapper">
          <div className="signup-card glass-card">
            <div className="signup-logo-wrap">
              <div className="signup-svg-logo">
                <svg width="48" height="40" viewBox="0 0 48 40" fill="none">
                  <circle cx="8" cy="5" r="4.5" fill="#1a3a6b"/>
                  <path d="M2 36V18C2 15 5 13 8 13C10 13 12 14.5 13 16L18 24" fill="#1a3a6b"/>
                  <circle cx="40" cy="5" r="4.5" fill="#3a7d44"/>
                  <path d="M46 36V18C46 15 43 13 40 13C38 13 36 14.5 35 16L30 24" fill="#3a7d44"/>
                  <path d="M16 26C18 28 21 30 24 30C27 30 30 28 32 26" stroke="#1a3a6b" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M18 28C20 30 22 31 24 31C26 31 28 30 30 28" stroke="#3a7d44" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div className="signup-brand">MANAI<span>M</span>ITRA</div>
                <div className="signup-tagline">ONE COMMITMENT. LIMITLESS REACH.</div>
              </div>
            </div>
            <h2 className="signup-heading">Join as</h2>
            <div className="role-choose-grid">
              <button className="role-choose-btn" id="choose-buyer" onClick={() => { setAuthType('buyer'); setMode('email') }}>
                <span className="role-choose-icon">🏡</span>
                <span className="role-choose-label">Buyer</span>
                <span className="role-choose-sub">Browse &amp; find plots</span>
              </button>
              <button className="role-choose-btn" id="choose-seller" onClick={() => { setAuthType('seller'); setMode('email') }}>
                <span className="role-choose-icon">💼</span>
                <span className="role-choose-label">Seller</span>
                <span className="role-choose-sub">List your property</span>
              </button>
            </div>
            <p className="signup-note">Already have an account? <Link to="/signup" onClick={() => setMode('emailsignin')}>Sign In</Link></p>
          </div>
        </div>
      </div>
    )
  }

  // STEP 2: Auth form
  return (
    <div className="page page-enter signup-bg">
      <div className="signup-wrapper">
        <div className="signup-card glass-card">
          <button className="back-btn" onClick={() => { setMode('choose'); setError(''); setInfo('') }}>← Back</button>
          <div className="signup-role-badge">
            {authType === 'buyer' ? '🏡 Buyer' : '💼 Seller'} Sign {mode === 'emailsignin' ? 'In' : 'Up / In'}
          </div>

          {error && <div className="auth-error">{error}</div>}
          {info  && <div className="auth-info">{info}</div>}

          {/* Google Sign In */}
          <button className="btn btn-google" onClick={handleGoogleSignIn} id="google-signin-btn">
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Continue with Google
          </button>

          <div className="auth-divider"><span>or use email</span></div>

          {/* Email Sign Up */}
          {mode === 'email' && (
            <form onSubmit={handleEmailSignUp} className="auth-form">
              <div className="form-group">
                <label>Email Address</label>
                <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@gmail.com" required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} />
              </div>
              <button className="btn btn-primary" style={{width:'100%'}} type="submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
              <button type="button" className="auth-switch-btn" onClick={() => setMode('emailsignin')}>
                Already have an account? Sign In
              </button>
            </form>
          )}

          {/* Email Sign In */}
          {mode === 'emailsignin' && (
            <form onSubmit={handleEmailSignIn} className="auth-form">
              <div className="form-group">
                <label>Email Address</label>
                <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@gmail.com" required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" required />
              </div>
              <button className="btn btn-primary" style={{width:'100%'}} type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              <button type="button" className="auth-switch-btn" onClick={() => { setMode('email'); setError('') }}>
                Don't have an account? Sign Up
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
