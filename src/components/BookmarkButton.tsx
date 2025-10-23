'use client'

import { useState, useEffect } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getBookmarks, addBookmark, removeBookmark } from '@/lib/storage'

interface BookmarkButtonProps {
  story: {
    id: string
    title: string
    slug: string
    coverImage: string
    author: string
    readingTime: string
  }
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  variant?: 'default' | 'outline' | 'ghost'
}

export default function BookmarkButton({ 
  story, 
  className, 
  size = 'md',
  showLabel = false,
  variant = 'ghost'
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Check if story is bookmarked on mount
  useEffect(() => {
    const checkBookmark = async () => {
      try {
        const bookmarks = await getBookmarks()
        const isBooked = bookmarks.some(bookmark => bookmark.storyId === story.id)
        setIsBookmarked(isBooked)
      } catch (error) {
        console.error('Failed to check bookmark status:', error)
      }
    }

    checkBookmark()
  }, [story.id])

  // Handle bookmark toggle
  const handleBookmark = async () => {
    if (isLoading || isAnimating) return

    setIsLoading(true)
    setIsAnimating(true)

    try {
      if (isBookmarked) {
        await removeBookmark(story.id)
        setIsBookmarked(false)
      } else {
        await addBookmark({
          id: story.id,
          title: story.title,
          coverImage: story.coverImage
        })
        setIsBookmarked(true)
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error)
    } finally {
      setIsLoading(false)
      // Keep animation for a bit longer for visual feedback
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

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
      onClick={handleBookmark}
      disabled={isLoading}
      className={cn(
        "relative transition-all duration-300 group",
        sizeClasses[size],
        isBookmarked 
          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20" 
          : "text-white/60 hover:text-white hover:bg-white/5",
        isAnimating && "animate-pulse",
        className
      )}
      aria-label={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
    >
      <div className="flex items-center space-x-2">
        {isBookmarked ? (
          <BookmarkCheck className={cn(iconSizes[size], "transition-transform duration-200", isAnimating && "scale-110")} />
        ) : (
          <Bookmark className={cn(iconSizes[size], "transition-transform duration-200", isAnimating && "scale-110")} />
        )}
        
        {showLabel && (
          <span className="font-medium">
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </span>
        )}
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
        </div>
      )}

      {/* Success animation */}
      {isAnimating && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
        </div>
      )}

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
      </div>
    </Button>
  )
}

// Bookmark status indicator (just shows if bookmarked)
interface BookmarkStatusProps {
  storyId: string
  className?: string
}

export function BookmarkStatus({ storyId, className }: BookmarkStatusProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    const checkBookmark = async () => {
      try {
        const bookmarks = await getBookmarks()
        const isBooked = bookmarks.some(bookmark => bookmark.storyId === storyId)
        setIsBookmarked(isBooked)
      } catch (error) {
        console.error('Failed to check bookmark status:', error)
      }
    }

    checkBookmark()
  }, [storyId])

  if (!isBookmarked) return null

  return (
    <div className={cn("flex items-center space-x-1 text-yellow-400", className)}>
      <BookmarkCheck className="h-4 w-4" />
      <span className="text-xs font-medium">Bookmarked</span>
    </div>
  )
}
