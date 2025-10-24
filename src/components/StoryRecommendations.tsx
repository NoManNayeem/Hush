'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { 
  Sparkles, 
  Clock, 
  User, 
  Tag, 
  TrendingUp,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Story } from '@/lib/storyLoader'

interface StoryRecommendationsProps {
  currentStoryId: string
  isOpen: boolean
  onToggle: () => void
  className?: string
}

interface Recommendation {
  story: Story
  reason: string
  score: number
  type: 'similar' | 'trending' | 'category' | 'author'
}

export default function StoryRecommendations({ 
  currentStoryId, 
  isOpen, 
  onToggle, 
  className 
}: StoryRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'similar' | 'trending' | 'category' | 'author'>('all')

  useEffect(() => {
    if (isOpen) {
      loadRecommendations()
    }
  }, [currentStoryId, isOpen, filter])

  const loadRecommendations = async () => {
    setIsLoading(true)
    try {
      // Load all stories
      const basePath = process.env.NODE_ENV === 'production' ? '/Hush' : ''
      const res = await fetch(`${basePath}/index.json`)
      const stories: Story[] = await res.json()
      
      // Get current story
      const currentStory = stories.find(s => s.id === currentStoryId)
      if (!currentStory) return

      // Generate recommendations
      // const recs: Recommendation[] = []

      // Similar stories (same categories)
      const similarStories = stories
        .filter(s => s.id !== currentStoryId && s.categories.some(cat => currentStory.categories.includes(cat)))
        .slice(0, 3)
        .map(story => ({
          story,
          reason: `Similar to ${currentStory.title}`,
          score: 0.8,
          type: 'similar' as const
        }))

      // Same author
      const authorStories = stories
        .filter(s => s.id !== currentStoryId && s.author === currentStory.author)
        .slice(0, 2)
        .map(story => ({
          story,
          reason: `More by ${currentStory.author}`,
          score: 0.9,
          type: 'author' as const
        }))

      // Trending (mock based on random)
      const trendingStories = stories
        .filter(s => s.id !== currentStoryId)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2)
        .map(story => ({
          story,
          reason: 'Trending now',
          score: 0.7,
          type: 'trending' as const
        }))

      // Category-based
      const categoryStories = stories
        .filter(s => s.id !== currentStoryId && s.categories.some(cat => currentStory.categories.includes(cat)))
        .slice(0, 2)
        .map(story => ({
          story,
          reason: `More ${currentStory.categories[0]} stories`,
          score: 0.6,
          type: 'category' as const
        }))

      // Combine and sort by score
      const allRecs = [...similarStories, ...authorStories, ...trendingStories, ...categoryStories]
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)

      // Apply filter
      const filtered = filter === 'all' 
        ? allRecs 
        : allRecs.filter(rec => rec.type === filter)

      setRecommendations(filtered)
    } catch (error) {
      console.error('Failed to load recommendations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRecommendationIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'similar':
        return <Sparkles className="h-4 w-4 text-purple-400" />
      case 'trending':
        return <TrendingUp className="h-4 w-4 text-orange-400" />
      case 'category':
        return <Tag className="h-4 w-4 text-blue-400" />
      case 'author':
        return <User className="h-4 w-4 text-green-400" />
      default:
        return <Sparkles className="h-4 w-4 text-gray-400" />
    }
  }

  const getRecommendationColor = (type: Recommendation['type']) => {
    switch (type) {
      case 'similar':
        return 'border-purple-500/20 bg-purple-500/10'
      case 'trending':
        return 'border-orange-500/20 bg-orange-500/10'
      case 'category':
        return 'border-blue-500/20 bg-blue-500/10'
      case 'author':
        return 'border-green-500/20 bg-green-500/10'
      default:
        return 'border-gray-500/20 bg-gray-500/10'
    }
  }

  if (!isOpen) return null

  return (
    <div className={cn(
      "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-black/95 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl transition-all duration-300 w-full max-w-4xl max-h-[80vh] overflow-hidden",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <Sparkles className="h-6 w-6 text-purple-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Recommended Stories</h2>
            <p className="text-sm text-gray-400">Discover more immersive narratives</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-white hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="p-6 border-b border-white/10">
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'similar', label: 'Similar' },
            { key: 'trending', label: 'Trending' },
            { key: 'category', label: 'Category' },
            { key: 'author', label: 'Author' }
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={filter === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(key as any)}
              className={cn(
                "text-xs",
                filter === key 
                  ? "bg-purple-600 text-white border-0" 
                  : "border-white/20 text-white hover:bg-white/10"
              )}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="p-6 overflow-y-auto max-h-96">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/5 rounded-lg p-4 animate-pulse">
                <div className="h-32 bg-white/10 rounded mb-3"></div>
                <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-white/10 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <Link 
                key={rec.story.id} 
                href={`/story/${rec.story.id}`}
                onClick={onToggle}
              >
                <div className="group relative bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
                  {/* Story Cover */}
                  <div className="relative h-32 overflow-hidden">
                    <Image
                      src={rec.story.coverImage}
                      alt={rec.story.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Recommendation Badge */}
                    <div className={cn(
                      "absolute top-2 left-2 flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium",
                      getRecommendationColor(rec.type)
                    )}>
                      {getRecommendationIcon(rec.type)}
                      <span className="text-white">{rec.type}</span>
                    </div>
                  </div>

                  {/* Story Content */}
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                      {rec.story.title}
                    </h3>
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                      {rec.story.excerpt}
                    </p>
                    
                    {/* Story Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{rec.story.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{rec.story.readingTime}</span>
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {rec.story.categories.slice(0, 2).map(category => (
                        <span 
                          key={category} 
                          className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-300 text-xs px-2 py-1 rounded-full border border-purple-500/30"
                        >
                          {category}
                        </span>
                      ))}
                    </div>

                    {/* Reason */}
                    <div className="text-xs text-gray-400 italic">
                      {rec.reason}
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No recommendations found</h3>
            <p className="text-gray-400">Try adjusting your filter or check back later</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/10">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            {recommendations.length} recommendation{recommendations.length !== 1 ? 's' : ''} found
          </p>
          <Button
            variant="outline"
            onClick={onToggle}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

// Recommendation hook
export function useStoryRecommendations(currentStoryId: string) {
  const [recommendations] = useState<Recommendation[]>([])

  const loadRecommendations = async () => {
    try {
      // Implementation similar to above
      // This would typically call an API
    } catch (error) {
      console.error('Failed to load recommendations:', error)
    }
  }

  useEffect(() => {
    loadRecommendations()
  }, [currentStoryId])

  return {
    recommendations,
    loadRecommendations
  }
}
