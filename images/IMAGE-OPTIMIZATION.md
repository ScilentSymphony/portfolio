# Image Optimization Guide

This document outlines the image requirements and optimization process for the portfolio website.

## Current Placeholders Requiring Real Images

### 1. Professional Headshot (about.html)
**Location:** `.headshot-placeholder`
**Dimensions:** 400×400px
**Format:** WebP (with JPG fallback)
**Target Size:** <50KB
**Usage:** Personal story section

```html
<picture>
  <source srcset="images/headshot.webp" type="image/webp">
  <img src="images/headshot.jpg"
       alt="Professional headshot of Zaki"
       width="400"
       height="400"
       loading="lazy">
</picture>
```

---

### 2. Thesis Cover Image (research.html)
**Location:** `.thesis-image`
**Dimensions:** 600×600px
**Format:** WebP (with JPG fallback)
**Target Size:** <80KB
**Usage:** Featured work section

```html
<picture>
  <source srcset="images/thesis-cover.webp" type="image/webp">
  <img src="images/thesis-cover.jpg"
       alt="Cover of thesis: Temporal Consciousness in Musical Improvisation"
       width="600"
       height="600"
       loading="lazy">
</picture>
```

---

### 3. Album Artwork (music.html)
**Location:** `.album-art` (3 instances)
**Dimensions:** 300×300px each
**Format:** WebP (with JPG fallback)
**Target Size:** <40KB each
**Usage:** Discography section

```html
<picture>
  <source srcset="images/album-1.webp" type="image/webp">
  <img src="images/album-1.jpg"
       alt="Album artwork for [Album Title]"
       width="300"
       height="300"
       loading="lazy">
</picture>
```

**Naming convention:**
- `album-1.webp` / `album-1.jpg`
- `album-2.webp` / `album-2.jpg`
- `album-3.webp` / `album-3.jpg`

---

### 4. Project Screenshots (tech.html)
**Location:** `.project-media` (3 instances)
**Dimensions:** 800×450px (16:9 aspect ratio)
**Format:** WebP (with JPG fallback)
**Target Size:** <100KB each
**Usage:** Project showcase section

```html
<picture>
  <source srcset="images/project-audiovisual.webp" type="image/webp">
  <img src="images/project-audiovisual.jpg"
       alt="Audio-reactive visual system screenshot"
       width="800"
       height="450"
       loading="lazy">
</picture>
```

**Naming convention:**
- `project-audiovisual.webp` / `project-audiovisual.jpg`
- `project-ai-workflow.webp` / `project-ai-workflow.jpg`
- `project-installation.webp` / `project-installation.jpg`

---

### 5. Open Graph Social Sharing Image (all pages)
**Location:** `<meta property="og:image">` tag
**Dimensions:** 1200×630px (Facebook/Twitter recommended)
**Format:** JPG or PNG
**Target Size:** <200KB
**Usage:** Social media link previews

**Current placeholder:** `images/og-image.jpg`

```html
<meta property="og:image" content="https://scilentsymphony.github.io/portfolio/images/og-image.jpg">
```

