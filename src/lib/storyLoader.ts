// Story loader and schema definitions for Hush platform

export type StoryBlockType = 
  | 'heading' 
  | 'subheading' 
  | 'paragraph' 
  | 'image' 
  | 'video' 
  | 'mermaid' 
  | 'reactflow' 
  | 'three-scene' 
  | 'embed' 
  | 'quote' 
  | 'code';

export interface BaseStoryBlock {
  type: StoryBlockType;
  caption?: string;
}

export interface TextStoryBlock extends BaseStoryBlock {
  type: 'heading' | 'subheading' | 'paragraph';
  text: string;
}

export interface MediaStoryBlock extends BaseStoryBlock {
  type: 'image' | 'video' | 'embed';
  src: string;
  caption?: string;
}

export interface CodeStoryBlock extends BaseStoryBlock {
  type: 'code';
  code: string;
  language?: string;
}

export interface MermaidStoryBlock extends BaseStoryBlock {
  type: 'mermaid';
  code: string;
}

export interface ReactFlowStoryBlock extends BaseStoryBlock {
  type: 'reactflow';
  nodes: Array<{
    id: string;
    type: string;
    position: { x: number; y: number };
    data: Record<string, unknown>;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    type?: string;
  }>;
}

export interface ThreeSceneStoryBlock extends BaseStoryBlock {
  type: 'three-scene';
  sceneId: string;
  props?: Record<string, unknown>;
}

export interface QuoteStoryBlock extends BaseStoryBlock {
  type: 'quote';
  text: string;
  author?: string;
}

export type StoryBlock = 
  | TextStoryBlock
  | MediaStoryBlock
  | CodeStoryBlock
  | MermaidStoryBlock
  | ReactFlowStoryBlock
  | ThreeSceneStoryBlock
  | QuoteStoryBlock;

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

// Enhanced story validation
export function validateStoryBlock(block: unknown): block is StoryBlock {
  if (!block || typeof block !== 'object') return false;
  
  const storyBlock = block as Record<string, unknown>;
  
  if (!storyBlock.type || typeof storyBlock.type !== 'string') return false;
  
  const validTypes: StoryBlockType[] = [
    'heading', 'subheading', 'paragraph', 'image', 'video', 
    'mermaid', 'reactflow', 'three-scene', 'embed', 'quote', 'code'
  ];
  
  if (!validTypes.includes(storyBlock.type as StoryBlockType)) return false;
  
  // Type-specific validation
  switch (storyBlock.type) {
    case 'heading':
    case 'subheading':
    case 'paragraph':
    case 'quote':
      return typeof storyBlock.text === 'string';
    case 'image':
    case 'video':
    case 'embed':
      return typeof storyBlock.src === 'string';
    case 'code':
      return typeof storyBlock.code === 'string';
    case 'mermaid':
      return typeof storyBlock.code === 'string';
    case 'reactflow':
      return Array.isArray(storyBlock.nodes) && Array.isArray(storyBlock.edges);
    case 'three-scene':
      return typeof storyBlock.sceneId === 'string';
    default:
      return false;
  }
}

// Enhanced story validation
export function validateStory(story: unknown): story is Story {
  if (!story || typeof story !== 'object') return false;
  
  const storyObj = story as Record<string, unknown>;
  
  // Required string fields
  const requiredStringFields = ['id', 'title', 'author', 'coverImage', 'publishedAt', 'excerpt', 'readingTime'];
  for (const field of requiredStringFields) {
    if (typeof storyObj[field] !== 'string') return false;
  }
  
  // Required array fields
  if (!Array.isArray(storyObj.categories) || !Array.isArray(storyObj.keywords) || !Array.isArray(storyObj.blocks)) {
    return false;
  }
  
  // Validate all blocks
  return storyObj.blocks.every(validateStoryBlock);
}

// Dynamic story loader with enhanced error handling
export async function loadStory(slug: string): Promise<Story | null> {
  try {
    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      console.error(`Invalid story slug format: ${slug}`);
      return null;
    }
    
    // Dynamic import of story file
    const storyModule = await import(`../../stories/${slug}.js`);
    const story = storyModule.default;
    
    // Validate story structure
    if (!validateStory(story)) {
      console.error(`Invalid story structure for ${slug}:`, story);
      return null;
    }
    
    return story;
  } catch (error) {
    console.error(`Error loading story ${slug}:`, error);
    return null;
  }
}

// Get all available story slugs with caching
let cachedSlugs: string[] | null = null;

export async function getAllStorySlugs(): Promise<string[]> {
  if (cachedSlugs) {
    return cachedSlugs;
  }
  
  // This would typically scan the stories directory
  // For now, we'll return a hardcoded list that will be updated by build scripts
  const slugs = [
    'lightless-town',
    'nephilim-archives', 
    'operation-moonfall',
    'infinite-staircase',
    'last-transmission'
  ];
  
  cachedSlugs = slugs;
  return slugs;
}

// Calculate reading time from blocks
export function calculateReadingTime(blocks: StoryBlock[]): string {
  const textBlocks = blocks.filter(block => 
    block.type === 'paragraph' || 
    block.type === 'heading' || 
    block.type === 'subheading'
  );
  
  const totalWords = textBlocks.reduce((count, block) => {
    if (block.type === 'paragraph' || block.type === 'heading' || block.type === 'subheading') {
      return count + (block.text?.split(' ').length || 0);
    }
    return count;
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
