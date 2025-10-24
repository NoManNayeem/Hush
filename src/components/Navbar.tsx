'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, Menu, X, Home, BookOpen, Info, AlertTriangle, Volume2, VolumeX, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { audioManager } from '@/lib/audio'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAudio = () => {
    if (isAudioEnabled) {
      audioManager.pauseAll()
    } else {
      audioManager.resumeAll()
    }
    setIsAudioEnabled(!isAudioEnabled)
  }

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 cinematic-nav",
        isScrolled 
          ? "bg-cinematic-surface/90 backdrop-blur-xl shadow-2xl border-b border-cinematic-border/50" 
          : "bg-transparent"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Enhanced Logo */}
        <Link 
          href="/" 
          className="flex items-center space-x-3 group"
          aria-label="Hush - Go to homepage"
        >
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-cinematic-accent to-cinematic-accent-secondary rounded-xl flex items-center justify-center shadow-2xl group-hover:shadow-cinematic-accent/50 transition-all duration-300 group-hover:scale-110 cinematic-glow">
              <span className="text-white font-bold text-xl display-text" aria-hidden="true">H</span>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-cinematic-accent-secondary rounded-full animate-pulse"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-cinematic-text group-hover:text-cinematic-accent transition-colors duration-300 display-text">
              HUSH
            </span>
            <span className="text-xs text-cinematic-text-muted -mt-1">
              Immersive Stories
            </span>
          </div>
        </Link>

        {/* Enhanced Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6" role="menubar">
          <Link 
            href="/explore" 
            className="text-cinematic-text/80 hover:text-cinematic-accent transition-all duration-300 flex items-center space-x-2 group cinematic-button px-4 py-2"
            role="menuitem"
            aria-label="Browse stories"
          >
            <BookOpen className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
            <span className="body-text">Stories</span>
          </Link>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-cinematic-text/80 hover:text-cinematic-accent hover:bg-cinematic-surface/20 transition-all duration-300 cinematic-glow"
            aria-label="Search stories"
            role="menuitem"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleAudio}
            className={cn(
              "transition-all duration-300",
              isAudioEnabled 
                ? "text-cinematic-accent hover:text-cinematic-accent-secondary" 
                : "text-cinematic-text-muted hover:text-cinematic-text"
            )}
            aria-label={isAudioEnabled ? "Disable audio" : "Enable audio"}
            role="menuitem"
          >
            {isAudioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
          
          <Link 
            href="/developer" 
            className="text-cinematic-text/80 hover:text-cinematic-accent transition-all duration-300 flex items-center space-x-2 group"
            role="menuitem"
            aria-label="About Hush"
          >
            <Info className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
            <span className="body-text">About</span>
          </Link>
          
          <Link 
            href="/disclaimer" 
            className="text-cinematic-text/80 hover:text-cinematic-accent transition-all duration-300 flex items-center space-x-2 group"
            role="menuitem"
            aria-label="Disclaimer and terms"
          >
            <AlertTriangle className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
            <span className="body-text">Disclaimer</span>
          </Link>
        </div>

        {/* Enhanced Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleAudio}
            className={cn(
              "transition-all duration-300",
              isAudioEnabled 
                ? "text-cinematic-accent" 
                : "text-cinematic-text-muted"
            )}
            aria-label={isAudioEnabled ? "Disable audio" : "Enable audio"}
          >
            {isAudioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-cinematic-text hover:text-cinematic-accent hover:bg-cinematic-surface/20 transition-all duration-300"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </Button>
        </div>
      </div>

      {/* Enhanced Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          id="mobile-menu"
          className="md:hidden fixed inset-0 bg-cinematic-bg/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center space-y-8 animate-cinematic-fade-in"
          role="menu"
          aria-label="Mobile navigation menu"
        >
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 text-cinematic-text hover:text-cinematic-accent hover:bg-cinematic-surface/20 transition-all duration-300" 
            onClick={() => setIsMenuOpen(false)}
          >
            <X className="h-8 w-8" />
          </Button>
          
          <Link 
            href="/" 
            className="text-3xl font-bold text-cinematic-text hover:text-cinematic-accent transition-colors duration-300 flex items-center space-x-3 display-text"
            onClick={() => setIsMenuOpen(false)}
          >
            <Home className="h-8 w-8" />
            <span>Home</span>
          </Link>
          
          <Link 
            href="/explore" 
            className="text-3xl font-bold text-cinematic-text hover:text-cinematic-accent transition-colors duration-300 flex items-center space-x-3 display-text"
            onClick={() => setIsMenuOpen(false)}
          >
            <BookOpen className="h-8 w-8" />
            <span>Stories</span>
          </Link>
          
          <Button 
            variant="ghost" 
            className="text-3xl font-bold text-cinematic-text hover:text-cinematic-accent transition-colors duration-300 flex items-center space-x-3 display-text" 
            onClick={() => setIsMenuOpen(false)}
          >
            <Search className="h-8 w-8" />
            <span>Search</span>
          </Button>
          
          <Link 
            href="/developer" 
            className="text-3xl font-bold text-cinematic-text hover:text-cinematic-accent transition-colors duration-300 flex items-center space-x-3 display-text"
            onClick={() => setIsMenuOpen(false)}
          >
            <Info className="h-8 w-8" />
            <span>About</span>
          </Link>
          
          <Link 
            href="/disclaimer" 
            className="text-3xl font-bold text-cinematic-text hover:text-cinematic-accent transition-colors duration-300 flex items-center space-x-3 display-text"
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