**Design recommendations:**
- Include name "Zaki"
- Include tagline: "Entrepreneur • Creative • Consultant • Technologist"
- Use brand colors (dark background #0A0F1C, gold accent #D4AF37)
- High contrast text for readability
- Test preview at: https://www.opengraph.xyz/

---

## Optimization Tools

### Online Tools (Free)

1. **TinyPNG** - https://tinypng.com
   - Excellent compression for PNG and JPG
   - Up to 80% size reduction
   - Preserves transparency

2. **Squoosh** - https://squoosh.app
   - Google's web app
   - Real-time comparison
   - Multiple format conversion (WebP, AVIF, etc.)
   - Fine-grained quality control

3. **Compress or Die** - https://compress-or-die.com
   - JPG, PNG, GIF, SVG optimization
   - Side-by-side quality comparison

### Desktop Applications

1. **ImageOptim** (Mac) - https://imageoptim.com
   - Drag-and-drop interface
   - Lossless optimization
   - Batch processing

2. **XnConvert** (Windows/Mac/Linux) - https://www.xnview.com/en/xnconvert/
   - Batch conversion
   - Resize and optimize
   - Free for personal use

### Command Line Tools

```bash
# Install ImageMagick
brew install imagemagick  # Mac
apt-get install imagemagick  # Linux

# Convert and resize
convert input.jpg -resize 400x400 -quality 85 output.jpg

# Convert to WebP
cwebp -q 80 input.jpg -o output.webp

# Batch convert all JPGs to WebP
for file in *.jpg; do cwebp -q 80 "$file" -o "${file%.jpg}.webp"; done
```

---

## Implementation Checklist

### Step 1: Prepare Images
- [ ] Export images at exact dimensions listed above
- [ ] Use 2x resolution for retina displays (e.g., 800×800px saved at 400×400px display size)
- [ ] Optimize with TinyPNG or Squoosh
- [ ] Convert to WebP format
- [ ] Keep JPG fallback for older browsers

### Step 2: Add to Repository
- [ ] Save all images in `/images/` directory
- [ ] Use descriptive filenames (lowercase, hyphens, no spaces)
- [ ] Maintain both WebP and JPG/PNG formats

### Step 3: Update HTML
- [ ] Replace placeholder `<div>` elements with `<picture>` elements
- [ ] Add descriptive `alt` text for accessibility
- [ ] Include `width` and `height` attributes (prevents layout shift)
- [ ] Add `loading="lazy"` for below-the-fold images
- [ ] Test all images load correctly

### Step 4: Test Performance
- [ ] Run Lighthouse audit
- [ ] Check Largest Contentful Paint (LCP) <2.5s
- [ ] Verify Cumulative Layout Shift (CLS) <0.1
- [ ] Test on slow 3G connection (Chrome DevTools)

---

## Best Practices

### 1. Always Include Width and Height
Prevents cumulative layout shift (CLS) by reserving space:
```html
<img src="image.webp" alt="Description" width="400" height="300">
```

### 2. Use Lazy Loading
All images below the fold should lazy load:
```html
<img src="image.webp" alt="Description" loading="lazy">
```

**Exception:** Hero images and above-the-fold content should NOT lazy load.

### 3. Responsive Images
For images that change size based on viewport:
```html
<img
  srcset="small.webp 400w, medium.webp 800w, large.webp 1200w"
  sizes="(max-width: 768px) 100vw, 50vw"
  src="medium.webp"
  alt="Description"
  loading="lazy">
```

### 4. WebP with Fallback
Always provide fallback for older browsers:
```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description">
</picture>
```

### 5. Compression Quality Guidelines
- **WebP:** 75-85 quality (sweet spot)
- **JPG:** 80-90 quality
- **PNG:** Use TinyPNG for optimization
- **Photography:** JPG or WebP
- **Graphics/Icons:** SVG (if possible) or PNG

---

## File Size Targets

| Image Type | Target Size | Maximum Size |
|-----------|-------------|--------------|
| Headshot (400×400) | 30-40KB | 50KB |
| Thesis cover (600×600) | 50-60KB | 80KB |
| Album art (300×300) | 25-30KB | 40KB |
| Project screenshot (800×450) | 60-80KB | 100KB |
| OG image (1200×630) | 100-150KB | 200KB |
| Favicon (SVG) | <5KB | 10KB |

---

## Favicon System (Already Implemented)

Current favicon system uses SVG with PNG fallbacks:
```html
<link rel="icon" type="image/svg+xml" href="images/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="images/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="images/apple-touch-icon.png">
```

See `images/FAVICON-INSTRUCTIONS.md` for generation details.

---

## Testing Resources

- **Lighthouse:** Chrome DevTools > Lighthouse tab
- **WebPageTest:** https://www.webpagetest.org/
- **PageSpeed Insights:** https://pagespeed.web.dev/
- **OG Image Preview:** https://www.opengraph.xyz/
- **Image Analysis:** https://www.webpagetest.org/easy/image-analysis/

---

## Future Enhancements

### Consider AVIF Format
AVIF offers better compression than WebP (20-30% smaller):
```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description">
</picture>
```

**Browser support:** Check https://caniuse.com/avif before implementing.

### Implement Image CDN
For production sites with high traffic, consider:
- Cloudinary
- Imgix
- Cloudflare Images

Benefits: Automatic format conversion, resizing, optimization, global CDN.

---

**Last Updated:** 2025-11-13
**Status:** Documentation complete, awaiting real images
