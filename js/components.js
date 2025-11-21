/* ===== PREMIUM UI COMPONENT INTERACTIONS ===== */
/* Shared JavaScript for interactive components across the portfolio */

/**
 * Initialize Spotlight Card Effect
 * Tracks mouse position and updates CSS custom properties for radial gradient
 */
function initSpotlightCards() {
    const spotlightCards = document.querySelectorAll('.spotlight-card');

    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/**
 * Initialize Intersection Observer for Fade-In Animations
 * Triggers animations when elements enter viewport
 */
function initFadeInAnimations() {
    const fadeInElements = document.querySelectorAll('.animate-fade-in, .stagger-fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    fadeInElements.forEach(el => observer.observe(el));
}

/**
 * Initialize Smooth Scroll for Anchor Links
 * Enhances navigation with smooth scrolling
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Initialize Hover Lift Effects
 * Adds dynamic shadow and transform on hover
 */
function initHoverLiftEffects() {
    const liftElements = document.querySelectorAll('.hover-lift');

    liftElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });

        el.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Initialize All Components
 * Call this function when DOM is ready
 */
function initComponents() {
    initSpotlightCards();
    initFadeInAnimations();
    initSmoothScroll();
    initHoverLiftEffects();
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComponents);
} else {
    initComponents();
}

// Export for manual initialization if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initSpotlightCards,
        initFadeInAnimations,
        initSmoothScroll,
        initHoverLiftEffects,
        initComponents
    };
}
