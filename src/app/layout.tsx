import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
})

export const metadata: Metadata = {
  title: 'Hush - Immersive Storytelling Platform',
  description: 'Some stories are meant to be heard in whispers. An open archive of fictional theories, mysteries, and stories told interactively.',
  keywords: ['storytelling', 'fiction', 'mystery', 'horror', 'conspiracy', 'interactive'],
  authors: [{ name: 'Nayeem Islam', url: 'https://github.com/NoManNayeem' }],
  creator: 'Nayeem Islam (NoManNayeem)',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nomannayeem.github.io/hush',
    title: 'Hush - Immersive Storytelling Platform',
    description: 'Some stories are meant to be heard in whispers.',
    siteName: 'Hush',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hush - Immersive Storytelling Platform',
    description: 'Some stories are meant to be heard in whispers.',
    creator: '@NoManNayeem',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
