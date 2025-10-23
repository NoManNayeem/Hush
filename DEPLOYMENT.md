# Hush Deployment Guide

## GitHub Pages Deployment

This guide explains how to deploy Hush to GitHub Pages using GitHub Actions.

### Prerequisites

1. **GitHub Repository**: The code must be in a GitHub repository
2. **GitHub Pages Enabled**: Enable GitHub Pages in repository settings
3. **Actions Permissions**: Ensure GitHub Actions can deploy to Pages

### Setup Steps

#### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Save the settings

#### 2. Repository Settings

Ensure the following settings in your repository:

- **Actions**: Enabled
- **Pages**: Source set to "GitHub Actions"
- **Branches**: Main branch protected (optional but recommended)

#### 3. Workflow Configuration

The deployment workflow (`.github/workflows/deploy.yml`) is already configured with:

- **Triggers**: Push to main branch, manual dispatch
- **Build Process**: Node.js 20, npm ci, build, export
- **Deployment**: Uses official GitHub Pages actions
- **Permissions**: Proper permissions for Pages deployment

### Deployment Process

#### Automatic Deployment

The workflow automatically triggers on:

- Push to `main` branch
- Changes to:
  - `stories/**` (story files)
  - `src/**` (source code)
  - `public/**` (static assets)
  - `package.json`, `next.config.js`, etc.

#### Manual Deployment

You can manually trigger deployment:

1. Go to **Actions** tab in your repository
2. Select **Deploy Hush to GitHub Pages**
3. Click **Run workflow**
4. Select the branch and click **Run workflow**

### Build Process

The deployment workflow performs these steps:

1. **Checkout**: Gets the latest code
2. **Setup Node.js**: Installs Node.js 20 with npm caching
3. **Install Dependencies**: Runs `npm ci` for clean install
4. **Generate Index**: Creates `public/index.json` from stories
5. **Generate Sitemap**: Creates `public/sitemap.xml`
6. **Build**: Runs `npm run build` with production settings
7. **Export**: Creates static files in `out/` directory
8. **Deploy**: Uploads to GitHub Pages

### Configuration Details

#### Next.js Configuration

```javascript
// next.config.js
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/hush' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/hush/' : '',
}
```

#### Environment Variables

The build process uses:
- `NEXT_PUBLIC_BASE_PATH=/hush` for GitHub Pages subdirectory
- `NODE_ENV=production` for optimized build

#### Static Export Features

- **Trailing Slashes**: Ensures proper routing
- **Unoptimized Images**: Required for static export
- **Base Path**: Configured for `/hush` subdirectory
- **Asset Prefix**: Proper asset loading from subdirectory

### Troubleshooting

#### Common Issues

1. **Build Failures**
   - Check Node.js version (should be 20)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Deployment Failures**
   - Ensure GitHub Pages is enabled
   - Check repository permissions
   - Verify workflow file syntax

3. **Routing Issues**
   - Ensure `trailingSlash: true` in Next.js config
   - Check `basePath` configuration
   - Verify static export settings

4. **Asset Loading Issues**
   - Check `assetPrefix` configuration
   - Ensure images are in `public/` directory
   - Verify `.nojekyll` file exists

#### Debug Steps

1. **Check Actions Logs**
   - Go to Actions tab
   - Click on failed workflow
   - Review step-by-step logs

2. **Local Testing**
   ```bash
   npm run build
   npm run export
   # Check out/ directory contents
   ```

3. **Verify Configuration**
   - Check `next.config.js` settings
   - Verify workflow file syntax
   - Ensure all required files exist

### Custom Domain (Optional)

To use a custom domain:

1. Add your domain to repository settings
2. Create a `CNAME` file in `public/` directory
3. Update DNS settings as instructed by GitHub

### Performance Optimization

The deployment includes several optimizations:

- **Static Export**: Pre-rendered pages for fast loading
- **Image Optimization**: Unoptimized for static hosting
- **Asset Prefixing**: Proper CDN-like asset loading
- **Caching**: npm cache for faster builds

### Security Considerations

- **GitHub Token**: Uses `GITHUB_TOKEN` (automatically provided)
- **Permissions**: Minimal required permissions
- **Secrets**: No additional secrets required
- **Public Repository**: Code is publicly accessible

### Monitoring

Monitor deployment status:

1. **Actions Tab**: View workflow runs
2. **Pages Tab**: Check deployment status
3. **Repository Insights**: View deployment history

### Rollback

To rollback a deployment:

1. Go to Actions tab
2. Find the last successful deployment
3. Re-run that workflow
4. Or push a previous commit

### Support

For deployment issues:

1. Check GitHub Actions documentation
2. Review Next.js static export guide
3. Verify GitHub Pages requirements
4. Check repository settings and permissions
