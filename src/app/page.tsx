'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import OnboardingModal from '@/components/OnboardingModal'
import { Button } from '@/components/ui/button'
import { checkOnboardingStatus } from '@/lib/storage'
import { ArrowRight, Sparkles, Play, BookOpen, Search, Zap } from 'lucide-react'

export default function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkOnboarding = async () => {
      const seen = await checkOnboardingStatus()
      setHasSeenOnboarding(seen)
      
      if (seen) {
        router.push('/explore')
      }
    }
    
    checkOnboarding()
    
    // Trigger entrance animation
    setTimeout(() => setIsLoaded(true), 100)
  }, [router])

  const handleGetStarted = () => {
    setShowOnboarding(true)
  }

  const handleOnboardingClose = () => {
    setShowOnboarding(false)
    router.push('/explore')
  }

  if (hasSeenOnboarding) {
    return null // Will redirect to /explore
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/50 to-black"></div>
      
      {/* Animated Particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <Navbar />
      
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Hero Logo */}
        <div className="relative z-10 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse-slow">
            <span className="text-white font-bold text-4xl">H</span>
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
          </div>
        </div>

        {/* Hero Text */}
        <div className={`transition-all duration-2000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-4xl leading-tight">
            Some stories are meant to be
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              heard in whispers
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
            An open archive of fictional theories, mysteries, and stories — told interactively through immersive storyboards.
          </p>
        </div>

        {/* CTA Button */}
        <div className={`transition-all duration-2000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Button
            size="lg"
            className="group bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handleGetStarted}
          >
            <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Begin Your Journey
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Feature Cards */}
        <div className={`mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl transition-all duration-2000 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="text-3xl mb-4">🎬</div>
            <h3 className="text-lg font-semibold text-white mb-2">Cinematic Stories</h3>
            <p className="text-sm text-gray-300">Stories unfold with animations, imagery, and immersive experiences</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="text-3xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-white mb-2">Interactive Discovery</h3>
            <p className="text-sm text-gray-300">Navigate through conspiracy theories, mysteries, and thought experiments</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="text-3xl mb-4">🌐</div>
            <h3 className="text-lg font-semibold text-white mb-2">Open Archive</h3>
            <p className="text-sm text-gray-300">Community-driven collection of fictional stories and theories</p>
          </div>
        </div>
      </main>

      <Footer />
      <OnboardingModal isOpen={showOnboarding} onClose={handleOnboardingClose} />
    </div>
  )
}