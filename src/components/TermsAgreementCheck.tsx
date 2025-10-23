'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Shield, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TermsAgreementCheckProps {
  onAgreed?: () => void
  redirectTo?: string
  showAsModal?: boolean
}

export default function TermsAgreementCheck({ 
  onAgreed, 
  redirectTo = '/explore',
  showAsModal = false 
}: TermsAgreementCheckProps) {
  const [hasAgreed, setHasAgreed] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user has already agreed to terms
    const agreed = localStorage.getItem('hush:termsAgreed')
    if (agreed !== 'true') {
      setIsVisible(true)
    }
  }, [])

  const handleAgreement = () => {
    if (hasAgreed) {
      localStorage.setItem('hush:termsAgreed', 'true')
      onAgreed?.()
      if (redirectTo) {
        router.push(redirectTo)
      }
    }
  }

  if (!isVisible) return null

  if (showAsModal) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-2xl w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Terms Agreement Required</h2>
            <p className="text-gray-300">
              Please agree to our terms before accessing the stories
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-300">
                All content on Hush is fictional and for entertainment purposes only.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-300">
                Some content may contain themes of horror, mystery, or suspense.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-300">
                You agree not to use fictional content as factual information.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 mb-6">
            <Checkbox 
              id="modal-terms-agreement"
              checked={hasAgreed}
              onCheckedChange={(checked) => setHasAgreed(checked as boolean)}
              className="mt-1"
            />
            <label htmlFor="modal-terms-agreement" className="text-white cursor-pointer text-sm">
              I understand and agree to the terms and conditions
            </label>
          </div>

          <div className="flex space-x-3">
            <Button 
              onClick={handleAgreement}
              disabled={!hasAgreed}
              className={cn(
                "flex-1 py-3 font-semibold transition-all duration-300",
                hasAgreed 
                  ? "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl" 
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              )}
            >
              Continue
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/disclaimer')}
              className="flex-1 py-3 border-white/20 text-white hover:bg-white/10"
            >
              Read Full Terms
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Shield className="h-6 w-6 text-yellow-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">Terms Agreement Required</h3>
          <p className="text-gray-300 text-sm mb-4">
            Please agree to our terms before accessing the stories. All content is fictional and for entertainment purposes only.
          </p>
          
          <div className="flex items-start space-x-3 mb-4">
            <Checkbox 
              id="inline-terms-agreement"
              checked={hasAgreed}
              onCheckedChange={(checked) => setHasAgreed(checked as boolean)}
              className="mt-1"
            />
            <label htmlFor="inline-terms-agreement" className="text-white cursor-pointer text-sm">
              I understand and agree to the terms and conditions
            </label>
          </div>

          <div className="flex space-x-3">
            <Button 
              onClick={handleAgreement}
              disabled={!hasAgreed}
              size="sm"
              className={cn(
                "transition-all duration-300",
                hasAgreed 
                  ? "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white" 
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              )}
            >
              Continue
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => router.push('/disclaimer')}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Read Full Terms
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
