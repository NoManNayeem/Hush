'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Search, Filter, Clock, User, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Story {
  id: string
  title: string
  author: string
  coverImage: string
  publishedAt: string
  categories: string[]
  keywords: string[]
  excerpt: string
  readingTime: string
}

export default function ExplorePage() {
  const [stories, setStories] = useState<Story[]>([])
  const [filteredStories, setFilteredStories] = useState<Story[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for now - will be replaced with actual data loading
  useEffect(() => {
    const mockStories: Story[] = [
      {
        id: 'lightless-town',
        title: 'The Lightless Town',
        author: 'R. Night',
        coverImage: '/assets/lightless.jpg',
        publishedAt: '2023-05-10',
        categories: ['horror', 'urban-legend'],
        keywords: ['town', 'darkness', 'mystery'],
        excerpt: 'At midnight, the town went quiet. Not the peaceful quiet of sleep, but the heavy silence of something that had been waiting.',
        readingTime: '8 min'
      },
      {
        id: 'nephilim-archives',
        title: 'The Nephilim Archives',
        author: 'A. Scholar',
        coverImage: '/assets/nephilim.jpg',
        publishedAt: '2023-06-15',
        categories: ['theology', 'mystery', 'historical'],
        keywords: ['ancient', 'giants', 'scripture'],
        excerpt: 'Deep within the Vatican archives, a manuscript tells of beings that walked among us before the flood.',
        readingTime: '12 min'
      },
      {
        id: 'operation-moonfall',
        title: 'Operation Moonfall',
        author: 'J. Whistle',
        coverImage: '/assets/moonfall.jpg',
        publishedAt: '2023-07-22',
        categories: ['conspiracy', 'sci-fi', 'space'],
        keywords: ['moon', 'coverup', 'mission'],
        excerpt: 'The official story says we never went back to the moon. The classified files tell a different tale.',
        readingTime: '15 min'
      },
      {
        id: 'infinite-staircase',
        title: 'The Infinite Staircase',
        author: 'M. Architect',
        coverImage: '/assets/staircase.jpg',
        publishedAt: '2023-08-05',
        categories: ['mystery', 'horror', 'architectural'],
        keywords: ['building', 'stairs', 'dimension'],
        excerpt: 'The building had 13 floors. At least, that\'s what the blueprints said. But the elevator went higher.',
        readingTime: '10 min'
      },
      {
        id: 'last-transmission',
        title: 'The Last Transmission from Earth',
        author: 'S. Explorer',
        coverImage: '/assets/transmission.jpg',
        publishedAt: '2023-09-12',
        categories: ['sci-fi', 'speculative', 'post-apocalyptic'],
        keywords: ['space', 'earth', 'colony'],
        excerpt: 'The final message from Earth reached the Mars colony three days after the planet went silent.',
        readingTime: '13 min'
      }
    ]

    setStories(mockStories)
    setFilteredStories(mockStories)
    setIsLoading(false)
  }, [])

  // Filter stories based on search and category
  useEffect(() => {
    let filtered = stories

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(story =>
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(story =>
        story.categories.includes(selectedCategory)
      )
    }

    setFilteredStories(filtered)
  }, [stories, searchQuery, selectedCategory])

  const allCategories = ['all', ...new Set(stories.flatMap(story => story.categories))]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading stories...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Explore Stories
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            Discover immersive tales of mystery, conspiracy, and wonder. 
            Each story unfolds as an interactive experience.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search stories, keywords, or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {allCategories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground">
            {filteredStories.length} {filteredStories.length === 1 ? 'story' : 'stories'} found
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStories.map((story) => (
            <Link
              key={story.id}
              href={`/story/${story.id}`}
              className="group block"
            >
              <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                {/* Cover Image */}
                <div className="aspect-video bg-gradient-to-br from-purple-900 to-cyan-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {story.title}
                    </h3>
                    <p className="text-sm text-white/80">
                      by {story.author}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-foreground/80 mb-4 line-clamp-3">
                    {story.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{story.readingTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{story.author}</span>
                      </div>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {story.categories.slice(0, 2).map((category) => (
                      <span
                        key={category}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {category}
                      </span>
                    ))}
                    {story.categories.length > 2 && (
                      <span className="text-xs text-muted-foreground">
                        +{story.categories.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredStories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No stories found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
