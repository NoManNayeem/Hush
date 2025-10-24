'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { setOnboardingComplete } from '@/lib/storage'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [agreedToDisclaimer, setAgreedToDisclaimer] = useState(false)

  const slides = [
    {
      title: "What is Hush?",
      content: "Hush is an open archive of fictional theories, mysteries, and stories — told interactively. Every story unfolds as a cinematic storyboard with animations, imagery, and immersive experiences.",
      icon: "🕶️"
    },
    {
      title: "How to Explore",
      content: "Search by keywords or categories. Tap a story to experience it as an animated storyboard. Navigate with arrow keys or swipe gestures. Use focus mode for distraction-free reading.",
      icon: "🔍"
    },
    {
      title: "Disclaimer",
      content: "Everything on Hush is imaginary. Any resemblance to real people or events is coincidental. This platform is for entertainment and creative exploration only.",
      icon: "⚠️"
    }
  ]

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const handleComplete = async () => {
    if (agreedToDisclaimer) {
      await setOnboardingComplete()
      onClose()
    }
  }

  const handleClose = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 bg-background border border-border rounded-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{slides[currentSlide]?.icon}</span>
            <h2 className="text-xl font-semibold text-foreground">
              {slides[currentSlide]?.title}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="min-h-[200px] flex flex-col justify-center">
            <p className="text-lg text-foreground/90 leading-relaxed text-center">
              {slides[currentSlide]?.content}
            </p>
          </div>

          {/* Disclaimer checkbox (only on last slide) */}
          {currentSlide === slides.length - 1 && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="disclaimer"
                  checked={agreedToDisclaimer}
                  onCheckedChange={(checked) => setAgreedToDisclaimer(checked as boolean)}
                  className="mt-1"
                />
                <label
                  htmlFor="disclaimer"
                  className="text-sm text-foreground/90 leading-relaxed cursor-pointer"
                >
                  I understand that all content on Hush is fictional and for entertainment purposes only. 
                  I agree to the terms and wish to continue.
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          {/* Progress dots */}
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  index === currentSlide ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex space-x-2">
            {currentSlide > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>
            )}

            {currentSlide < slides.length - 1 ? (
              <Button onClick={handleNext} className="flex items-center space-x-2">
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!agreedToDisclaimer}
                className="flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
