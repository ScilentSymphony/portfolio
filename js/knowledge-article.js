// Apply category accent automatically based on post metadata
(() => {
  const normalizeCategory = (value) => {
    if (!value) return null;
    const normalized = value.toLowerCase();

    if (normalized.includes('research')) return 'research';
    if (normalized.includes('music')) return 'music';
    if (normalized.includes('tech')) return 'tech';

    return null;
  };

  const categoryHeader = document.querySelector('.post-category-header');
  const headerCategory = normalizeCategory(categoryHeader?.dataset.category);
  const labelCategory = normalizeCategory(categoryHeader?.querySelector('.category-label')?.textContent);
  const detectedCategory = headerCategory || labelCategory;

  if (detectedCategory) {
    document.body.dataset.category = detectedCategory;
    document.body.classList.add(`post-${detectedCategory}`);
  }
})();

// Reading progress bar with throttling to prevent layout thrashing
// Throttle function to limit execution frequency
function throttle(func, wait) {
  let lastTime = 0;
  let timeout = null;
  return function executedFunction(...args) {
    const now = Date.now();
    const remaining = wait - (now - lastTime);

    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      lastTime = now;
      func(...args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        lastTime = Date.now();
        timeout = null;
        func(...args);
      }, remaining);
    }
  };
}

// Batch DOM reads before writes to prevent reflow/repaint thrashing
function updateProgressBar() {
  // Batch all DOM reads first
  const winScroll = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;

  // Then do DOM writes
  const progressBar = document.getElementById("progressBar");
  if (progressBar) {
    progressBar.style.width = scrolled + "%";
  }
}

// Use throttled scroll listener with passive flag for better performance
window.addEventListener('scroll', throttle(updateProgressBar, 16), { passive: true }); // ~60fps

// Table of Contents active state based on scroll position
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    const tocLink = document.querySelector(`.article-toc a[href="#${id}"]`);

    if (tocLink) {
      if (entry.isIntersecting) {
        document.querySelectorAll('.article-toc a').forEach(link => link.classList.remove('active'));
        tocLink.classList.add('active');
      }
    }
  });
}, {
  rootMargin: '-20% 0px -70% 0px'
});

// Observe all headings with IDs
document.querySelectorAll('h2[id], h3[id]').forEach(heading => {
  observer.observe(heading);
});
