import './globals.css'

export const metadata = {
  title: 'SlotYourGame',
  description: 'Cricket team management for community clubs',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
