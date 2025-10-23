import { notFound } from 'next/navigation'
import { loadStory, generateStoryMetadata, getAllStorySlugs } from '@/lib/storyLoader'
import Storyboard from '@/components/Storyboard'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface StoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const slugs = await getAllStorySlugs()
  return slugs.map((slug) => ({
    slug: slug,
  }))
}

export async function generateMetadata({ params }: StoryPageProps) {
  const { slug } = await params
  const story = await loadStory(slug)
  
  if (!story) {
    return {
      title: 'Story Not Found — Hush',
      description: 'The requested story could not be found.',
    }
  }

  return generateStoryMetadata(story)
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params
  const story = await loadStory(slug)
  
  if (!story) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Storyboard story={story} />
      <Footer />
    </div>
  )
}
