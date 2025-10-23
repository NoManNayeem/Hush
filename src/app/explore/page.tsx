'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ParticleBackground from '@/components/ParticleBackground'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Filter, Clock, User, Tag, Play, BookOpen, Star, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import Fuse from 'fuse.js'
import Image from 'next/image'

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

export default function ExplorePage() {
  const [stories, setStories] = useState<Story[]>([])
  const [filteredStories, setFilteredStories] = useState<Story[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [allCategories, setAllCategories] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    async function fetchStories() {
      const res = await fetch('/hush/index.json')
      const data: Story[] = await res.json()
      setStories(data)
      setFilteredStories(data)

      const categories = Array.from(new Set(data.flatMap(story => story.categories)))
      setAllCategories(categories)
      
      // Trigger entrance animation
      setTimeout(() => setIsLoaded(true), 100)
    }
    fetchStories()
  }, [])

  useEffect(() => {
    let currentStories = stories

    // Filter by category
    if (selectedCategory) {
      currentStories = currentStories.filter(story => story.categories.includes(selectedCategory))
    }

    // Search by term
    if (searchTerm) {
      const fuse = new Fuse(currentStories, {
        keys: ['title', 'excerpt', 'author', 'categories', 'keywords'],
        threshold: 0.3,
      })
      currentStories = fuse.search(searchTerm).map(result => result.item)
    }

    setFilteredStories(currentStories)
  }, [searchTerm, selectedCategory, stories])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black to-cyan-900/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/30 to-black"></div>
      
      {/* Animated Particles */}
      <div className="absolute inset-0">
        <ParticleBackground count={30} opacity={0.1} />
      </div>

      <Navbar />
      
      <main className="relative z-10 container mx-auto px-4 py-8 pt-24">
        {/* Hero Section */}
        <div className={`text-center mb-12 transition-all duration-2000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Explore
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              {' '}Stories
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover immersive narratives that blur the line between fiction and reality
          </p>
        </div>

        {/* Search and Filters */}
        <div className={`mb-12 transition-all duration-2000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search stories..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "flex items-center transition-all duration-300",
                selectedCategory === null 
                  ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white border-0" 
                  : "bg-white/5 text-white border-white/10 hover:bg-white/10"
              )}
            >
              <Filter className="h-4 w-4 mr-2" /> All Stories
            </Button>
            {allCategories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "flex items-center transition-all duration-300",
                  selectedCategory === category 
                    ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white border-0" 
                    : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                )}
              >
                <Tag className="h-4 w-4 mr-2" /> {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Stories Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-2000 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {filteredStories.length > 0 ? (
            filteredStories.map((story, index) => (
              <Link href={`/story/${story.slug}`} key={story.id}>
                <div 
                  className="group relative bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-purple-500/20"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Story Cover */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={story.coverImage}
                      alt={story.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                        <Play className="h-8 w-8 text-white ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Story Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
                      {story.title}
                    </h2>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {story.excerpt}
                    </p>
                    
                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {story.categories.map(category => (
                        <span 
                          key={category} 
                          className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-500/30"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                    
                    {/* Story Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {story.author}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {story.readingTime}
                      </div>
                    </div>
                  </div>

                  {/* Hover Effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-4">No stories found</h3>
              <p className="text-gray-400 text-lg">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}