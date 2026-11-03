'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<'admin' | 'player'>('player')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Player specific state
  const [playerName, setPlayerName] = useState('Alex Hunter')
  const [playerNumber, setPlayerNumber] = useState('10')
  const [selectedAdmin, setSelectedAdmin] = useState('admin@phantomsfc.com')
  const [message, setMessage] = useState('')
  const [sentSuccess, setSentSuccess] = useState(false)
  const [recentAttendance, setRecentAttendance] = useState('Present (vs Titans FC)')

  // Admin specific lists & state
  const [pendingUsers, setPendingUsers] = useState<any[]>([
    { id: '1', email: 'sam@phantomsfc.com', full_name: 'Sam Wilson', display_name: 'Sammy', number: '7' },
    { id: '2', email: 'jordan@phantomsfc.com', full_name: 'Jordan Lee', display_name: 'J-Lee', number: '14' }
  ])
  const [approvedUsers, setApprovedUsers] = useState<any[]>([
    { id: '3', email: 'alex@phantomsfc.com', full_name: 'Alex Hunter', display_name: 'Alex', number: '10' },
    { id: '4', email: 'chris@phantomsfc.com', full_name: 'Chris Morgan', display_name: 'Captain Chris', number: '4' }
  ])
  const [adminList] = useState<string[]>([
    'admin@phantomsfc.com',
    'coach.boss@phantomsfc.com'
  ])

  // Training Schedule State
  const [trainingDate, setTrainingDate] = useState('')
  const [trainingTime, setTrainingTime] = useState('')
  const [trainingNote, setTrainingNote] = useState('')
  const [scheduledSessions, setScheduledSessions] = useState<any[]>([
    { date: '2026-03-10', time: '18:00', note: 'Tactical drills & stamina training at North Pitch' }
  ])

  // Attendance Logger State
  const [targetPlayer, setTargetPlayer] = useState('')
  const [attendanceStatus, setAttendanceStatus] = useState('present')
  const [allAttendanceLogs, setAllAttendanceLogs] = useState<any[]>([
    { player_info: 'Alex Hunter (#10)', status: 'present', date: '2026-03-05' }
  ])

  // PhantomBot AI State
  const [prompt, setPrompt] = useState('')
  const [reply, setReply] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user?.email?.includes('admin')) {
        setRole('admin')
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user?.email?.includes('admin')) {
        setRole('admin')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
    else alert('Account created! An admin must approve your account.')
  }

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert(error.message)
    } else {
      if (email.includes('admin')) {
        setRole('admin')
      } else {
        setRole('player')
      }
    }
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) alert(error.message)
  }

  const handleSignOut = () => {
    setUser(null)
    supabase.auth.signOut()
  }

  // Messaging admin
  const sendMessageToAdmin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    setSentSuccess(true)
    setMessage('')
    setTimeout(() => setSentSuccess(false), 3500)
  }

  // Scheduling training
  const scheduleTraining = (e: React.FormEvent) => {
    e.preventDefault()
    if (!trainingDate || !trainingTime) return
    const newSession = { date: trainingDate, time: trainingTime, note: trainingNote || 'Regular Training Session' }
    setScheduledSessions([newSession, ...scheduledSessions])
    setTrainingDate('')
    setTrainingTime('')
    setTrainingNote('')
    alert('Training session successfully scheduled!')
  }

  // Admin Attendance Logging
  const logAttendance = (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetPlayer) return
    const newLog = { player_info: targetPlayer, status: attendanceStatus, date: new Date().toISOString().split('T')[0] }
    setAllAttendanceLogs([newLog, ...allAttendanceLogs])
    setTargetPlayer('')
    alert(`Successfully logged ${attendanceStatus} for ${targetPlayer}`)
  }

  // AI Chat Handler
  const handleAiSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return
    setAiLoading(true)
    setReply('')
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      setReply(data.reply || data.error)
    } catch (err) {
      setReply('Failed to connect to PhantomBot.')
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center py-4 border-b border-slate-800">
        <h1 className="text-3xl font-extrabold tracking-wider text-emerald-400">PHANTOMS FC ⚽</h1>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-xs bg-slate-800 px-3 py-1.5 rounded-full text-emerald-300 border border-slate-700">
              Role: <strong className="uppercase">{role}</strong>
            </span>
            <button onClick={handleSignOut} className="bg-rose-600 hover:bg-rose-700 text-xs px-3 py-2 rounded font-bold transition">
              Logout
            </button>
          </div>
        ) : (
          <span className="text-sm text-slate-500">Not Logged In</span>
        )}
      </header>

      <main className="w-full max-w-4xl mt-8 flex flex-col gap-8">
        {!user ? (
          /* AUTH SECTION */
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl max-w-md mx-auto w-full shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">Login / Request Access</h2>
            <button 
              onClick={handleGoogleLogin} 
              className="w-full bg-white text-black font-semibold py-2 rounded-lg mb-4 flex items-center justify-center gap-2 hover:bg-slate-200 transition text-sm"
            >
              Continue with Google
            </button>
            <div className="relative my-4 text-center">
              <span className="bg-slate-900 px-2 text-xs text-slate-500 uppercase">Or Email & Password</span>
            </div>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Email (use admin@phantomsfc.com for admin view)" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm outline-none focus:border-emerald-400"
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm outline-none focus:border-emerald-400"
              />
              <div className="flex gap-2 mt-2">
                <button onClick={handleLogin} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-2 rounded-lg text-sm transition">
                  Log In
                </button>
                <button onClick={handleSignUp} className="flex-1 bg-slate-700 hover:bg-slate-600 font-bold py-2 rounded-lg text-sm transition">
                  Request Join
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* DASHBOARD REDIRECTION BASED ON ROLE */
          <div className="flex flex-col gap-8 w-full">
            
            {/* ROLE SWITCHER BAR (for testing convenience) */}
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Current View Mode: <strong className="text-emerald-400 uppercase">{role} Dashboard</strong></span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setRole('player')}
                  className={`px-3 py-1 rounded font-bold ${role === 'player' ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-300'}`}
                >
                  Player Dashboard
                </button>
                <button 
                  onClick={() => setRole('admin')}
                  className={`px-3 py-1 rounded font-bold ${role === 'admin' ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-300'}`}
                >
                  Admin Dashboard
                </button>
              </div>
            </div>

            {/* ================= PLAYER DASHBOARD ================= */}
            {role === 'player' && (
              <div className="flex flex-col gap-6">
                
                {/* Player Identity & Jersey Header */}
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-center md:col-span-2">
                    <span className="text-xs text-slate-400 uppercase tracking-widest">Player Profile</span>
                    <h2 className="text-2xl font-black text-white mt-1">{playerName}</h2>
                    <span className="text-xs text-emerald-400 mt-1 font-semibold">Phantoms FC Squad Member</span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col items-center justify-center text-center">
                    <span className="text-xs text-slate-400 uppercase tracking-widest">Jersey No.</span>
                    <span className="text-4xl font-black text-emerald-400 mt-1">#{playerNumber}</span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-center">
                    <span className="text-xs text-slate-400 uppercase tracking-widest">Recent Activity</span>
                    <span className="text-sm font-bold text-emerald-300 mt-1">{recentAttendance}</span>
                  </div>
                </div>

                {/* Upcoming Training Sessions Calendar View */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-emerald-400 mb-3">📅 Upcoming Training Schedule</h3>
                  <div className="grid gap-3">
                    {scheduledSessions.map((session, idx) => (
                      <div key={idx} className="bg-slate-800/60 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border border-slate-700/50">
                        <div>
                          <p className="font-bold text-sm text-slate-200">{session.note}</p>
                          <p className="text-xs text-slate-400">🕒 {session.time} | 📅 {session.date}</p>
                        </div>
                        <span className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded border border-emerald-500/30 font-semibold">
                          Scheduled
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message Specific Admin */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-emerald-400 mb-2">✉️ Message Team Admin</h3>
                  <p className="text-xs text-slate-400 mb-4">Select an administrator below to send a direct message regarding your availability or training.</p>
                  <form onSubmit={sendMessageToAdmin} className="flex flex-col gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Select Admin Recipient</label>
                      <select 
                        value={selectedAdmin}
                        onChange={(e) => setSelectedAdmin(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-400"
                      >
                        {adminList.map((adm, i) => (
                          <option key={i} value={adm}>{adm}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Your Message</label>
                      <textarea
                        rows={3}
                        placeholder="Type your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm outline-none focus:border-emerald-400"
                        required
                      />
                    </div>
                    <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-2.5 rounded-lg text-sm self-start px-6 transition">
                      Send to Admin
                    </button>
                    {sentSuccess && <span className="text-emerald-400 text-xs font-semibold">Message successfully sent to {selectedAdmin}!</span>}
                  </form>
                </div>

                {/* PhantomBot AI Assistant */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col gap-4">
                  <h3 className="text-lg font-bold text-emerald-400">🤖 PhantomBot AI Assistant</h3>
                  <form onSubmit={handleAiSend} className="flex gap-2">
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Ask about club rules, tactics, or training..."
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400"
                    />
                    <button
                      type="submit"
                      disabled={aiLoading}
                      className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-5 py-2 rounded-lg text-sm transition"
                    >
                      {aiLoading ? 'Thinking...' : 'Send'}
                    </button>
                  </form>
                  {reply && (
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-sm text-slate-200">
                      <strong className="text-emerald-400 block mb-1">PhantomBot:</strong>
                      {reply}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ================= ADMIN DASHBOARD ================= */}
            {role === 'admin' && (
              <div className="flex flex-col gap-6">
                
                {/* Admin Header Notice */}
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-emerald-400">Admin Command Center</h3>
                    <p className="text-xs text-slate-300">Manage squad roster, display names, jersey numbers, and log player attendance.</p>
                  </div>
                  <span className="text-2xl">🛡️</span>
                </div>

                {/* Squad Roster & Display Names / Numbers */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-emerald-400 mb-4">⚽ Active Approved Roster ({approvedUsers.length})</h3>
                  <div className="grid gap-3">
                    {approvedUsers.map((player) => (
                      <div key={player.id} className="bg-slate-800/60 p-4 rounded-lg flex justify-between items-center text-sm border border-slate-700/50">
                        <div className="flex items-center gap-4">
                          <span className="text-xl font-black text-emerald-400 bg-slate-900 px-3 py-1 rounded border border-slate-700">
                            #{player.number}
                          </span>
                          <div>
                            <p className="font-bold text-slate-100">{player.full_name} <span className="text-xs text-slate-400">({player.display_name})</span></p>
                            <p className="text-xs text-slate-400">{player.email}</p>
                          </div>
                        </div>
                        <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded font-semibold border border-emerald-500/30">
                          Active
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending Approvals */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-amber-400 mb-4">Pending Approvals ({pendingUsers.length})</h3>
                  {pendingUsers.length === 0 ? (
                    <p className="text-xs text-slate-500">No pending accounts.</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {pendingUsers.map((p) => (
                        <div key={p.id} className="bg-slate-800/60 p-3 rounded-lg flex justify-between items-center text-sm">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-emerald-400">#{p.number}</span>
                            <div>
                              <p className="font-semibold">{p.full_name} <span className="text-xs text-slate-400">({p.display_name})</span></p>
                              <p className="text-xs text-slate-400">{p.email}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                setPendingUsers(pendingUsers.filter(u => u.id !== p.id))
                                setApprovedUsers([...approvedUsers, p])
                              }}
                              className="bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold px-3 py-1.5 rounded"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => setPendingUsers(pendingUsers.filter(u => u.id !== p.id))}
                              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Training Session Scheduler (Calendar Option) */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-emerald-400 mb-2">🗓️ Schedule Training Session</h3>
                  <p className="text-xs text-slate-400 mb-4">Pick a date and time for team training.</p>
                  <form onSubmit={scheduleTraining} className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Date</label>
                      <input 
                        type="date" 
                        value={trainingDate}
                        onChange={(e) => setTrainingDate(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Time</label>
                      <input 
                        type="time" 
                        value={trainingTime}
                        onChange={(e) => setTrainingTime(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Session Note / Location</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Stamina & Tactical"
                        value={trainingNote}
                        onChange={(e) => setTrainingNote(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-6 py-2.5 rounded-lg text-sm transition">
                        Publish Training Session
                      </button>
                    </div>
                  </form>
                </div>

                {/* Attendance Logger & Master Log */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Logger Form */}
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-emerald-400 mb-2">Log Player Attendance</h3>
                    <form onSubmit={logAttendance} className="flex flex-col gap-3 mt-4">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Player Name & Number</label>
                        <input 
                          type="text" 
                          placeholder="Alex Hunter (#10)" 
                          value={targetPlayer} 
                          onChange={(e) => setTargetPlayer(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Status</label>
                        <select 
                          value={attendanceStatus} 
                          onChange={(e) => setAttendanceStatus(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-400"
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="late">Late</option>
                          <option value="excused">Excused</option>
                        </select>
                      </div>
                      <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-2.5 rounded-lg text-sm mt-2 transition">
                        Save Attendance Record
                      </button>
                    </form>
                  </div>

                  {/* Master Attendance Logs (Admin Only) */}
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col">
                    <h3 className="text-lg font-bold text-slate-200 mb-4">📋 Master Attendance Logs</h3>
                    <div className="flex-1 overflow-y-auto max-h-64 flex flex-col gap-2">
                      {allAttendanceLogs.length === 0 ? (
                        <p className="text-xs text-slate-500">No attendance records found.</p>
                      ) : (
                        allAttendanceLogs.map((log, idx) => (
                          <div key={idx} className="bg-slate-800/60 p-3 rounded-lg flex justify-between items-center text-xs">
                            <div>
                              <p className="font-semibold text-slate-200">{log.player_info}</p>
                              <p className="text-slate-400">{log.date}</p>
                            </div>
                            <span className={`px-2.5 py-1 rounded font-bold uppercase ${
                              log.status === 'present' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                              log.status === 'absent' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 
                              'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}>
                              {log.status}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}
      </main>
    </div>
  )
}