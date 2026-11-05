'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'

export default function AttendancePage() {
  const [attendance, setAttendance] = useState([
    { id: '1', name: 'Alex Hunter', number: '10', status: 'Present' },
    { id: '2', name: 'Chris Morgan', number: '4', status: 'Late' },
    { id: '3', name: 'Sam Taylor', number: '7', status: 'Absent' }
  ])

  const toggleStatus = (id: string) => {
    setAttendance(attendance.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === 'Present' ? 'Late' : p.status === 'Late' ? 'Absent' : 'Present'
        return { ...p, status: nextStatus }
      }
      return p
    }))
  }

  return (
    <>
      <Navbar role="admin" />
      <main className="max-w-5xl mx-auto p-6 md:p-12 flex flex-col gap-8">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
          <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">Admin Control</span>
          <h1 className="text-3xl font-black text-white mt-1">📋 Squad Attendance & Logs</h1>
          <p className="text-xs text-slate-400 mt-1">Tap a player's status to cycle between Present, Late, and Absent.</p>
        </div>

        <div className="grid gap-3">
          {attendance.map((player) => (
            <div key={player.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-sm font-black text-cyan-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                  #{player.number}
                </span>
                <h3 className="font-bold text-white text-sm">{player.name}</h3>
              </div>
              <button 
                onClick={() => toggleStatus(player.id)}
                className={`text-xs px-4 py-2 rounded-xl font-bold border transition ${
                  player.status === 'Present' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                  player.status === 'Late' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                  'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                {player.status}
              </button>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}