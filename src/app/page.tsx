'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import OnboardingModal from '@/components/OnboardingModal'
import { Button } from '@/components/ui/button'
import { checkOnboardingStatus } from '@/lib/storage'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkOnboarding = async () => {
      const seen = await checkOnboardingStatus()
      setHasSeenOnboarding(seen)
      
      if (seen) {
        // Redirect to explore if already onboarded
        router.push('/explore')
      }
    }
    
    checkOnboarding()
  }, [router])

  const handleGetStarted = () => {
    setShowOnboarding(true)
  }

  const handleOnboardingClose = () => {
    setShowOnboarding(false)
    // After onboarding, redirect to explore
    router.push('/explore')
  }

  if (hasSeenOnboarding) {
    return null // Will redirect to /explore
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <main className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Background Animation Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-cyan-900/20" />
        
        {/* Animated Logo */}
        <div className="relative z-10 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse-slow">
            <span className="text-white font-bold text-4xl">H</span>
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
          </div>
        </div>

        {/* Tagline */}
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 max-w-4xl">
          Some stories are meant to be{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            heard in whispers
          </span>
        </h1>

        <p className="text-xl text-foreground/80 mb-8 max-w-2xl leading-relaxed">
          An open archive of fictional theories, mysteries, and stories — 
          told interactively through immersive storyboards.
        </p>

        {/* CTA Button */}
        <Button
          size="lg"
          onClick={handleGetStarted}
          className="group bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <span>Get Started</span>
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>

        {/* Features Preview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <div className="text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border">
            <div className="text-3xl mb-4">🎬</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Cinematic Stories</h3>
            <p className="text-sm text-foreground/70">
              Stories unfold with animations, imagery, and immersive experiences
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border">
            <div className="text-3xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Interactive Discovery</h3>
            <p className="text-sm text-foreground/70">
              Navigate through conspiracy theories, mysteries, and thought experiments
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border">
            <div className="text-3xl mb-4">🌐</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Open Archive</h3>
            <p className="text-sm text-foreground/70">
              Community-driven collection of fictional stories and theories
            </p>
          </div>
        </div>
      </main>

      <Footer />

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleOnboardingClose}
      />
    </div>
  )
}
