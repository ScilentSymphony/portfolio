(function() {
  const canvas = document.getElementById("tech-grid");
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

  // Grid parameters
  let cols = 0;
  let rows = 0;
  let gridPadding = 10;
  const targetSpacing = 55;
  const maxCols = 40;

  // Deformation parameters
  const amplitude = 26;
  const timeScale = 0.00025;
  const scale1 = 1.7;
  const scale2 = 3.3;

  // Mouse interaction parameters
  let mouseX = -1000;
  let mouseY = -1000;
  const mouseInfluenceRadius = 200;
  const mouseDeformStrength = 30;

  // Steel/blue color palette - read from CSS variables for theme consistency
  // Converts hex color from CSS variable to RGB object
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : {r: 74, g: 95, b: 122}; // fallback to steel
  }

  // Read steel color from CSS variable (--accent-steel)
  const steelColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-steel').trim();
  const mainColor = hexToRgb(steelColor);

  // Generate color variations based on base steel color
  const softColor = {
    r: Math.min(255, mainColor.r + 26),
    g: Math.min(255, mainColor.g + 25),
    b: Math.min(255, mainColor.b + 23)
  };
  const highlightColor = {
    r: Math.min(255, mainColor.r + 46),
    g: Math.min(255, mainColor.g + 55),
    b: Math.min(255, mainColor.b + 58)
  };

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  // Simple layered trig-based pseudo-noise
  function noise2(nx, ny, timeMs) {
    const t = timeMs * timeScale;

    const v1 =
      Math.sin(nx * scale1 + t * 0.9) +
      Math.cos(ny * scale1 * 1.1 - t * 0.6);

    const v2 =
      Math.sin((nx + ny) * scale2 + t * 0.45) +
      Math.cos((nx - ny) * (scale2 * 0.6) - t * 0.35);

    let v = (v1 + v2) * 0.25;
    v = v * 0.5 + 0.5;
    v = Math.pow(v, 1.4);
    return v;
  }

  function displacePoint(x, y, timeMs) {
    const nx = (x - gridPadding) / Math.max(1, width - gridPadding * 2);
    const ny = (y - gridPadding) / Math.max(1, height - gridPadding * 2);

    const n1 = noise2(nx * 2.1, ny * 2.1, timeMs);
    const n2 = noise2(nx * 3.3 + 12.7, ny * 2.9 - 4.3, timeMs + 8000);

    const angle1 = (n1 - 0.5) * Math.PI * 2;
    const angle2 = (n2 - 0.5) * Math.PI * 2;

    const mag1 = (n1 - 0.5) * 2;
    const mag2 = (n2 - 0.5) * 2;

    let dx = (Math.cos(angle1) * mag1 + Math.sin(angle2) * mag2) * amplitude * 0.7;
    let dy = (Math.sin(angle1) * mag1 - Math.cos(angle2) * mag2) * amplitude;

    // Mouse interaction - deform grid near cursor
    const distToMouse = Math.sqrt((x - mouseX) ** 2 + (y - mouseY) ** 2);
    if (distToMouse < mouseInfluenceRadius) {
      const mouseInfluence = 1 - (distToMouse / mouseInfluenceRadius);
      const mouseAngle = Math.atan2(y - mouseY, x - mouseX);

      // Ripple effect - push away from mouse
      const mouseDx = Math.cos(mouseAngle) * mouseInfluence * mouseDeformStrength;
      const mouseDy = Math.sin(mouseAngle) * mouseInfluence * mouseDeformStrength;

      dx += mouseDx;
      dy += mouseDy;
    }

    // Edge falloff
    const cx = 0.5;
    const cy = 0.5;
    const distFromCenter = Math.sqrt((nx - cx) ** 2 + (ny - cy) ** 2);
    const falloff = lerp(1.0, 0.5, Math.min(distFromCenter * 1.4, 1.0));

    return {
      x: x + dx * falloff,
      y: y + dy * falloff
    };
  }

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

    const usableWidth = Math.max(1, width - gridPadding * 2);
    const usableHeight = Math.max(1, height - gridPadding * 2);

    // Reduce grid resolution on mobile for better performance
    const isMobile = width < 768;
    const spacing = isMobile ? 70 : targetSpacing; // Larger spacing = fewer grid points
    cols = Math.min(maxCols, Math.max(6, Math.round(usableWidth / spacing)));
    rows = Math.max(4, Math.round(usableHeight / spacing));
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
    mouseX = -1000;
    mouseY = -1000;
  });

  function drawGrid(timeMs) {
    ctx.clearRect(0, 0, width, height);

    const usableWidth = width - gridPadding * 2;
    const usableHeight = height - gridPadding * 2;

    const dx = usableWidth / (cols - 1);
    const dy = usableHeight / (rows - 1);

    // Precompute displaced points
    const points = [];
    for (let j = 0; j < rows; j++) {
      points[j] = [];
      for (let i = 0; i < cols; i++) {
        const x = gridPadding + i * dx;
        const y = gridPadding + j * dy;
        points[j][i] = displacePoint(x, y, timeMs);
      }
    }

    // Draw horizontal lines
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (let j = 0; j < rows; j++) {
      const strength = j / (rows - 1);
      const mc = mainColor;
      const sc = softColor;
      const r = Math.round(lerp(sc.r, mc.r, strength));
      const g = Math.round(lerp(sc.g, mc.g, strength));
      const b = Math.round(lerp(sc.b, mc.b, strength));
      const alpha = lerp(0.12, 0.32, strength);

      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.lineWidth = lerp(0.3, 1.0, strength);

      ctx.beginPath();
      for (let i = 0; i < cols; i++) {
        const p = points[j][i];
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }

    // Draw vertical lines
    for (let i = 0; i < cols; i++) {
      const strength = i / (cols - 1);
      const mc = mainColor;
      const sc = softColor;
      const r = Math.round(lerp(sc.r, mc.r, strength));
      const g = Math.round(lerp(sc.g, mc.g, strength));
      const b = Math.round(lerp(sc.b, mc.b, strength));

      // Occasional subtle highlight
      const highlightFactor =
        0.04 * Math.sin((timeMs * timeScale * 0.5) + i * 0.7);

      const hr = Math.round(lerp(r, highlightColor.r, Math.max(0, highlightFactor)));
      const hg = Math.round(lerp(g, highlightColor.g, Math.max(0, highlightFactor)));
      const hb = Math.round(lerp(b, highlightColor.b, Math.max(0, highlightFactor)));

      const alpha = lerp(0.10, 0.30, strength);

      ctx.strokeStyle = `rgba(${hr}, ${hg}, ${hb}, ${alpha})`;
      ctx.lineWidth = lerp(0.3, 0.9, strength);

      ctx.beginPath();
      for (let j = 0; j < rows; j++) {
        const p = points[j][i];
        if (j === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }
  }

  // Performance monitoring
  performance.mark('grid-init-start');

  // Page visibility control for battery optimization
  let isPageVisible = !document.hidden;
  let firstFrame = true;
  let animationFrameId = null;

  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
    if (isPageVisible) {
      requestAnimationFrame(loop);
    }
  });

  function loop(now) {
    if (!isPageVisible) return; // Pause when hidden

    try {
      // Track first frame performance
      if (firstFrame) {
        performance.mark('grid-first-frame');
        performance.measure('grid-init', 'grid-init-start', 'grid-first-frame');
        firstFrame = false;
      }

      drawGrid(now);
      animationFrameId = requestAnimationFrame(loop);
    } catch (err) {
      console.error('Grid animation error:', err);
      // Stop animation on error to prevent infinite error loop
      return;
    }
  }

  animationFrameId = requestAnimationFrame(loop);

  // Cleanup on page unload
  function cleanup() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    window.removeEventListener('resize', resize);
  }

  window.addEventListener('beforeunload', cleanup);
  window.addEventListener('pagehide', cleanup);
})();
