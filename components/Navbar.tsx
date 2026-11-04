'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from '../context/ThemeContext'

export default function Navbar({ role, user, onSignOut }: { role?: string; user?: any; onSignOut?: () => void }) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="w-full border-b border-slate-800 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
      <Link href="/" className="flex items-center gap-3">
        <Image 
          src="/logo.png" 
          alt="Phantoms FC Logo" 
          width={40} 
          height={40} 
          className="rounded-full border border-emerald-400 object-cover"
        />
        <span className="text-xl font-black tracking-wider">PHANTOMS FC</span>
      </Link>

      <nav className="flex items-center gap-5 text-sm font-semibold">
        <Link href="/" className="hover:opacity-80 transition">Dashboard</Link>
        <Link href="/schedule" className="hover:opacity-80 transition">📅 Schedule</Link>
        <Link href="/notifications" className="hover:opacity-80 transition">🔔 Reminders</Link>

        {role === 'admin' && (
          <>
            <Link href="/admin/approvals" className="hover:opacity-80 transition text-amber-400">Approvals</Link>
            <Link href="/admin/roster" className="hover:opacity-80 transition text-emerald-400">Squad Roster</Link>
            <Link href="/admin/attendance" className="hover:opacity-80 transition text-cyan-400">Attendance</Link>
          </>
        )}

        <Link href="/profile" className="hover:opacity-80 transition">👤 Settings</Link>
      </nav>

      <div className="flex items-center gap-3">
        <select 
          value={theme}
          onChange={(e) => setTheme(e.target.value as any)}
          className="bg-slate-800 text-xs border border-slate-700 text-white px-2.5 py-1.5 rounded-lg outline-none cursor-pointer"
        >
          <option value="cyber-green">🟢 Cyber Green</option>
          <option value="orion-light">⚪ ORION Light</option>
          <option value="dark">🌙 Inverted Dark</option>
          <option value="royal-blue">👑 Royal Blue</option>
        </select>

        {user && onSignOut && (
          <button onClick={onSignOut} className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-3 py-1.5 rounded-lg font-bold transition">
            Logout
          </button>
        )}
      </div>
    </header>
  )
}