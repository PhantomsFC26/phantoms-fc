'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Navbar from '../../components/Navbar'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [displayName, setDisplayName] = useState('')
  const [jerseyNumber, setJerseyNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        fetchProfile(session.user.id)
      }
    })
  }, [])

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (data) {
      setDisplayName(data.display_name || '')
      setJerseyNumber(data.jersey_number || '')
      setPhone(data.phone || '')
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      display_name: displayName,
      jersey_number: jerseyNumber,
      phone: phone
    })

    setLoading(false)
    if (error) alert('Error updating profile: ' + error.message)
    else {
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    }
  }

  return (
    <>
      <Navbar role="player" user={user} />
      <main className="max-w-xl mx-auto p-6 md:p-12 flex flex-col gap-8">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
          <h1 className="text-2xl font-black text-white mb-1">👤 Player Profile & Settings</h1>
          <p className="text-xs text-slate-400 mb-6">Manage your kit number, contact info, and personal account details.</p>

          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-semibold">Email (Read-only)</label>
              <input type="email" disabled value={user?.email || ''} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-500 cursor-not-allowed" />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1 font-semibold">Full Name / Display Name</label>
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-400" />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1 font-semibold">Jersey Number</label>
              <input type="number" value={jerseyNumber} onChange={(e) => setJerseyNumber(e.target.value)} required className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-400" />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1 font-semibold">WhatsApp / Phone Number</label>
              <input type="text" placeholder="+1234567890" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-400" />
            </div>

            <button type="submit" disabled={loading} className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3 rounded-xl text-sm transition mt-2">
              {loading ? 'Saving Changes...' : 'Save Profile'}
            </button>

            {savedSuccess && <span className="text-emerald-400 text-xs font-semibold text-center">Profile updated successfully!</span>}
          </form>
        </div>
      </main>
    </>
  )
}