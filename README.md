# 🕶️ Hush - Immersive Storytelling Platform

> Some stories are meant to be heard in whispers.

Hush is an open-source, immersive storytelling platform that transforms traditional narratives into interactive experiences. Built with Next.js, GSAP animations, and Three.js, it creates cinematic storyboards that make readers feel something real.

## ✨ Features

### 🎬 Cinematic TV Experience
- **TV Screen Effects**: Authentic scanlines, flicker, and static for immersive viewing
- **Dramatic Transitions**: Slide, fade, zoom, and flip effects with sound
- **Atmospheric Lighting**: Dynamic backgrounds that pulse and shift
- **TV Remote Controls**: Intuitive interface for customizing the experience
- **Auto-play System**: Hands-free story progression with progress tracking

### 📖 Immersive Storytelling
- **Multiple Block Types**: Text, images, videos, Mermaid diagrams, ReactFlow networks, and 3D scenes
- **Focus Mode**: Distraction-free reading experience
- **Bookmarks & Reactions**: Save favorites and react with emojis
- **Search & Discovery**: Find stories by keywords, categories, or authors
- **Mobile-First**: Responsive design optimized for all devices
- **Static Export**: Deploy anywhere with GitHub Pages, Vercel, or Netlify

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NoManNayeem/Hush.git
   cd Hush
   ```

2. **Install dependencies**
   ```bash
   npm install
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

## 🚀 Deployment

### GitHub Pages (Recommended)

Hush is optimized for GitHub Pages deployment with automatic CI/CD:

1. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Set Source to "GitHub Actions"

2. **Automatic Deployment**
   - Push to `main` branch triggers deployment
   - Workflow builds and deploys automatically
   - Available at `https://yourusername.github.io/Hush`

3. **Manual Deployment**
   - Go to Actions tab → "Deploy Hush to GitHub Pages"
   - Click "Run workflow"

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Other Platforms

- **Vercel**: `vercel --prod`
- **Netlify**: Connect repository for automatic builds
- **Static Hosting**: Use `npm run build` and deploy `out/` folder

## 🎬 Features

### 🎬 Cinematic TV Experience
- **TV Screen Effects**: Authentic scanlines, flicker, and static for immersive viewing
- **Dramatic Transitions**: Slide, fade, zoom, and flip effects with sound
- **Atmospheric Lighting**: Dynamic backgrounds that pulse and shift
- **TV Remote Controls**: Intuitive interface for customizing the experience
- **Auto-play System**: Hands-free story progression with progress tracking
- **Sound Effects**: Transition sounds, TV static, and typing audio feedback

### Interactive Elements
- **Multiple Block Types**: Text, images, videos, Mermaid diagrams, ReactFlow networks, 3D scenes
- **Bookmarks & Reactions**: Save favorites and react with emojis
- **Reading Progress**: Automatic save and restore
- **Search & Discovery**: Find stories by keywords, categories, or authors

### Technical Excellence
- **Mobile-First**: Responsive design optimized for all devices
- **Static Export**: Deploy anywhere with GitHub Pages, Vercel, or Netlify
- **Performance**: Optimized bundle size and lazy loading
- **Accessibility**: Full keyboard navigation and screen reader support

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
Hush/
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
- `npm run build:export` - Build and export static site
- `npm run gen:index` - Generate story index
- `npm run gen:sitemap` - Generate sitemap
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking
- `npm run analyze` - Analyze bundle size
- `npm run clean` - Clean build artifacts
- `npm run preview` - Preview production build
- `npm run validate` - Run type check and linting

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **Animation**: GSAP + ScrollTrigger + CSS Animations
- **3D**: Three.js + @react-three/fiber
- **Diagrams**: Mermaid + ReactFlow
- **Search**: Fuse.js
- **Icons**: Lucide React
- **Audio**: Web Audio API
- **UI Components**: Radix UI primitives
- **TypeScript**: Full type safety

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
- Project: [Hush Repository](https://github.com/NoManNayeem/Hush)

## ⚠️ Disclaimer

All content on Hush is entirely fictional and created for entertainment purposes only. Any resemblance to real persons or events is purely coincidental. See our [Disclaimer Page](/disclaimer) for full details.

---

*Made with ❤️ for storytellers everywhere*
