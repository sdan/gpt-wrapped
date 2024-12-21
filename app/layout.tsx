import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'My App',
  description: 'Sample Next.js app',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
