import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/ui/Navbar'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { AppProvider } from '@/components/ui/AppProvider'
import DynamicTitle from '@/components/ui/DynamicTitle'
import { OnboardingWrapper } from '@/components/ui/OnboardingWrapper'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pomodoro Wellness App',
  description: 'A productivity app that combines the Pomodoro technique with active workout breaks',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
       <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      <body className={inter.className}>
        <ThemeProvider>
          <AppProvider>
            <DynamicTitle />
            <Navbar />
            {/* OnboardingWrapper provides the onboarding modal for first-time visitors */}
            <OnboardingWrapper>
              {children}
            </OnboardingWrapper>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}