'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Link from 'next/link'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<'admin' | 'player'>('player')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  // Profile Details State
  const [displayName, setDisplayName] = useState('')
  const [jerseyNumber, setJerseyNumber] = useState('')
  const [isProfileComplete, setIsProfileComplete] = useState(true)

  // Onboarding Form Inputs
  const [inputName, setInputName] = useState('')
  const [inputJersey, setInputJersey] = useState('')
  const [loadingProfile, setLoadingProfile] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        fetchUserProfile(session.user.id, session.user.email)
      }
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        fetchUserProfile(session.user.id, session.user.email)
      } else {
        setUser(null)
        setDisplayName('')
        setJerseyNumber('')
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const fetchUserProfile = async (userId: string, userEmail?: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('display_name, jersey_number, role')
      .eq('id', userId)
      .maybeSingle()

    if (data) {
      if (data.display_name && data.jersey_number) {
        setDisplayName(data.display_name)
        setJerseyNumber(data.jersey_number)
        setIsProfileComplete(true)
      } else {
        setIsProfileComplete(false)
      }

      if (data.role === 'admin' || userEmail?.includes('admin')) {
        setRole('admin')
      } else {
        setRole('player')
      }
    } else {
      setIsProfileComplete(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return alert('Please enter email and password.')
    setAuthLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setAuthLoading(false)

    if (error) {
      alert('Login Error: ' + error.message)
    } else if (data.user) {
      setUser(data.user)
      fetchUserProfile(data.user.id, data.user.email)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return alert('Please enter email and password.')
    setAuthLoading(true)

    const { data, error } = await supabase.auth.signUp({ email, password })
    setAuthLoading(false)

    if (error) {
      alert('Signup Error: ' + error.message)
    } else if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: data.user.email,
        role: 'player'
      })
      setUser(data.user)
      setIsProfileComplete(false)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputName.trim() || !inputJersey.trim()) return
    setLoadingProfile(true)

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        display_name: inputName,
        jersey_number: inputJersey,
        role: role
      })

    setLoadingProfile(false)

    if (error) {
      alert('Error saving profile: ' + error.message)
    } else {
      setDisplayName(inputName)
      setJerseyNumber(inputJersey)
      setIsProfileComplete(true)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <>
      <Navbar role={role} user={user} onSignOut={handleSignOut} />
      <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-12">
        
        {!user ? (
          /* UNAUTHENTICATED LANDING */
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full w-max border border-emerald-500/20">
                Official Football Club Suite
              </span>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white">
                Manage your squad <br />
                <span className="text-emerald-400">like a pro team.</span>
              </h1>
              <p className="text-slate-400 text-base leading-relaxed">
                Join Phantoms FC, get your official jersey number assigned, and track team schedules & announcements.
              </p>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col gap-4">
                <form className="flex flex-col gap-3">
                  <input 
                    type="email" 
                    placeholder="Email address" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-400"
                  />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-400"
                  />
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <button 
                      type="button" 
                      onClick={handleLogin} 
                      disabled={authLoading}
                      className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3 rounded-xl text-sm transition"
                    >
                      {authLoading ? 'Logging in...' : 'Log In'}
                    </button>
                    <button 
                      type="button" 
                      onClick={handleSignUp} 
                      disabled={authLoading}
                      className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold py-3 rounded-xl text-sm transition"
                    >
                      Sign Up
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : !isProfileComplete ? (
          /* ONBOARDING MODAL */
          <div className="max-w-md mx-auto w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-black text-white mb-1">⚽ Set Up Your Player Profile</h2>
            <p className="text-xs text-slate-400 mb-6">Enter your details to generate your digital card.</p>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-semibold">Your Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Alex Hunter" 
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1 font-semibold">Jersey Number</label>
                <input 
                  type="number" 
                  required
                  placeholder="e.g. 10" 
                  value={inputJersey}
                  onChange={(e) => setInputJersey(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-400"
                />
              </div>

              <button 
                type="submit" 
                disabled={loadingProfile}
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3 rounded-xl text-sm transition mt-2"
              >
                {loadingProfile ? 'Saving...' : 'Enter Dashboard'}
              </button>
            </form>
          </div>
        ) : (
          /* LOGGED-IN DASHBOARD WITH DISPLAY NAME & JERSEY NUMBER */
          <div className="flex flex-col gap-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-5">
                {/* Dynamic Jersey Badge */}
                <div className="bg-slate-800 border-2 border-emerald-400/50 rounded-2xl w-16 h-16 flex items-center justify-center text-emerald-400 font-black text-2xl shadow-lg">
                  #{jerseyNumber}
                </div>

                <div>
                  <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Player Dashboard</span>
                  <h1 className="text-3xl font-black text-white mt-0.5">
                    Welcome back, {displayName}
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">Logged in as {user.email}</p>
                </div>
              </div>

              <button 
                onClick={handleSignOut}
                className="bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 px-4 py-2 rounded-xl text-xs font-bold transition"
              >
                Sign Out
              </button>
            </div>

            {/* Modules Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/schedule" className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl block transition shadow-lg group">
                <span className="text-2xl mb-3 block">📅</span>
                <h3 className="font-bold text-white text-lg mb-1 group-hover:text-emerald-400 transition">Training Schedule</h3>
                <p className="text-xs text-slate-400 leading-relaxed">View upcoming matches, training times, and pitch locations.</p>
              </Link>

              <Link href="/ai-bot" className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl block transition shadow-lg group">
                <span className="text-2xl mb-3 block">🤖</span>
                <h3 className="font-bold text-white text-lg mb-1 group-hover:text-emerald-400 transition">Tactical AI Bot</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Ask AI about team strategy and session drills.</p>
              </Link>

              <Link href="/profile" className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl block transition shadow-lg group">
                <span className="text-2xl mb-3 block">👤</span>
                <h3 className="font-bold text-white text-lg mb-1 group-hover:text-emerald-400 transition">Profile & Settings</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Update jersey number or account details.</p>
              </Link>

              {role === 'admin' && (
                <>
                  <Link href="/admin/roster" className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-2xl block transition shadow-lg group">
                    <span className="text-2xl mb-3 block">🛡️</span>
                    <h3 className="font-bold text-emerald-400 text-lg mb-1">Squad Roster</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">Manage active players and roster numbers.</p>
                  </Link>

                  <Link href="/admin/attendance" className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 p-6 rounded-2xl block transition shadow-lg group">
                    <span className="text-2xl mb-3 block">📋</span>
                    <h3 className="font-bold text-cyan-400 text-lg mb-1">Attendance Tracker</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">Log attendance and disciplinary alerts.</p>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

      </main>
    </>
  )
}