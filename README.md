# Portfolio Website

Personal portfolio for Zaki - showcasing research, music, and creative technology work.

Built with Claude Code.

## 🌐 Live Site

[scilentsymphony.github.io/portfolio](https://scilentsymphony.github.io/portfolio)

## 🎯 Features

- **Responsive Design** - Mobile-first approach with adaptive navigation
- **Animated Backgrounds** - Unique page-specific animations (musical notes, flow fields, living typography)
- **Knowledge Base** - Blog-style articles with reading progress indicators
- **SEO Optimized** - Comprehensive meta tags, Open Graph, structured data
- **Performance Focused** - Optimized images (WebP), lazy loading, minimal dependencies
- **Accessible** - WCAG compliant with skip links, ARIA labels, reduced motion support

## 🛠 Tech Stack

- **Vanilla HTML/CSS/JS** - No framework bloat
- **GSAP** - Smooth animations and transitions
- **GitHub Pages** - Free hosting with custom domain support
- **Python/Pillow** - Image optimization and favicon generation

## 📁 Project Structure

```
portfolio/
├── index.html              # Homepage
├── about.html              # About page with living typography background
├── research.html           # Research work and thesis
├── music.html              # Music discography and projects
├── tech.html               # Technical projects and skills
├── services.html           # Commission work and pricing
├── contact.html            # Contact form
├── knowledge/              # Knowledge base / blog
│   ├── index.html          # Knowledge base index with filtering
│   ├── new-era.html        # Album deep dive article
│   ├── nothing-new.html    # Album deep dive article
│   ├── making-it-your-own.html  # Research article
│   └── post-template.html  # Template for new articles
├── css/
│   ├── style.css           # Main stylesheet (global + page-specific)
│   └── knowledge/
│       └── knowledge.css   # Knowledge base specific styles
├── js/
│   ├── main.js             # Navigation, scroll animations
│   ├── research-flowfield.js    # Research page particle animation
│   ├── tech-grid.js        # Tech page grid animation
│   ├── services-blobs.js   # Services page blob animation
│   ├── knowledge-filter.js # Knowledge base filtering
│   └── about-typography.js # About page background animation
├── images/                 # Optimized images (WebP format)
│   ├── og-image.jpg        # Social media share image
│   ├── favicon-*.png       # Favicon in multiple sizes
│   └── *.webp              # Album covers, headshots, etc.
├── data/
│   ├── knowledge-*.json    # Structured data for knowledge articles
│   └── ...
└── docs/
    ├── PERFORMANCE-BUDGET.md     # Performance guidelines
    ├── IMAGE-OPTIMIZATION.md     # Image optimization guide
    └── FAVICON-INSTRUCTIONS.md   # Favicon generation guide

```

## 🚀 Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/ScilentSymphony/portfolio.git
   cd portfolio
   ```

2. Serve locally (choose one):
   ```bash
   # Python 3
   python3 -m http.server 8000

   # Node.js (with http-server)
   npx http-server

   # VS Code Live Server extension
   # Right-click index.html → "Open with Live Server"
   ```

3. Open browser to `http://localhost:8000`

## 📝 Adding New Knowledge Articles

1. Copy the template:
   ```bash
   cp knowledge/post-template.html knowledge/your-new-post.html
   ```

2. Update the article metadata:
   - Title, description, keywords in `<head>`
   - Category (research/music/tech)
   - Date, reading time
   - Author information

3. Create structured data JSON:
   ```bash
   # Create data/knowledge-your-post.json
   # Follow the pattern in existing JSON files
   ```

4. Add article to `knowledge/index.html`:
   - Add a card in the articles grid
   - Include proper category attribute for filtering

5. Link from related main pages (optional):
   - Link album cards from `music.html` to knowledge articles
   - Reference research articles from `research.html`

## 🎨 Customization

### Colors

Main colors defined in `css/style.css`:
```css
--text-primary: #f6f6f6;      /* Light text */
--text-secondary: #b0b0b0;    /* Muted text */
--background: #0A0A0A;         /* Dark background */
--accent-gold: #D4AF37;        /* Gold accent */
```

### Fonts

- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

Loaded from Google Fonts CDN.

## 📊 Performance

- Target: 90+ Lighthouse score
- Images: WebP format, lazy loading
- CSS: Single file, ~130KB unminified
- JS: Modular, deferred loading
- See `PERFORMANCE-BUDGET.md` for details

## 🔧 Build Tools

No build process required! This is intentionally a static site with no compilation step.

For production optimization:
```bash
# Minify CSS (optional)
npx csso css/style.css -o css/style.min.css

# Optimize images (already optimized)
# See images/IMAGE-OPTIMIZATION.md
```

## 📱 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile Safari (iOS 13+)
- Chrome Mobile (Android 8+)

## 📄 License

© 2025 Zaki Hutchinson. All rights reserved.

## 🤝 Credits

Built with assistance from Claude Code (Anthropic).

---

For questions or collaboration inquiries, visit [scilentsymphony.github.io/portfolio/contact.html](https://scilentsymphony.github.io/portfolio/contact.html)
