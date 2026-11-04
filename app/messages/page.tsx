'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function MessageAdminComponent() {
  const [adminList, setAdminList] = useState<string[]>([])
  const [selectedAdmin, setSelectedAdmin] = useState('')
  const [message, setMessage] = useState('')
  const [sentSuccess, setSentSuccess] = useState(false)

  // Fetch actual admins/users from Supabase on load
  useEffect(() => {
    async function fetchAdmins() {
      // Option 1: If you have a custom 'profiles' table with a role column
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('role', 'admin')

      if (data && data.length > 0) {
        const emails = data.map((profile: any) => profile.email)
        setAdminList(emails)
        setSelectedAdmin(emails[0])
      } else {
        // Fallback to your actual personal admin email if no profile table query matches yet
        setAdminList(['your-actual-email@gmail.com'])
        setSelectedAdmin('your-actual-email@gmail.com')
      }
    }

    fetchAdmins()
  }, [])

  const sendMessageToAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    // Optional: Send the message via Supabase table insertion or email trigger (Brevo SMTP)
    const { error } = await supabase.from('admin_messages').insert([
      { recipient_email: selectedAdmin, message_body: message }
    ])

    if (error) {
      console.error('Error sending message:', error.message)
    }

    setSentSuccess(true)
    setMessage('')
    setTimeout(() => setSentSuccess(false), 3500)
  }

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
      <h3 className="text-lg font-bold text-emerald-400 mb-2">✉️ Message Team Admin</h3>
      <p className="text-xs text-slate-400 mb-4">Select your actual administrator email below to send a direct message.</p>
      
      <form onSubmit={sendMessageToAdmin} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Select Admin Recipient</label>
          <select 
            value={selectedAdmin}
            onChange={(e) => setSelectedAdmin(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white outline-none focus:border-emerald-400"
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
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white outline-none focus:border-emerald-400"
            required
          />
        </div>

        <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-2.5 rounded-lg text-sm self-start px-6 transition">
          Send to Admin
        </button>

        {sentSuccess && <span className="text-emerald-400 text-xs font-semibold">Message successfully sent to {selectedAdmin}!</span>}
      </form>
    </div>
  )
}