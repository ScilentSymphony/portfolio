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
  // Executes immediately, then at most once every 'wait' milliseconds
  function throttle(func, wait) {
    let lastTime = 0;
    let timeout = null;
    return function executedFunction(...args) {
      const now = Date.now();
      const remaining = wait - (now - lastTime);

      if (remaining <= 0) {
        // Execute immediately if enough time has passed
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        lastTime = now;
        func(...args);
      } else if (!timeout) {
        // Schedule trailing call
        timeout = setTimeout(() => {
          lastTime = Date.now();
          timeout = null;
          func(...args);
        }, remaining);
      }
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

  // Only initialize if all elements exist
  if (hamburgerBtn && slideMenu && slideMenuOverlay && slideMenuClose) {

    function openMenu() {
      hamburgerBtn.classList.add('active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      slideMenu.classList.add('active');
      slideMenuOverlay.classList.add('active');
      slideMenuOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      // Focus the close button for accessibility
      slideMenuClose.focus();
    }

    function closeMenu() {
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      slideMenu.classList.remove('active');
      slideMenuOverlay.classList.remove('active');
      slideMenuOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      // Return focus to hamburger button
      hamburgerBtn.focus();
    }

    function toggleMenu(e) {
      e.preventDefault();
      if (slideMenu.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    // Hamburger button - use click event (works for both mouse and touch)
    hamburgerBtn.addEventListener('click', toggleMenu);

    // Close button
    slideMenuClose.addEventListener('click', function(e) {
      e.preventDefault();
      closeMenu();
    });

    // Overlay click to close
    slideMenuOverlay.addEventListener('click', closeMenu);

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && slideMenu.classList.contains('active')) {
        closeMenu();
      }
    });

    // Close menu when clicking a link
    const slideMenuLinks = document.querySelectorAll('.slide-menu-links a');
    slideMenuLinks.forEach(function(link) {
      link.addEventListener('click', closeMenu);
    });

    // Focus trap for accessibility
    const focusableElements = slideMenu.querySelectorAll(
      'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      slideMenu.addEventListener('keydown', function(e) {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      });
    }

    console.log('Mobile menu initialized');
  } else {
    console.warn('Mobile menu elements not found');
  }

  // ===== CONTACT FORM HANDLING =====
  const contactForm = document.querySelector('.contact-form');
  const formStatus = document.querySelector('.form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;

      // Show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      formStatus.textContent = '';
      formStatus.className = 'form-status';

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          formStatus.textContent = 'Message sent successfully! I\'ll respond within 1-2 business days.';
          formStatus.classList.add('form-status--success');
          contactForm.reset();
        } else {
          const data = await response.json();
          if (data.errors) {
            formStatus.textContent = data.errors.map(error => error.message).join(', ');
          } else {
            formStatus.textContent = 'Something went wrong. Please try again or email directly.';
          }
          formStatus.classList.add('form-status--error');
        }
      } catch (error) {
        formStatus.textContent = 'Network error. Please check your connection and try again.';
        formStatus.classList.add('form-status--error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }

  console.log('All scripts initialized');

});
