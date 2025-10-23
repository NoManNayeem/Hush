// Story loader and schema definitions for Hush platform

export interface StoryBlock {
  type: 'heading' | 'subheading' | 'paragraph' | 'image' | 'video' | 'mermaid' | 'reactflow' | 'three-scene' | 'embed' | 'quote' | 'code';
  text?: string;
  src?: string;
  caption?: string;
  code?: string;
  nodes?: any[];
  edges?: any[];
  sceneId?: string;
  props?: Record<string, any>;
  url?: string;
  author?: string;
  language?: string;
}

export interface Story {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  publishedAt: string;
  categories: string[];
  keywords: string[];
  excerpt: string;
  readingTime: string;
  blocks: StoryBlock[];
}

// Dynamic story loader
export async function loadStory(slug: string): Promise<Story | null> {
  try {
    // Dynamic import of story file
    const storyModule = await import(`../../stories/${slug}.js`);
    return storyModule.default as Story;
  } catch (error) {
    console.error(`Error loading story ${slug}:`, error);
    return null;
  }
}

// Get all available story slugs
export async function getAllStorySlugs(): Promise<string[]> {
  // This would typically scan the stories directory
  // For now, we'll return a hardcoded list that will be updated by build scripts
  return [
    'lightless-town',
    'nephilim-archives', 
    'operation-moonfall',
    'infinite-staircase',
    'last-transmission'
  ];
}

// Validate story schema
export function validateStory(story: any): story is Story {
  return (
    typeof story === 'object' &&
    typeof story.id === 'string' &&
    typeof story.title === 'string' &&
    typeof story.author === 'string' &&
    typeof story.coverImage === 'string' &&
    typeof story.publishedAt === 'string' &&
    Array.isArray(story.categories) &&
    Array.isArray(story.keywords) &&
    typeof story.excerpt === 'string' &&
    typeof story.readingTime === 'string' &&
    Array.isArray(story.blocks)
  );
}

// Calculate reading time from blocks
export function calculateReadingTime(blocks: StoryBlock[]): string {
  const textBlocks = blocks.filter(block => 
    block.type === 'paragraph' || 
    block.type === 'heading' || 
    block.type === 'subheading'
  );
  
  const totalWords = textBlocks.reduce((count, block) => {
    return count + (block.text?.split(' ').length || 0);
  }, 0);
  
  const minutes = Math.ceil(totalWords / 200); // Average reading speed
  return `${minutes} min`;
}

// Generate story metadata for SEO
export function generateStoryMetadata(story: Story) {
  return {
    title: `${story.title} — Hush`,
    description: story.excerpt,
    keywords: story.keywords.join(', '),
    openGraph: {
      title: story.title,
      description: story.excerpt,
      images: [story.coverImage],
      type: 'article',
      publishedTime: story.publishedAt,
      authors: [story.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: story.title,
      description: story.excerpt,
      images: [story.coverImage],
    },
  };
}
