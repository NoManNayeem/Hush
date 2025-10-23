'use client'

import { StoryBlock } from '@/lib/storyLoader'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface StoryBlockRendererProps {
  block: StoryBlock
  index: number
}

export default function StoryBlockRenderer({ block, index }: StoryBlockRendererProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const renderBlock = () => {
    switch (block.type) {
      case 'heading':
        return (
          <h1 className="story-heading animate-fade-in">
            {block.text}
          </h1>
        )

      case 'subheading':
        return (
          <h2 className="story-subheading animate-fade-in">
            {block.text}
          </h2>
        )

      case 'paragraph':
        return (
          <p className="story-text animate-fade-in">
            {block.text}
          </p>
        )

      case 'image':
        return (
          <div className="story-block animate-fade-in">
            <img
              src={block.src}
              alt={block.caption || ''}
              className="w-full max-w-4xl mx-auto rounded-lg shadow-lg"
              loading="lazy"
            />
            {block.caption && (
              <p className="text-center text-sm text-muted-foreground mt-2 italic">
                {block.caption}
              </p>
            )}
          </div>
        )

      case 'video':
        return (
          <div className="story-block animate-fade-in">
            <div className="w-full max-w-4xl mx-auto">
              <iframe
                src={block.src}
                className="w-full aspect-video rounded-lg shadow-lg"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin"
                title={block.caption || 'Video content'}
              />
              {block.caption && (
                <p className="text-center text-sm text-muted-foreground mt-2 italic">
                  {block.caption}
                </p>
              )}
            </div>
          </div>
        )

      case 'embed':
        return (
          <div className="story-block animate-fade-in">
            <div className="w-full max-w-4xl mx-auto p-4 bg-muted/50 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground mb-2">
                External Content
              </div>
              <iframe
                src={block.url}
                className="w-full aspect-video rounded-lg"
                sandbox="allow-scripts allow-same-origin"
                title="Embedded content"
              />
            </div>
          </div>
        )

      case 'quote':
        return (
          <blockquote className="story-block animate-fade-in">
            <div className="border-l-4 border-primary pl-6 py-4 bg-muted/30 rounded-r-lg">
              <p className="text-xl italic text-foreground/90 leading-relaxed">
                "{block.text}"
              </p>
              {block.author && (
                <footer className="mt-4 text-sm text-muted-foreground">
                  — {block.author}
                </footer>
              )}
            </div>
          </blockquote>
        )

      case 'code':
        return (
          <div className="story-block animate-fade-in">
            <div className="bg-muted rounded-lg p-4 border border-border">
              {block.language && (
                <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                  {block.language}
                </div>
              )}
              <pre className="text-sm text-foreground overflow-x-auto">
                <code>{block.code}</code>
              </pre>
            </div>
          </div>
        )

      case 'mermaid':
        return (
          <div className="story-block animate-fade-in">
            <div className="w-full max-w-4xl mx-auto p-4 bg-muted/30 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground mb-2">
                Diagram
              </div>
              <div className="mermaid-container">
                {/* Mermaid will be rendered here by dynamic import */}
                <div className="text-center text-muted-foreground py-8">
                  Loading diagram...
                </div>
              </div>
            </div>
          </div>
        )

      case 'reactflow':
        return (
          <div className="story-block animate-fade-in">
            <div className="w-full max-w-4xl mx-auto p-4 bg-muted/30 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground mb-2">
                Interactive Diagram
              </div>
              <div className="reactflow-container h-96">
                {/* ReactFlow will be rendered here by dynamic import */}
                <div className="text-center text-muted-foreground py-8">
                  Loading interactive diagram...
                </div>
              </div>
            </div>
          </div>
        )

      case 'three-scene':
        return (
          <div className="story-block animate-fade-in">
            <div className="w-full max-w-4xl mx-auto p-4 bg-muted/30 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground mb-2">
                3D Scene
              </div>
              <div className="three-scene-container h-96">
                {/* Three.js scene will be rendered here by dynamic import */}
                <div className="text-center text-muted-foreground py-8">
                  Loading 3D scene...
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="story-block animate-fade-in">
            <p className="text-muted-foreground italic">
              Unknown block type: {block.type}
            </p>
          </div>
        )
    }
  }

  return (
    <div className={cn(
      "story-block transition-all duration-500",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    )}>
      {renderBlock()}
    </div>
  )
}
