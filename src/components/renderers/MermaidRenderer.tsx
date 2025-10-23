'use client'

import { useEffect, useRef } from 'react'

interface MermaidRendererProps {
  chart: string
}

export default function MermaidRenderer({ chart }: MermaidRendererProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const renderChart = async () => {
      if (!ref.current) return

      try {
        // Dynamically import mermaid
        const mermaid = await import('mermaid')
        
        // Initialize mermaid if not already done
        if (!(mermaid.default as any).initialize) {
          (mermaid.default as any).initialize({
            startOnLoad: false,
            theme: 'dark',
            themeVariables: {
              primaryColor: '#8b5cf6',
              primaryTextColor: '#ffffff',
              primaryBorderColor: '#06b6d4',
              lineColor: '#ffffff',
              sectionBkgColor: '#1a1a1a',
              altSectionBkgColor: '#2a2a2a',
              gridColor: '#333333',
              textColor: '#ffffff',
              taskBkgColor: '#8b5cf6',
              taskTextColor: '#ffffff',
              taskTextLightColor: '#ffffff',
              taskTextOutsideColor: '#ffffff',
              taskTextClickableColor: '#06b6d4',
              activeTaskBkgColor: '#06b6d4',
              activeTaskBorderColor: '#06b6d4',
              section0: '#8b5cf6',
              section1: '#06b6d4',
              section2: '#10b981',
              section3: '#f59e0b',
              altSection: '#1a1a1a',
              grid: '#333333'
            }
          })
        }

        // Clear previous content
        ref.current.innerHTML = ''
        
        // Render the chart
        const { svg } = await (mermaid.default as any).render(`mermaid-${Date.now()}`, chart)
        ref.current.innerHTML = svg
      } catch (error) {
        console.error('Error rendering mermaid chart:', error)
        if (ref.current) {
          ref.current.innerHTML = '<p class="text-red-400">Error rendering chart</p>'
        }
      }
    }

    renderChart()
  }, [chart])

  return (
    <div 
      ref={ref} 
      className="w-full h-full flex items-center justify-center"
    />
  )
}
