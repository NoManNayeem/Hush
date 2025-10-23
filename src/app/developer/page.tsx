import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Github, ExternalLink, Heart, Code, BookOpen } from 'lucide-react'
import Image from 'next/image'

export default function DeveloperPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-white font-bold text-3xl">H</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            About Hush
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            An immersive storytelling platform built with passion for creative exploration and interactive narratives.
          </p>
        </div>

        {/* Creator Section */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Created by Nayeem Islam
          </h2>
          
          <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 shadow-lg">
              <Image
                src="https://avatars.githubusercontent.com/u/60138887?v=4"
                alt="Nayeem Islam (NoManNayeem)"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nayeem Islam (NoManNayeem)
              </h3>
              <p className="text-foreground/80 mb-4">
                Full-stack developer passionate about creating immersive digital experiences. 
                I believe in the power of storytelling to connect, inspire, and explore the boundaries of imagination.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex items-center space-x-2"
                >
                  <a href="https://github.com/NoManNayeem" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                    <span>GitHub</span>
                  </a>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex items-center space-x-2"
                >
                  <a href="https://github.com/NoManNayeem/hush" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    <span>Hush Repository</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Project Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Code className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                Technology Stack
              </h3>
            </div>
            <ul className="text-sm text-foreground/80 space-y-2">
              <li>• Next.js 15 with App Router</li>
              <li>• React 18 with TypeScript</li>
              <li>• Tailwind CSS + shadcn/ui</li>
              <li>• GSAP for animations</li>
              <li>• Three.js for 3D scenes</li>
              <li>• Mermaid + ReactFlow for diagrams</li>
              <li>• Fuse.js for search</li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                Project Vision
              </h3>
            </div>
            <p className="text-sm text-foreground/80">
              Hush aims to revolutionize digital storytelling by combining traditional narrative 
              with interactive elements, animations, and immersive experiences. Every story becomes 
              a journey of discovery.
            </p>
          </div>
        </div>

        {/* Contributing */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Contributing to Hush
          </h2>
          
          <p className="text-foreground/80 mb-6">
            Hush is an open-source project that welcomes contributions from storytellers, 
            developers, and creative minds. Whether you want to add a new story, improve 
            the platform, or suggest new features, we'd love to have you involved.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-3xl mb-2">📝</div>
              <h4 className="font-semibold text-foreground mb-2">Write Stories</h4>
              <p className="text-sm text-foreground/70">
                Contribute your own fictional tales and interactive narratives
              </p>
            </div>
            
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-3xl mb-2">🔧</div>
              <h4 className="font-semibold text-foreground mb-2">Improve Platform</h4>
              <p className="text-sm text-foreground/70">
                Help enhance the technical foundation and user experience
              </p>
            </div>
            
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-3xl mb-2">💡</div>
              <h4 className="font-semibold text-foreground mb-2">Suggest Features</h4>
              <p className="text-sm text-foreground/70">
                Share ideas for new capabilities and storytelling tools
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <a href="https://github.com/NoManNayeem/hush" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-2" />
                View on GitHub
              </a>
            </Button>
            
            <Button variant="outline" asChild>
              <a href="https://github.com/NoManNayeem/hush/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer">
                <BookOpen className="h-4 w-4 mr-2" />
                Contributing Guide
              </a>
            </Button>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center py-8">
          <div className="flex items-center justify-center space-x-2 text-muted-foreground mb-4">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>for storytellers everywhere</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 Hush. All stories are fictional. Built with Next.js and deployed on GitHub Pages.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
