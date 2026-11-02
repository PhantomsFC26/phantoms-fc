'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<'admin' | 'player'>('player')
  const [isApproved, setIsApproved] = useState<boolean>(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Messaging state
  const [message, setMessage] = useState('')
  const [sentSuccess, setSentSuccess] = useState(false)

  // Attendance state
  const [playerEmail, setPlayerEmail] = useState('')
  const [status, setStatus] = useState('present')
  const [attendanceLogs, setAttendanceLogs] = useState<any[]>([])

  // Pending users list for admin
  const [pendingUsers, setPendingUsers] = useState<any[]>([
    { id: '1', email: 'alex@phantomsfc.com', full_name: 'Alex Hunter' },
    { id: '2', email: 'sam@phantomsfc.com', full_name: 'Sam Wilson' }
  ])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
    else alert('Account created! An admin must approve your account before you can log in.')
  }

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) alert(error.message)
  }

  const handleSignOut = () => setUser(null)

  const approveUser = (id: string) => {
    setPendingUsers(pendingUsers.filter(u => u.id !== id))
    alert('Player approved successfully!')
  }

  const sendMessageToAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setSentSuccess(true)
    setMessage('')
    setTimeout(() => setSentSuccess(false), 3000)
  }

  const logAttendance = async (e: React.FormEvent) => {
    e.preventDefault()
    const newLog = { player_email: playerEmail, status, date: new Date().toLocaleDateString() }
    setAttendanceLogs([newLog, ...attendanceLogs])
    setPlayerEmail('')
    alert(`Logged ${status} for ${playerEmail}`)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center py-4 border-b border-slate-800">
        <h1 className="text-3xl font-extrabold tracking-wider text-emerald-400">PHANTOMS FC ⚽</h1>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">{user.email}</span>
            <button onClick={handleSignOut} className="bg-rose-600 hover:bg-rose-700 text-xs px-3 py-2 rounded font-bold">
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
              <span className="bg-slate-900 px-2 text-xs text-slate-500 uppercase">Or Email / Phone</span>
            </div>

            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Email or Phone Number" 
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
                <button onClick={handleLogin} className="flex-1 bg-emerald-500 hover:bg-emerald-600 font-bold py-2 rounded-lg text-sm">
                  Log In
                </button>
                <button onClick={handleSignUp} className="flex-1 bg-slate-700 hover:bg-slate-600 font-bold py-2 rounded-lg text-sm">
                  Request Join
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* DASHBOARD SECTION */
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* View Switcher Controls */}
            <div className="md:col-span-2 bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-300">View As:</span>
                <button 
                  onClick={() => setRole('player')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${role === 'player' ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400'}`}
                >
                  Player View
                </button>
                <button 
                  onClick={() => setRole('admin')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${role === 'admin' ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400'}`}
                >
                  Admin View
                </button>
              </div>

              {role === 'player' && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Status:</span>
                  <button 
                    onClick={() => setIsApproved(!isApproved)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${isApproved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500' : 'bg-amber-500/20 text-amber-400 border border-amber-500'}`}
                  >
                    {isApproved ? 'Approved' : 'Pending Approval (Click to Toggle)'}
                  </button>
                </div>
              )}
            </div>

            {/* PLAYER VIEW */}
            {role === 'player' && (
              !isApproved ? (
                /* PENDING APPROVAL WARNING */
                <div className="md:col-span-2 bg-amber-500/10 border border-amber-500/30 p-8 rounded-xl text-center flex flex-col items-center">
                  <span className="text-4xl mb-3">⏳</span>
                  <h3 className="text-xl font-bold text-amber-400 mb-2">Account Pending Admin Approval</h3>
                  <p className="text-sm text-slate-300 max-w-md">
                    Your account has been created! To protect team privacy, a club admin needs to approve your registration before you can view team stats and messages.
                  </p>
                </div>
              ) : (
                /* APPROVED PLAYER HUB */
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl md:col-span-2">
                  <h3 className="text-lg font-bold text-emerald-400 mb-2">Message Team Admin</h3>
                  <p className="text-xs text-slate-400 mb-4">Have questions about upcoming fixtures or training sessions? Send a note directly to the admin.</p>
                  <form onSubmit={sendMessageToAdmin} className="flex flex-col gap-3">
                    <textarea
                      rows={4}
                      placeholder="Type your concern or question here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm outline-none focus:border-emerald-400"
                      required
                    />
                    <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 font-bold py-2 rounded-lg text-sm self-start px-6">
                      Send Message
                    </button>
                    {sentSuccess && <span className="text-emerald-400 text-xs mt-1">Message sent successfully!</span>}
                  </form>
                </div>
              )
            )}

            {/* ADMIN VIEW */}
            {role === 'admin' && (
              <>
                {/* Pending Requests Panel */}
                <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-amber-400 mb-2">Pending Account Approval Requests ({pendingUsers.length})</h3>
                  {pendingUsers.length === 0 ? (
                    <p className="text-xs text-slate-500">No pending approvals right now.</p>
                  ) : (
                    <div className="flex flex-col gap-2 mt-4">
                      {pendingUsers.map((p) => (
                        <div key={p.id} className="bg-slate-800/60 p-3 rounded-lg flex justify-between items-center text-sm">
                          <div>
                            <p className="font-semibold">{p.full_name}</p>
                            <p className="text-xs text-slate-400">{p.email}</p>
                          </div>
                          <button 
                            onClick={() => approveUser(p.id)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold px-4 py-2 rounded-lg"
                          >
                            Approve Player
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Attendance Logger */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-emerald-400 mb-2">Log Player Attendance</h3>
                  <form onSubmit={logAttendance} className="flex flex-col gap-3 mt-4">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Player Email/ID</label>
                      <input 
                        type="text" 
                        placeholder="player@phantomsfc.com" 
                        value={playerEmail} 
                        onChange={(e) => setPlayerEmail(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Attendance Status</label>
                      <select 
                        value={status} 
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-400"
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                        <option value="excused">Excused</option>
                      </select>
                    </div>
                    <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 font-bold py-2.5 rounded-lg text-sm mt-2">
                      Save Attendance
                    </button>
                  </form>
                </div>

                {/* Attendance Logs */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-slate-200 mb-4">Recent Attendance Logs</h3>
                  {attendanceLogs.length === 0 ? (
                    <p className="text-xs text-slate-500">No attendance logged yet for today.</p>
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {attendanceLogs.map((log, idx) => (
                        <li key={idx} className="bg-slate-800/60 p-3 rounded-lg flex justify-between items-center text-xs">
                          <span>{log.player_email}</span>
                          <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                            log.status === 'present' ? 'bg-emerald-500/20 text-emerald-400' : 
                            log.status === 'absent' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {log.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}

          </div>
        )}
      </main>
    </div>
  )
}
