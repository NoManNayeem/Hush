/**
 * Simple, Working Audio System for Cinematic Storytelling
 */

class SimpleAudioManager {
  private sounds: Map<string, HTMLAudioElement> = new Map()
  private masterVolume = 0.7
  private isMuted = false

  // Load a sound file
  loadSound(id: string, src: string, options: { volume?: number; loop?: boolean } = {}): Promise<void> {
    return new Promise((resolve) => {
      const audio = new Audio(src)
      audio.volume = (options.volume || 1) * this.masterVolume
      audio.loop = options.loop || false
      
      audio.addEventListener('canplaythrough', () => {
        this.sounds.set(id, audio)
        resolve()
      })
      
      audio.addEventListener('error', () => {
        // Silently fail for missing audio files - this is expected in development
        console.warn(`Audio file not found: ${src}`)
        resolve() // Resolve anyway to prevent blocking
      })
    })
  }

  // Play a sound
  play(id: string): void {
    const sound = this.sounds.get(id)
    if (sound && !this.isMuted) {
      sound.currentTime = 0
      sound.play().catch(() => {
        // Audio play failed, likely due to autoplay restrictions
      })
    }
  }

  // Stop a sound
  stop(id: string): void {
    const sound = this.sounds.get(id)
    if (sound) {
      sound.pause()
      sound.currentTime = 0
    }
  }

  // Set volume
  setVolume(id: string, volume: number): void {
    const sound = this.sounds.get(id)
    if (sound) {
      sound.volume = volume * this.masterVolume
    }
  }

  // Mute/unmute all sounds
  toggleMute(): void {
    this.isMuted = !this.isMuted
    this.sounds.forEach(sound => {
      sound.muted = this.isMuted
    })
  }

  // Set master volume
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume))
    this.sounds.forEach(sound => {
      sound.volume = sound.volume / (this.masterVolume / volume)
    })
  }

  // Pause all sounds
  pauseAll(): void {
    this.sounds.forEach(sound => {
      sound.pause()
    })
  }

  // Resume all sounds
  resumeAll(): void {
    if (!this.isMuted) {
      this.sounds.forEach(sound => {
        sound.play().catch(() => {
          // Audio play failed
        })
      })
    }
  }
}

// Create and export a single instance
export const audioManager = new SimpleAudioManager()

// Initialize with some basic sounds (only if in browser)
if (typeof window !== 'undefined') {
  // Load basic sound effects with error handling
  Promise.all([
    audioManager.loadSound('pageTurn', '/audio/effects/page-turn.mp3', { volume: 0.3 }),
    audioManager.loadSound('typing', '/audio/effects/typewriter.mp3', { volume: 0.2 }),
    audioManager.loadSound('mysteryReveal', '/audio/effects/mystery-reveal.mp3', { volume: 0.4 }),
    audioManager.loadSound('backgroundMusic', '/audio/backgrounds/cinematic-ambient.mp3', { volume: 0.2, loop: true })
  ]).catch(() => {
    // All audio loading failed, which is fine for development
    console.info('Audio files not available - this is normal in development')
  })
}