'use client'

import { useEffect, useState } from 'react'

interface ParticleBackgroundProps {
  count?: number
  opacity?: number
}

export default function ParticleBackground({ count = 50, opacity = 0.2 }: ParticleBackgroundProps) {
  const [particles, setParticles] = useState<Array<{
    left: number
    top: number
    animationDelay: number
    animationDuration: number
  }>>([])

  useEffect(() => {
    // Generate particles only on client side
    const generatedParticles = Array.from({ length: count }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 3,
      animationDuration: 2 + Math.random() * 3
    }))
    
    setParticles(generatedParticles)
  }, [count])

  return (
    <>
      {particles.map((particle, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full animate-pulse"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.animationDelay}s`,
            animationDuration: `${particle.animationDuration}s`,
            backgroundColor: `rgba(255, 255, 255, ${opacity})`
          }}
        />
      ))}
    </>
  )
}
