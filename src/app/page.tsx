'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import OnboardingModal from '@/components/OnboardingModal'
import ParticleBackground from '@/components/ParticleBackground'
import { Button } from '@/components/ui/button'
import { checkOnboardingStatus } from '@/lib/storage'
import { ArrowRight, Sparkles, Play } from 'lucide-react'

export default function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()
  // const heroRef = useRef<HTMLDivElement>(null)

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
    <div className="min-h-screen relative overflow-hidden bg-cinematic-bg">
      {/* Enhanced Cinematic Background */}
      <div className="absolute inset-0 immersive-bg animate-cinematic-bg"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-cinematic-bg/50 to-cinematic-bg"></div>
      
      {/* Enhanced Animated Particles */}
      <div className="absolute inset-0">
        <ParticleBackground count={50} opacity={0.15} />
      </div>

      <Navbar />
      
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Enhanced Hero Logo */}
        <div className="relative z-10 mb-12 animate-cinematic-fade-in">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-cinematic-accent to-cinematic-accent-secondary rounded-3xl flex items-center justify-center shadow-2xl animate-cinematic-glow">
              <span className="text-white font-bold text-5xl display-text">H</span>
            </div>
            <div className="absolute -top-3 -right-3">
              <Sparkles className="h-8 w-8 text-cinematic-accent-secondary animate-pulse" />
            </div>
            <div className="absolute -bottom-2 -left-2">
              <div className="w-6 h-6 bg-cinematic-accent rounded-full animate-ping"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Hero Text */}
        <div className={`transition-all duration-2000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-5xl md:text-7xl font-bold text-cinematic-text mb-8 max-w-5xl leading-tight display-text">
            Some stories are meant to be
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cinematic-accent to-cinematic-accent-secondary animate-shimmer">
              heard in whispers
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-cinematic-text-muted mb-12 max-w-3xl leading-relaxed serif-text">
            An open archive of fictional theories, mysteries, and stories — told interactively through immersive storyboards that blur the line between reality and imagination.
          </p>
        </div>

        {/* Enhanced CTA Button */}
        <div className={`transition-all duration-2000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Button
            size="lg"
            className="group cinematic-button px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110"
            onClick={handleGetStarted}
          >
            <Play className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
            Begin Your Journey
            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Enhanced Feature Cards */}
        <div className={`mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl transition-all duration-2000 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center p-8 rounded-2xl cinematic-card hover:cinematic-glow transition-all duration-500 hover:scale-105 group">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🎬</div>
            <h3 className="text-2xl font-bold text-cinematic-text mb-4 display-text">Cinematic Stories</h3>
            <p className="text-base text-cinematic-text-muted leading-relaxed serif-text">
              Stories unfold with professional animations, immersive imagery, and cinematic effects that transport you into the narrative.
            </p>
          </div>
          <div className="text-center p-8 rounded-2xl cinematic-card hover:cinematic-glow transition-all duration-500 hover:scale-105 group">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🔍</div>
            <h3 className="text-2xl font-bold text-cinematic-text mb-4 display-text">Interactive Discovery</h3>
            <p className="text-base text-cinematic-text-muted leading-relaxed serif-text">
              Navigate through conspiracy theories, mysteries, and thought experiments with intuitive controls and immersive navigation.
            </p>
          </div>
          <div className="text-center p-8 rounded-2xl cinematic-card hover:cinematic-glow transition-all duration-500 hover:scale-105 group">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🌐</div>
            <h3 className="text-2xl font-bold text-cinematic-text mb-4 display-text">Open Archive</h3>
            <p className="text-base text-cinematic-text-muted leading-relaxed serif-text">
              Community-driven collection of fictional stories and theories, continuously expanding with new immersive narratives.
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <OnboardingModal isOpen={showOnboarding} onClose={handleOnboardingClose} />
    </div>
  )
}