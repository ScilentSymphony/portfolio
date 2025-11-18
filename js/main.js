// Main JavaScript file - animations and interactions
console.log('Site loaded');

// ===== WAIT FOR DOM AND GSAP TO LOAD =====
document.addEventListener('DOMContentLoaded', function() {

  // ===== NAVIGATION COLLAPSE ANIMATION =====
  const nav = document.getElementById('mainNav');
  const navContainer = nav.querySelector('.nav-container');
  const navLinks = nav.querySelector('.nav-links');
  const navLogo = nav.querySelector('.nav-logo');

  let isCollapsed = false;

  // GSAP timeline for collapsing navigation
  const collapseTimeline = gsap.timeline({ paused: true });
  collapseTimeline
    .to(navLinks, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.inOut'
    })
    .to(navContainer, {
      paddingTop: '0.75rem',
      paddingBottom: '0.75rem',
      duration: 0.4,
      ease: 'power2.inOut'
    }, '-=0.2')
    .to(navLogo, {
      fontSize: '1rem',
      duration: 0.4,
      ease: 'power2.inOut'
    }, '-=0.4');

  // GSAP timeline for expanding navigation
  const expandTimeline = gsap.timeline({ paused: true });
  expandTimeline
    .to(navContainer, {
      paddingTop: '1.5rem',
      paddingBottom: '1.5rem',
      duration: 0.4,
      ease: 'power2.inOut'
    })
    .to(navLogo, {
      fontSize: '1.5rem',
      duration: 0.4,
      ease: 'power2.inOut'
    }, '-=0.4')
    .to(navLinks, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.inOut'
    }, '-=0.2');

  // Scroll handler with threshold
  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100 && !isCollapsed) {
      // Collapse navigation
      collapseTimeline.restart();
      nav.classList.add('nav-collapsed');
      isCollapsed = true;
    } else if (scrollTop <= 100 && isCollapsed) {
      // Expand navigation
      expandTimeline.restart();
      nav.classList.remove('nav-collapsed');
      isCollapsed = false;
    }
  }

  // Throttle function to limit scroll event firing
  // Only executes once every 'wait' milliseconds for performance
  function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Attach throttled scroll listener (checks every 50ms)
  // Use { passive: true } for better scroll performance
  window.addEventListener('scroll', throttle(handleScroll, 50), { passive: true });


  // ===== HERO ENTRANCE ANIMATIONS =====
  // Animate hero elements on page load with staggered timing

  // Main title - fade in from below
  gsap.from('.hero h1', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.2
  });

  // Tagline - follows title
  gsap.from('.tagline', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power3.out',
    delay: 0.5
  });

  // Subtitle - follows tagline
  gsap.from('.subtitle', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power3.out',
    delay: 0.7
  });

  // CTA buttons - last to appear
  gsap.from('.hero-cta', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power3.out',
    delay: 0.9
  });

  // ===== INTERSECTION OBSERVER FOR LAZY ANIMATIONS =====
  // More performant than scroll events for animating elements as they enter viewport

  const observerOptions = {
    threshold: 0.1, // Trigger when 10% of element is visible
    rootMargin: '0px 0px -50px 0px' // Start animation slightly before element enters viewport
  };

  const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add fade-in animation using GSAP
        gsap.from(entry.target, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power3.out'
        });
        // Stop observing after animation to prevent re-triggering
        fadeInObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all card elements for lazy animation
  const animatedElements = document.querySelectorAll(
    '.category-card, .project-card, .release-card, .package-card, ' +
    '.testimonial-card, .faq-item, .thesis-feature, .about-card'
  );

  animatedElements.forEach(el => {
    fadeInObserver.observe(el);
  });

  console.log('Animations initialized with Intersection Observer');

  // ===== MOBILE HAMBURGER MENU =====
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const slideMenu = document.querySelector('.slide-menu');
  const slideMenuOverlay = document.querySelector('.slide-menu-overlay');
  const slideMenuClose = document.querySelector('.slide-menu-close');

  function openMenu() {
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    slideMenu.classList.add('active');
    slideMenuOverlay.classList.add('active');
    slideMenuOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    slideMenu.classList.remove('active');
    slideMenuOverlay.classList.remove('active');
    slideMenuOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', function() {
      if (slideMenu.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (slideMenuClose) {
    slideMenuClose.addEventListener('click', closeMenu);
  }

  if (slideMenuOverlay) {
    slideMenuOverlay.addEventListener('click', closeMenu);
  }

  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && slideMenu && slideMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  // Close menu when clicking a link
  const slideMenuLinks = document.querySelectorAll('.slide-menu-links a');
  slideMenuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  console.log('Mobile menu initialized');

});
