'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { 
  Settings, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Zap, 
  Eye, 
  EyeOff,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface UtilityPanelProps {
  isOpen: boolean
  onToggle: () => void
  autoplayMode: 'disabled' | 'slow' | 'normal' | 'fast'
  onAutoplayChange: (mode: 'disabled' | 'slow' | 'normal' | 'fast') => void
  ttsEnabled: boolean
  onTTSChange: (enabled: boolean) => void
  typingSpeed: number
  onTypingSpeedChange: (speed: number) => void
  focusMode: boolean
  onFocusModeChange: (enabled: boolean) => void
  currentBlock: number
  totalBlocks: number
  onNavigate: (direction: 'prev' | 'next') => void
  onReset: () => void
}

export default function UtilityPanel({
  isOpen,
  onToggle,
  autoplayMode,
  onAutoplayChange,
  ttsEnabled,
  onTTSChange,
  typingSpeed,
  onTypingSpeedChange,
  focusMode,
  onFocusModeChange,
  currentBlock,
  totalBlocks,
  onNavigate,
  onReset
}: UtilityPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false)

  // Auto-minimize on mobile after interaction
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      const timer = setTimeout(() => setIsMinimized(true), 3000)
      return () => clearTimeout(timer)
    }
    return () => {}
  }, [isOpen])

  const autoplayOptions = [
    { value: 'disabled', label: 'Manual', icon: Pause, color: 'text-gray-400' },
    { value: 'slow', label: 'Slow', icon: Play, color: 'text-green-400' },
    { value: 'normal', label: 'Normal', icon: Play, color: 'text-blue-400' },
    { value: 'fast', label: 'Fast', icon: Zap, color: 'text-orange-400' }
  ] as const

  return (
    <>
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className={cn(
          "fixed top-4 right-4 z-50 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300",
          isOpen && "bg-purple-500/20 border-purple-500/30"
        )}
        aria-label={isOpen ? "Close utility panel" : "Open utility panel"}
      >
        <Settings className="h-5 w-5" />
      </Button>

      {/* Side Panel */}
      <div className={cn(
        "fixed top-0 right-0 h-full bg-black/90 backdrop-blur-md border-l border-white/10 z-40 transition-all duration-300 ease-in-out",
        isOpen 
          ? "translate-x-0" 
          : "translate-x-full",
        isMinimized ? "w-16" : "w-80"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            {!isMinimized && (
              <h2 className="text-lg font-semibold text-white">Reading Controls</h2>
            )}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/10"
                aria-label={isMinimized ? "Expand panel" : "Minimize panel"}
              >
                {isMinimized ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="text-white hover:bg-white/10"
                aria-label="Close panel"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {!isMinimized && (
              <>
                {/* Progress Indicator */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-white">
                    <span>Progress</span>
                    <span>{currentBlock + 1} / {totalBlocks}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentBlock + 1) / totalBlocks) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white">Navigation</h3>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate('prev')}
                      disabled={currentBlock === 0}
                      className="flex-1 border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate('next')}
                      disabled={currentBlock === totalBlocks - 1}
                      className="flex-1 border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onReset}
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Beginning
                  </Button>
                </div>

                {/* Autoplay Controls */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">Auto-play</h3>
                    {autoplayMode !== 'disabled' && (
                      <div className="flex items-center space-x-1 text-xs text-green-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>Auto-scroll</span>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {autoplayOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <Button
                          key={option.value}
                          variant={autoplayMode === option.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => onAutoplayChange(option.value)}
                          className={cn(
                            "flex items-center space-x-2 text-xs",
                            autoplayMode === option.value
                              ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white border-0"
                              : "border-white/20 text-white hover:bg-white/10"
                          )}
                        >
                          <Icon className={cn("h-3 w-3", option.color)} />
                          <span>{option.label}</span>
                        </Button>
                      )
                    })}
                  </div>
                  {autoplayMode !== 'disabled' && (
                    <div className="text-xs text-gray-400 bg-white/5 rounded p-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>Screen auto-scrolls to keep content centered</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span>Timing adjusts based on content type</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* TTS Controls */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">Text-to-Speech</h3>
                    <Switch
                      checked={ttsEnabled}
                      onCheckedChange={onTTSChange}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>
                  {ttsEnabled && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-300">
                        <Volume2 className="h-4 w-4" />
                        <span>Browser TTS Active</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Typing Animation Controls (when TTS is off) */}
                {!ttsEnabled && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">Typing Animation</h3>
                      <Switch
                        checked={true}
                        onCheckedChange={() => {}}
                        className="data-[state=checked]:bg-cyan-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-white">
                        <span>Speed</span>
                        <span>{typingSpeed}ms</span>
                      </div>
                      <Slider
                        value={[typingSpeed]}
                        onValueChange={([value]) => onTypingSpeedChange(value || 50)}
                        min={20}
                        max={100}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Fast</span>
                        <span>Slow</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Focus Mode */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">Focus Mode</h3>
                    <Switch
                      checked={focusMode}
                      onCheckedChange={onFocusModeChange}
                      className="data-[state=checked]:bg-green-600"
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    Hide navigation and focus on story content
                  </p>
                </div>
              </>
            )}

            {/* Minimized View */}
            {isMinimized && (
              <div className="space-y-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onAutoplayChange(autoplayMode === 'disabled' ? 'normal' : 'disabled')}
                  className={cn(
                    "w-full text-white hover:bg-white/10",
                    autoplayMode !== 'disabled' && "bg-purple-500/20"
                  )}
                  title={autoplayMode === 'disabled' ? 'Start autoplay' : 'Stop autoplay'}
                >
                  {autoplayMode === 'disabled' ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onTTSChange(!ttsEnabled)}
                  className={cn(
                    "w-full text-white hover:bg-white/10",
                    ttsEnabled && "bg-cyan-500/20"
                  )}
                  title={ttsEnabled ? 'Disable TTS' : 'Enable TTS'}
                >
                  {ttsEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onFocusModeChange(!focusMode)}
                  className={cn(
                    "w-full text-white hover:bg-white/10",
                    focusMode && "bg-green-500/20"
                  )}
                  title={focusMode ? 'Exit focus mode' : 'Enter focus mode'}
                >
                  {focusMode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          {!isMinimized && (
            <div className="p-4 border-t border-white/10">
              <div className="text-xs text-gray-400 text-center">
                Press <kbd className="px-1 py-0.5 bg-white/10 rounded">S</kbd> to toggle panel
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
