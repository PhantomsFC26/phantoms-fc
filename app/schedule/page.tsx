'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Navbar from '../../components/Navbar'

export default function SchedulePage() {
  const [sessions, setSessions] = useState<any[]>([
    { id: '1', title: 'Tactical & Positional Drill', date: '2026-11-08', time: '18:00', location: 'North Pitch A', status: 'Confirmed' },
    { id: '2', title: 'Stamina & High Press', date: '2026-11-10', time: '19:30', location: 'Main Turf', status: 'Scheduled' }
  ])

  return (
    <>
      <Navbar role="player" />
      <main className="max-w-5xl mx-auto p-6 md:p-12 flex flex-col gap-8">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
          <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Team Calendar</span>
          <h1 className="text-3xl font-black text-white mt-1">📅 Training Schedule</h1>
          <p className="text-xs text-slate-400 mt-1">Upcoming training sessions, match fixtures, and location details.</p>
        </div>

        <div className="grid gap-4">
          {sessions.map((session) => (
            <div key={session.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                  {session.date} • {session.time}
                </span>
                <h3 className="text-lg font-bold text-white mt-2">{session.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">📍 Location: {session.location}</p>
              </div>
              <span className="bg-slate-800 text-emerald-400 text-xs px-3 py-1.5 rounded-xl font-bold border border-slate-700">
                {session.status}
              </span>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}