'use client'

import { useState, useEffect } from 'react'
import { Focus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FocusToggleProps {
  isFocusMode: boolean
  onToggle: (isFocus: boolean) => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  variant?: 'default' | 'outline' | 'ghost'
}

export default function FocusToggle({ 
  isFocusMode, 
  onToggle, 
  className, 
  size = 'md',
  showLabel = false,
  variant = 'ghost'
}: FocusToggleProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  // Handle focus toggle
  const handleToggle = () => {
    setIsAnimating(true)
    onToggle(!isFocusMode)
    
    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 300)
  }

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'f' || event.key === 'F') {
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault()
          handleToggle()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFocusMode])

  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  return (
    <Button
      variant={variant}
      onClick={handleToggle}
      className={cn(
        "relative transition-all duration-300 group",
        sizeClasses[size],
        isFocusMode 
          ? "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20" 
          : "text-white/60 hover:text-white hover:bg-white/5",
        isAnimating && "animate-pulse",
        className
      )}
      aria-label={isFocusMode ? 'Exit focus mode' : 'Enter focus mode'}
    >
      <div className="flex items-center space-x-2">
        {isFocusMode ? (
          <X className={cn(iconSizes[size], "transition-transform duration-200", isAnimating && "scale-110")} />
        ) : (
          <Focus className={cn(iconSizes[size], "transition-transform duration-200", isAnimating && "scale-110")} />
        )}
        
        {showLabel && (
          <span className="font-medium">
            {isFocusMode ? 'Exit Focus' : 'Focus Mode'}
          </span>
        )}
      </div>

      {/* Animation overlay */}
      {isAnimating && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping" />
        </div>
      )}

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {isFocusMode ? 'Exit focus mode (Ctrl+F)' : 'Enter focus mode (Ctrl+F)'}
      </div>
    </Button>
  )
}

// Focus mode indicator (shows when in focus mode)
interface FocusIndicatorProps {
  isFocusMode: boolean
  className?: string
}

export function FocusIndicator({ isFocusMode, className }: FocusIndicatorProps) {
  if (!isFocusMode) return null

  return (
    <div className={cn(
      "fixed top-4 right-4 z-50 flex items-center space-x-2 px-3 py-2 bg-purple-500/10 border border-purple-500/20 rounded-lg backdrop-blur-sm",
      className
    )}>
      <Focus className="h-4 w-4 text-purple-400" />
      <span className="text-sm font-medium text-purple-300">Focus Mode</span>
      <div className="text-xs text-purple-400/60">Press Ctrl+F to exit</div>
    </div>
  )
}

// Focus mode overlay (darkens background when in focus)
interface FocusOverlayProps {
  isFocusMode: boolean
  children: React.ReactNode
  className?: string
}

export function FocusOverlay({ isFocusMode, children, className }: FocusOverlayProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isFocusMode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 pointer-events-none" />
      )}
    </div>
  )
}
