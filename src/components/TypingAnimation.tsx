'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface TypingAnimationProps {
  text: string
  speed?: number
  onComplete?: () => void
  onCharacter?: () => void
  className?: string
  showCursor?: boolean
}

export default function TypingAnimation({ 
  text, 
  speed = 50, 
  onComplete, 
  onCharacter,
  className,
  showCursor = true 
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (currentIndex < text.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
        onCharacter?.()
      }, speed)
    } else if (currentIndex === text.length && !isComplete) {
      setIsComplete(true)
      onComplete?.()
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [currentIndex, text, speed, onComplete, onCharacter, isComplete])

  // Reset when text changes
  useEffect(() => {
    setDisplayedText('')
    setCurrentIndex(0)
    setIsComplete(false)
  }, [text])

  return (
    <span className={cn("inline-block", className)}>
      {displayedText}
      {showCursor && (
        <span 
          className={cn(
            "inline-block w-0.5 h-5 bg-white ml-1 animate-pulse",
            isComplete && "hidden"
          )}
        />
      )}
    </span>
  )
}
