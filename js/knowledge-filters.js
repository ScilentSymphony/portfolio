document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const postCards = document.querySelectorAll('.post-card');

  // Check URL for filter parameter
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get('filter');

  if (filterParam) {
    // Find and activate the corresponding filter button
    filterButtons.forEach(btn => {
      if (btn.dataset.filter === filterParam) {
        btn.click();
      }
    });
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.dataset.filter;

      // Update active state
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-pressed', 'true');

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
    });
  });
});
