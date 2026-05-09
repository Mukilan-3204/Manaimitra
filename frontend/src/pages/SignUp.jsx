import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import './SignUp.css'

export default function SignUp() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Role comes from URL: /signup?role=buyer or /signup?role=seller
  const role = searchParams.get('role') || 'buyer'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignIn, setIsSignIn] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate('/')
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (isSignIn) {
      // Sign In
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError('Wrong email or password. Please try again.')
        setLoading(false)
        return
      }
      navigate('/')
    } else {
      // Sign Up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role } }
      })
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: data.user.email,
          full_name: '',
          role: role
        })
        if (data.session) {
          navigate('/')
        } else {
          navigate('/')
        }
      }
    }
    setLoading(false)
  }

  return (
    <div className="page page-enter signup-bg">
      <div className="signup-wrapper">
        <div className="signup-card glass-card">

          {/* Logo */}
          <div className="signup-logo-wrap">
            <svg width="40" height="34" viewBox="0 0 48 40" fill="none">
              <circle cx="8" cy="5" r="4.5" fill="#1a3a6b"/>
              <path d="M2 36V18C2 15 5 13 8 13C10 13 12 14.5 13 16L18 24" fill="#1a3a6b"/>
              <circle cx="40" cy="5" r="4.5" fill="#3a7d44"/>
              <path d="M46 36V18C46 15 43 13 40 13C38 13 36 14.5 35 16L30 24" fill="#3a7d44"/>
              <path d="M16 26C18 28 21 30 24 30C27 30 30 28 32 26" stroke="#1a3a6b" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <div>
              <div className="signup-brand">MANAI<span>M</span>ITRA</div>
            </div>
          </div>

          {/* Role badge */}
          <div className="signup-role-badge">
            {role === 'buyer' ? '🏡 Buyer' : '💼 Seller'} — {isSignIn ? 'Sign In' : 'Create Account'}
          </div>

          {error && <div className="auth-error">{error}</div>}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                className="form-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@gmail.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                className="form-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
                minLength={6}
              />
            </div>
            <button className="btn btn-primary" style={{width:'100%'}} type="submit" disabled={loading}>
              {loading ? 'Please wait...' : isSignIn ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <button
            type="button"
            className="auth-switch-btn"
            onClick={() => { setIsSignIn(!isSignIn); setError('') }}
          >
            {isSignIn ? "Don't have an account? Create one" : 'Already have an account? Sign In'}
          </button>

          <button className="back-btn" style={{marginTop:'16px'}} onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  )
}
