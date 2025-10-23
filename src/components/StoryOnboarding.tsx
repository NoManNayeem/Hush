'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Play, 
  Volume2, 
  Settings, 
  ArrowRight, 
  ArrowLeft, 
  Eye, 
  Type, 
  Zap,
  CheckCircle,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface StoryOnboardingProps {
  isOpen: boolean
  onComplete: () => void
  onSkip: () => void
}

export default function StoryOnboarding({ isOpen, onComplete, onSkip }: StoryOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const steps = [
    {
      title: "Welcome to Hush",
      subtitle: "Your immersive storytelling experience",
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Play className="h-10 w-10 text-white" />
            </div>
            <p className="text-gray-300 text-lg">
              Discover the power of immersive storytelling with cinematic visuals, 
              interactive elements, and intelligent narration.
            </p>
          </div>
        </div>
      ),
      action: "Get Started"
    },
    {
      title: "Reading Controls",
      subtitle: "Master your reading experience",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-3 mb-2">
                <ArrowLeft className="h-5 w-5 text-blue-400" />
                <ArrowRight className="h-5 w-5 text-blue-400" />
                <span className="text-sm font-semibold text-white">Navigation</span>
              </div>
              <p className="text-xs text-gray-400">Use arrow keys or swipe to navigate</p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-3 mb-2">
                <Settings className="h-5 w-5 text-purple-400" />
                <span className="text-sm font-semibold text-white">Settings</span>
              </div>
              <p className="text-xs text-gray-400">Press S to open utility panel</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg p-4 border border-purple-500/20">
            <div className="flex items-center space-x-3 mb-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              <span className="text-sm font-semibold text-white">Auto-play</span>
            </div>
            <p className="text-xs text-gray-300">
              Choose from Slow & Thoughtful, Normal Pace, or Quick Read modes
            </p>
          </div>
        </div>
      ),
      action: "Next"
    },
    {
      title: "Audio & Animation",
      subtitle: "Choose your preferred experience",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-3 mb-3">
                <Volume2 className="h-5 w-5 text-cyan-400" />
                <span className="text-sm font-semibold text-white">Text-to-Speech</span>
              </div>
              <p className="text-xs text-gray-400 mb-2">
                Listen to stories with high-quality AI narration
              </p>
              <div className="flex items-center space-x-2 text-xs text-cyan-400">
                <CheckCircle className="h-3 w-3" />
                <span>Browser TTS fallback available</span>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-3 mb-3">
                <Type className="h-5 w-5 text-green-400" />
                <span className="text-sm font-semibold text-white">Typing Animation</span>
              </div>
              <p className="text-xs text-gray-400 mb-2">
                Watch text appear character by character with sound effects
              </p>
              <div className="flex items-center space-x-2 text-xs text-green-400">
                <CheckCircle className="h-3 w-3" />
                <span>Only when TTS is disabled</span>
              </div>
            </div>
          </div>
        </div>
      ),
      action: "Next"
    },
    {
      title: "Focus & Immersion",
      subtitle: "Dive deep into the story",
      content: (
        <div className="space-y-6">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center space-x-3 mb-3">
              <Eye className="h-5 w-5 text-green-400" />
              <span className="text-sm font-semibold text-white">Focus Mode</span>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              Hide all distractions and focus purely on the story content
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs text-gray-300">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Press F to toggle focus mode</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Full-screen immersive experience</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg p-4 border border-purple-500/20">
            <h4 className="text-sm font-semibold text-white mb-2">Pro Tips</h4>
            <div className="space-y-1 text-xs text-gray-300">
              <div>• Use keyboard shortcuts for quick navigation</div>
              <div>• Bookmark stories you love</div>
              <div>• React to share your thoughts</div>
              <div>• Try different autoplay speeds</div>
            </div>
          </div>
        </div>
      ),
      action: "Start Reading"
    }
  ]

  const handleNext = () => {
    setCompletedSteps(prev => [...prev, currentStep])
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      onComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    localStorage.setItem('hush:storyOnboardingSeen', 'true')
    onSkip()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-300 text-sm">
              {steps[currentStep].subtitle}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSkip}
            className="text-white hover:bg-white/10"
            aria-label="Skip onboarding"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center space-x-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-2 flex-1 rounded-full transition-all duration-300",
                index <= currentStep 
                  ? "bg-gradient-to-r from-purple-500 to-cyan-500" 
                  : "bg-white/10"
              )}
            />
          ))}
        </div>

        {/* Content */}
        <div className="mb-8">
          {steps[currentStep].content}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">
              {currentStep + 1} of {steps.length}
            </span>
          </div>

          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
          >
            {steps[currentStep].action}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-4">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Skip this tour
          </button>
        </div>
      </div>
    </div>
  )
}
