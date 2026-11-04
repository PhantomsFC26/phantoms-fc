'use client'

import { useState } from 'react'
import Navbar from '../../components/Navbar'

export default function NotificationsPage() {
  const [logs, setLogs] = useState<string[]>([])

  const triggerReminder = (interval: string) => {
    const msg = `🔔 REMINDER: Phantoms FC event starts in ${interval}! Scheduled by Admin. Please arrive on time.`
    setLogs([msg, ...logs])
    alert(`Broadcast Sent: "${msg}"`)
  }

  return (
    <>
      <Navbar />
      <div className="p-8 max-w-4xl mx-auto flex flex-col gap-6">
        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-black text-emerald-400">🔔 Session & Tournament Reminders</h1>
          <p className="text-xs text-slate-400 mt-1">Configure and send scheduled notifications to players prior to training and tournaments.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: '2 Hours Before Event', interval: '2 hours' },
            { label: '1 Hour Before Event', interval: '1 hour' },
            { label: '30 Minutes Before Event', interval: '30 minutes' },
            { label: '5 Minutes Before Event', interval: '5 minutes' },
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-bold text-sm text-white">{item.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">Triggers app & mobile notification</p>
              </div>
              <button
                onClick={() => triggerReminder(item.interval)}
                className="bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold px-3.5 py-2 rounded-lg transition"
              >
                Send Test
              </button>
            </div>
          ))}
        </div>

        {/* Activity Logs */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="font-bold text-white text-md mb-3">📋 Dispatch Activity Log</h3>
          {logs.length === 0 ? (
            <p className="text-xs text-slate-500">No recent notifications sent in this session.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {logs.map((log, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 p-3 rounded text-xs text-emerald-400 font-mono">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}