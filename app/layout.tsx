import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '../context/ThemeContext'

export const metadata: Metadata = {
  title: 'Phantoms FC ⚽',
  description: 'Official Phantoms Football Club Management & Player Portal',
  icons: {
    icon: '/logo.png', // Uses your uploaded club logo as the favicon instead of 'N'
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}