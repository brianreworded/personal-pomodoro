'use client'

import { useAppState } from '@/components/ui/AppProvider'
import { OnboardingModal } from '@/components/ui/OnboardingModal'

export function OnboardingWrapper({ children }: { children: React.ReactNode }) {
  const { showOnboarding, setShowOnboarding, completeOnboarding } = useAppState()

  return (
    <>
      {children}
      <OnboardingModal 
        open={showOnboarding} 
        onOpenChange={setShowOnboarding} 
        onComplete={completeOnboarding}
      />
    </>
  )
}