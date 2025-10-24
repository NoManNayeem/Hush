'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import Fuse from 'fuse.js'

interface Story {
  id: string
  title: string
  author: string
  excerpt: string
  categories: string[]
  keywords: string[]
  slug: string
  publishedAt: string
  coverImage: string
  readingTime: string
}

interface SearchBarProps {
  onStorySelect?: (story: Story) => void
  placeholder?: string
  className?: string
}

export default function SearchBar({ onStorySelect, placeholder = "Search stories...", className }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [stories, setStories] = useState<Story[]>([])
  const [filteredStories, setFilteredStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load stories index
  useEffect(() => {
    const loadStories = async () => {
      try {
        setIsLoading(true)
        const basePath = process.env.NODE_ENV === 'production' ? '/hush' : ''
        const res = await fetch(`${basePath}/index.json`)
        const data: Story[] = await res.json()
        setStories(data)
      } catch (error) {
        console.error('Failed to load stories:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isOpen && stories.length === 0) {
      loadStories()
    }
  }, [isOpen, stories.length])

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('hush:recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Search functionality
  useEffect(() => {
    if (query.trim() && stories.length > 0) {
      const fuse = new Fuse(stories, {
        keys: ['title', 'excerpt', 'author', 'categories', 'keywords'],
        threshold: 0.3,
        includeScore: true,
      })
      
      const results = fuse.search(query).map(result => result.item)
      setFilteredStories(results)
    } else {
      setFilteredStories([])
    }
  }, [query, stories])

  // Handle search
  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Save to recent searches
      const newRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
      setRecentSearches(newRecent)
      localStorage.setItem('hush:recentSearches', JSON.stringify(newRecent))
    }
  }

  // Handle story selection
  const handleStorySelect = (story: Story) => {
    handleSearch(query)
    onStorySelect?.(story)
    setIsOpen(false)
    setQuery('')
  }

  // Handle recent search click
  const handleRecentSearch = (searchTerm: string) => {
    setQuery(searchTerm)
    inputRef.current?.focus()
  }

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('hush:recentSearches')
  }

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsOpen(false)
              setQuery('')
            }
          }}
          className="pl-10 pr-10 bg-white/5 border-white/10 focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-lg border border-white/10 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-400">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto mb-2"></div>
              Loading stories...
            </div>
          ) : query.trim() ? (
            // Search Results
            <div className="p-2">
              {filteredStories.length > 0 ? (
                <>
                  <div className="px-3 py-2 text-xs text-gray-400 border-b border-white/10 mb-2">
                    {filteredStories.length} result{filteredStories.length !== 1 ? 's' : ''} for "{query}"
                  </div>
                  {filteredStories.map((story) => (
                    <button
                      key={story.id}
                      onClick={() => handleStorySelect(story)}
                      className="w-full p-3 text-left hover:bg-white/5 rounded-lg transition-colors group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-white/80">
                            {story.title.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold truncate group-hover:text-purple-300 transition-colors">
                            {story.title}
                          </h3>
                          <p className="text-sm text-gray-400 truncate mt-1">
                            {story.excerpt}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs text-gray-500">{story.author}</span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">{story.readingTime}</span>
                            <div className="flex space-x-1">
                              {story.categories.slice(0, 2).map((category) => (
                                <span
                                  key={category}
                                  className="text-xs bg-purple-800/30 text-purple-300 px-2 py-1 rounded-full"
                                >
                                  {category}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </>
              ) : (
                <div className="p-4 text-center text-gray-400">
                  No stories found for "{query}"
                </div>
              )}
            </div>
          ) : (
            // Recent Searches & Trending
            <div className="p-2">
              {recentSearches.length > 0 && (
                <>
                  <div className="flex items-center justify-between px-3 py-2 text-xs text-gray-400 border-b border-white/10 mb-2">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>Recent searches</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-500 hover:text-white h-auto p-1"
                    >
                      Clear
                    </Button>
                  </div>
                  <div className="space-y-1 mb-4">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentSearch(search)}
                        className="w-full p-2 text-left text-sm text-gray-300 hover:bg-white/5 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span>{search}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
              
              <div className="flex items-center px-3 py-2 text-xs text-gray-400 border-b border-white/10 mb-2">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>Popular categories</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {['horror', 'mystery', 'sci-fi', 'conspiracy', 'theology', 'urban-legend'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setQuery(category)}
                    className="p-2 text-left text-sm text-gray-300 hover:bg-white/5 rounded-lg transition-colors capitalize"
                  >
                    {category.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
