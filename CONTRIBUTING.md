# Contributing to Hush

Thank you for your interest in contributing to Hush! This guide will help you get started with contributing to our immersive storytelling platform.

## 🤝 How to Contribute

### 1. Writing Stories

The easiest way to contribute is by adding your own fictional stories to the platform.

#### Story Requirements

- **Must be fictional**: All content must be clearly marked as fiction
- **Original work**: Stories must be your own creation
- **Appropriate content**: No explicit content or hate speech
- **Complete narrative**: Stories should have a beginning, middle, and end

#### Story Format

Create a new `.js` file in the `/stories` directory:

```javascript
const story = {
  id: 'your-story-slug',           // URL-friendly identifier
  title: 'Your Story Title',        // Display title
  author: 'Your Name',              // Author name
  coverImage: '/assets/cover.jpg',  // Cover image path
  publishedAt: '2025-01-01',       // Publication date (ISO format)
  categories: ['horror', 'mystery'], // Array of categories
  keywords: ['keyword1', 'keyword2'], // Search keywords
  excerpt: 'Brief description...',   // Short summary
  readingTime: '5 min',             // Estimated reading time
  blocks: [
    // Your story blocks here
  ]
}

export default story
```

#### Available Block Types

- `heading` - Main story headings
- `subheading` - Section headings  
- `paragraph` - Regular text content
- `image` - Images with optional captions
- `video` - Video embeds
- `embed` - External content embeds
- `quote` - Quoted text with optional attribution
- `code` - Code blocks with syntax highlighting
- `mermaid` - Mermaid diagrams
- `reactflow` - Interactive node diagrams
- `three-scene` - 3D scenes (advanced)

#### Example Story Block

```javascript
{
  type: 'paragraph',
  text: 'Your story content goes here. This is where you tell your tale, building suspense and engaging your readers.'
},
{
  type: 'image',
  src: 'https://example.com/image.jpg',
  caption: 'Optional caption for the image'
},
{
  type: 'quote',
  text: 'A memorable quote from your story',
  author: 'Character Name'
}
```

### 2. Improving the Platform

#### Development Setup

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/hush.git
   cd hush
   ```

3. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

#### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
3. **Test your changes**
   ```bash
   npm run build
   npm run export
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**

### 3. Reporting Issues

#### Bug Reports

When reporting bugs, please include:

- **Description**: Clear description of the issue
- **Steps to reproduce**: How to reproduce the bug
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Environment**: Browser, OS, device type
- **Screenshots**: If applicable

#### Feature Requests

When suggesting features:

- **Use case**: Why would this feature be useful?
- **Description**: Detailed description of the feature
- **Mockups**: Visual examples if applicable
- **Alternatives**: Other ways to solve the problem

## 📋 Pull Request Process

### Before Submitting

1. **Test your changes** thoroughly
2. **Follow the code style** (use Prettier)
3. **Update documentation** if needed
4. **Add tests** for new features
5. **Check for accessibility** issues

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] All existing tests pass
- [ ] New tests added

## Screenshots
(if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

## 🎨 Code Style

### General Guidelines

- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Prefer composition over inheritance
- Write self-documenting code

### File Naming

- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Stories: `kebab-case.js`
- Pages: `lowercase.tsx`

### Import Order

1. React imports
2. Next.js imports
3. Third-party libraries
4. Local components
5. Utilities and types

## 🧪 Testing

### Manual Testing

Before submitting, please test:

- [ ] Story renders correctly
- [ ] All block types work
- [ ] Navigation functions properly
- [ ] Mobile responsiveness
- [ ] Accessibility features
- [ ] Performance (no console errors)

### Browser Testing

Test in multiple browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📚 Documentation

### Updating Documentation

When adding features:

1. **Update README.md** if needed
2. **Add inline comments** to complex code
3. **Update type definitions**
4. **Create examples** for new features

## 🚫 What Not to Contribute

- **Real conspiracy theories** or misinformation
- **Hate speech** or discriminatory content
- **Explicit content** or violence
- **Copyrighted material** without permission
- **Spam** or promotional content

## 🎯 Areas for Contribution

### High Priority

- **New story block types**
- **Accessibility improvements**
- **Performance optimizations**
- **Mobile UX enhancements**
- **Search functionality**

### Medium Priority

- **Animation improvements**
- **3D scene enhancements**
- **Audio integration**
- **Social sharing features**
- **Analytics integration**

### Low Priority

- **Theme customization**
- **Advanced animations**
- **Export features**
- **API integrations**

## 💡 Getting Help

### Resources

- **GitHub Issues**: For bug reports and feature requests
- **Discussions**: For questions and ideas
- **Documentation**: Check existing docs first
- **Code Examples**: Look at existing stories

### Community Guidelines

- **Be respectful** and inclusive
- **Help others** when you can
- **Ask questions** if you're stuck
- **Share knowledge** and learn together

## 🏆 Recognition

Contributors will be recognized in:

- **README.md** contributors section
- **Release notes** for significant contributions
- **GitHub** contributor statistics
- **Project documentation**

## 📞 Contact

- **GitHub**: [@NoManNayeem](https://github.com/NoManNayeem)
- **Issues**: [GitHub Issues](https://github.com/NoManNayeem/hush/issues)
- **Discussions**: [GitHub Discussions](https://github.com/NoManNayeem/hush/discussions)

---

Thank you for contributing to Hush! Together, we're building a platform that celebrates the art of storytelling and the power of imagination.

*Happy storytelling! 📖✨*
