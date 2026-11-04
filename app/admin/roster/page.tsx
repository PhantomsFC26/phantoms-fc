'use client'

import { useState } from 'react'
import Navbar from '../../../components/Navbar'

export default function SquadRosterPage() {
  const [approvedUsers, setApprovedUsers] = useState<any[]>([
    { id: '3', email: 'alex@phantomsfc.com', full_name: 'Alex Hunter', display_name: 'Alex', number: '10', phone: '+1234567890' },
    { id: '4', email: 'chris@phantomsfc.com', full_name: 'Chris Morgan', display_name: 'Captain Chris', number: '4', phone: '+1987654321' }
  ])

  const removePlayer = (id: string) => {
    setApprovedUsers(approvedUsers.filter(u => u.id !== id))
  }

  return (
    <>
      <Navbar role="admin" />
      <main className="max-w-5xl mx-auto p-8 flex flex-col gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h1 className="text-2xl font-black text-emerald-400 mb-2">🛡️ Squad Roster Management</h1>
          <p className="text-xs text-slate-400 mb-6">View active squad members, connect via WhatsApp, or remove players.</p>

          <div className="grid gap-3">
            {approvedUsers.map((player) => (
              <div key={player.id} className="bg-slate-800/60 p-4 rounded-xl flex justify-between items-center border border-slate-700/50">
                <div className="flex items-center gap-4">
                  <span className="text-xl font-black text-emerald-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
                    #{player.number}
                  </span>
                  <div>
                    <h3 className="font-bold text-white text-sm">{player.full_name} <span className="text-xs text-slate-400">({player.display_name})</span></h3>
                    <p className="text-xs text-slate-400">{player.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a 
                    href={`https://wa.me/${player.phone}?text=Hello%20from%20Phantoms%20FC!`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs px-3 py-1.5 rounded-lg font-bold transition"
                  >
                    💬 WhatsApp
                  </a>
                  <button 
                    onClick={() => removePlayer(player.id)}
                    className="bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 border border-rose-500/30 text-xs px-3 py-1.5 rounded-lg font-bold transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}