# 🕶️ Hush - Immersive Storytelling Platform

> Some stories are meant to be heard in whispers.

Hush is an open-source, immersive storytelling platform that transforms traditional narratives into interactive experiences. Built with Next.js, GSAP animations, and Three.js, it creates cinematic storyboards that make readers feel something real.

## ✨ Features

- **Immersive Storytelling**: Stories unfold with animations, imagery, and interactive elements
- **Multiple Block Types**: Text, images, videos, Mermaid diagrams, ReactFlow networks, and 3D scenes
- **Focus Mode**: Distraction-free reading experience
- **Bookmarks & Reactions**: Save favorites and react with emojis
- **Search & Discovery**: Find stories by keywords, categories, or authors
- **Mobile-First**: Responsive design optimized for all devices
- **Static Export**: Deploy anywhere with GitHub Pages, Vercel, or Netlify

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NoManNayeem/hush.git
   cd hush
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Generate story index**
   ```bash
   npm run gen:index
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 How to Add Stories

### Method 1: JavaScript Story Files

Create a new file in the `/stories` directory:

```javascript
// stories/my-story.js
const story = {
  id: 'my-story',
  title: 'My Amazing Story',
  author: 'Your Name',
  coverImage: '/assets/my-cover.jpg',
  publishedAt: '2025-01-01',
  categories: ['mystery', 'horror'],
  keywords: ['keyword1', 'keyword2'],
  excerpt: 'A brief description of your story...',
  readingTime: '5 min',
  blocks: [
    {
      type: 'heading',
      text: 'Chapter 1'
    },
    {
      type: 'paragraph',
      text: 'Your story content goes here...'
    },
    {
      type: 'image',
      src: 'https://example.com/image.jpg',
      caption: 'Optional caption'
    }
    // ... more blocks
  ]
}

export default story
```

### Method 2: Markdown Files (Coming Soon)

Support for Markdown files with YAML frontmatter is planned for future releases.

## 🎨 Block Types

Hush supports various block types for rich storytelling:

- **Text**: `heading`, `subheading`, `paragraph`
- **Media**: `image`, `video`, `embed`
- **Interactive**: `mermaid`, `reactflow`, `three-scene`
- **Content**: `quote`, `code`

## 🛠️ Development

### Project Structure

```
hush/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   └── lib/                 # Utilities and helpers
├── stories/                 # Story files
├── scripts/                 # Build scripts
├── public/                  # Static assets
└── .github/workflows/       # GitHub Actions
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run export` - Export static site
- `npm run gen:index` - Generate story index
- `npm run gen:sitemap` - Generate sitemap

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **Animation**: GSAP + ScrollTrigger
- **3D**: Three.js + @react-three/fiber
- **Diagrams**: Mermaid + ReactFlow
- **Search**: Fuse.js
- **Icons**: React Icons

## 🚀 Deployment

### GitHub Pages

1. Push your code to GitHub
2. Enable GitHub Pages in repository settings
3. The GitHub Action will automatically deploy on content changes

### Vercel

1. Connect your GitHub repository to Vercel
2. Deploy automatically on every push

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build:export`
3. Set publish directory: `out`

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Ways to Contribute

- **Write Stories**: Add your own fictional tales
- **Improve Platform**: Enhance features and user experience
- **Report Issues**: Help us identify and fix bugs
- **Suggest Features**: Share ideas for new capabilities

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Creator

**Nayeem Islam (NoManNayeem)**
- GitHub: [@NoManNayeem](https://github.com/NoManNayeem)
- Project: [Hush Repository](https://github.com/NoManNayeem/hush)

## ⚠️ Disclaimer

All content on Hush is entirely fictional and created for entertainment purposes only. Any resemblance to real persons or events is purely coincidental. See our [Disclaimer Page](/disclaimer) for full details.

---

*Made with ❤️ for storytellers everywhere*
