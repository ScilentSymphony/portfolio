document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const postCards = document.querySelectorAll('.post-card');

  // Apply filter function (can be called from click or popstate)
  function applyFilter(filter, updateUrl = true) {
    // Update active state
    filterButtons.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
      if (btn.dataset.filter === filter) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      }
    });

    // Filter posts
    postCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = 'block';
        // Trigger reflow for animation
        card.style.animation = 'none';
        setTimeout(() => {
          card.style.animation = 'fadeIn 0.5s ease-in-out';
        }, 10);
      } else {
        card.style.display = 'none';
      }
    });

    // Update URL if requested
    if (updateUrl) {
      const newUrl = filter === 'all'
        ? window.location.pathname
        : `${window.location.pathname}?filter=${filter}`;
      window.history.pushState({ filter }, '', newUrl);
    }
  }

  // Check URL for filter parameter on initial load
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get('filter');

  if (filterParam) {
    // Apply filter from URL without updating URL again
    applyFilter(filterParam, false);
  }

  // Handle filter button clicks
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.dataset.filter;
      applyFilter(filter, true);
    });
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', function(event) {
    const filter = event.state?.filter || 'all';
    applyFilter(filter, false);
  });
});
