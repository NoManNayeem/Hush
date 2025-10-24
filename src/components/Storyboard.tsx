'use client'

import { useState, useEffect, useRef } from 'react'
import { Story, StoryBlock } from '@/lib/storyLoader'
import { saveReadingProgress, loadReadingProgress } from '@/lib/storage'
import StoryBlockRenderer from './StoryBlockRenderer'
import ParticleBackground from './ParticleBackground'
// import SearchBar from './SearchBar'
import ReactionButton from './ReactionButton'
import BookmarkButton from './BookmarkButton'
import FocusToggle from './FocusToggle'
import TextToSpeech, { useStoryTTS } from './TextToSpeech'
import UtilityPanel from './UtilityPanel'
import StoryOnboarding from './StoryOnboarding'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, X, Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StoryboardProps {
  story: Story
}

export default function Storyboard({ story }: StoryboardProps) {
  const [currentBlock, setCurrentBlock] = useState(0)
  const [isFocusMode, setIsFocusMode] = useState(false)
  // const [isBookmarked, setIsBookmarked] = useState(false)
  // const [reactions, setReactions] = useState<Record<string, number>>({})
  // const [isPlaying, setIsPlaying] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  // const [isTTSEnabled, setIsTTSEnabled] = useState(false)
  // const [isTyping, setIsTyping] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(50) // ms per character
  const [autoplayMode, setAutoplayMode] = useState<'disabled' | 'slow' | 'normal' | 'fast'>('disabled')
  const [showAutoplayIntro, setShowAutoplayIntro] = useState(false)
  const [autoplayProgress, setAutoplayProgress] = useState(0)
  const [showUtilityPanel, setShowUtilityPanel] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  
  // Cinematic UI state
  const [isCinematicMode, setIsCinematicMode] = useState(true)
  const [transitionType, setTransitionType] = useState<'slide' | 'fade' | 'zoom' | 'flip'>('slide')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showProgressBar, setShowProgressBar] = useState(true)
  const [showBlockCounter, setShowBlockCounter] = useState(true)
  const [tvEffects, setTvEffects] = useState(true)
  const [atmosphericMode, setAtmosphericMode] = useState(true)
  const [soundEffects, setSoundEffects] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  // const typingRef = useRef<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  
  // TTS hook
  const { isEnabled: ttsEnabled, toggleTTS } = useStoryTTS(story.id)

  // TV-Style transition manager with dramatic effects
  const transitionToBlock = async (newBlock: number, _direction: 'next' | 'prev' = 'next') => {
    if (isTransitioning || newBlock < 0 || newBlock >= story.blocks.length) return
    
    setIsTransitioning(true)
    
    // Play transition sound
    playTransitionSound()
    
    // Add dramatic transition delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setCurrentBlock(newBlock)
    
    // Play TV static sound for effect
    if (tvEffects) {
      playTvStaticSound()
    }
    
    // Transition completion
    setTimeout(() => {
      setIsTransitioning(false)
    }, 1000)
  }

  const nextBlock = () => {
    if (currentBlock < story.blocks.length - 1) {
      transitionToBlock(currentBlock + 1, 'next')
    }
  }

  const prevBlock = () => {
    if (currentBlock > 0) {
      transitionToBlock(currentBlock - 1, 'prev')
    }
  }

  // TV Sound Effects
  const playTypingSound = () => {
    if (audioContextRef.current && soundEffects) {
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

  const playTransitionSound = () => {
    if (audioContextRef.current && soundEffects) {
      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)
      
      oscillator.type = 'sawtooth'
      oscillator.frequency.setValueAtTime(200, audioContextRef.current.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContextRef.current.currentTime + 0.3)
      
      gainNode.gain.setValueAtTime(0.03, audioContextRef.current.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.3)
      
      oscillator.start()
      oscillator.stop(audioContextRef.current.currentTime + 0.3)
    }
  }

  const playTvStaticSound = () => {
    if (audioContextRef.current && soundEffects) {
      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)
      
      oscillator.type = 'sawtooth'
      oscillator.frequency.setValueAtTime(1000 + Math.random() * 2000, audioContextRef.current.currentTime)
      
      gainNode.gain.setValueAtTime(0.01, audioContextRef.current.currentTime)
      
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

  // Enhanced auto-scroll to current block with autoplay support
  useEffect(() => {
    if (containerRef.current) {
      const currentBlockElement = containerRef.current.querySelector(`[data-block-index="${currentBlock}"]`)
      if (currentBlockElement) {
        // Different scroll behavior based on autoplay mode
        const scrollOptions: ScrollIntoViewOptions = autoplayMode !== 'disabled' 
          ? { 
              behavior: 'smooth', 
              block: 'center',
              inline: 'center'
            }
          : { 
              behavior: 'smooth', 
              block: 'center' 
            }
        
        currentBlockElement.scrollIntoView(scrollOptions)
        
        // For autoplay, also ensure the element is fully visible
        if (autoplayMode !== 'disabled') {
          setTimeout(() => {
            const rect = currentBlockElement.getBoundingClientRect()
            const viewportHeight = window.innerHeight
            const elementCenter = rect.top + rect.height / 2
            const viewportCenter = viewportHeight / 2
            
            // If element is not centered, adjust scroll
            if (Math.abs(elementCenter - viewportCenter) > 50) {
              currentBlockElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'center'
              } as ScrollIntoViewOptions)
            }
          }, 100)
        }
      }
    }
  }, [currentBlock, autoplayMode])

  useEffect(() => {
    // Check if user has seen story onboarding
    const hasSeenOnboarding = localStorage.getItem('hush:storyOnboardingSeen')
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
    }

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

  // Fixed autoplay system
  useEffect(() => {
    // Clear any existing autoplay
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current)
      autoPlayRef.current = null
    }

    if (autoplayMode !== 'disabled' && currentBlock < story.blocks.length - 1) {
      const getBlockReadTime = (block: StoryBlock): number => {
        let baseTime = 3000 // Default 3 seconds
        
        switch (block.type) {
          case 'heading':
            baseTime = 4000
            break
          case 'subheading':
            baseTime = 3500
            break
          case 'paragraph':
            const text = (block as any).text || ''
            const wordCount = text.split(' ').length
            baseTime = Math.max(3000, wordCount * 150) // 150ms per word
            break
          case 'image':
          case 'video':
          case 'mermaid':
          case 'reactflow':
          case 'three-scene':
          case 'embed':
            baseTime = 6000
            break
          case 'quote':
            baseTime = 4000
            break
          case 'code':
            baseTime = 5000
            break
        }

        // Apply speed multiplier based on autoplay mode
        const speedMultipliers = {
          'slow': 1.5,
          'normal': 1.0,
          'fast': 0.7
        }
        
        return Math.ceil(baseTime * speedMultipliers[autoplayMode])
      }

      const currentBlockData = story.blocks[currentBlock]
      if (!currentBlockData) return
      
      const readTime = getBlockReadTime(currentBlockData)
      
      // Reset progress
      setAutoplayProgress(0)
      
      // Animate progress
      let startTime = Date.now()
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(100, (elapsed / readTime) * 100)
        setAutoplayProgress(progress)
        
        if (progress >= 100) {
          clearInterval(progressInterval)
        }
      }, 50)

      // Schedule next block
      autoPlayRef.current = setTimeout(() => {
        clearInterval(progressInterval)
        if (currentBlock < story.blocks.length - 1) {
          nextBlock()
        } else {
          // Story finished
          setAutoplayMode('disabled')
          setAutoplayProgress(0)
        }
      }, readTime)
    } else {
      setAutoplayProgress(0)
    }

    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current)
        autoPlayRef.current = null
      }
    }
  }, [autoplayMode, currentBlock, story.blocks])

  const navigateBlocks = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentBlock < story.blocks.length - 1) {
      if (isCinematicMode) {
        nextBlock()
      } else {
        setCurrentBlock(currentBlock + 1)
      }
    } else if (direction === 'prev' && currentBlock > 0) {
      if (isCinematicMode) {
        prevBlock()
      } else {
        setCurrentBlock(currentBlock - 1)
      }
    }
  }

  const toggleFocusMode = () => {
    setIsFocusMode(!isFocusMode)
  }

  const toggleAutoPlay = () => {
    if (autoplayMode === 'disabled') {
      setShowAutoplayIntro(true)
    } else {
      setAutoplayMode('disabled')
    }
  }

  const startAutoplay = (mode: 'slow' | 'normal' | 'fast') => {
    setAutoplayMode(mode)
    setShowAutoplayIntro(false)
  }

  const handleReset = () => {
    setCurrentBlock(0)
    setAutoplayMode('disabled')
    setAutoplayProgress(0)
  }

  const handleOnboardingComplete = () => {
    localStorage.setItem('hush:storyOnboardingSeen', 'true')
    setShowOnboarding(false)
  }

  const handleOnboardingSkip = () => {
    localStorage.setItem('hush:storyOnboardingSeen', 'true')
    setShowOnboarding(false)
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
          } else if (event.key === 's' || event.key === 'S') {
            event.preventDefault()
            setShowUtilityPanel(!showUtilityPanel)
          }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentBlock, story.blocks.length])

  // Touch gesture handlers for mobile
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
        "fixed inset-0 bg-black text-white overflow-hidden",
        isCinematicMode ? "cinematic-viewport" : "relative min-h-screen"
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

      {/* TV Screen Content Area */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center",
        isCinematicMode && "cinematic-content-area",
        tvEffects && "tv-screen-effects",
        atmosphericMode && "atmospheric-lighting"
      )}>
        {/* Story Blocks Container */}
        <div 
          ref={containerRef}
          className={cn(
            "relative w-full h-full max-w-6xl mx-auto",
            isCinematicMode && "cinematic-blocks-container",
            tvEffects && "tv-glow-effect"
          )}
        >
          {/* Current Story Block */}
          {story.blocks.map((block, index) => (
            <div
              key={index}
              data-block-index={index}
              className={cn(
                "absolute inset-0 w-full h-full flex items-center justify-center",
                "transition-all duration-1000 ease-in-out",
                isCinematicMode && "cinematic-block",
                tvEffects && "tv-block-effect",
                index === currentBlock ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full",
                isTransitioning && "pointer-events-none",
                transitionType === 'slide' && index === currentBlock && "dramatic-slide",
                transitionType === 'fade' && index === currentBlock && "dramatic-fade",
                transitionType === 'zoom' && index === currentBlock && "dramatic-zoom"
              )}
              style={{
                transform: index === currentBlock ? 'translateX(0)' : 'translateX(100%)',
                zIndex: index === currentBlock ? 10 : 1,
                animation: index === currentBlock && tvEffects ? 'tv-flicker 2s ease-in-out infinite' : 'none'
              }}
            >
              <div className="w-full max-w-4xl mx-auto px-8">
                <StoryBlockRenderer 
                  block={block} 
                  enableTyping={!ttsEnabled}
                  typingSpeed={typingSpeed}
                  onTypingCharacter={playTypingSound}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cinematic Navigation Controls */}
      {isCinematicMode && (
        <>
          {/* Progress Bar */}
          {showProgressBar && (
            <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-white/10">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300"
                style={{ width: `${((currentBlock + 1) / story.blocks.length) * 100}%` }}
              />
            </div>
          )}

          {/* Block Counter */}
          {showBlockCounter && (
            <div className="fixed top-4 right-4 z-[60] bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 text-sm text-white">
              {currentBlock + 1} / {story.blocks.length}
            </div>
          )}

          {/* Navigation Arrows */}
          <div className="fixed inset-0 z-[55] pointer-events-none">
            {/* Left Arrow */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevBlock}
                disabled={currentBlock === 0 || isTransitioning}
                className="w-12 h-12 bg-black/50 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>

            {/* Right Arrow */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={nextBlock}
                disabled={currentBlock === story.blocks.length - 1 || isTransitioning}
                className="w-12 h-12 bg-black/50 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* TV Remote Controls */}
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] flex items-center space-x-2 bg-black/70 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/30 shadow-2xl">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCinematicMode(!isCinematicMode)}
              className="w-10 h-10 text-white hover:bg-white/20 rounded-lg"
              title="Toggle TV Mode"
            >
              {isCinematicMode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTvEffects(!tvEffects)}
              className={cn(
                "w-10 h-10 text-white hover:bg-white/20 rounded-lg",
                tvEffects && "bg-purple-500/30"
              )}
              title="Toggle TV Effects"
            >
              <span className="text-sm">📺</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setAtmosphericMode(!atmosphericMode)}
              className={cn(
                "w-10 h-10 text-white hover:bg-white/20 rounded-lg",
                atmosphericMode && "bg-cyan-500/30"
              )}
              title="Toggle Atmospheric Lighting"
            >
              <span className="text-sm">✨</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSoundEffects(!soundEffects)}
              className={cn(
                "w-10 h-10 text-white hover:bg-white/20 rounded-lg",
                soundEffects && "bg-green-500/30"
              )}
              title="Toggle Sound Effects"
            >
              <span className="text-sm">🔊</span>
            </Button>

            <div className="w-px h-6 bg-white/20 mx-2"></div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowProgressBar(!showProgressBar)}
              className="w-10 h-10 text-white hover:bg-white/20 rounded-lg"
              title="Toggle Progress Bar"
            >
              <div className="w-4 h-1 bg-white rounded"></div>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowBlockCounter(!showBlockCounter)}
              className="w-10 h-10 text-white hover:bg-white/20 rounded-lg"
              title="Toggle Block Counter"
            >
              <span className="text-xs font-mono">#</span>
            </Button>

            <div className="w-px h-6 bg-white/20 mx-2"></div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTransitionType(transitionType === 'slide' ? 'fade' : transitionType === 'fade' ? 'zoom' : 'slide')}
              className="w-10 h-10 text-white hover:bg-white/20 rounded-lg"
              title={`Transition: ${transitionType}`}
            >
              <span className="text-xs">
                {transitionType === 'slide' ? '→' : transitionType === 'fade' ? '○' : '⚡'}
              </span>
            </Button>
          </div>

          {/* Mobile Cinematic Controls */}
          <div className="fixed bottom-20 left-4 right-4 z-[60] md:hidden">
            <div className="flex justify-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevBlock}
                disabled={currentBlock === 0 || isTransitioning}
                className="flex-1 bg-black/50 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextBlock}
                disabled={currentBlock === story.blocks.length - 1 || isTransitioning}
                className="flex-1 bg-black/50 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Enhanced Top Navigation with Better Controls */}
      {!isFocusMode && !isCinematicMode && (
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
                  {/* Enhanced Auto-play Control */}
                  <div className="relative">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={toggleAutoPlay} 
                      className={cn(
                        "text-white hover:bg-white/10 transition-all duration-300",
                        autoplayMode !== 'disabled' ? "bg-purple-500/20 text-purple-300" : "text-white/80"
                      )}
                      title={autoplayMode !== 'disabled' ? "Stop auto-play" : "Start auto-play"}
                    >
                      {autoplayMode !== 'disabled' ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    
                    {/* Autoplay Mode Indicator */}
                    {autoplayMode !== 'disabled' && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  
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

          {/* Enhanced Auto-play Indicator */}
          {autoplayMode !== 'disabled' && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-purple-500/10 border border-purple-500/20 rounded-lg px-4 py-2 backdrop-blur-sm">
              <div className="flex items-center space-x-3 text-purple-300">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">
                  Auto-playing ({autoplayMode})
                </span>
                <div className="w-16 h-1 bg-purple-500/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-400 transition-all duration-100"
                    style={{ width: `${autoplayProgress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-purple-400">
                  {Math.ceil((story.blocks.length - currentBlock - 1) * 2)}s remaining
                </span>
              </div>
            </div>
          )}

          {/* Autoplay Intro Modal */}
          {showAutoplayIntro && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md w-full">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Choose Auto-play Speed</h2>
                  <p className="text-gray-300 text-sm">
                    Let the story unfold automatically at your preferred pace
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <Button 
                    onClick={() => startAutoplay('slow')}
                    className="w-full py-4 text-left bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <div>
                        <div className="font-semibold">Slow & Thoughtful</div>
                        <div className="text-xs text-gray-400">~4-6 seconds per block</div>
                      </div>
                    </div>
                  </Button>

                  <Button 
                    onClick={() => startAutoplay('normal')}
                    className="w-full py-4 text-left bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <div>
                        <div className="font-semibold">Normal Pace</div>
                        <div className="text-xs text-gray-400">~3-4 seconds per block</div>
                      </div>
                    </div>
                  </Button>

                  <Button 
                    onClick={() => startAutoplay('fast')}
                    className="w-full py-4 text-left bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                      <div>
                        <div className="font-semibold">Quick Read</div>
                        <div className="text-xs text-gray-400">~2-3 seconds per block</div>
                      </div>
                    </div>
                  </Button>
                </div>

                <Button 
                  variant="outline"
                  onClick={() => setShowAutoplayIntro(false)}
                  className="w-full py-3 border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
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
                    enableTyping={!ttsEnabled}
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
                    autoPlay={false}
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

          {/* Story Onboarding */}
          <StoryOnboarding
            isOpen={showOnboarding}
            onComplete={handleOnboardingComplete}
            onSkip={handleOnboardingSkip}
          />

          {/* Utility Panel */}
          <UtilityPanel
            isOpen={showUtilityPanel}
            onToggle={() => setShowUtilityPanel(!showUtilityPanel)}
            autoplayMode={autoplayMode}
            onAutoplayChange={setAutoplayMode}
            ttsEnabled={ttsEnabled}
            onTTSChange={toggleTTS}
            typingSpeed={typingSpeed}
            onTypingSpeedChange={setTypingSpeed}
            focusMode={isFocusMode}
            onFocusModeChange={setIsFocusMode}
            currentBlock={currentBlock}
            totalBlocks={story.blocks.length}
            onNavigate={navigateBlocks}
            onReset={handleReset}
          />

          {/* Keyboard Shortcuts Hint */}
          {!isFocusMode && showControls && (
            <div className="fixed bottom-20 right-4 z-40 bg-black/80 backdrop-blur-sm border border-white/10 rounded-lg p-3 text-xs text-white/70">
              <div className="space-y-1">
                <div>← → Navigate</div>
                <div>Space Next</div>
                <div>F Focus Mode</div>
                <div>P Auto-play</div>
                <div>T Text-to-Speech</div>
                <div>S Settings Panel</div>
              </div>
            </div>
          )}
        </div>
      )
    }