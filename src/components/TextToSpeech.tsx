'use client'

import { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX, Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ENV } from '@/lib/env'

interface TextToSpeechProps {
  text: string
  storyId: string
  blockIndex: number
  className?: string
  autoPlay?: boolean
}

interface TTSState {
  isPlaying: boolean
  isPaused: boolean
  currentTime: number
  duration: number
  isLoading: boolean
  error: string | null
}

export default function TextToSpeech({ 
  text, 
  className,
  autoPlay = false 
}: TextToSpeechProps) {
  const [ttsState, setTtsState] = useState<TTSState>({
    isPlaying: false,
    isPaused: false,
    currentTime: 0,
    duration: 0,
    isLoading: false,
    error: null
  })
  
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Initialize TTS when component mounts
  useEffect(() => {
    if (text && autoPlay) {
      handlePlay()
    }
  }, [text, autoPlay])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (synthesisRef.current) {
        speechSynthesis.cancel()
        synthesisRef.current = null
      }
    }
  }, [])

  // Generate TTS audio using Hugging Face API
  const generateTTS = async (text: string): Promise<string> => {
    try {
      setTtsState(prev => ({ ...prev, isLoading: true, error: null }))

      const response = await fetch(ENV.HF_TTS_API, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ENV.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text,
          parameters: {
            return_tensors: false,
            return_dict_in_generate: false,
            output_attentions: false,
            output_hidden_states: false,
            use_cache: true
          }
        })
      })

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      
      setTtsState(prev => ({ ...prev, isLoading: false }))
      return audioUrl
    } catch (error) {
      console.error('TTS generation failed:', error)
      setTtsState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Failed to generate speech. Using browser TTS instead.' 
      }))
      
      // Fallback to browser TTS
      return await generateBrowserTTS(text)
    }
  }

  // Fallback to browser TTS
  const generateBrowserTTS = async (text: string): Promise<string> => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = ENV.TTS_RATE
      utterance.pitch = ENV.TTS_PITCH
      utterance.volume = ENV.TTS_VOLUME
      
      // Use a more natural voice if available
      const voices = speechSynthesis.getVoices()
      const naturalVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.name.includes('Samantha') ||
        voice.name.includes('Alex')
      )
      
      if (naturalVoice) {
        utterance.voice = naturalVoice
      }
      
      synthesisRef.current = utterance
      resolve('browser-tts')
    })
  }

  // Handle play/pause
  const handlePlay = async () => {
    try {
      if (ttsState.isPaused && audioRef.current) {
        // Resume audio
        audioRef.current.play()
        setTtsState(prev => ({ ...prev, isPlaying: true, isPaused: false }))
        return
      }

      if (!audioUrl) {
        // Generate TTS audio
        const url = await generateTTS(text)
        if (url === 'browser-tts') {
          // Use browser TTS
          if (synthesisRef.current) {
            speechSynthesis.speak(synthesisRef.current)
            setTtsState(prev => ({ ...prev, isPlaying: true, isPaused: false }))
          }
          return
        }
        setAudioUrl(url)
      }

      if (audioUrl && audioUrl !== 'browser-tts') {
        // Play generated audio
        if (!audioRef.current) {
          audioRef.current = new Audio(audioUrl)
          audioRef.current.addEventListener('timeupdate', handleTimeUpdate)
          audioRef.current.addEventListener('ended', handleEnded)
          audioRef.current.addEventListener('error', handleError)
        }
        
        audioRef.current.play()
        setTtsState(prev => ({ ...prev, isPlaying: true, isPaused: false }))
      }
    } catch (error) {
      console.error('Playback error:', error)
      setTtsState(prev => ({ ...prev, error: 'Playback failed' }))
    }
  }

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setTtsState(prev => ({ ...prev, isPlaying: false, isPaused: true }))
    } else if (synthesisRef.current) {
      speechSynthesis.pause()
      setTtsState(prev => ({ ...prev, isPlaying: false, isPaused: true }))
    }
  }

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    if (synthesisRef.current) {
      speechSynthesis.cancel()
    }
    setTtsState(prev => ({ 
      ...prev, 
      isPlaying: false, 
      isPaused: false, 
      currentTime: 0 
    }))
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setTtsState(prev => ({
        ...prev,
        currentTime: audioRef.current!.currentTime,
        duration: audioRef.current!.duration || 0
      }))
    }
  }

  const handleEnded = () => {
    setTtsState(prev => ({ 
      ...prev, 
      isPlaying: false, 
      isPaused: false, 
      currentTime: 0 
    }))
  }

  const handleError = () => {
    setTtsState(prev => ({ ...prev, error: 'Audio playback failed' }))
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {/* TTS Controls */}
      <div className="flex items-center space-x-1 bg-black/20 backdrop-blur-sm rounded-lg p-2 border border-white/10">
        {ttsState.isLoading ? (
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            <span>Generating speech...</span>
          </div>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={ttsState.isPlaying ? handlePause : handlePlay}
              className="text-white hover:bg-white/10 h-8 w-8 p-0"
              aria-label={ttsState.isPlaying ? 'Pause speech' : 'Play speech'}
            >
              {ttsState.isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleStop}
              className="text-white hover:bg-white/10 h-8 w-8 p-0"
              aria-label="Stop speech"
            >
              <VolumeX className="h-4 w-4" />
            </Button>

            {/* Progress indicator */}
            {ttsState.duration > 0 && (
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <span>{formatTime(ttsState.currentTime)}</span>
                <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-400 transition-all duration-300"
                    style={{ width: `${(ttsState.currentTime / ttsState.duration) * 100}%` }}
                  />
                </div>
                <span>{formatTime(ttsState.duration)}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Error message */}
      {ttsState.error && (
        <div className="text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded">
          {ttsState.error}
        </div>
      )}

      {/* TTS Status indicator */}
      {ttsState.isPlaying && (
        <div className="flex items-center space-x-1 text-xs text-purple-400">
          <Volume2 className="h-3 w-3 animate-pulse" />
          <span>Speaking</span>
        </div>
      )}
    </div>
  )
}

// Hook for managing TTS across the entire story
export function useStoryTTS(storyId: string) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [currentBlock, setCurrentBlock] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    // Load TTS preferences from localStorage
    const saved = localStorage.getItem(`hush:tts:${storyId}`)
    if (saved) {
      const { enabled, block } = JSON.parse(saved)
      setIsEnabled(enabled)
      setCurrentBlock(block)
    }
  }, [storyId])

  const toggleTTS = () => {
    const newEnabled = !isEnabled
    setIsEnabled(newEnabled)
    localStorage.setItem(`hush:tts:${storyId}`, JSON.stringify({
      enabled: newEnabled,
      block: currentBlock
    }))
  }

  const setCurrentBlockTTS = (block: number) => {
    setCurrentBlock(block)
    localStorage.setItem(`hush:tts:${storyId}`, JSON.stringify({
      enabled: isEnabled,
      block
    }))
  }

  return {
    isEnabled,
    currentBlock,
    isPlaying,
    toggleTTS,
    setCurrentBlockTTS,
    setIsPlaying
  }
}
