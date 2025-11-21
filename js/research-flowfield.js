(function() {
  const canvas = document.getElementById("research-flowfield");
  if (!canvas) return;

  // Feature detection and error handling
  if (!canvas.getContext) {
    console.warn('Canvas not supported');
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.warn('Canvas 2D context not supported');
    return;
  }
  let width = 0;
  let height = 0;
  let dpr = window.devicePixelRatio || 1;

  // Flowfield parameters
  const fieldScale = 0.0016;
  const timeScale = 0.00008;
  const zOffsetSpeed = 0.00003;
  let zOffset = 0;

  // Mouse interaction parameters
  let mouseX = width / 2;
  let mouseY = height / 2;
  const mouseInfluenceRadius = 150;
  const mouseRepelStrength = 2.5;

  // Particle parameters
  let particles = [];
  let particleCount = 0;
  const baseSpeed = 0.5;
  const trailFade = 0.08;

  // Color palette - read from CSS variables for theme consistency
  // Converts hex color from CSS variable to RGB object
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : {r: 107, g: 39, b: 55}; // fallback to wine
  }

  // Read wine color from CSS variable (--accent-wine)
  const wineColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-wine').trim();
  const baseWine = hexToRgb(wineColor);

  // Generate color variations based on base wine color
  const colors = [
    baseWine, // Base wine from CSS
    {r: Math.min(255, baseWine.r + 57), g: Math.min(255, baseWine.g + 46), b: Math.min(255, baseWine.b + 53)}, // Lighter
    {r: Math.max(0, baseWine.r - 33), g: Math.max(0, baseWine.g - 13), b: Math.max(0, baseWine.b - 18)}, // Darker
    {r: Math.min(255, baseWine.r + 93), g: Math.min(255, baseWine.g + 51), b: Math.min(255, baseWine.b + 55)}, // Bright
    {r: Math.min(255, baseWine.r + 23), g: Math.min(255, baseWine.g + 11), b: Math.min(255, baseWine.b + 15)} // Mid-tone
  ];

  const rand = (min, max) => Math.random() * (max - min) + min;

  // PERLIN NOISE IMPLEMENTATION
  const PERM_SIZE = 256;
  const perm = new Uint8Array(PERM_SIZE * 2);
  (function initPerm() {
    const p = [];
    for (let i = 0; i < PERM_SIZE; i++) p[i] = i;
    for (let i = PERM_SIZE - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    for (let i = 0; i < PERM_SIZE * 2; i++) {
      perm[i] = p[i % PERM_SIZE];
    }
  })();

  const grad3 = [
    [ 1,  1,  0], [-1,  1,  0], [ 1, -1,  0], [-1, -1,  0],
    [ 1,  0,  1], [-1,  0,  1], [ 1,  0, -1], [-1,  0, -1],
    [ 0,  1,  1], [ 0, -1,  1], [ 0,  1, -1], [ 0, -1, -1]
  ];

  function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function grad(hash, x, y, z) {
    const g = grad3[hash % grad3.length];
    return g[0] * x + g[1] * y + g[2] * z;
  }

  function noise3(x, y, z) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;

    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const zf = z - Math.floor(z);

    const u = fade(xf);
    const v = fade(yf);
    const w = fade(zf);

    const A  =  perm[X] + Y;
    const AA =  perm[A] + Z;
    const AB =  perm[A + 1] + Z;
    const B  =  perm[X + 1] + Y;
    const BA =  perm[B] + Z;
    const BB =  perm[B + 1] + Z;

    const x1 = lerp(
      grad(perm[AA], xf,     yf,     zf),
      grad(perm[BA], xf - 1, yf,     zf),
      u
    );
    const x2 = lerp(
      grad(perm[AB], xf,     yf - 1, zf),
      grad(perm[BB], xf - 1, yf - 1, zf),
      u
    );
    const y1 = lerp(x1, x2, v);

    const x3 = lerp(
      grad(perm[AA + 1], xf,     yf,     zf - 1),
      grad(perm[BA + 1], xf - 1, yf,     zf - 1),
      u
    );
    const x4 = lerp(
      grad(perm[AB + 1], xf,     yf - 1, zf - 1),
      grad(perm[BB + 1], xf - 1, yf - 1, zf - 1),
      u
    );
    const y2 = lerp(x3, x4, v);

    return (lerp(y1, y2, w) + 1) * 0.5;
  }

  // Sample flowfield vector with mouse interaction
  function sampleFlowField(x, y, timeMs) {
    const t = timeMs * timeScale + zOffset;
    const nx = x * fieldScale;
    const ny = y * fieldScale;

    const angleNoise = noise3(nx, ny, t);
    const magNoise = noise3(nx + 100.5, ny - 123.8, t + 21.7);

    let angle = angleNoise * Math.PI * 2;
    let mag = 0.7 + magNoise * 0.8;

    // Calculate mouse influence
    const dx = x - mouseX;
    const dy = y - mouseY;
    const distToMouse = Math.sqrt(dx * dx + dy * dy);

    if (distToMouse < mouseInfluenceRadius && distToMouse > 0) {
      // Calculate repulsion force
      const influence = 1 - (distToMouse / mouseInfluenceRadius);
      const repelAngle = Math.atan2(dy, dx);
      const repelMag = influence * mouseRepelStrength;

      // Add repulsion vector to the flowfield vector
      const vx = Math.cos(angle) * mag + Math.cos(repelAngle) * repelMag;
      const vy = Math.sin(angle) * mag + Math.sin(repelAngle) * repelMag;
      return { vx, vy };
    }

    const vx = Math.cos(angle) * mag;
    const vy = Math.sin(angle) * mag;
    return { vx, vy };
  }

  // Create particle
  function createParticle() {
    const margin = 40;
    const x = rand(-margin, width + margin);
    const y = rand(-margin, height + margin);

    // Pick a color (weighted distribution)
    const r = Math.random();
    let color;
    if (r < 0.4) color = colors[0];        // wine (most common)
    else if (r < 0.65) color = colors[1];  // lighter burgundy
    else if (r < 0.85) color = colors[2];  // deep burgundy
    else if (r < 0.95) color = colors[4];  // mid-tone
    else color = colors[3];                // bright red (rare)

    const alpha = rand(0.18, 0.5);
    const lineWidth = rand(0.25, 0.85);

    return {
      x,
      y,
      prevX: x,
      prevY: y,
      color,
      alpha,
      lineWidth,
      speedMul: rand(0.5, 1.3)
    };
  }

  function initParticles() {
    particles = [];
    // Reduce particle count on mobile for better performance
    const isMobile = width < 768;
    const base = (width * height) / (isMobile ? 3000 : 2000);
    particleCount = isMobile
      ? Math.min(800, Math.max(300, base))  // 300-800 on mobile
      : Math.min(1800, Math.max(600, base)); // 600-1800 on desktop

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }
  }

  // Resize canvas
  function resize() {
    dpr = window.devicePixelRatio || 1;
    const parent = canvas.parentElement;
    width = parent.offsetWidth;
    height = parent.offsetHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = "#0A0A0A";
    ctx.fillRect(0, 0, width, height);

    initParticles();
  }

  window.addEventListener("resize", resize);
  resize();

  // Track mouse position for interaction
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  // Reset mouse position when leaving canvas
  canvas.addEventListener('mouseleave', () => {
    mouseX = width / 2;
    mouseY = height / 2;
  });

  // Performance monitoring
  performance.mark('flowfield-init-start');

  // Animation loop with page visibility control
  let lastTime = performance.now();
  let isPageVisible = !document.hidden;
  let firstFrame = true;
  let animationFrameId = null;

  // Pause animation when tab is hidden to save battery
  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
    if (isPageVisible) {
      lastTime = performance.now(); // Reset time to prevent jump
      requestAnimationFrame(step);
    }
  });

  function step(now) {
    if (!isPageVisible) return; // Pause when hidden

    try {
      // Track first frame performance
      if (firstFrame) {
        performance.mark('flowfield-first-frame');
        performance.measure('flowfield-init', 'flowfield-init-start', 'flowfield-first-frame');
        firstFrame = false;
      }

      const dt = now - lastTime;
      lastTime = now;

      zOffset += dt * zOffsetSpeed;

      ctx.fillStyle = `rgba(10, 10, 10, ${trailFade})`;
      ctx.fillRect(0, 0, width, height);

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.prevX = p.x;
        p.prevY = p.y;

        const { vx, vy } = sampleFlowField(p.x, p.y, now);
        p.x += vx * baseSpeed * p.speedMul;
        p.y += vy * baseSpeed * p.speedMul;

        const margin = 30;
        if (p.x < -margin || p.x > width + margin || p.y < -margin || p.y > height + margin) {
          particles[i] = createParticle();
          continue;
        }

        ctx.beginPath();
        ctx.moveTo(p.prevX, p.prevY);
        ctx.lineTo(p.x, p.y);

        const c = p.color;
        ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${p.alpha})`;
        ctx.lineWidth = p.lineWidth;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(step);
    } catch (err) {
      console.error('Flowfield animation error:', err);
      // Stop animation on error to prevent infinite error loop
      return;
    }
  }

  animationFrameId = requestAnimationFrame(step);

  // Cleanup on page unload
  function cleanup() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    window.removeEventListener('resize', resize);
    particles = [];
  }

  window.addEventListener('beforeunload', cleanup);
  window.addEventListener('pagehide', cleanup);
})();
