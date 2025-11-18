(function() {
  const WORDS = [
    "improvisation", "story", "clouds", "prefiguration", "configuration", "refiguration", "narrative",
    "listening", "texture", "silence", "tension", "discovery", "emergence", "attention",
    "communication", "vibration", "resonance", "pattern", "beauty", "chance", "error", "density",
    "clarity", "memory", "breath", "gesture", "friction", "contour", "shadow", "edge", "grain",
    "fold", "echo", "drift", "pulse", "structure", "rhythm", "space", "weight", "resistance",
    "trace", "contrast", "harmony", "dissonance", "timing", "velocity", "timbre", "texture",
    "recall", "arc", "edges", "shape", "tension", "softness", "layer", "delineation", "subtext",
    "immanence"
  ];

  const WORD_COUNT = 100;
  const container = document.getElementById("bg-typography");

  if (!container) return;

  const rand = (min, max) => Math.random() * (max - min) + min;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < WORD_COUNT; i++) {
    const isAccent = Math.random() < 0.12;
    const word = WORDS[i % WORDS.length];
    const x = rand(-10, 100);
    const y = rand(-10, 100);
    const tx = rand(-20, 20);
    const ty = rand(-30, 30);
    const dur = rand(8, 38);
    const delay = rand(-30, 10);

    const span = document.createElement('span');
    span.className = `bg-typography__word ${isAccent ? 'bg-typography__word--accent' : ''}`;
    span.textContent = word;

    // Use inline styles instead of stylesheet.insertRule() for CSP compliance
    span.style.left = `${x}vw`;
    span.style.top = `${y}vh`;
    span.style.setProperty('--tx', `${tx}px`);
    span.style.setProperty('--ty', `${ty}px`);
    span.style.setProperty('--dur', `${dur}s`);
    span.style.setProperty('--delay', `${delay}s`);

    fragment.appendChild(span);
  }

  container.appendChild(fragment);

  // Handle page visibility to pause animations when tab is not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.body.classList.add('page-hidden');
    } else {
      document.body.classList.remove('page-hidden');
    }
  });
})();
