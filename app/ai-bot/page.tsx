'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'

export default function AIBotPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello! I'm your Phantoms FC tactical assistant. Ask me anything about upcoming drills, formations, or club schedules." }
  ])
  const [input, setInput] = useState('')

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = input
    setMessages(prev => [...prev, { role: 'user', text: userMsg }, { role: 'assistant', text: `Analyzing squad data regarding "${userMsg}"... All systems optimal, Coach!` }])
    setInput('')
  }

  return (
    <>
      <Navbar role="player" />
      <main className="max-w-4xl mx-auto p-6 md:p-12 flex flex-col gap-6 h-[85vh]">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Intelligent Agent</span>
          <h1 className="text-2xl font-black text-white mt-1">🤖 Phantoms Tactical AI Bot</h1>
          <p className="text-xs text-slate-400 mt-1">Get instant answers about training sessions, team stats, and club guidelines.</p>
        </div>

        {/* Chat Box Area */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-y-auto flex flex-col gap-4 shadow-xl">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user' ? 'bg-emerald-500 text-black font-semibold' : 'bg-slate-800 text-slate-200 border border-slate-700'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="flex gap-3">
          <input 
            type="text" 
            placeholder="Ask about drills, tactics, or schedule..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
          />
          <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-6 py-3 rounded-xl text-sm transition">
            Send
          </button>
        </form>
      </main>
    </>
  )
}