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
      <main className="p-8 max-w-5xl mx-auto flex flex-col gap-6">
        {!user ? (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl max-w-md mx-auto w-full shadow-lg mt-12">
            <h2 className="text-xl font-bold mb-4 text-center text-white">Login to Phantoms FC</h2>
            <button 
              onClick={handleGoogleLogin} 
              className="w-full bg-white text-black font-semibold py-2.5 rounded-lg mb-4 hover:bg-slate-200 transition text-sm"
            >
              Continue with Google
            </button>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm outline-none focus:border-emerald-400 text-white"
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm outline-none focus:border-emerald-400 text-white"
              />
              <button onClick={handleLogin} className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-2.5 rounded-lg text-sm transition mt-2">
                Log In
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-3xl font-black text-emerald-400 mb-1">⚽ Phantoms FC Command Center</h1>
                  <p className="text-sm text-slate-400">Multi-Page V2 Architecture Active. Select a module below:</p>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1.5 rounded-full font-bold uppercase">
                  Role: {role}
                </span>
              </div>
              
              <div className="grid sm:grid-cols-3 gap-4">
                <Link href="/schedule" className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 p-5 rounded-xl block transition">
                  <h3 className="font-bold text-white mb-1">📅 Training Schedule</h3>
                  <p className="text-xs text-slate-400">View and schedule training sessions & tournaments.</p>
                </Link>

                <Link href="/notifications" className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 p-5 rounded-xl block transition">
                  <h3 className="font-bold text-white mb-1">🔔 Reminders</h3>
                  <p className="text-xs text-slate-400">Configure 2h, 1h, 30m, and 5m automated alerts.</p>
                </Link>

                <Link href="/profile" className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 p-5 rounded-xl block transition">
                  <h3 className="font-bold text-white mb-1">👤 Profile Settings</h3>
                  <p className="text-xs text-slate-400">Update phone, jersey number, or delete account.</p>
                </Link>

                {role === 'admin' && (
                  <>
                    <Link href="/admin/roster" className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 p-5 rounded-xl block transition">
                      <h3 className="font-bold text-emerald-400 mb-1">🛡️ Squad Roster</h3>
                      <p className="text-xs text-slate-400">Manage players, remove members, and WhatsApp chats.</p>
                    </Link>

                    <Link href="/admin/approvals" className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 p-5 rounded-xl block transition">
                      <h3 className="font-bold text-amber-400 mb-1">✅ Approvals</h3>
                      <p className="text-xs text-slate-400">Approve or reject pending player join requests.</p>
                    </Link>

                    <Link href="/admin/attendance" className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 p-5 rounded-xl block transition">
                      <h3 className="font-bold text-cyan-400 mb-1">📋 Attendance & Warnings</h3>
                      <p className="text-xs text-slate-400">Log attendance and issue disciplinary warnings.</p>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}