import React from 'react';
import { StoryBlock, validateStoryBlock } from '@/lib/storyLoader';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import TypingAnimation from './TypingAnimation';
import { StoryBlockSkeleton } from './LoadingSpinner';
import { reportError } from './ErrorBoundary';

// Dynamically import heavy components with error boundaries
const MermaidRenderer = dynamic(() => import('./renderers/MermaidRenderer'), { 
  ssr: false,
  loading: () => <StoryBlockSkeleton />
});
const ReactFlowRenderer = dynamic(() => import('./renderers/ReactFlowRenderer'), { 
  ssr: false,
  loading: () => <StoryBlockSkeleton />
});
const ThreeSceneRenderer = dynamic(() => import('./renderers/ThreeSceneRenderer'), { 
  ssr: false,
  loading: () => <StoryBlockSkeleton />
});
const ReactPlayer = dynamic(() => import('react-player/lazy'), { 
  ssr: false,
  loading: () => <StoryBlockSkeleton />
});

interface StoryBlockRendererProps {
  block: StoryBlock;
  enableTyping?: boolean;
  typingSpeed?: number;
  onTypingCharacter?: () => void;
}

export default function StoryBlockRenderer({ 
  block, 
  enableTyping = false, 
  typingSpeed = 50, 
  onTypingCharacter 
}: StoryBlockRendererProps) {
  // Validate block structure
  if (!validateStoryBlock(block)) {
    console.error('Invalid story block:', block);
    reportError(new Error('Invalid story block structure'), 'StoryBlockRenderer');
    return (
      <div className="my-8 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
        <p className="text-red-400">Invalid story block format</p>
      </div>
    );
  }

  try {
    switch (block.type) {
    case 'heading':
      return (
        <div className="my-12 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 leading-tight">
            {enableTyping ? (
              <TypingAnimation 
                text={block.text || ''} 
                speed={typingSpeed} 
                onCharacter={onTypingCharacter || (() => {})}
                className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400"
              />
            ) : (
              block.text
            )}
          </h2>
        </div>
      );
    case 'subheading':
      return (
        <div className="my-8 text-center">
          <h3 className="text-3xl md:text-4xl font-semibold text-white/90 leading-tight">
            {enableTyping ? (
              <TypingAnimation 
                text={block.text || ''} 
                speed={typingSpeed} 
                onCharacter={onTypingCharacter || (() => {})}
                className="text-3xl md:text-4xl font-semibold text-white/90"
              />
            ) : (
              block.text
            )}
          </h3>
        </div>
      );
    case 'paragraph':
      return (
        <div className="my-8 max-w-3xl mx-auto">
          <p className="text-xl leading-relaxed text-white/80 font-light">
            {enableTyping ? (
              <TypingAnimation 
                text={block.text || ''} 
                speed={typingSpeed} 
                onCharacter={onTypingCharacter || (() => {})}
                className="text-xl leading-relaxed text-white/80 font-light"
              />
            ) : (
              block.text
            )}
          </p>
        </div>
      );
    case 'image':
      return (
        <div className="my-12">
          {block.src && (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative overflow-hidden rounded-lg shadow-2xl">
                <Image
                  src={block.src}
                  alt={block.caption || 'Story image'}
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              {block.caption && (
                <p className="text-sm text-white/60 mt-4 text-center italic">
                  {block.caption}
                </p>
              )}
            </div>
          )}
        </div>
      );
    case 'video':
      return (
        <div className="my-12">
          {block.src && (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-2xl border border-white/10">
                <ReactPlayer
                  url={block.src}
                  controls
                  width="100%"
                  height="100%"
                  className="rounded-lg"
                  config={{
                    youtube: {
                      playerVars: {
                        modestbranding: 1,
                        rel: 0,
                        showinfo: 0
                      }
                    },
                    vimeo: {
                      playerOptions: {
                        responsive: true,
                        autopause: true
                      }
                    }
                  }}
                  light={
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-900/20 to-cyan-900/20">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                        <p className="text-white/80 text-sm">Click to play video</p>
                      </div>
                    </div>
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
              </div>
              {block.caption && (
                <p className="text-sm text-white/60 mt-4 text-center italic">
                  {block.caption}
                </p>
              )}
            </div>
          )}
        </div>
      );
    case 'mermaid':
      return (
        <div className="my-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-black/50 backdrop-blur-sm p-6 rounded-lg shadow-2xl border border-white/10 overflow-auto">
              {block.code && <MermaidRenderer chart={block.code} />}
            </div>
            {block.caption && (
              <p className="text-sm text-white/60 mt-4 text-center italic">
                {block.caption}
              </p>
            )}
          </div>
        </div>
      );
    case 'reactflow':
      return (
        <div className="my-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative h-96 bg-black/50 backdrop-blur-sm p-4 rounded-lg shadow-2xl border border-white/10">
              {block.nodes && block.edges && (
                <ReactFlowRenderer nodes={block.nodes} edges={block.edges} />
              )}
            </div>
            {block.caption && (
              <p className="text-sm text-white/60 mt-4 text-center italic">
                {block.caption}
              </p>
            )}
          </div>
        </div>
      );
    case 'three-scene':
      return (
        <div className="my-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative h-96 w-full bg-black rounded-lg overflow-hidden shadow-2xl border border-white/10">
              {block.sceneId && <ThreeSceneRenderer sceneId={block.sceneId} {...block.props} />}
            </div>
            {block.caption && (
              <p className="text-sm text-white/60 mt-4 text-center italic">
                {block.caption}
              </p>
            )}
          </div>
        </div>
      );
    case 'embed':
      return (
        <div className="my-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl border border-white/10 bg-black/20">
              {block.src && (
                <>
                  <iframe
                    src={block.src}
                    title={block.caption || 'Embedded content'}
                    className="w-full h-full"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                    External Content
                  </div>
                </>
              )}
            </div>
            {block.caption && (
              <p className="text-sm text-white/60 mt-4 text-center italic">
                {block.caption}
              </p>
            )}
          </div>
        </div>
      );
    case 'quote':
      return (
        <div className="my-12 max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-full"></div>
            <blockquote className="pl-8 italic text-2xl text-white/90 leading-relaxed">
              <p className="mb-4">"{block.text}"</p>
              {block.author && (
                <footer className="text-lg text-right not-italic text-white/60 mt-4">
                  — {block.author}
                </footer>
              )}
            </blockquote>
          </div>
        </div>
      );
    case 'code':
      return (
        <div className="my-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-2xl border border-white/10 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-400 ml-2">
                    {block.language || 'code'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (block.code) {
                      navigator.clipboard.writeText(block.code)
                    }
                  }}
                  className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5"
                >
                  Copy
                </button>
              </div>
              
              {/* Code content */}
              <div className="p-6 overflow-auto max-h-96">
                <pre className="text-green-400 text-sm leading-relaxed font-mono">
                  <code>{block.code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      );
    default:
      return (
        <div className="my-8 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-400">Unknown block type: {(block as any).type}</p>
        </div>
      );
    }
  } catch (error) {
    console.error('Error rendering story block:', error);
    reportError(error as Error, 'StoryBlockRenderer');
    return (
      <div className="my-8 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
        <p className="text-red-400">Error rendering story block</p>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-2">
            <summary className="cursor-pointer text-sm text-red-300">Error Details</summary>
            <pre className="mt-2 text-xs text-red-200 bg-red-900/20 p-2 rounded overflow-auto">
              {error instanceof Error ? error.message : String(error)}
            </pre>
          </details>
        )}
      </div>
    );
  }
}