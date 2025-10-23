'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, Menu, X, Home, BookOpen, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      isScrolled 
        ? "bg-black/80 backdrop-blur-md shadow-lg border-b border-white/10" 
        : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <span className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
            HUSH
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            href="/explore" 
            className="text-white/80 hover:text-white transition-all duration-300 flex items-center space-x-2 group"
          >
            <BookOpen className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
            <span>Stories</span>
          </Link>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <Link 
            href="/about" 
            className="text-white/80 hover:text-white transition-all duration-300 flex items-center space-x-2 group"
          >
            <Info className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
            <span>About</span>
          </Link>
          
          <Link 
            href="/disclaimer" 
            className="text-white/80 hover:text-white transition-all duration-300 flex items-center space-x-2 group"
          >
            <AlertTriangle className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
            <span>Disclaimer</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:bg-white/10 transition-all duration-300"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/95 backdrop-blur-md z-40 flex flex-col items-center justify-center space-y-8">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 text-white hover:bg-white/10" 
            onClick={() => setIsMenuOpen(false)}
          >
            <X className="h-8 w-8" />
          </Button>
          
          <Link 
            href="/" 
            className="text-3xl font-bold text-white hover:text-purple-300 transition-colors duration-300 flex items-center space-x-3"
            onClick={() => setIsMenuOpen(false)}
          >
            <Home className="h-8 w-8" />
            <span>Home</span>
          </Link>
          
          <Link 
            href="/explore" 
            className="text-3xl font-bold text-white hover:text-purple-300 transition-colors duration-300 flex items-center space-x-3"
            onClick={() => setIsMenuOpen(false)}
          >
            <BookOpen className="h-8 w-8" />
            <span>Stories</span>
          </Link>
          
          <Button 
            variant="ghost" 
            className="text-3xl font-bold text-white hover:text-purple-300 transition-colors duration-300 flex items-center space-x-3" 
            onClick={() => setIsMenuOpen(false)}
          >
            <Search className="h-8 w-8" />
            <span>Search</span>
          </Button>
          
          <Link 
            href="/about" 
            className="text-3xl font-bold text-white hover:text-purple-300 transition-colors duration-300 flex items-center space-x-3"
            onClick={() => setIsMenuOpen(false)}
          >
            <Info className="h-8 w-8" />
            <span>About</span>
          </Link>
          
          <Link 
            href="/disclaimer" 
            className="text-3xl font-bold text-white hover:text-purple-300 transition-colors duration-300 flex items-center space-x-3"
            onClick={() => setIsMenuOpen(false)}
          >
            <AlertTriangle className="h-8 w-8" />
            <span>Disclaimer</span>
          </Link>
        </div>
      )}
    </nav>
  )
}