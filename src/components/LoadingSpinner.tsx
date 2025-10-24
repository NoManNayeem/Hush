'use client'

import { Loader2, BookOpen, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  className?: string
  variant?: 'default' | 'story' | 'magical'
}

export default function LoadingSpinner({ 
  size = 'md', 
  text = 'Loading...', 
  className = '',
  variant = 'default'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  const getSpinnerContent = () => {
    switch (variant) {
      case 'story':
        return (
          <div className="relative">
            <BookOpen className={cn("animate-pulse text-purple-500", sizeClasses[size])} />
            <div className="absolute -top-1 -right-1">
              <Sparkles className="h-3 w-3 text-yellow-400 animate-ping" />
            </div>
          </div>
        )
      case 'magical':
        return (
          <div className="relative">
            <div className={cn(
              "animate-spin rounded-full border-2 border-transparent bg-gradient-to-r from-purple-500 to-cyan-500",
              sizeClasses[size]
            )}>
              <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-purple-500 to-cyan-500 animate-pulse" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white animate-bounce" />
            </div>
          </div>
        )
      default:
        return (
          <Loader2 className={cn(
            "animate-spin text-purple-500",
            sizeClasses[size]
          )} />
        )
    }
  }

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-2", className)}>
      {getSpinnerContent()}
      {text && (
        <p className="text-sm text-gray-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

// Full screen loading component
export function FullScreenLoading({ 
  text = 'Loading Hush...',
  variant = 'story'
}: { 
  text?: string
  variant?: 'default' | 'story' | 'magical'
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
          <span className="text-white font-bold text-2xl">H</span>
        </div>
        <LoadingSpinner size="lg" text={text} variant={variant} />
        <div className="space-y-2">
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="text-xs text-gray-400">Preparing your immersive experience...</p>
        </div>
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
        <LoadingSpinner size="md" text="Loading story..." variant="story" />
        <p className="text-xs text-gray-500 mt-4">
          Preparing your immersive experience
        </p>
      </div>
    </div>
  )
}

// Skeleton loading components
export function StoryCardSkeleton() {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl border border-white/10 animate-pulse">
      <div className="h-48 bg-gradient-to-br from-purple-900/20 to-cyan-900/20"></div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-white/10 rounded"></div>
        <div className="space-y-2">
          <div className="h-4 bg-white/10 rounded w-3/4"></div>
          <div className="h-4 bg-white/10 rounded w-1/2"></div>
        </div>
        <div className="flex space-x-2">
          <div className="h-6 bg-white/10 rounded-full w-16"></div>
          <div className="h-6 bg-white/10 rounded-full w-20"></div>
        </div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-white/10 rounded w-20"></div>
          <div className="h-4 bg-white/10 rounded w-16"></div>
        </div>
      </div>
    </div>
  )
}

export function StoryBlockSkeleton() {
  return (
    <div className="my-8 max-w-3xl mx-auto space-y-4 animate-pulse">
      <div className="h-8 bg-white/10 rounded w-3/4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-white/10 rounded"></div>
        <div className="h-4 bg-white/10 rounded w-5/6"></div>
        <div className="h-4 bg-white/10 rounded w-4/5"></div>
      </div>
    </div>
  )
}

// Progress loading component
export function ProgressLoader({ 
  progress, 
  text = "Loading...",
  className 
}: { 
  progress: number
  text?: string
  className?: string 
}) {
  return (
    <div className={cn("w-full space-y-3", className)}>
      <div className="flex justify-between items-center text-sm text-gray-400">
        <span>{text}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
