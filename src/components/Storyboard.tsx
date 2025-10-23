'use client'

import { useState, useEffect, useRef } from 'react'
import { Story, StoryBlock } from '@/lib/storyLoader'
import { saveReadingProgress, loadReadingProgress } from '@/lib/storage'
import StoryBlockRenderer from './StoryBlockRenderer'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Focus, Bookmark, Heart, Eye, Zap, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StoryboardProps {
  story: Story
}

export default function Storyboard({ story }: StoryboardProps) {
  const [currentBlock, setCurrentBlock] = useState(0)
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [reactions, setReactions] = useState<Record<string, number>>({})
  const containerRef = useRef<HTMLDivElement>(null)

  // Load saved progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      const progress = await loadReadingProgress(story.id)
      if (progress) {
        setCurrentBlock(progress.blockIndex)
        if (containerRef.current) {
          containerRef.current.scrollTop = progress.scroll
        }
      }
    }
    loadProgress()
  }, [story.id])

  // Save progress on block change
  useEffect(() => {
    const saveProgress = async () => {
      await saveReadingProgress({
        storyId: story.id,
        blockIndex: currentBlock,
        scroll: containerRef.current?.scrollTop || 0,
        timestamp: new Date().toISOString()
      })
    }
    saveProgress()
  }, [currentBlock, story.id])

  const handlePrevious = () => {
    if (currentBlock > 0) {
      setCurrentBlock(currentBlock - 1)
    }
  }

  const handleNext = () => {
    if (currentBlock < story.blocks.length - 1) {
      setCurrentBlock(currentBlock + 1)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrevious()
    } else if (e.key === 'ArrowRight') {
      handleNext()
    } else if (e.key === 'Escape') {
      setIsFocusMode(false)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [currentBlock])

  const toggleFocusMode = () => {
    setIsFocusMode(!isFocusMode)
  }

  const addReaction = (emoji: string) => {
    setReactions(prev => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1
    }))
  }

  const progressPercentage = ((currentBlock + 1) / story.blocks.length) * 100

  return (
    <div className={cn(
      "min-h-screen bg-background transition-all duration-300",
      isFocusMode && "focus-mode"
    )}>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 h-1 bg-muted">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Main Content */}
      <div 
        ref={containerRef}
        className="container mx-auto px-4 py-8 max-w-4xl"
      >
        {/* Story Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {story.title}
          </h1>
          <div className="flex items-center justify-center space-x-4 text-muted-foreground">
            <span>by {story.author}</span>
            <span>•</span>
            <span>{story.readingTime}</span>
            <span>•</span>
            <span>{story.categories.join(', ')}</span>
          </div>
        </div>

        {/* Current Block */}
        <div className="mb-8">
          <StoryBlockRenderer 
            block={story.blocks[currentBlock]} 
            index={currentBlock}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentBlock === 0}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              {currentBlock + 1} of {story.blocks.length}
            </span>
          </div>

          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentBlock === story.blocks.length - 1}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFocusMode}
            className="flex items-center space-x-2"
          >
            <Focus className="h-4 w-4" />
            <span>{isFocusMode ? 'Exit Focus' : 'Focus Mode'}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={cn(
              "flex items-center space-x-2",
              isBookmarked && "text-yellow-500"
            )}
          >
            <Bookmark className="h-4 w-4" />
            <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
          </Button>
        </div>

        {/* Reactions */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => addReaction('❤️')}
            className="flex items-center space-x-2"
          >
            <Heart className="h-4 w-4" />
            <span>{reactions['❤️'] || 0}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => addReaction('👁️')}
            className="flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>{reactions['👁️'] || 0}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => addReaction('😱')}
            className="flex items-center space-x-2"
          >
            <Zap className="h-4 w-4" />
            <span>{reactions['😱'] || 0}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => addReaction('💭')}
            className="flex items-center space-x-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{reactions['💭'] || 0}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
