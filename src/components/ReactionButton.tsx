'use client'

import { useState, useEffect } from 'react'
import { Heart, Eye, Zap, MessageCircle, Smile } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getReactionsFor, setReaction } from '@/lib/storage'

interface ReactionButtonProps {
  storyId: string
  reactionType: 'liked' | 'viewed' | 'shocked' | 'thoughtful'
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
}

const reactionConfig = {
  liked: {
    icon: Heart,
    label: 'Like',
    emoji: '❤️',
    color: 'text-red-500',
    hoverColor: 'hover:text-red-400',
    activeColor: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20'
  },
  viewed: {
    icon: Eye,
    label: 'View',
    emoji: '👁️',
    color: 'text-blue-500',
    hoverColor: 'hover:text-blue-400',
    activeColor: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20'
  },
  shocked: {
    icon: Zap,
    label: 'Shocked',
    emoji: '😱',
    color: 'text-yellow-500',
    hoverColor: 'hover:text-yellow-400',
    activeColor: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20'
  },
  thoughtful: {
    icon: MessageCircle,
    label: 'Thoughtful',
    emoji: '💭',
    color: 'text-purple-500',
    hoverColor: 'hover:text-purple-400',
    activeColor: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20'
  }
}

export default function ReactionButton({ 
  storyId, 
  reactionType, 
  className, 
  size = 'md',
  showCount = true 
}: ReactionButtonProps) {
  const [isActive, setIsActive] = useState(false)
  const [count, setCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [reactions, setReactions] = useState<Record<string, number>>({})

  const config = reactionConfig[reactionType]
  const Icon = config.icon

  // Load reactions on mount
  useEffect(() => {
    const loadReactions = async () => {
      try {
        const storyReactions = await getReactionsFor(storyId)
        if (storyReactions) {
          setReactions(storyReactions.reactions || {})
          setCount(storyReactions.reactions?.[reactionType] || 0)
          setIsActive(reactionType === 'liked' ? storyReactions.liked : false)
        }
      } catch (error) {
        console.error('Failed to load reactions:', error)
      }
    }

    loadReactions()
  }, [storyId, reactionType])

  // Handle reaction toggle
  const handleReaction = async () => {
    if (isAnimating) return

    setIsAnimating(true)
    const newActive = !isActive
    const newCount = newActive ? count + 1 : Math.max(0, count - 1)

    // Optimistic update
    setIsActive(newActive)
    setCount(newCount)
    setReactions(prev => ({
      ...prev,
      [reactionType]: newCount
    }))

    try {
      await setReaction(storyId, {
        liked: reactionType === 'liked' ? newActive : false,
        reactions: {
          ...reactions,
          [reactionType]: newCount
        }
      })
    } catch (error) {
      console.error('Failed to save reaction:', error)
      // Revert optimistic update
      setIsActive(!newActive)
      setCount(count)
      setReactions(prev => ({
        ...prev,
        [reactionType]: count
      }))
    } finally {
      setIsAnimating(false)
    }
  }

  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleReaction}
        disabled={isAnimating}
        className={cn(
          "relative transition-all duration-300 group",
          sizeClasses[size],
          isActive 
            ? `${config.activeColor} ${config.bgColor} ${config.borderColor} border` 
            : `text-white/60 ${config.hoverColor} hover:bg-white/5`,
          isAnimating && "animate-pulse"
        )}
        aria-label={`${isActive ? 'Remove' : 'Add'} ${config.label} reaction`}
      >
        <Icon className={cn(iconSizes[size], "transition-transform duration-200", isActive && "scale-110")} />
        
        {/* Animation overlay */}
        {isAnimating && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={cn(
              "w-2 h-2 rounded-full animate-ping",
              config.bgColor.replace('/10', '/30')
            )} />
          </div>
        )}
      </Button>

      {showCount && count > 0 && (
        <span className={cn(
          "text-sm font-medium transition-colors duration-200",
          isActive ? config.activeColor : "text-white/60"
        )}>
          {count}
        </span>
      )}

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {isActive ? `Remove ${config.label}` : `Add ${config.label}`}
      </div>
    </div>
  )
}

// Quick reaction buttons component
interface QuickReactionsProps {
  storyId: string
  className?: string
  showLabels?: boolean
}

export function QuickReactions({ storyId, className, showLabels = false }: QuickReactionsProps) {
  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <ReactionButton 
        storyId={storyId} 
        reactionType="liked" 
        size="sm" 
        showCount={false}
      />
      <ReactionButton 
        storyId={storyId} 
        reactionType="viewed" 
        size="sm" 
        showCount={false}
      />
      <ReactionButton 
        storyId={storyId} 
        reactionType="shocked" 
        size="sm" 
        showCount={false}
      />
      <ReactionButton 
        storyId={storyId} 
        reactionType="thoughtful" 
        size="sm" 
        showCount={false}
      />
    </div>
  )
}
