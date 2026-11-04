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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user?.email?.includes('admin')) setRole('admin')
    })
  }, [])

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else if (email.includes('admin')) setRole('admin')
    else setRole('player')
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  const handleSignOut = () => {
    setUser(null)
    supabase.auth.signOut()
  }

  return (
    <>
      <Navbar role={role} user={user} onSignOut={handleSignOut} />
      <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-16">
        
        {!user ? (
          /* ================= ORION-INSPIRED LANDING / HERO SECTION ================= */
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="flex flex-col gap-6">
              <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full w-max border border-emerald-500/20">
                Official Football Club Management Suite
              </span>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white">
                Manage your squad <br />
                <span className="text-emerald-400">like a pro team.</span>
              </h1>
              <p className="text-slate-400 text-base leading-relaxed">
                Phantoms FC brings together your team schedules, automated WhatsApp reminders, disciplinary logs, and player rosters into one seamless platform.
              </p>

              {/* Login / Auth Card Box */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col gap-4 mt-2">
                <h3 className="font-bold text-white text-md">Access Team Portal</h3>
                <button 
                  onClick={handleGoogleLogin} 
                  className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-slate-200 transition text-sm flex items-center justify-center gap-2"
                >
                  Continue with Google
                </button>
                <div className="relative text-center my-1">
                  <span className="bg-slate-900 px-3 text-xs text-slate-500 uppercase">Or use email</span>
                </div>
                <div className="flex flex-col gap-3">
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
                  <button onClick={handleLogin} className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3 rounded-xl text-sm transition">
                    Log In
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side Orion-Style Preview Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Squad Overview</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-bold">Active V2</span>
              </div>

              <div className="flex flex-col gap-4">
                <div className="bg-slate-800/50 border border-slate-700/60 p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white text-sm">Next Training Session</h4>
                    <p className="text-xs text-slate-400 mt-0.5">North Pitch • Tactical & Stamina</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded">Confirmed</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 border border-slate-700/60 p-4 rounded-xl">
                    <span className="text-xs text-slate-400 block">Squad Readiness</span>
                    <strong className="text-2xl font-black text-white mt-1 block">94%</strong>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700/60 p-4 rounded-xl">
                    <span className="text-xs text-slate-400 block">Attendance Rate</span>
                    <strong className="text-2xl font-black text-emerald-400 mt-1 block">98.2%</strong>
                  </div>
                </div>

                <div className="border border-slate-700/60 rounded-xl p-4 flex flex-col gap-2">
                  <span className="text-xs font-semibold text-slate-300">Quick Modules Enabled</span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-xs bg-slate-800 text-emerald-400 px-2.5 py-1 rounded border border-slate-700">📅 Schedule</span>
                    <span className="text-xs bg-slate-800 text-amber-400 px-2.5 py-1 rounded border border-slate-700">🔔 Reminders</span>
                    <span className="text-xs bg-slate-800 text-cyan-400 px-2.5 py-1 rounded border border-slate-700">🛡️ Roster Controls</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* ================= LOGGED-IN DASHBOARD (ORION GRID STYLE) ================= */
          <div className="flex flex-col gap-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Command Center</span>
                <h1 className="text-3xl font-black text-white mt-1">Welcome back, Phantoms Squad.</h1>
                <p className="text-xs text-slate-400 mt-1">Select any module below to manage team operations.</p>
              </div>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-4 py-2 rounded-full font-bold uppercase">
                Role: {role}
              </span>
            </div>

            {/* Modules Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/schedule" className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl block transition shadow-lg group">
                <span className="text-2xl mb-3 block">📅</span>
                <h3 className="font-bold text-white text-lg mb-1 group-hover:text-emerald-400 transition">Training Schedule</h3>
                <p className="text-xs text-slate-400 leading-relaxed">View upcoming matches, training times, and pitch locations.</p>
              </Link>

              <Link href="/notifications" className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl block transition shadow-lg group">
                <span className="text-2xl mb-3 block">🔔</span>
                <h3 className="font-bold text-white text-lg mb-1 group-hover:text-emerald-400 transition">Automated Reminders</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Configure 2h, 1h, 30m, and 5m pre-session alerts.</p>
              </Link>

              <Link href="/profile" className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl block transition shadow-lg group">
                <span className="text-2xl mb-3 block">👤</span>
                <h3 className="font-bold text-white text-lg mb-1 group-hover:text-emerald-400 transition">Profile & Settings</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Update jersey number, phone number, or manage account deletion.</p>
              </Link>

              {role === 'admin' && (
                <>
                  <Link href="/admin/roster" className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-2xl block transition shadow-lg group">
                    <span className="text-2xl mb-3 block">🛡️</span>
                    <h3 className="font-bold text-emerald-400 text-lg mb-1">Squad Roster</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">Manage active players, remove members, and launch WhatsApp chats.</p>
                  </Link>

                  <Link href="/admin/approvals" className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 p-6 rounded-2xl block transition shadow-lg group">
                    <span className="text-2xl mb-3 block">✅</span>
                    <h3 className="font-bold text-amber-400 text-lg mb-1">Player Approvals</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">Review and approve new member signups and requests.</p>
                  </Link>

                  <Link href="/admin/attendance" className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 p-6 rounded-2xl block transition shadow-lg group">
                    <span className="text-2xl mb-3 block">📋</span>
                    <h3 className="font-bold text-cyan-400 text-lg mb-1">Attendance & Warnings</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">Log attendance and issue formal disciplinary warnings.</p>
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