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
  const stylesheet = Array.from(document.styleSheets).find(sheet =>
    sheet.href && sheet.href.includes('css/style.css')
  );

  if (!container || !stylesheet) return;

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

    const className = `bg-typography__dynamic-${i}`;
    const rule = `.${className}{left:${x}vw;top:${y}vh;--tx:${tx}px;--ty:${ty}px;--dur:${dur}s;--delay:${delay}s;}`;
    stylesheet.insertRule(rule, stylesheet.cssRules.length);

    const span = document.createElement('span');
    span.className = `bg-typography__word ${isAccent ? 'bg-typography__word--accent' : ''} ${className}`;
    span.textContent = word;
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
