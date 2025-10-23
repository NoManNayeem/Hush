'use client'

import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export default function LoadingSpinner({ 
  size = 'md', 
  text = 'Loading...', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-purple-500`} />
      {text && (
        <p className="text-sm text-gray-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

// Full screen loading component
export function FullScreenLoading({ text = 'Loading Hush...' }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
          <span className="text-white font-bold text-2xl">H</span>
        </div>
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  )
}

// Story loading component
export function StoryLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center max-w-md">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
          <span className="text-white font-bold text-xl">H</span>
        </div>
        <LoadingSpinner size="md" text="Loading story..." />
        <p className="text-xs text-gray-500 mt-4">
          Preparing your immersive experience
        </p>
      </div>
    </div>
  )
}
