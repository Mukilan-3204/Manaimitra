import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL || ''

export function AuthProvider({ children }) {
  const [user, setUser]           = useState(null)
  const [role, setRole]           = useState(null)
  const [loading, setLoading]     = useState(true)

  const determineRole = async (u) => {
    if (!u) { setRole(null); return }
    if (u.email === OWNER_EMAIL) { setRole('owner'); return }
    try {
      const { data } = await supabase.from('profiles').select('role').eq('id', u.id).single()
      setRole(data?.role || 'buyer')
    } catch {
      setRole('buyer')
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      determineRole(session?.user ?? null).finally(() => setLoading(false))
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      determineRole(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setRole(null)
  }

  const updateRole = async (newRole) => {
    if (!user) return
    await supabase.from('profiles').update({ role: newRole }).eq('id', user.id)
    setRole(newRole)
  }

  return (
    <AuthContext.Provider value={{
      user,
      role,
      loading,
      isAuthenticated: !!user,
      isOwner: role === 'owner',
      signInWithGoogle,
      signOut,
      updateRole,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
