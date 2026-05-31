import './globals.css'

export const metadata = {
  title: 'SlotYourGame — Cricket Team Management',
  description: 'Fixtures, attendance, ground bookings, stats, and free agent recruiting for cricket teams in India.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
