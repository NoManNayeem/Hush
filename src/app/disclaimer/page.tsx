'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { AlertTriangle, Shield, Eye, Heart, BookOpen } from 'lucide-react'
import ParticleBackground from '@/components/ParticleBackground'
import { cn } from '@/lib/utils'

export default function DisclaimerPage() {
  const [hasAgreed, setHasAgreed] = useState(false)
  // const [isAnimating, setIsAnimating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user has already agreed to terms
    const agreed = localStorage.getItem('hush:termsAgreed')
    if (agreed === 'true') {
      setHasAgreed(true)
    }
  }, [])

  const handleAgreement = () => {
    if (hasAgreed) {
      localStorage.setItem('hush:termsAgreed', 'true')
      // setIsAnimating(true)
      setTimeout(() => {
        router.push('/explore')
      }, 500)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/30 to-black"></div>
      
      {/* Animated Particles */}
      <ParticleBackground count={15} opacity={0.1} />
      
      <Navbar />
      
      <main className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Terms & 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400"> Conditions</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Please read and agree to our terms before exploring the stories
          </p>
        </div>

        {/* Enhanced Disclaimer Content */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Fictional Content</h3>
                  <p className="text-gray-300 text-sm">
                    All stories are works of fiction. Any resemblance to real events or people is purely coincidental.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Eye className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Age Appropriate</h3>
                  <p className="text-gray-300 text-sm">
                    Some content may contain themes of horror, mystery, or suspense. Viewer discretion advised.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Creative Expression</h3>
                  <p className="text-gray-300 text-sm">
                    We celebrate storytelling and imagination as forms of artistic expression and entertainment.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Entertainment Only</h3>
                  <p className="text-gray-300 text-sm">
                    This platform is designed for creative storytelling and imaginative exploration.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">User Responsibility</h3>
                  <p className="text-gray-300 text-sm">
                    You agree not to use fictional content as factual information for decision-making.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Content Moderation</h3>
                  <p className="text-gray-300 text-sm">
                    All content must be clearly marked as fictional. Misleading content will be removed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Agreement Section */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex items-start space-x-4 mb-6">
              <Checkbox 
                id="terms-agreement"
                checked={hasAgreed}
                onCheckedChange={(checked) => setHasAgreed(checked as boolean)}
                className="mt-1"
              />
              <label htmlFor="terms-agreement" className="text-white cursor-pointer">
                <span className="block text-lg font-semibold mb-2">
                  I understand and agree to the terms
                </span>
                <span className="text-gray-300 text-sm">
                  I acknowledge that all content on Hush is fictional and for entertainment purposes only. 
                  I will not use any information from this platform as factual or for decision-making purposes.
                </span>
              </label>
            </div>

            <Button 
              onClick={handleAgreement}
              disabled={!hasAgreed}
              className={cn(
                "w-full py-4 text-lg font-semibold transition-all duration-300",
                hasAgreed 
                  ? "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl" 
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              )}
            >
              {hasAgreed ? "Continue to Stories" : "Please agree to continue"}
            </Button>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Additional Information</h2>
          <div className="space-y-4 text-gray-300">
            <p>
              <strong className="text-white">Last updated:</strong> October 2025
            </p>
            <p>
              If you have any questions about this disclaimer, please contact us through our 
              <a href="/developer" className="text-purple-400 hover:text-purple-300 transition-colors ml-1"> developer page</a>.
            </p>
            <p className="text-sm text-gray-400">
              By using this platform, you acknowledge that you understand all content is fictional 
              and agree to use Hush responsibly for entertainment purposes only.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}