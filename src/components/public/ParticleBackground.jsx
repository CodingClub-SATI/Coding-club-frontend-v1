import { useEffect, useRef } from 'react';
import './ParticleBackground.css';

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // ==========================
    // Configuration
    // ==========================
    const TARGET_FPS = 30;
    const FRAME_TIME = 1000 / TARGET_FPS;

    const CONNECTION_DISTANCE = 130;
    const CONNECTION_DISTANCE_SQ = CONNECTION_DISTANCE * CONNECTION_DISTANCE;
    const INV_CONNECTION_DISTANCE_SQ = 1 / CONNECTION_DISTANCE_SQ;
    const INV_CELL_SIZE = 1 / CONNECTION_DISTANCE;

    const MAX_PARTICLES = 130;
    const PARTICLE_DENSITY = 23000;

    const PARTICLE_SPEED = 0.15;
    const MAX_PARTICLE_SIZE = 2;
    const MIN_PARTICLE_SIZE = 1;

    const LINE_OPACITY = 0.15;
    const LINE_OPACITY_STEPS = 5;

    // Accessibility //
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId;
    let resizeTimeout;
    let lastFrameTime = 0;
    let isPaused = false;
    let logicalWidth = 0;
    let logicalHeight = 0;
    let particles = [];

    let cols = 0;
    let rows = 0;
    let grid = [];

    const lineBuckets = Array.from({ length: LINE_OPACITY_STEPS }, () => []);

    const styles = getComputedStyle(document.documentElement);

    const accentRgb = styles.getPropertyValue('--brand-accent-rgb').trim() || '255, 255, 255';
    const secondaryRgb = styles.getPropertyValue('--brand-secondary-rgb').trim() || '100, 100, 100';

    const accentColor = `rgb(${accentRgb})`;
    const secondaryColor = `rgb(${secondaryRgb})`;

    // Precompute the stroke color + opacity for each bucket once, since
    // accentRgb never changes at runtime.
    const bucketStrokeStyles = new Array(LINE_OPACITY_STEPS);
    for (let b = 0; b < LINE_OPACITY_STEPS; b++) {
      const opacity = ((b + 0.5) / LINE_OPACITY_STEPS) * LINE_OPACITY;
      bucketStrokeStyles[b] = `rgba(${accentRgb}, ${opacity})`;
    }

    function initParticles() {
      particles = [];
      const area = logicalWidth * logicalHeight;
      const particleCount = Math.min(MAX_PARTICLES, (area / PARTICLE_DENSITY) | 0);

      for (let i = 0; i < particleCount; i++) {

        particles.push({
          id: i,
          x: Math.random() * logicalWidth,
          y: Math.random() * logicalHeight,
          vx: (Math.random() - 0.5) * PARTICLE_SPEED,
          vy: (Math.random() - 0.5) * PARTICLE_SPEED,
          cellX: 0,
          cellY: 0,
          size: Math.random() * (MAX_PARTICLE_SIZE - MIN_PARTICLE_SIZE) + MIN_PARTICLE_SIZE,
          alpha: Math.random() * 0.5 + 0.1,
          color: Math.random() > 0.6 ? accentColor : secondaryColor,
        });
      }
    }

    function rebuildGrid() {
      cols = Math.max(1, Math.ceil(logicalWidth * INV_CELL_SIZE));
      rows = Math.max(1, Math.ceil(logicalHeight * INV_CELL_SIZE));
      grid = Array.from({ length: cols * rows }, () => []);
    }

    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      logicalWidth = window.innerWidth;
      logicalHeight = window.innerHeight;

      canvas.width = logicalWidth * dpr;
      canvas.height = logicalHeight * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineWidth = 0.6;
      rebuildGrid();
      initParticles();
    }

    resizeCanvas();

    function handleResize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 200);
    }
    window.addEventListener('resize', handleResize, { passive: true });

    function handleVisibilityChange() {
      isPaused = document.hidden;

      if (!isPaused) {
        lastFrameTime = performance.now();
        animationId = requestAnimationFrame(draw);
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);

    function draw(currentTime) {
      if (isPaused) return;

      if (currentTime - lastFrameTime < FRAME_TIME) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      lastFrameTime = currentTime - ((currentTime - lastFrameTime) % FRAME_TIME);
      ctx.clearRect(0, 0, logicalWidth, logicalHeight);

      const particleCount = particles.length;
      for (let i = 0; i < grid.length; i++) {
        grid[i].length = 0;
      }

      for (let b = 0; b < LINE_OPACITY_STEPS; b++) {
        lineBuckets[b].length = 0;
      }

      // ==========================
      // Update particles + build grid
      // ==========================
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];

        let x = p.x + p.vx;
        let y = p.y + p.vy;

        // Wrap around edges
        if (x < 0) x += logicalWidth;
        else if (x >= logicalWidth) x -= logicalWidth;

        if (y < 0) y += logicalHeight;
        else if (y >= logicalHeight) y -= logicalHeight;

        const cellX = (x * INV_CELL_SIZE) | 0;
        const cellY = (y * INV_CELL_SIZE) | 0;

        p.x = x;
        p.y = y;
        p.cellX = cellX;
        p.cellY = cellY;

        grid[cellY * cols + cellX].push(p);
      }

      // ==========================
      // Find connections, sorted into opacity buckets
      // ==========================
      for (let i = 0; i < particleCount; i++) {
        const p1 = particles[i];
        const p1x = p1.x;
        const p1y = p1.y;
        const cellX = p1.cellX;
        const cellY = p1.cellY;

        for (let dRow = -1; dRow <= 1; dRow++) {
          const neighborRow = cellY + dRow;
          if (neighborRow < 0 || neighborRow >= rows) continue;

          const rowOffset = neighborRow * cols;

          for (let dCol = -1; dCol <= 1; dCol++) {
            const neighborCol = cellX + dCol;
            if (neighborCol < 0 || neighborCol >= cols) continue;

            const cell = grid[rowOffset + neighborCol];

            for (let j = 0; j < cell.length; j++) {
              const p2 = cell[j];

              // Prevent duplicate lines
              if (p2.id <= p1.id) continue;

              const p2x = p2.x;
              const p2y = p2.y;

              const dx = p1x - p2x;
              const dxSq = dx * dx;
              // Short-circuit before touching dy at all
              if (dxSq > CONNECTION_DISTANCE_SQ) continue;

              const dy = p1y - p2y;
              const distSq = dxSq + dy * dy;

              if (distSq > CONNECTION_DISTANCE_SQ) continue;

              const ratio = 1 - distSq * INV_CONNECTION_DISTANCE_SQ;
              let bucket = (ratio * LINE_OPACITY_STEPS) | 0;
              if (bucket >= LINE_OPACITY_STEPS) bucket = LINE_OPACITY_STEPS - 1;

              lineBuckets[bucket].push(p1x, p1y, p2x, p2y);
            }
          }
        }
      }

      // ==========================
      // Draw connections: one beginPath/stroke per bucket, not per line
      // ==========================
      for (let b = 0; b < LINE_OPACITY_STEPS; b++) {
        const bucket = lineBuckets[b];
        const len = bucket.length;
        if (len === 0) continue;

        ctx.strokeStyle = bucketStrokeStyles[b];
        ctx.beginPath();
        for (let k = 0; k < len; k += 4) {
          ctx.moveTo(bucket[k], bucket[k + 1]);
          ctx.lineTo(bucket[k + 2], bucket[k + 3]);
        }
        ctx.stroke();
      }

      // ==========================
      // Draw particles
      // ==========================
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;

      animationId = requestAnimationFrame(draw);
    }

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);

      clearTimeout(resizeTimeout);

      window.removeEventListener('resize', handleResize);

      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="particle-canvas"
      aria-hidden="true"
    />
  );
}
