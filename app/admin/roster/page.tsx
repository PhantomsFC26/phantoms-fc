'use client'

import { useState } from 'react'
import Navbar from '../../../components/Navbar'

export default function RosterPage() {
  const [players, setPlayers] = useState([
    { id: '1', name: 'Alex Hunter', display_name: 'Alex', number: '10', email: 'alex@phantomsfc.com', phone: '+1234567890' },
    { id: '2', name: 'Chris Morgan', display_name: 'Cap Chris', number: '4', email: 'chris@phantomsfc.com', phone: '+1987654321' },
    { id: '3', name: 'Sam Wilson', display_name: 'Sammy', number: '7', email: 'sam@phantomsfc.com', phone: '+1122334455' }
  ])

  const handleRemovePlayer = (id: string, name: string) => {
    if (confirm(`Remove ${name} from the active squad?`)) {
      setPlayers(players.filter(p => p.id !== id))
      alert(`${name} has been removed from the active squad.`)
    }
  }

  const handleDeleteAccount = (id: string, name: string) => {
    if (confirm(`PERMANENT DELETION: Delete ${name}'s account and purge all data from Supabase?`)) {
      setPlayers(players.filter(p => p.id !== id))
      alert(`Account for ${name} permanently deleted.`)
    }
  }

  const openWhatsApp = (phone: string, name: string) => {
    const msg = encodeURIComponent(`Hi ${name}, this is Phantoms FC Admin regarding upcoming team training.`)
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank')
  }

  return (
    <>
      <Navbar role="admin" />
      <div className="p-8 max-w-5xl mx-auto flex flex-col gap-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-black text-emerald-400">🛡️ Squad Roster & Member Management</h1>
            <p className="text-xs text-slate-400 mt-1">View enrolled players, remove squad members, delete accounts, or trigger WhatsApp alerts.</p>
          </div>
          <span className="bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full font-bold">
            {players.length} Enrolled Players
          </span>
        </div>

        <div className="grid gap-4">
          {players.map((player) => (
            <div key={player.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-black text-emerald-400 bg-slate-950 px-4 py-2 rounded-lg border border-slate-800">
                  #{player.number}
                </span>
                <div>
                  <h3 className="font-bold text-lg text-white">{player.name} <span className="text-xs text-slate-400 font-normal">({player.display_name})</span></h3>
                  <p className="text-xs text-slate-400">{player.email} • {player.phone}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button 
                  onClick={() => openWhatsApp(player.phone, player.name)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-black text-xs font-bold px-3 py-2 rounded-lg transition"
                >
                  💬 WhatsApp
                </button>
                <button 
                  onClick={() => handleRemovePlayer(player.id, player.name)}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition"
                >
                  Remove from Squad
                </button>
                <button 
                  onClick={() => handleDeleteAccount(player.id, player.name)}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition"
                >
                  Delete Account
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}