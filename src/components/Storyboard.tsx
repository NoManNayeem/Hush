'use client'

import { useState, useEffect, useRef } from 'react'
import { Story, StoryBlock } from '@/lib/storyLoader'
import { saveReadingProgress, loadReadingProgress } from '@/lib/storage'
import StoryBlockRenderer from './StoryBlockRenderer'
import ParticleBackground from './ParticleBackground'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, Eye, EyeOff, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StoryboardProps {
  story: Story
}

export default function Storyboard({ story }: StoryboardProps) {
  const [currentBlock, setCurrentBlock] = useState(0)
  const [isTheaterMode, setIsTheaterMode] = useState(true)
  const [isAutoplay, setIsAutoplay] = useState(false)
  const [autoplaySpeed, setAutoplaySpeed] = useState<'slow' | 'normal' | 'fast'>('normal')
  const [showControls, setShowControls] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null)
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [userInteracted, setUserInteracted] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Soft background music from web
  useEffect(() => {
    if (audioEnabled && isTheaterMode && userInteracted) {
      // Use a very soft, ambient sound from a reliable source
      const audio = new Audio('https://www.soundjay.com/misc/sounds/ambient-forest.mp3')
      audio.loop = true
      audio.volume = 0.03 // Very soft volume (3%)
      audio.crossOrigin = 'anonymous'
      
      // Add error handling for CORS issues
      audio.addEventListener('error', () => {
        // Fallback to a different source if the first one fails
        const fallbackAudio = new Audio('https://www.bensound.com/bensound-music/bensound-softbackground.mp3')
        fallbackAudio.loop = true
        fallbackAudio.volume = 0.03
        fallbackAudio.crossOrigin = 'anonymous'
        
        fallbackAudio.play().catch(() => {
          console.log('Background audio requires user interaction')
        })
        
        setBackgroundMusic(fallbackAudio)
      })
      
      // Try to play, but don't force it
      audio.play().catch(() => {
        // Audio autoplay blocked, user needs to interact first
        console.log('Background audio requires user interaction')
      })
      
      setBackgroundMusic(audio)
    } else if (backgroundMusic) {
      backgroundMusic.pause()
      setBackgroundMusic(null)
    }

    return () => {
      if (backgroundMusic) {
        backgroundMusic.pause()
      }
    }
  }, [audioEnabled, isTheaterMode, userInteracted])

  // Auto-hide controls in theater mode
  useEffect(() => {
    if (isTheaterMode) {
      const resetControls = () => {
        setShowControls(true)
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current)
        }
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false)
        }, 3000)
      }

      const handleMouseMove = () => resetControls()
      const handleKeyPress = () => resetControls()

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('keydown', handleKeyPress)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('keydown', handleKeyPress)
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current)
        }
      }
    }
  }, [isTheaterMode])

  // Load reading progress
  useEffect(() => {
    const loadProgress = async () => {
      const progress = await loadReadingProgress(story.id)
      if (progress) {
        setCurrentBlock(progress.blockIndex)
      }
    }
    loadProgress()
  }, [story.id])

  // Save reading progress
  useEffect(() => {
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

  // Enhanced Autoplay functionality
  useEffect(() => {
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current)
    }

    if (isAutoplay && currentBlock < story.blocks.length - 1 && !isTransitioning) {
      const speeds = {
        slow: 8000,
        normal: 5000,
        fast: 3000
      }

      // Calculate reading time based on content
      const currentBlockData = story.blocks[currentBlock]
      let baseTime = speeds[autoplaySpeed]
      
      if (currentBlockData) {
        // Adjust timing based on content type
        switch (currentBlockData.type) {
          case 'heading':
            baseTime = Math.max(baseTime, 3000)
            break
          case 'paragraph':
            const text = (currentBlockData as any).text || ''
            const wordCount = text.split(' ').length
            baseTime = Math.max(baseTime, wordCount * 200) // 200ms per word
            break
          case 'image':
          case 'video':
            baseTime = Math.max(baseTime, 6000)
            break
          case 'quote':
            baseTime = Math.max(baseTime, 4000)
            break
        }
      }

      autoplayRef.current = setTimeout(() => {
        if (isAutoplay && currentBlock < story.blocks.length - 1) {
          nextBlock()
        } else {
          setIsAutoplay(false) // Stop autoplay when story ends
        }
      }, baseTime)
    }

    return () => {
      if (autoplayRef.current) {
        clearTimeout(autoplayRef.current)
      }
    }
  }, [isAutoplay, currentBlock, autoplaySpeed, story.blocks.length, isTransitioning])

  const nextBlock = () => {
    if (currentBlock < story.blocks.length - 1 && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentBlock(currentBlock + 1)
        setIsTransitioning(false)
      }, 300)
    }
  }

  const prevBlock = () => {
    if (currentBlock > 0 && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentBlock(currentBlock - 1)
        setIsTransitioning(false)
      }, 300)
    }
  }

  const toggleAutoplay = () => {
    setIsAutoplay(!isAutoplay)
  }

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled)
  }

  const toggleTheaterMode = () => {
    setIsTheaterMode(!isTheaterMode)
  }

  const toggleFocusMode = () => {
    setIsFocusMode(!isFocusMode)
    if (!isFocusMode) {
      setIsAutoplay(false) // Stop autoplay when entering focus mode
    }
  }

  // Handle user interaction to start background music
  const handleUserInteraction = () => {
    if (!userInteracted) {
      setUserInteracted(true)
    }
  }

  // Touch handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0]?.clientX || 0)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0]?.clientX || 0)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextBlock()
    } else if (isRightSwipe) {
      prevBlock()
    }
  }

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault()
        nextBlock()
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        prevBlock()
      } else if (event.key === 'a' || event.key === 'A') {
        event.preventDefault()
        toggleAutoplay()
      } else if (event.key === 'm' || event.key === 'M') {
        event.preventDefault()
        toggleAudio()
      } else if (event.key === 't' || event.key === 'T') {
        event.preventDefault()
        toggleTheaterMode()
      } else if (event.key === 'f' || event.key === 'F') {
        event.preventDefault()
        toggleFocusMode()
      } else if (event.key === 'Escape') {
        event.preventDefault()
        if (isFocusMode) {
          setIsFocusMode(false)
        } else {
          window.history.back()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentBlock, isAutoplay, audioEnabled, isTheaterMode, isFocusMode])

  const progressPercentage = ((currentBlock + 1) / story.blocks.length) * 100

  return (
        <div 
          className={cn(
            "fixed inset-0 bg-black text-white overflow-hidden my-12",
            isTheaterMode ? "theater-mode" : "standard-mode",
            isFocusMode && "focus-mode"
          )}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={handleUserInteraction}
          onKeyDown={handleUserInteraction}
        >
      {/* Theater Background */}
      {isTheaterMode && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.8)_100%)]"></div>
          <ParticleBackground count={15} opacity={0.1} />
        </>
      )}

      {/* Story Content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <div 
          ref={containerRef}
          className={cn(
            "w-full max-w-5xl mx-auto px-8",
            isTheaterMode && "theater-content"
          )}
        >
          {/* Current Story Block */}
          <div className={cn(
            "transition-all duration-500 ease-in-out",
            isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
          )}>
            {story.blocks[currentBlock] && (
              <StoryBlockRenderer 
                block={story.blocks[currentBlock]} 
                enableTyping={true}
                typingSpeed={50}
              />
            )}
          </div>
        </div>
      </div>

          {/* Theater Controls */}
      {isTheaterMode && !isFocusMode && (
        <>
          {/* Top Progress Bar */}
          <div className={cn(
            "fixed top-0 left-0 right-0 h-1 bg-white/10 transition-all duration-300 z-50",
            showControls ? "opacity-100" : "opacity-0"
          )}>
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Block Counter */}
          <div className={cn(
            "fixed top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 text-sm transition-all duration-300 z-50",
            showControls ? "opacity-100" : "opacity-0"
          )}>
            {currentBlock + 1} / {story.blocks.length}
          </div>

          {/* Autoplay Indicator */}
          {isAutoplay && (
            <div className="fixed top-4 left-4 bg-purple-500/20 backdrop-blur-sm rounded-lg px-3 py-1 text-sm text-purple-300 z-50">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>Auto {autoplaySpeed}</span>
              </div>
            </div>
          )}

          {/* Background Music Indicator */}
          {audioEnabled && isTheaterMode && userInteracted && (
            <div className="fixed top-16 left-4 bg-green-500/20 backdrop-blur-sm rounded-lg px-3 py-1 text-sm text-green-300 z-50">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Ambient</span>
              </div>
            </div>
          )}

          {/* Navigation Arrows */}
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute left-8 top-1/2 -translate-y-1/2 pointer-events-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevBlock}
                disabled={currentBlock === 0 || isTransitioning}
                className={cn(
                  "w-14 h-14 bg-black/50 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 transition-all duration-300",
                  showControls ? "opacity-100" : "opacity-0"
                )}
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </div>

            <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={nextBlock}
                disabled={currentBlock === story.blocks.length - 1 || isTransitioning}
                className={cn(
                  "w-14 h-14 bg-black/50 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 transition-all duration-300",
                  showControls ? "opacity-100" : "opacity-0"
                )}
              >
                <ArrowRight className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Mobile-Optimized Bottom Control Bar */}
          <div className={cn(
            "fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 transition-all duration-300 z-50",
            showControls ? "translate-y-0" : "translate-y-full"
          )}>
            <div className={cn(
              "container mx-auto px-4 py-3",
              isMobile ? "px-2 py-2" : "px-6 py-4"
            )}>
              <div className={cn(
                "flex items-center justify-between",
                isMobile ? "flex-col space-y-2" : "flex-row"
              )}>
                {/* Mobile: Stack controls vertically */}
                {isMobile ? (
                  <>
                    {/* Top Row - Main Controls */}
                    <div className="flex items-center justify-center space-x-6 w-full">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={prevBlock}
                        disabled={currentBlock === 0 || isTransitioning}
                        className="w-12 h-12 text-white hover:bg-white/20 disabled:opacity-50"
                        title="Previous"
                      >
                        <SkipBack className="h-6 w-6" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleAutoplay}
                        className={cn(
                          "w-14 h-14 text-white hover:bg-white/20 rounded-full",
                          isAutoplay && "text-purple-400 bg-purple-500/20"
                        )}
                        title="Toggle Autoplay"
                      >
                        {isAutoplay ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7" />}
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={nextBlock}
                        disabled={currentBlock === story.blocks.length - 1 || isTransitioning}
                        className="w-12 h-12 text-white hover:bg-white/20 disabled:opacity-50"
                        title="Next"
                      >
                        <SkipForward className="h-6 w-6" />
                      </Button>
                    </div>

                    {/* Bottom Row - Settings */}
                    <div className="flex items-center justify-center space-x-4 w-full">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleFocusMode}
                        className={cn(
                          "w-10 h-10 text-white hover:bg-white/20",
                          isFocusMode && "text-blue-400 bg-blue-500/20"
                        )}
                        title="Focus Mode"
                      >
                        <Eye className="h-5 w-5" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleAudio}
                        className={cn(
                          "w-10 h-10 text-white hover:bg-white/20",
                          audioEnabled && "text-green-400"
                        )}
                        title="Toggle Audio"
                      >
                        {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheaterMode}
                        className="w-10 h-10 text-white hover:bg-white/20"
                        title="Exit Theater Mode"
                      >
                        <EyeOff className="h-5 w-5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.history.back()}
                        className="w-10 h-10 text-white hover:bg-white/20"
                        title="Back to Stories"
                      >
                        <Home className="h-5 w-5" />
                      </Button>
                    </div>
                  </>
                ) : (
                  /* Desktop: Horizontal layout */
                  <>
                    {/* Left Controls */}
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleFocusMode}
                        className={cn(
                          "w-10 h-10 text-white hover:bg-white/20",
                          isFocusMode && "text-blue-400 bg-blue-500/20"
                        )}
                        title="Focus Mode"
                      >
                        <Eye className="h-5 w-5" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleAudio}
                        className={cn(
                          "w-10 h-10 text-white hover:bg-white/20",
                          audioEnabled && "text-green-400"
                        )}
                        title="Toggle Audio"
                      >
                        {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                      </Button>
                    </div>

                    {/* Center Controls */}
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={prevBlock}
                        disabled={currentBlock === 0 || isTransitioning}
                        className="w-10 h-10 text-white hover:bg-white/20 disabled:opacity-50"
                        title="Previous"
                      >
                        <SkipBack className="h-5 w-5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleAutoplay}
                        className={cn(
                          "w-12 h-12 text-white hover:bg-white/20",
                          isAutoplay && "text-purple-400 bg-purple-500/20"
                        )}
                        title="Toggle Autoplay"
                      >
                        {isAutoplay ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={nextBlock}
                        disabled={currentBlock === story.blocks.length - 1 || isTransitioning}
                        className="w-10 h-10 text-white hover:bg-white/20 disabled:opacity-50"
                        title="Next"
                      >
                        <SkipForward className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheaterMode}
                        className="w-10 h-10 text-white hover:bg-white/20"
                        title="Exit Theater Mode"
                      >
                        <EyeOff className="h-5 w-5" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.history.back()}
                        className="w-10 h-10 text-white hover:bg-white/20"
                        title="Back to Stories"
                      >
                        <Home className="h-5 w-5" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className={cn(
            "fixed bottom-20 right-4 bg-black/80 backdrop-blur-sm border border-white/10 rounded-lg p-3 text-xs text-white/70 transition-all duration-300 z-40",
            showControls && !isMobile ? "opacity-100" : "opacity-0"
          )}>
            <div className="space-y-1">
              <div>← → Navigate</div>
              <div>Space Next</div>
              <div>A Autoplay</div>
              <div>M Audio</div>
              <div>F Focus</div>
              <div>T Theater</div>
              <div>Esc Back</div>
            </div>
          </div>
        </>
      )}

      {/* Focus Mode UI */}
      {isFocusMode && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center max-w-2xl mx-auto px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Focus Mode</h2>
              <p className="text-white/70 text-lg">
                Immersive reading experience with minimal distractions
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="text-white/60">
                <p className="mb-2">Navigation:</p>
                <p className="text-sm">← → Arrow keys or swipe on mobile</p>
                <p className="text-sm">Space bar for next block</p>
              </div>
              
              <div className="text-white/60">
                <p className="mb-2">Controls:</p>
                <p className="text-sm">Press F or click the eye icon to exit focus mode</p>
                <p className="text-sm">Press Esc to go back to stories</p>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center space-x-4">
              <Button
                onClick={toggleFocusMode}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
              >
                Exit Focus Mode
              </Button>
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Back to Stories
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Standard Mode (Non-Theater) */}
      {!isTheaterMode && (
        <div className="relative z-10 min-h-screen bg-cinematic-bg flex flex-col">
          {/* Standard Navigation */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-cinematic-surface/90 backdrop-blur-xl border-b border-cinematic-border/50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="text-cinematic-text hover:text-cinematic-accent"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Stories
              </Button>
              
              <h1 className="text-lg font-bold text-cinematic-text truncate max-w-md">
                {story.title}
              </h1>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheaterMode}
                  className="text-cinematic-text hover:text-cinematic-accent"
                  title="Enter Theater Mode"
                >
                  <Eye className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Standard Content - Main Content Area */}
          <main className="flex-1 pt-20 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="space-y-8">
                {story.blocks.map((block, index) => (
                  <div
                    key={index}
                    className={cn(
                      "transition-all duration-500",
                      index === currentBlock 
                        ? "opacity-100 transform translate-y-0" 
                        : index < currentBlock 
                          ? "opacity-30 transform -translate-y-4" 
                          : "opacity-0 transform translate-y-8"
                    )}
                  >
                    <StoryBlockRenderer 
                      block={block} 
                      enableTyping={index === currentBlock}
                      typingSpeed={50}
                    />
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* Standard Bottom Controls */}
          <div className="fixed bottom-0 left-0 right-0 bg-cinematic-surface/90 backdrop-blur-xl border-t border-cinematic-border/50 z-40">
            <div className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <Button 
                  variant="ghost" 
                  onClick={prevBlock} 
                  disabled={currentBlock === 0}
                  className="text-cinematic-text hover:text-cinematic-accent disabled:opacity-50"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" /> Previous
                </Button>
                
                <div className="text-center">
                  <div className="text-sm text-cinematic-text/70">
                    {currentBlock + 1} of {story.blocks.length}
                  </div>
                  <div className="text-xs text-cinematic-text/50">
                    {Math.round(progressPercentage)}% complete
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  onClick={nextBlock} 
                  disabled={currentBlock === story.blocks.length - 1}
                  className="text-cinematic-text hover:text-cinematic-accent disabled:opacity-50"
                >
                  Next <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}