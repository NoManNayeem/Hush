'use client'

// import { Suspense } from 'react'

interface ThreeSceneRendererProps {
  sceneId: string
  [key: string]: any
}

// Simplified scene renderer that shows a placeholder for now
export default function ThreeSceneRenderer({ sceneId }: ThreeSceneRendererProps) {
  const getSceneStyle = () => {
    switch (sceneId) {
      case 'horror':
        return {
          background: 'radial-gradient(circle, #1a1a1a 0%, #000000 100%)',
          color: '#ff6b6b'
        }
      case 'scifi':
        return {
          background: 'radial-gradient(circle, #0a0a0a 0%, #001122 100%)',
          color: '#06b6d4'
        }
      case 'mystery':
        return {
          background: 'radial-gradient(circle, #2a1a2a 0%, #1a0a1a 100%)',
          color: '#8b5cf6'
        }
      case 'theology':
        return {
          background: 'radial-gradient(circle, #2a2a0a 0%, #1a1a00 100%)',
          color: '#fbbf24'
        }
      case 'conspiracy':
        return {
          background: 'radial-gradient(circle, #2a0a0a 0%, #1a0000 100%)',
          color: '#ef4444'
        }
      default:
        return {
          background: 'radial-gradient(circle, #1a1a2a 0%, #0a0a1a 100%)',
          color: '#8b5cf6'
        }
    }
  }

  const sceneStyle = getSceneStyle()

  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-50"
        style={{ background: sceneStyle.background }}
      />
      
      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: sceneStyle.color,
              opacity: Math.random() * 0.5 + 0.3,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Scene content */}
      <div className="relative z-10 text-center">
        <div 
          className="text-6xl mb-4 animate-pulse"
          style={{ color: sceneStyle.color }}
        >
          {sceneId === 'horror' && '👻'}
          {sceneId === 'scifi' && '🚀'}
          {sceneId === 'mystery' && '🔍'}
          {sceneId === 'theology' && '⛪'}
          {sceneId === 'conspiracy' && '🕵️'}
          {!['horror', 'scifi', 'mystery', 'theology', 'conspiracy'].includes(sceneId) && '🎭'}
        </div>
        <div 
          className="text-lg font-semibold"
          style={{ color: sceneStyle.color }}
        >
          {sceneId.charAt(0).toUpperCase() + sceneId.slice(1)} Scene
        </div>
      </div>
    </div>
  )
}