// Main JavaScript file - animations and interactions
console.log('Site loaded');

// ===== WAIT FOR DOM AND GSAP TO LOAD =====
document.addEventListener('DOMContentLoaded', function() {

  const createNoopTimeline = () => ({
    to() { return this; },
    from() { return this; },
    restart() {}
  });

  const createGsapFallback = () => ({
    timeline: () => createNoopTimeline(),
    from: () => {},
    to: () => {}
  });

  const gsapAvailable = typeof window !== 'undefined' && typeof window.gsap !== 'undefined';
  const gsapInstance = gsapAvailable ? window.gsap : createGsapFallback();

  if (!gsapAvailable) {
    console.warn('GSAP not found. Animations will be skipped but interactions remain active.');
  }

  // ===== NAVIGATION COLLAPSE ANIMATION =====
  const nav = document.getElementById('mainNav');
  const navContainer = nav.querySelector('.nav-container');
  const navLinks = nav.querySelector('.nav-links');
  const navLogo = nav.querySelector('.nav-logo');

  let isCollapsed = false;

  // GSAP timeline for collapsing navigation
  const collapseTimeline = gsapInstance.timeline({ paused: true });
  collapseTimeline
    .to(navContainer, {
      paddingTop: '0.75rem',
      paddingBottom: '0.75rem',
      duration: 0.4,
      ease: 'power2.inOut'
    })
    .to(navLogo, {
      fontSize: '1rem',
      duration: 0.4,
      ease: 'power2.inOut'
    }, '-=0.4');

  // GSAP timeline for expanding navigation
  const expandTimeline = gsapInstance.timeline({ paused: true });
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
    }, '-=0.4');

  // Scroll handler with threshold
  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100 && !isCollapsed) {
      // Collapse navigation
      if (gsapAvailable) {
        collapseTimeline.restart();
      } else {
        // Apply styles directly when GSAP is unavailable
        navContainer.style.paddingTop = '0.75rem';
        navContainer.style.paddingBottom = '0.75rem';
        navLogo.style.fontSize = '1rem';
      }
      nav.classList.add('nav-collapsed');
      isCollapsed = true;
    } else if (scrollTop <= 100 && isCollapsed) {
      // Expand navigation
      if (gsapAvailable) {
        expandTimeline.restart();
      } else {
        // Apply styles directly when GSAP is unavailable
        navContainer.style.paddingTop = '1.5rem';
        navContainer.style.paddingBottom = '1.5rem';
        navLogo.style.fontSize = '1.5rem';
      }
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

  // Run once on load to handle page refreshes while scrolled down
  handleScroll();


  // ===== HERO ENTRANCE ANIMATIONS WITH MASK REVEALS =====
  // Premium reveal effect: elements slide up from behind a mask

  if (gsapAvailable) {
    // Wrap hero text elements for mask reveal
    const heroH1 = document.querySelector('.hero h1');
    const heroTagline = document.querySelector('.tagline');
    const heroSubtitle = document.querySelector('.subtitle');

    // Apply mask reveal animation to hero elements
    if (heroH1 && !heroH1.classList.contains('mask-reveal')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'mask-reveal';
      heroH1.parentNode.insertBefore(wrapper, heroH1);
      wrapper.appendChild(heroH1);

      gsapInstance.to(heroH1, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.3
      });
    } else if (heroH1) {
      // Fallback to regular animation if mask setup fails
      gsapInstance.from(heroH1, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2
      });
    }

    // Tagline - follows title
    if (heroTagline) {
      gsapInstance.from(heroTagline, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.6
      });
    }

    // Subtitle - follows tagline
    if (heroSubtitle) {
      gsapInstance.from(heroSubtitle, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.9
      });
    }

    // CTA buttons - last to appear
    const heroCTA = document.querySelector('.hero-cta');
    if (heroCTA) {
      gsapInstance.from(heroCTA, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out',
        delay: 1.2
      });
    }
  }

  // ===== INTERSECTION OBSERVER FOR LAZY ANIMATIONS =====
  // More performant than scroll events for animating elements as they enter viewport

  if (gsapAvailable) {
    const observerOptions = {
      threshold: 0.1, // Trigger when 10% of element is visible
      rootMargin: '0px 0px -50px 0px' // Start animation slightly before element enters viewport
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add fade-in animation using GSAP
          gsapInstance.from(entry.target, {
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
  }

  // ===== MOBILE HAMBURGER MENU =====
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const slideMenu = document.querySelector('.slide-menu');
  const slideMenuOverlay = document.querySelector('.slide-menu-overlay');
  const slideMenuClose = document.querySelector('.slide-menu-close');
  const slideMenuLinks = document.querySelectorAll('.slide-menu-links a');

  // Only initialize if all elements exist
  if (hamburgerBtn && slideMenu && slideMenuOverlay && slideMenuClose) {
    let lastFocusedElement = null;
    const focusableSelector = 'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const setMenuState = (isOpen) => {
      hamburgerBtn.classList.toggle('active', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      slideMenu.classList.toggle('is-active', isOpen);
      slideMenuOverlay.classList.toggle('is-active', isOpen);
      slideMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      slideMenuOverlay.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      document.body.classList.toggle('menu-open', isOpen);

      if (isOpen) {
        lastFocusedElement = document.activeElement;
        (slideMenu.querySelector('[data-menu-initial]') || slideMenuClose).focus();
      } else if (lastFocusedElement) {
        lastFocusedElement.focus({ preventScroll: true });
      }
    };

    const closeMenu = () => setMenuState(false);
    const openMenu = () => setMenuState(true);

    const toggleMenu = (event) => {
      event.preventDefault();
      const isOpen = slideMenu.classList.contains('is-active');
      isOpen ? closeMenu() : openMenu();
    };

    // Hamburger button - use click event (works for both mouse and touch)
    hamburgerBtn.addEventListener('click', toggleMenu);

    // Close button
    slideMenuClose.addEventListener('click', (event) => {
      event.preventDefault();
      closeMenu();
    });

    // Overlay click to close
    slideMenuOverlay.addEventListener('click', closeMenu);

    // Close menu on escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && slideMenu.classList.contains('is-active')) {
        closeMenu();
      }
    });

    // Close menu when clicking a link
    slideMenuLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Focus trap for accessibility
    slideMenu.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;

      const focusableElements = Array.from(
        slideMenu.querySelectorAll(focusableSelector)
      ).filter((el) => !el.hasAttribute('disabled'));

      if (!focusableElements.length) return;

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable.focus();
        }
      } else if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    });

    // Ensure menu starts in a closed state with correct aria
    setMenuState(false);

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

  // ===== MAGNETIC BUTTON MICRO-INTERACTIONS =====
  const magneticButtons = document.querySelectorAll('.btn-primary');

  magneticButtons.forEach(button => {
    button.classList.add('magnetic');

    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = 100; // Magnetic field radius

      if (distance < maxDistance) {
        const pull = 0.3; // How much the button moves toward cursor
        const moveX = deltaX * pull;
        const moveY = deltaY * pull;

        if (gsapAvailable) {
          gsapInstance.to(button, {
            x: moveX,
            y: moveY,
            duration: 0.3,
            ease: 'power2.out'
          });
        } else {
          button.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
      }
    });

    button.addEventListener('mouseleave', () => {
      if (gsapAvailable) {
        gsapInstance.to(button, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        });
      } else {
        button.style.transform = 'translate(0, 0)';
      }
    });
  });

  // ===== MULTI-SPEED PARALLAX SCROLLING =====
  // Different elements move at different speeds to create depth

  // Layer 1: Background elements (slowest - 0.3x speed)
  const bgElements = document.querySelectorAll('.hero-shapes .shape');
  // Layer 2: Images (medium - 0.7x speed)
  const parallaxImages = document.querySelectorAll('.project-media img, .album-art, .about-image img, .thesis-image img');
  // Layer 3: Cards (subtle - 0.95x speed)
  const parallaxCards = document.querySelectorAll('.category-card, .release-card, .package-card');

  if (parallaxImages.length > 0 || bgElements.length > 0 || parallaxCards.length > 0) {
    const handleParallax = throttle(() => {
      const scrollY = window.pageYOffset;

      // Background shapes - slowest movement (0.3x)
      bgElements.forEach(shape => {
        if (gsapAvailable) {
          gsapInstance.to(shape, {
            y: scrollY * 0.3,
            duration: 0.1,
            ease: 'none',
            overwrite: true
          });
        } else {
          shape.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
      });

      // Images - medium movement (0.7x)
      parallaxImages.forEach(img => {
        const rect = img.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Only apply parallax if image is in viewport
        if (rect.top < windowHeight && rect.bottom > 0) {
          const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
          const parallaxOffset = (scrollProgress - 0.5) * 40; // Increased to 40px

          if (gsapAvailable) {
            gsapInstance.to(img, {
              y: parallaxOffset,
              duration: 0.1,
              ease: 'none',
              overwrite: true
            });
          } else {
            img.style.transform = `translateY(${parallaxOffset}px)`;
          }
        }
      });

      // Cards - subtle movement (0.95x)
      parallaxCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight && rect.bottom > 0) {
          const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
          const parallaxOffset = (scrollProgress - 0.5) * 8; // Subtle 8px movement

          if (gsapAvailable) {
            gsapInstance.to(card, {
              y: parallaxOffset,
              duration: 0.1,
              ease: 'none',
              overwrite: true
            });
          } else {
            card.style.transform = `translateY(${parallaxOffset}px)`;
          }
        }
      });
    }, 16); // Run at ~60fps

    window.addEventListener('scroll', handleParallax, { passive: true });
    handleParallax(); // Initial call
  }

  console.log('All scripts initialized');

});
