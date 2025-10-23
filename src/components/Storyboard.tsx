'use client'

import { useState, useEffect, useRef } from 'react'
import { Story, StoryBlock } from '@/lib/storyLoader'
import { saveReadingProgress, loadReadingProgress } from '@/lib/storage'
import StoryBlockRenderer from './StoryBlockRenderer'
import ParticleBackground from './ParticleBackground'
import SearchBar from './SearchBar'
import ReactionButton from './ReactionButton'
import BookmarkButton from './BookmarkButton'
import FocusToggle from './FocusToggle'
import TextToSpeech, { useStoryTTS } from './TextToSpeech'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, X, Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StoryboardProps {
  story: Story
}

export default function Storyboard({ story }: StoryboardProps) {
  const [currentBlock, setCurrentBlock] = useState(0)
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [reactions, setReactions] = useState<Record<string, number>>({})
  const [isPlaying, setIsPlaying] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isTTSEnabled, setIsTTSEnabled] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(50) // ms per character
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const typingRef = useRef<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  
  // TTS hook
  const { isEnabled: ttsEnabled, toggleTTS, setCurrentBlockTTS } = useStoryTTS(story.id)

  // Typing sound effect
  const playTypingSound = () => {
    if (audioContextRef.current) {
      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)
      
      oscillator.frequency.setValueAtTime(800 + Math.random() * 400, audioContextRef.current.currentTime)
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1)
      
      oscillator.start()
      oscillator.stop(audioContextRef.current.currentTime + 0.1)
    }
  }

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }, [])

  // Auto-scroll to current block
  useEffect(() => {
    if (containerRef.current) {
      const currentBlockElement = containerRef.current.querySelector(`[data-block-index="${currentBlock}"]`)
      if (currentBlockElement) {
        currentBlockElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
      }
    }
  }, [currentBlock])

  useEffect(() => {
    // Load reading progress
    const loadProgress = async () => {
      const progress = await loadReadingProgress(story.id)
      if (progress) {
        setCurrentBlock(progress.blockIndex)
      }
    }
    loadProgress()
  }, [story.id])

  useEffect(() => {
    // Save reading progress
    const saveProgress = async () => {
      await saveReadingProgress({
        storyId: story.id,
        blockIndex: currentBlock,
        scroll: 0,
        timestamp: new Date().toISOString()
      })
    }
    saveProgress()
  }, [story.id, currentBlock])

  useEffect(() => {
    // Auto-hide controls
    let hideTimeout: NodeJS.Timeout
    const resetTimeout = () => {
      clearTimeout(hideTimeout)
      setShowControls(true)
      hideTimeout = setTimeout(() => setShowControls(false), 3000)
    }

    resetTimeout()
    return () => clearTimeout(hideTimeout)
  }, [currentBlock])

  useEffect(() => {
    // Enhanced auto-play functionality with intelligent timing
    if (isPlaying) {
      const getBlockReadTime = (block: StoryBlock): number => {
        // Calculate reading time based on block type and content
        switch (block.type) {
          case 'heading':
          case 'subheading':
            return 2000 // 2 seconds for headings
          case 'paragraph':
            const wordCount = block.text?.split(' ').length || 0
            return Math.max(3000, wordCount * 200) // 200ms per word, min 3s
          case 'image':
            return 4000 // 4 seconds for images
          case 'video':
            return 10000 // 10 seconds for videos (user can pause)
          case 'mermaid':
          case 'reactflow':
            return 6000 // 6 seconds for diagrams
          case 'three-scene':
            return 8000 // 8 seconds for 3D scenes
          case 'quote':
            return 5000 // 5 seconds for quotes
          case 'code':
            return 4000 // 4 seconds for code
          default:
            return 3000 // Default 3 seconds
        }
      }

      const scheduleNextBlock = () => {
        if (currentBlock < story.blocks.length - 1) {
          const nextBlock = story.blocks[currentBlock + 1]
          const readTime = getBlockReadTime(nextBlock)
          
          autoPlayRef.current = setTimeout(() => {
            setCurrentBlock(prev => prev + 1)
            scheduleNextBlock() // Schedule the next block
          }, readTime)
        } else {
          // Story finished
          setIsPlaying(false)
        }
      }

      scheduleNextBlock()
    } else {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current)
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current)
      }
    }
  }, [isPlaying, currentBlock, story.blocks])

  const navigateBlocks = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentBlock < story.blocks.length - 1) {
      setCurrentBlock(currentBlock + 1)
    } else if (direction === 'prev' && currentBlock > 0) {
      setCurrentBlock(currentBlock - 1)
    }
  }

  const toggleFocusMode = () => {
    setIsFocusMode(!isFocusMode)
  }

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault()
        navigateBlocks('next')
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        navigateBlocks('prev')
      } else if (event.key === 'f' || event.key === 'F') {
        event.preventDefault()
        toggleFocusMode()
      } else if (event.key === 'p' || event.key === 'P') {
        event.preventDefault()
        toggleAutoPlay()
      } else if (event.key === 't' || event.key === 'T') {
        event.preventDefault()
        toggleTTS()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentBlock, story.blocks.length])

  // Touch gesture handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      navigateBlocks('next')
    } else if (isRightSwipe) {
      navigateBlocks('prev')
    }
  }

  const progressPercentage = ((currentBlock + 1) / story.blocks.length) * 100

  // Helper function to extract text from blocks for TTS
  const getBlockText = (block: StoryBlock): string => {
    switch (block.type) {
      case 'heading':
      case 'subheading':
      case 'paragraph':
      case 'quote':
        return block.text || ''
      case 'code':
        return block.code || ''
      case 'image':
      case 'video':
      case 'embed':
        return block.caption || ''
      case 'mermaid':
      case 'reactflow':
      case 'three-scene':
        return block.caption || ''
      default:
        return ''
    }
  }

  return (
    <div 
      className={cn(
        "relative min-h-screen bg-black text-white overflow-hidden",
        isFocusMode ? "overflow-hidden" : ""
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black to-cyan-900/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/30 to-black"></div>
      
      {/* Animated Particles */}
      <ParticleBackground count={20} opacity={0.1} />

          {/* Enhanced Top Navigation with Better Controls */}
          {!isFocusMode && (
            <div className={cn(
              "fixed top-0 left-0 right-0 z-50 p-4 bg-black/90 backdrop-blur-md border-b border-white/20 transition-all duration-300",
              showControls ? "translate-y-0" : "-translate-y-full"
            )}>
              <div className="container mx-auto flex justify-between items-center">
                <Button variant="ghost" size="icon" onClick={() => window.history.back()} className="text-white hover:bg-white/10">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-bold text-white truncate max-w-md">{story.title}</h1>
                <div className="flex items-center space-x-1">
                  {/* Auto-play Control */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleAutoPlay} 
                    className={cn(
                      "text-white hover:bg-white/10 transition-all duration-300",
                      isPlaying ? "bg-purple-500/20 text-purple-300" : "text-white/80"
                    )}
                    title={isPlaying ? "Pause auto-play" : "Start auto-play"}
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  
                  {/* TTS Control */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTTS}
                    className={cn(
                      "text-white hover:bg-white/10 transition-all duration-300",
                      ttsEnabled ? "bg-cyan-500/20 text-cyan-300" : "text-white/80"
                    )}
                    aria-label={ttsEnabled ? 'Disable text-to-speech' : 'Enable text-to-speech'}
                    title={ttsEnabled ? "Disable TTS" : "Enable TTS"}
                  >
                    {ttsEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  </Button>
                  
                  {/* Typing Speed Control (only when TTS is off) */}
                  {!ttsEnabled && (
                    <div className="flex items-center space-x-1 bg-white/5 rounded-lg px-2 py-1">
                      <span className="text-xs text-white/60">Speed:</span>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={typingSpeed}
                        onChange={(e) => setTypingSpeed(parseInt(e.target.value))}
                        className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                        title="Typing speed"
                      />
                    </div>
                  )}
                  
                  <FocusToggle
                    isFocusMode={isFocusMode}
                    onToggle={setIsFocusMode}
                    size="sm"
                  />
                  <BookmarkButton
                    story={{
                      id: story.id,
                      title: story.title,
                      slug: story.id,
                      coverImage: story.coverImage,
                      author: story.author,
                      readingTime: story.readingTime
                    }}
                    size="sm"
                  />
                  <ReactionButton
                    storyId={story.id}
                    reactionType="liked"
                    size="sm"
                    showCount={false}
                  />
                </div>
              </div>
            </div>
          )}

      {/* Auto-play Indicator */}
      {isPlaying && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-purple-500/10 border border-purple-500/20 rounded-lg px-4 py-2 backdrop-blur-sm">
          <div className="flex items-center space-x-2 text-purple-300">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Auto-playing</span>
            <span className="text-xs text-purple-400">
              {Math.ceil((story.blocks.length - currentBlock - 1) * 3)}s remaining
            </span>
          </div>
        </div>
      )}

      {/* Story Content */}
      <div className={cn(
        "container mx-auto py-16 px-4",
        isFocusMode ? "pt-4 pb-4" : "pt-24 pb-24"
      )}>
        <div className="max-w-4xl mx-auto">
          {story.blocks.map((block, index) => (
            <div
              key={index}
              className={cn(
                "story-block transition-all duration-1000 ease-out",
                index === currentBlock 
                  ? "opacity-100 transform translate-y-0 scale-100" 
                  : index < currentBlock 
                    ? "opacity-30 transform -translate-y-4 scale-95" 
                    : "opacity-0 transform translate-y-8 scale-95"
              )}
            >
                  <StoryBlockRenderer 
                    block={block} 
                    enableTyping={!ttsEnabled && isPlaying}
                    typingSpeed={typingSpeed}
                    onTypingCharacter={playTypingSound}
                  />
              
              {/* TTS for current block */}
              {index === currentBlock && ttsEnabled && (
                <div className="mt-4 flex justify-center">
                  <TextToSpeech
                    text={getBlockText(block)}
                    storyId={story.id}
                    blockIndex={index}
                    autoPlay={isPlaying}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Controls */}
      {!isFocusMode && (
        <div className={cn(
          "fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/80 backdrop-blur-sm border-t border-white/10 transition-all duration-300",
          showControls ? "translate-y-0" : "translate-y-full"
        )}>
          <div className="container mx-auto">
            {/* Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-2 mb-4">
              <div
                ref={progressRef}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            {/* Navigation Controls */}
            <div className="flex justify-between items-center">
              <Button 
                variant="ghost" 
                onClick={() => navigateBlocks('prev')} 
                disabled={currentBlock === 0}
                className="text-white hover:bg-white/10 disabled:opacity-50"
              >
                <ArrowLeft className="h-5 w-5 mr-2" /> Previous
              </Button>
              
              <div className="text-center">
                <div className="text-sm text-white/70 mb-1">
                  {currentBlock + 1} of {story.blocks.length}
                </div>
                <div className="text-xs text-white/50">
                  {Math.round(progressPercentage)}% complete
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                onClick={() => navigateBlocks('next')} 
                disabled={currentBlock === story.blocks.length - 1}
                className="text-white hover:bg-white/10 disabled:opacity-50"
              >
                Next <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Focus Mode Exit */}
      {isFocusMode && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button 
            variant="secondary" 
            size="icon" 
            onClick={toggleFocusMode}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Keyboard Shortcuts Hint */}
      {!isFocusMode && showControls && (
        <div className="fixed bottom-20 right-4 z-40 bg-black/80 backdrop-blur-sm border border-white/10 rounded-lg p-3 text-xs text-white/70">
          <div className="space-y-1">
            <div>← → Navigate</div>
            <div>Space Next</div>
            <div>F Focus Mode</div>
            <div>P Auto-play</div>
            <div>T Text-to-Speech</div>
          </div>
        </div>
      )}
    </div>
  )
}