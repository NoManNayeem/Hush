'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { 
  Accessibility, 
  Type, 
  Eye, 
  Volume2, 
  Contrast, 
  Settings,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccessibilitySettings {
  fontSize: number
  highContrast: boolean
  reducedMotion: boolean
  screenReader: boolean
  keyboardNavigation: boolean
  focusIndicators: boolean
  colorBlindSupport: boolean
}

interface AccessibilityPanelProps {
  isOpen: boolean
  onToggle: () => void
  className?: string
}

export default function AccessibilityPanel({ 
  isOpen, 
  onToggle, 
  className 
}: AccessibilityPanelProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 16,
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    focusIndicators: true,
    colorBlindSupport: false
  })
  const [isExpanded, setIsExpanded] = useState(false)

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('hush:accessibility')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSettings(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error('Failed to load accessibility settings:', error)
      }
    }
  }, [])

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('hush:accessibility', JSON.stringify(settings))
    applyAccessibilitySettings(settings)
  }, [settings])

  const applyAccessibilitySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement
    
    // Font size
    root.style.fontSize = `${newSettings.fontSize}px`
    
    // High contrast
    if (newSettings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }
    
    // Reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }
    
    // Color blind support
    if (newSettings.colorBlindSupport) {
      root.classList.add('color-blind-support')
    } else {
      root.classList.remove('color-blind-support')
    }
    
    // Focus indicators
    if (newSettings.focusIndicators) {
      root.classList.add('focus-indicators')
    } else {
      root.classList.remove('focus-indicators')
    }
  }

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      fontSize: 16,
      highContrast: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: true,
      focusIndicators: true,
      colorBlindSupport: false
    }
    setSettings(defaultSettings)
  }

  if (!isOpen) return null

  return (
    <div className={cn(
      "fixed bottom-4 left-4 z-50 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl transition-all duration-300",
      isExpanded ? "w-80" : "w-16",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {isExpanded && (
          <div className="flex items-center space-x-2">
            <Accessibility className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Accessibility</h3>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:bg-white/10 h-8 w-8"
            aria-label={isExpanded ? "Collapse panel" : "Expand panel"}
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-white hover:bg-white/10 h-8 w-8"
            aria-label="Close accessibility panel"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Font Size */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Type className="h-4 w-4 text-blue-400" />
              <label className="text-sm font-medium text-white">Font Size</label>
            </div>
            <div className="space-y-2">
              <Slider
                value={[settings.fontSize]}
                onValueChange={([value]) => updateSetting('fontSize', value || 16)}
                min={12}
                max={24}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Small</span>
                <span className="text-white">{settings.fontSize}px</span>
                <span>Large</span>
              </div>
            </div>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Contrast className="h-4 w-4 text-yellow-400" />
              <label className="text-sm font-medium text-white">High Contrast</label>
            </div>
            <Switch
              checked={settings.highContrast}
              onCheckedChange={(checked) => updateSetting('highContrast', checked)}
              className="data-[state=checked]:bg-yellow-600"
            />
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-green-400" />
              <label className="text-sm font-medium text-white">Reduce Motion</label>
            </div>
            <Switch
              checked={settings.reducedMotion}
              onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
              className="data-[state=checked]:bg-green-600"
            />
          </div>

          {/* Screen Reader */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4 text-purple-400" />
              <label className="text-sm font-medium text-white">Screen Reader</label>
            </div>
            <Switch
              checked={settings.screenReader}
              onCheckedChange={(checked) => updateSetting('screenReader', checked)}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>

          {/* Focus Indicators */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-cyan-400" />
              <label className="text-sm font-medium text-white">Focus Indicators</label>
            </div>
            <Switch
              checked={settings.focusIndicators}
              onCheckedChange={(checked) => updateSetting('focusIndicators', checked)}
              className="data-[state=checked]:bg-cyan-600"
            />
          </div>

          {/* Color Blind Support */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-orange-400" />
              <label className="text-sm font-medium text-white">Color Blind Support</label>
            </div>
            <Switch
              checked={settings.colorBlindSupport}
              onCheckedChange={(checked) => updateSetting('colorBlindSupport', checked)}
              className="data-[state=checked]:bg-orange-600"
            />
          </div>

          {/* Reset Button */}
          <Button
            variant="outline"
            onClick={resetSettings}
            className="w-full border-white/20 text-white hover:bg-white/10"
          >
            Reset to Defaults
          </Button>
        </div>
      )}

      {/* Minimized View */}
      {!isExpanded && (
        <div className="p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(true)}
            className="w-full text-white hover:bg-white/10"
            aria-label="Open accessibility settings"
          >
            <Accessibility className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  )
}

// Accessibility hook
export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 16,
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    focusIndicators: true,
    colorBlindSupport: false
  })

  useEffect(() => {
    const saved = localStorage.getItem('hush:accessibility')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSettings(parsed)
      } catch (error) {
        console.error('Failed to load accessibility settings:', error)
      }
    }
  }, [])

  return settings
}
