const fs = require('fs')
const path = require('path')

// Function to extract metadata from a story file
function extractStoryMetadata(filePath) {
  try {
    // Read the story file
    const storyContent = fs.readFileSync(filePath, 'utf8')
    
    // Use a simpler approach - require the file directly
    // This is safer than regex parsing for complex objects
    delete require.cache[require.resolve(filePath)]
    const storyModule = require(filePath)
    const story = storyModule.default || storyModule
    
    // Validate that we have the required fields
    if (!story.id || !story.title || !story.author) {
      console.warn(`Story ${filePath} is missing required fields`)
      return null
    }
    
    // Return only the metadata needed for the index
    return {
      id: story.id,
      title: story.title,
      author: story.author,
      excerpt: story.excerpt || '',
      categories: story.categories || [],
      keywords: story.keywords || [],
      slug: story.id,
      publishedAt: story.publishedAt || new Date().toISOString().split('T')[0],
      coverImage: story.coverImage || '/assets/default-cover.jpg',
      readingTime: story.readingTime || '5 min'
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message)
    return null
  }
}

// Function to scan the stories directory
function generateIndex() {
  const storiesDir = path.join(__dirname, '..', 'stories')
  const outputPath = path.join(__dirname, '..', 'public', 'index.json')
  
  console.log('Scanning stories directory...')
  
  if (!fs.existsSync(storiesDir)) {
    console.log('Stories directory does not exist, creating empty index...')
    fs.writeFileSync(outputPath, JSON.stringify([], null, 2))
    return
  }
  
  const files = fs.readdirSync(storiesDir)
  const storyFiles = files.filter(file => file.endsWith('.js'))
  
  console.log(`Found ${storyFiles.length} story files`)
  
  const stories = []
  
  for (const file of storyFiles) {
    const filePath = path.join(storiesDir, file)
    console.log(`Processing ${file}...`)
    
    const metadata = extractStoryMetadata(filePath)
    if (metadata) {
      stories.push(metadata)
      console.log(`✓ Added ${metadata.title}`)
    } else {
      console.log(`✗ Failed to process ${file}`)
    }
  }
  
  // Sort stories by publication date (newest first)
  stories.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
  
  // Write the index file
  fs.writeFileSync(outputPath, JSON.stringify(stories, null, 2))
  
  console.log(`\nIndex generated successfully!`)
  console.log(`- ${stories.length} stories indexed`)
  console.log(`- Output: ${outputPath}`)
  
  // Print summary
  console.log('\nStories:')
  stories.forEach((story, index) => {
    console.log(`${index + 1}. ${story.title} by ${story.author} (${story.categories.join(', ')})`)
  })
}

// Run the script
if (require.main === module) {
  generateIndex()
}

module.exports = { generateIndex, extractStoryMetadata }
