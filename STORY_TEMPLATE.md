# Story Template for Hush

This template provides a complete example of how to create a story for the Hush platform. Copy this template and modify it to create your own story.

## File Location

Place your story file in the `/stories` directory with the naming convention: `your-story-slug.js`

## Complete Story Template

```javascript
const story = {
  // Required: Unique identifier for the story (used in URLs)
  id: 'your-story-slug',
  
  // Required: Story title
  title: 'Your Story Title',
  
  // Required: Author name
  author: 'Your Name',
  
  // Required: Cover image URL (use high-quality images from Unsplash or similar)
  coverImage: 'https://images.unsplash.com/photo-1234567890?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80',
  
  // Required: Publication date (ISO format: YYYY-MM-DD)
  publishedAt: '2024-01-01',
  
  // Required: Array of categories (choose from existing or add new ones)
  categories: ['horror', 'mystery', 'conspiracy', 'sci-fi', 'theology', 'urban-legend', 'supernatural'],
  
  // Required: Array of keywords for search
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  
  // Required: Brief description (2-3 sentences)
  excerpt: 'A compelling description of your story that will appear in search results and story cards.',
  
  // Required: Estimated reading time
  readingTime: '10 min',
  
  // Required: Array of story blocks (the main content)
  blocks: [
    // Heading block
    {
      type: 'heading',
      text: 'Chapter 1: The Beginning'
    },
    
    // Paragraph block
    {
      type: 'paragraph',
      text: 'Your story content goes here. This is where you tell your tale, building atmosphere and engaging the reader with compelling narrative.'
    },
    
    // Image block
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1234567890?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80',
      caption: 'Optional caption for the image'
    },
    
    // Subheading block
    {
      type: 'subheading',
      text: 'A New Discovery'
    },
    
    // Video block
    {
      type: 'video',
      src: 'https://www.youtube.com/watch?v=VIDEO_ID',
      caption: 'Optional caption for the video'
    },
    
    // Mermaid diagram block
    {
      type: 'mermaid',
      code: `graph TD
        A[Start] --> B[Discovery]
        B --> C[Investigation]
        C --> D[Revelation]
        D --> E[Conclusion]`,
      caption: 'Optional caption for the diagram'
    },
    
    // ReactFlow diagram block
    {
      type: 'reactflow',
      nodes: [
        { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
        { id: '2', position: { x: 200, y: 0 }, data: { label: 'Node 2' } }
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' }
      ],
      caption: 'Optional caption for the network diagram'
    },
    
    // Three.js scene block
    {
      type: 'three-scene',
      sceneId: 'your-scene-id',
      props: { intensity: 0.5, color: '#ff0000' },
      caption: 'Optional caption for the 3D scene'
    },
    
    // Embed block (for external content)
    {
      type: 'embed',
      src: 'https://example.com/embed',
      caption: 'Optional caption for the embedded content'
    },
    
    // Quote block
    {
      type: 'quote',
      text: 'This is an important quote from your story.',
      author: 'Character Name'
    },
    
    // Code block
    {
      type: 'code',
      code: `function mysteriousFunction() {
  return "Something mysterious";
}`,
      language: 'javascript'
    }
  ]
};

// Required: Export the story as default
export default story;
```

## Block Types Reference

### Text Blocks
- **`heading`**: Main chapter/section titles
- **`subheading`**: Subsection titles
- **`paragraph`**: Regular text content

### Media Blocks
- **`image`**: Images with optional captions
- **`video`**: Video embeds (YouTube, Vimeo, etc.)
- **`embed`**: External content embeds

### Interactive Blocks
- **`mermaid`**: Flowcharts, diagrams, and graphs
- **`reactflow`**: Interactive node networks
- **`three-scene`**: 3D scenes and visualizations

### Content Blocks
- **`quote`**: Important quotes with optional attribution
- **`code`**: Code snippets with syntax highlighting

## Best Practices

### Story Structure
1. **Hook**: Start with an engaging opening
2. **Build**: Develop the narrative with varied block types
3. **Climax**: Use interactive elements for key moments
4. **Resolution**: Provide satisfying conclusion

### Content Guidelines
- **Length**: Aim for 15-25 blocks per story
- **Reading Time**: 8-15 minutes is ideal
- **Images**: Use high-quality, atmospheric images
- **Categories**: Choose 2-4 relevant categories
- **Keywords**: Include 5-10 descriptive keywords

### Technical Notes
- **Images**: Use Unsplash or similar for high-quality, free images
- **Videos**: YouTube and Vimeo URLs work best
- **Mermaid**: Use standard Mermaid syntax
- **ReactFlow**: Provide nodes and edges arrays
- **Three.js**: Reference scene IDs from the platform

## Example Categories

- **Horror**: Supernatural, psychological, cosmic
- **Mystery**: Detective, investigation, puzzle
- **Conspiracy**: Government, corporate, secret societies
- **Sci-fi**: Space, technology, future
- **Theology**: Religious, spiritual, metaphysical
- **Urban Legend**: Folklore, local stories, myths
- **Supernatural**: Ghosts, paranormal, unexplained

## Submission Process

1. Create your story file in `/stories/`
2. Test locally with `npm run dev`
3. Submit a pull request to the repository
4. Include a brief description of your story in the PR

## Need Help?

- Check existing stories in `/stories/` for examples
- Review the [Contributing Guide](CONTRIBUTING.md)
- Open an issue for questions or suggestions

---

*Happy storytelling! 🕶️*
