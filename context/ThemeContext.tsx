'use client'

import React, { createContext, useContext, useState } from 'react'

type Theme = 'orion-light' | 'dark' | 'cyber-green' | 'royal-blue'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'cyber-green',
  setTheme: () => {}
})

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('cyber-green')

  const getThemeClass = () => {
    switch (theme) {
      case 'orion-light':
        return 'bg-white text-slate-900'
      case 'dark':
        return 'bg-black text-slate-100'
      case 'royal-blue':
        return 'bg-slate-950 text-amber-300'
      default:
        return 'bg-slate-950 text-emerald-400'
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`min-h-screen transition-colors duration-300 ${getThemeClass()}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)