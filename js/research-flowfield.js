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

  // Particle parameters
  let particles = [];
  let particleCount = 0;
  const baseSpeed = 0.5;
  const trailFade = 0.08;

  // Red color palette (wine/burgundy theme)
  const colors = [
    {r:107,g:39,b:55}, {r:164,g:85,b:108}, {r:74,g:26,b:37}, {r:200,g:90,b:110}, {r:130,g:50,b:70}
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

  // Sample flowfield vector
  function sampleFlowField(x, y, timeMs) {
    const t = timeMs * timeScale + zOffset;
    const nx = x * fieldScale;
    const ny = y * fieldScale;

    const angleNoise = noise3(nx, ny, t);
    const magNoise = noise3(nx + 100.5, ny - 123.8, t + 21.7);

    const angle = angleNoise * Math.PI * 2;
    const mag = 0.7 + magNoise * 0.8;

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

  // Performance monitoring
  performance.mark('flowfield-init-start');

  // Animation loop with page visibility control
  let lastTime = performance.now();
  let isPageVisible = !document.hidden;
  let firstFrame = true;

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

      requestAnimationFrame(step);
    } catch (err) {
      console.error('Flowfield animation error:', err);
      // Stop animation on error to prevent infinite error loop
      return;
    }
  }

  requestAnimationFrame(step);
})();
