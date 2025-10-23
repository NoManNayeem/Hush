import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo and tagline */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="text-lg font-bold text-foreground">Hush</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Some stories are meant to be heard in whispers.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
            <Link 
              href="/disclaimer" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Disclaimer
            </Link>
            <Link 
              href="/developer" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Developer
            </Link>
            <Link 
              href="https://github.com/NoManNayeem/hush" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contribute
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
            <p>
              © 2025 Hush. All stories are fictional.
            </p>
            <p className="mt-2 md:mt-0">
              Created by{' '}
              <Link 
                href="https://github.com/NoManNayeem" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Nayeem Islam
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
