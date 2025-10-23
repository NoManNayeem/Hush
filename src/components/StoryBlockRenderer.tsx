import React from 'react';
import { StoryBlock } from '@/lib/storyLoader';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamically import heavy components
const MermaidRenderer = dynamic(() => import('./renderers/MermaidRenderer'), { ssr: false });
const ReactFlowRenderer = dynamic(() => import('./renderers/ReactFlowRenderer'), { ssr: false });
const ThreeSceneRenderer = dynamic(() => import('./renderers/ThreeSceneRenderer'), { ssr: false });
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

interface StoryBlockRendererProps {
  block: StoryBlock;
}

export default function StoryBlockRenderer({ block }: StoryBlockRendererProps) {
  switch (block.type) {
    case 'heading':
      return (
        <div className="my-12 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 leading-tight">
            {block.text}
          </h2>
        </div>
      );
    case 'subheading':
      return (
        <div className="my-8 text-center">
          <h3 className="text-3xl md:text-4xl font-semibold text-white/90 leading-tight">
            {block.text}
          </h3>
        </div>
      );
    case 'paragraph':
      return (
        <div className="my-8 max-w-3xl mx-auto">
          <p className="text-xl leading-relaxed text-white/80 font-light">
            {block.text}
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
              <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-2xl">
                <ReactPlayer
                  url={block.src}
                  controls
                  width="100%"
                  height="100%"
                  className="rounded-lg"
                />
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
            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl border border-white/10">
              {block.src && (
                <iframe
                  src={block.src}
                  title={block.caption || 'Embedded content'}
                  className="w-full h-full"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />
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
            <div className="relative bg-gray-900/90 backdrop-blur-sm p-6 rounded-lg shadow-2xl border border-white/10 overflow-auto">
              <pre className="text-green-400 text-sm leading-relaxed">
                <code>{block.code}</code>
              </pre>
            </div>
          </div>
        </div>
      );
    default:
      return (
        <div className="my-8 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-400">Unknown block type: {block.type}</p>
        </div>
      );
  }
}