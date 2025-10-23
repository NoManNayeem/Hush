const fs = require('fs')
const path = require('path')

// Function to generate sitemap.xml
function generateSitemap() {
  const indexPath = path.join(__dirname, '..', 'public', 'index.json')
  const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml')
  
  console.log('Generating sitemap...')
  
  // Check if index.json exists
  if (!fs.existsSync(indexPath)) {
    console.log('index.json not found, running generate-index.js first...')
    const { generateIndex } = require('./generate-index')
    generateIndex()
  }
  
  // Read the stories index
  let stories = []
  try {
    const indexContent = fs.readFileSync(indexPath, 'utf8')
    stories = JSON.parse(indexContent)
  } catch (error) {
    console.error('Error reading index.json:', error.message)
    return
  }
  
  // Base URL for the site (adjust for GitHub Pages)
  const baseUrl = 'https://nomannayeem.github.io/Hush'
  
  // Generate sitemap XML
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Explore page -->
  <url>
    <loc>${baseUrl}/explore</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Disclaimer page -->
  <url>
    <loc>${baseUrl}/disclaimer</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  
  <!-- Developer page -->
  <url>
    <loc>${baseUrl}/developer</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
`

  // Add story pages
  stories.forEach(story => {
    const lastmod = new Date(story.publishedAt).toISOString().split('T')[0]
    
    sitemap += `  
  <!-- Story: ${story.title} -->
  <url>
    <loc>${baseUrl}/story/${story.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
  })

  sitemap += `
</urlset>`

  // Write sitemap file
  fs.writeFileSync(outputPath, sitemap)
  
  console.log(`Sitemap generated successfully!`)
  console.log(`- ${stories.length} story pages included`)
  console.log(`- Output: ${outputPath}`)
  
  // Print summary
  console.log('\nPages included:')
  console.log('1. Homepage (/)')
  console.log('2. Explore (/explore)')
  console.log('3. Disclaimer (/disclaimer)')
  console.log('4. Developer (/developer)')
  stories.forEach((story, index) => {
    console.log(`${index + 5}. ${story.title} (/story/${story.slug})`)
  })
}

// Run the script
if (require.main === module) {
  generateSitemap()
}

module.exports = { generateSitemap }
