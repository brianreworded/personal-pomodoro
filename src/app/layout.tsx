import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/ui/Navbar'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { AppProvider } from '@/components/ui/AppProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pomodoro Fitness App',
  description: 'A productivity app that combines the Pomodoro technique with active workout breaks',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AppProvider>
            <Navbar />
            {children}
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}