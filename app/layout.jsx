import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: 'SlotYourGame — Cricket Team Management',
  description: 'Fixtures, attendance, ground bookings, stats, and free agent recruiting for cricket teams in India.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
