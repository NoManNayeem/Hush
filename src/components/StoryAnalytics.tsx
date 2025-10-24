'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  Eye, 
  Clock, 
  Heart, 
  Bookmark, 
  Share2, 
  TrendingUp,
  Users,
  Calendar,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface StoryAnalytics {
  views: number
  readingTime: number
  completionRate: number
  bookmarks: number
  reactions: number
  shares: number
  lastRead: string
  readingSessions: number
}

interface StoryAnalyticsProps {
  storyId: string
  isOpen: boolean
  onToggle: () => void
  className?: string
}

export default function StoryAnalytics({ 
  storyId, 
  isOpen, 
  onToggle, 
  className 
}: StoryAnalyticsProps) {
  const [analytics, setAnalytics] = useState<StoryAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')

  useEffect(() => {
    if (isOpen) {
      loadAnalytics()
    }
  }, [storyId, isOpen, timeRange])

  const loadAnalytics = async () => {
    setIsLoading(true)
    try {
      // Load analytics from localStorage (in a real app, this would be from an API)
      const stored = localStorage.getItem(`hush:analytics:${storyId}`)
      if (stored) {
        setAnalytics(JSON.parse(stored))
      } else {
        // Generate mock analytics for demonstration
        const mockAnalytics: StoryAnalytics = {
          views: Math.floor(Math.random() * 1000) + 100,
          readingTime: Math.floor(Math.random() * 30) + 5,
          completionRate: Math.floor(Math.random() * 40) + 60,
          bookmarks: Math.floor(Math.random() * 50) + 10,
          reactions: Math.floor(Math.random() * 100) + 20,
          shares: Math.floor(Math.random() * 30) + 5,
          lastRead: new Date().toISOString(),
          readingSessions: Math.floor(Math.random() * 20) + 5
        }
        setAnalytics(mockAnalytics)
        localStorage.setItem(`hush:analytics:${storyId}`, JSON.stringify(mockAnalytics))
      }
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString()
  }

  if (!isOpen) return null

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl transition-all duration-300 w-80",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Story Analytics</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-white hover:bg-white/10 h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Time Range Selector */}
      <div className="p-4 border-b border-white/10">
        <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
          {(['7d', '30d', '90d', 'all'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={cn(
                "flex-1 text-xs",
                timeRange === range 
                  ? "bg-purple-600 text-white" 
                  : "text-gray-400 hover:text-white"
              )}
            >
              {range === 'all' ? 'All Time' : range}
            </Button>
          ))}
        </div>
      </div>

      {/* Analytics Content */}
      <div className="p-4 space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-white/10 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : analytics ? (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Eye className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-gray-400">Views</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {formatNumber(analytics.views)}
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-400">Avg. Time</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {analytics.readingTime}m
                </div>
              </div>
            </div>

            {/* Engagement Metrics */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-gray-400">Reactions</span>
                </div>
                <span className="text-white font-semibold">
                  {formatNumber(analytics.reactions)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bookmark className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-gray-400">Bookmarks</span>
                </div>
                <span className="text-white font-semibold">
                  {formatNumber(analytics.bookmarks)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Share2 className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-gray-400">Shares</span>
                </div>
                <span className="text-white font-semibold">
                  {formatNumber(analytics.shares)}
                </span>
              </div>
            </div>

            {/* Completion Rate */}
            <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg p-3 border border-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-gray-400">Completion Rate</span>
                </div>
                <span className="text-white font-semibold">
                  {analytics.completionRate}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${analytics.completionRate}%` }}
                />
              </div>
            </div>

            {/* Additional Stats */}
            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-3 w-3" />
                  <span>Reading Sessions</span>
                </div>
                <span className="text-white">{analytics.readingSessions}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-3 w-3" />
                  <span>Last Read</span>
                </div>
                <span className="text-white">{formatDate(analytics.lastRead)}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No analytics data available</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Analytics hook for tracking user interactions
export function useStoryAnalytics(storyId: string) {
  const trackView = () => {
    const key = `hush:analytics:${storyId}`
    const existing = localStorage.getItem(key)
    const analytics = existing ? JSON.parse(existing) : {
      views: 0,
      readingTime: 0,
      completionRate: 0,
      bookmarks: 0,
      reactions: 0,
      shares: 0,
      lastRead: new Date().toISOString(),
      readingSessions: 0
    }
    
    analytics.views += 1
    analytics.lastRead = new Date().toISOString()
    localStorage.setItem(key, JSON.stringify(analytics))
  }

  const trackReadingTime = (timeInMinutes: number) => {
    const key = `hush:analytics:${storyId}`
    const existing = localStorage.getItem(key)
    if (existing) {
      const analytics = JSON.parse(existing)
      analytics.readingTime = Math.round((analytics.readingTime + timeInMinutes) / 2)
      localStorage.setItem(key, JSON.stringify(analytics))
    }
  }

  const trackCompletion = (percentage: number) => {
    const key = `hush:analytics:${storyId}`
    const existing = localStorage.getItem(key)
    if (existing) {
      const analytics = JSON.parse(existing)
      analytics.completionRate = Math.round((analytics.completionRate + percentage) / 2)
      localStorage.setItem(key, JSON.stringify(analytics))
    }
  }

  return {
    trackView,
    trackReadingTime,
    trackCompletion
  }
}
