'use client';

import React, { useRef, useEffect } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  color: string;
  hasSpikes: boolean;
}

interface NebulaCloud {
  x: number;
  y: number;
  radius: number;
  colorStop0: string;
  colorStop1: string;
  alpha: number;
  speedX: number;
  speedY: number;
  phase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  width: number;
  active: boolean;
}

interface DustParticle {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  vx: number;
  vy: number;
  color: string;
}

interface StarfieldCanvasProps {
  className?: string;
  starCount?: number;
  showNebula?: boolean;
  showPlanet?: boolean;
  showMoon?: boolean;
  showBear?: boolean;
  showShootingStars?: boolean;
  reducedMotion?: boolean;
}

export default function StarfieldCanvas({
  className = '',
  starCount = 280,
  showNebula = true,
  showPlanet = false,
  showMoon = true,
  showBear = true,
  showShootingStars = true,
  reducedMotion = false,
}: StarfieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameIdRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // References to keep state outside React renders
  const starsRef = useRef<Star[]>([]);
  const nebulaeRef = useRef<NebulaCloud[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const dustRef = useRef<DustParticle[]>([]);
  const nextMeteorTimeRef = useRef<number>(2000);

  // Planet parameters
  const planetRef = useRef({
    xRatio: 0.85,
    yRatio: 0.22,
    radius: 54,
  });

  // Initialize all cosmos elements once
  useEffect(() => {
    // 1. Generate multi-magnitude stars
    const stars: Star[] = [];
    const colors = [
      '#F8F7FF', // Brilliant white
      '#648BFF', // Electric blue
      '#C4D4FF', // Blue-white
      '#D58ACF', // Soft nebula pink
      '#F1D5A5', // Stardust gold
    ];

    for (let i = 0; i < starCount; i++) {
      const isGiant = i < 15; // 15 prominent bright stars with diffraction flares
      const isMedium = i < 70;
      const radius = isGiant
        ? 2.2 + Math.random() * 1.4
        : isMedium
        ? 1.2 + Math.random() * 0.9
        : 0.4 + Math.random() * 0.7;

      stars.push({
        x: Math.random(),
        y: Math.random(),
        radius,
        baseOpacity: isGiant ? 0.85 : 0.25 + Math.random() * 0.65,
        twinkleSpeed: 0.4 + Math.random() * 1.5,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        hasSpikes: isGiant,
      });
    }
    starsRef.current = stars;

    // 2. Generate Volumetric Nebula Clouds (Multi-layer color clusters)
    const nebulae: NebulaCloud[] = [
      {
        x: 0.2,
        y: 0.35,
        radius: 0.55,
        colorStop0: 'rgba(118, 86, 201, 0.22)', // Deep Violet Core
        colorStop1: 'rgba(51, 71, 185, 0.0)',
        alpha: 0.25,
        speedX: 0.00008,
        speedY: 0.00005,
        phase: 0,
      },
      {
        x: 0.78,
        y: 0.45,
        radius: 0.6,
        colorStop0: 'rgba(100, 139, 255, 0.2)', // Electric Blue
        colorStop1: 'rgba(118, 86, 201, 0.0)',
        alpha: 0.22,
        speedX: -0.00006,
        speedY: 0.00007,
        phase: Math.PI / 3,
      },
      {
        x: 0.5,
        y: 0.8,
        radius: 0.5,
        colorStop0: 'rgba(213, 138, 207, 0.16)', // Magenta / Pink bloom
        colorStop1: 'rgba(51, 71, 185, 0.0)',
        alpha: 0.18,
        speedX: 0.00005,
        speedY: -0.00006,
        phase: Math.PI / 1.5,
      },
      {
        x: 0.65,
        y: 0.18,
        radius: 0.4,
        colorStop0: 'rgba(241, 213, 165, 0.12)', // Stardust Gold aura
        colorStop1: 'rgba(118, 86, 201, 0.0)',
        alpha: 0.14,
        speedX: -0.00004,
        speedY: -0.00004,
        phase: Math.PI,
      },
    ];
    nebulaeRef.current = nebulae;

    // 3. Floating foreground stardust particles
    const dust: DustParticle[] = [];
    for (let i = 0; i < 40; i++) {
      dust.push({
        x: Math.random(),
        y: Math.random(),
        radius: 0.8 + Math.random() * 1.5,
        opacity: 0.15 + Math.random() * 0.4,
        vx: (Math.random() - 0.5) * 0.00008,
        vy: (Math.random() - 0.5) * 0.00008,
        color: i % 2 === 0 ? '#648BFF' : '#F1D5A5',
      });
    }
    dustRef.current = dust;

    // 4. Shooting Stars pool
    shootingStarsRef.current = [];
  }, [starCount]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Animation Loop
    const render = (time: number) => {
      if (document.hidden) {
        animFrameIdRef.current = requestAnimationFrame(render);
        return;
      }

      const dt = lastTimeRef.current ? Math.min(time - lastTimeRef.current, 100) : 16;
      lastTimeRef.current = time;

      ctx.clearRect(0, 0, width, height);

      // ── LAYER 1: Deep Cosmic Space Gradient ──
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.85
      );
      bgGrad.addColorStop(0, '#0A0E28');
      bgGrad.addColorStop(0.5, '#080B1C');
      bgGrad.addColorStop(1, '#050713');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // ── LAYER 2: Volumetric Nebula Glow ──
      if (showNebula) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        nebulaeRef.current.forEach((nebula) => {
          const driftX = Math.sin(time * nebula.speedX + nebula.phase) * (width * 0.04);
          const driftY = Math.cos(time * nebula.speedY + nebula.phase) * (height * 0.04);
          const cx = nebula.x * width + driftX;
          const cy = nebula.y * height + driftY;
          const r = nebula.radius * Math.max(width, height);

          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
          grad.addColorStop(0, nebula.colorStop0);
          grad.addColorStop(0.45, nebula.colorStop0.replace(/[\d.]+\)$/, `${nebula.alpha * 0.5})`));
          grad.addColorStop(1, nebula.colorStop1);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.restore();
      }

      // ── LAYER 3: Distant Celestial Planet (Optional for Intro/Constellation) ──
      if (showPlanet) {
        const px = planetRef.current.xRatio * width;
        const py = planetRef.current.yRatio * height;
        const pr = planetRef.current.radius;

        ctx.save();
        // Planet Outer Atmospheric Aura
        const aura = ctx.createRadialGradient(px, py, pr * 0.8, px, py, pr * 2.2);
        aura.addColorStop(0, 'rgba(100, 139, 255, 0.35)');
        aura.addColorStop(0.5, 'rgba(118, 86, 201, 0.15)');
        aura.addColorStop(1, 'transparent');
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(px, py, pr * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Planet Sphere with Twilight Terminator
        const sphere = ctx.createRadialGradient(px - pr * 0.35, py - pr * 0.35, pr * 0.1, px, py, pr);
        sphere.addColorStop(0, '#EAE8FF');
        sphere.addColorStop(0.2, '#7656C9');
        sphere.addColorStop(0.55, '#161D3C');
        sphere.addColorStop(0.85, '#070A18');
        sphere.addColorStop(1, '#050713');
        ctx.fillStyle = sphere;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fill();

        // Planet Rings
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(-Math.PI / 6);
        ctx.scale(1, 0.28);
        ctx.beginPath();
        ctx.arc(0, 0, pr * 1.9, 0, Math.PI * 2);
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(241, 213, 165, 0.35)';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, pr * 2.3, 0, Math.PI * 2);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(100, 139, 255, 0.25)';
        ctx.stroke();
        ctx.restore();

        ctx.restore();
      }

      // ── LAYER 3.5: Floating 3D Moon (Zero-Gravity Orbit) ──
      if (showMoon) {
        drawFloatingMoon(ctx, width, height, time);
      }

      // ── LAYER 4: Multi-Magnitude Stars ──
      starsRef.current.forEach((star) => {
        const sx = star.x * width;
        const sy = star.y * height;

        // Twinkle factor
        const twinkle = reducedMotion
          ? 1
          : 0.5 + 0.5 * Math.sin(time * 0.002 * star.twinkleSpeed + star.twinkleOffset);
        const opacity = star.baseOpacity * (0.6 + 0.4 * twinkle);

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = star.color;

        // Soft halo on brighter stars
        if (star.radius > 1.2) {
          ctx.beginPath();
          ctx.arc(sx, sy, star.radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = opacity * 0.25;
          ctx.fill();
          ctx.globalAlpha = opacity;
        }

        // Star Core
        ctx.beginPath();
        ctx.arc(sx, sy, star.radius, 0, Math.PI * 2);
        ctx.fill();

        // Cross diffraction spikes on bright giants
        if (star.hasSpikes && !reducedMotion) {
          const spikeLen = star.radius * 4.5 * twinkle;
          ctx.strokeStyle = star.color;
          ctx.lineWidth = 0.5;
          ctx.globalAlpha = opacity * 0.6;
          ctx.beginPath();
          ctx.moveTo(sx - spikeLen, sy);
          ctx.lineTo(sx + spikeLen, sy);
          ctx.moveTo(sx, sy - spikeLen);
          ctx.lineTo(sx, sy + spikeLen);
          ctx.stroke();
        }

        ctx.restore();
      });

      // ── LAYER 5: Shooting Stars (Meteors) ──
      if (showShootingStars && !reducedMotion) {
        // Spawn meteor periodically
        if (time > nextMeteorTimeRef.current) {
          shootingStarsRef.current.push({
            x: Math.random() * width * 0.8,
            y: Math.random() * height * 0.35,
            length: 80 + Math.random() * 90,
            speed: 12 + Math.random() * 8,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2, // ~45 deg diagonal
            opacity: 1,
            width: 1.5 + Math.random() * 1,
            active: true,
          });
          nextMeteorTimeRef.current = time + 4000 + Math.random() * 5000;
        }

        // Draw and update active shooting stars
        shootingStarsRef.current.forEach((meteor) => {
          if (!meteor.active) return;

          const endX = meteor.x - Math.cos(meteor.angle) * meteor.length;
          const endY = meteor.y - Math.sin(meteor.angle) * meteor.length;

          const mGrad = ctx.createLinearGradient(meteor.x, meteor.y, endX, endY);
          mGrad.addColorStop(0, `rgba(248, 247, 255, ${meteor.opacity})`);
          mGrad.addColorStop(0.3, `rgba(100, 139, 255, ${meteor.opacity * 0.7})`);
          mGrad.addColorStop(0.7, `rgba(118, 86, 201, ${meteor.opacity * 0.3})`);
          mGrad.addColorStop(1, 'transparent');

          ctx.save();
          ctx.strokeStyle = mGrad;
          ctx.lineWidth = meteor.width;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(meteor.x, meteor.y);
          ctx.lineTo(endX, endY);
          ctx.stroke();

          // Bright glowing head
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(meteor.x, meteor.y, meteor.width * 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Update meteor position
          meteor.x += Math.cos(meteor.angle) * meteor.speed;
          meteor.y += Math.sin(meteor.angle) * meteor.speed;
          meteor.opacity -= 0.016;

          if (meteor.opacity <= 0 || meteor.x > width + 100 || meteor.y > height + 100) {
            meteor.active = false;
          }
        });

        // Filter dead meteors
        shootingStarsRef.current = shootingStarsRef.current.filter((m) => m.active);
      }

      // ── LAYER 6: Floating Foreground Cosmic Dust ──
      if (!reducedMotion) {
        dustRef.current.forEach((d) => {
          d.x += d.vx * dt;
          d.y += d.vy * dt;

          if (d.x < 0) d.x = 1;
          if (d.x > 1) d.x = 0;
          if (d.y < 0) d.y = 1;
          if (d.y > 1) d.y = 0;

          const dx = d.x * width;
          const dy = d.y * height;

          ctx.save();
          ctx.globalAlpha = d.opacity;
          ctx.fillStyle = d.color;
          ctx.beginPath();
          ctx.arc(dx, dy, d.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }

      // ── LAYER 7: Floating 3D Astronaut Bear (Zero Gravity) ──
      if (showBear) {
        drawFloatingBear(ctx, width, height, time);
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [showNebula, showPlanet, showMoon, showBear, showShootingStars, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}

// ── 3D FLOATING LUNAR MOON (Zero-Gravity Canvas Vector Renderer) ──
function drawFloatingMoon(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number
) {
  // Smooth zero-g drift in upper right space
  const mx = width * 0.82 + Math.sin(time * 0.0004) * 20;
  const my = height * 0.22 + Math.cos(time * 0.0005) * 16;
  const radius = Math.min(width, height) * 0.08 + 24;

  ctx.save();
  ctx.translate(mx, my);

  // Outer moonlight atmospheric aura
  const aura = ctx.createRadialGradient(0, 0, radius * 0.7, 0, 0, radius * 2.2);
  aura.addColorStop(0, 'rgba(241, 213, 165, 0.35)');
  aura.addColorStop(0.3, 'rgba(100, 139, 255, 0.18)');
  aura.addColorStop(0.7, 'rgba(118, 86, 201, 0.08)');
  aura.addColorStop(1, 'transparent');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 2.2, 0, Math.PI * 2);
  ctx.fill();

  // 3D Lunar Sphere with volumetric terminator gradient
  const moonGrad = ctx.createRadialGradient(
    -radius * 0.35,
    -radius * 0.35,
    radius * 0.1,
    0,
    0,
    radius
  );
  moonGrad.addColorStop(0, '#FFFFFF');
  moonGrad.addColorStop(0.25, '#F1E9DB');
  moonGrad.addColorStop(0.55, '#C4B5D0');
  moonGrad.addColorStop(0.85, '#2D224C');
  moonGrad.addColorStop(1, '#0C0A1E');
  ctx.fillStyle = moonGrad;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  // Craters with 3D bevel (inner shadow + lit rim)
  const craters = [
    { x: -0.2 * radius, y: -0.15 * radius, r: 0.18 * radius },
    { x: 0.25 * radius, y: -0.28 * radius, r: 0.13 * radius },
    { x: 0.05 * radius, y: 0.25 * radius, r: 0.22 * radius },
    { x: -0.35 * radius, y: 0.2 * radius, r: 0.14 * radius },
    { x: 0.38 * radius, y: 0.1 * radius, r: 0.1 * radius },
  ];

  craters.forEach((c) => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(30, 20, 50, 0.3)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(c.x - c.r * 0.2, c.y - c.r * 0.2, c.r * 0.85, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Stardust stars in lunar orbit
  for (let i = 0; i < 6; i++) {
    const angle = time * 0.0008 * (i % 2 === 0 ? 1 : -1) + (i * Math.PI) / 3;
    const dist = radius * (1.3 + 0.3 * Math.sin(time * 0.001 + i));
    const px = Math.cos(angle) * dist;
    const py = Math.sin(angle) * dist * 0.6;
    ctx.beginPath();
    ctx.arc(px, py, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? '#F1D5A5' : '#648BFF';
    ctx.fill();
  }

  ctx.restore();
}

// ── 3D FLOATING ZERO-GRAVITY ASTRONAUT BEAR (Canvas Vector Renderer) ──
function drawFloatingBear(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number
) {
  // Weightless floating drift on the left / mid-left
  const bx = width * 0.18 + Math.sin(time * 0.0006) * 35;
  const by = height * 0.52 + Math.cos(time * 0.0008) * 28;
  const scale = Math.min(width, height) < 600 ? 0.78 : 1.05;

  // Gentle zero-gravity tumble/rocking
  const tilt = Math.sin(time * 0.0007) * 0.18 + Math.cos(time * 0.0011) * 0.05;

  ctx.save();
  ctx.translate(bx, by);
  ctx.scale(scale, scale);
  ctx.rotate(tilt);

  // 1. Stardust bubbles floating behind the bear
  for (let i = 0; i < 5; i++) {
    const bubbleTime = time * 0.001 + i * 1.5;
    const bDist = 45 + i * 16;
    const bAngle = Math.PI * 0.75 + Math.sin(bubbleTime) * 0.4;
    const px = Math.cos(bAngle) * bDist;
    const py = Math.sin(bAngle) * bDist;
    const bSize = 2.5 + (i % 3) * 1.5;
    const bAlpha = 0.25 + 0.25 * Math.sin(bubbleTime * 1.5);

    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, bSize, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? `rgba(241, 168, 208, ${bAlpha})` : `rgba(100, 139, 255, ${bAlpha})`;
    ctx.fill();
    ctx.restore();
  }

  // 2. Silver tether line to floating glowing heart balloon
  const heartAngle = -Math.PI * 0.35 + Math.sin(time * 0.0012) * 0.15;
  const heartDist = 72 + Math.cos(time * 0.001) * 10;
  const hx = Math.cos(heartAngle) * heartDist;
  const hy = Math.sin(heartAngle) * heartDist;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(15, -10);
  ctx.quadraticCurveTo(hx * 0.5 + 15, hy * 0.5 - 10, hx, hy + 12);
  ctx.strokeStyle = 'rgba(241, 213, 165, 0.45)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();

  // Floating Glowing Heart Balloon
  ctx.save();
  ctx.translate(hx, hy);
  ctx.rotate(Math.sin(time * 0.0015) * 0.12);
  const heartScale = 0.85 + 0.05 * Math.sin(time * 0.003);
  ctx.scale(heartScale, heartScale);

  const hGlow = ctx.createRadialGradient(0, 0, 5, 0, 0, 22);
  hGlow.addColorStop(0, 'rgba(241, 168, 208, 0.6)');
  hGlow.addColorStop(0.5, 'rgba(118, 86, 201, 0.2)');
  hGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = hGlow;
  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, 5);
  ctx.bezierCurveTo(-12, -8, -14, -20, 0, -22);
  ctx.bezierCurveTo(14, -20, 12, -8, 0, 5);
  const heartGrad = ctx.createRadialGradient(-3, -12, 1, 0, -8, 16);
  heartGrad.addColorStop(0, '#FFE8F3');
  heartGrad.addColorStop(0.3, '#F1A8D0');
  heartGrad.addColorStop(0.7, '#D58ACF');
  heartGrad.addColorStop(1, '#7656C9');
  ctx.fillStyle = heartGrad;
  ctx.fill();
  ctx.restore();

  // 3. Bear Suit Backpack (Oxygen tank)
  ctx.save();
  ctx.beginPath();
  ctx.arc(-10, 8, 14, 0, Math.PI * 2);
  ctx.arc(10, 8, 14, 0, Math.PI * 2);
  ctx.fillStyle = '#1A2142';
  ctx.fill();
  ctx.restore();

  // Feet
  const footSwing = Math.sin(time * 0.002) * 4;
  ctx.beginPath();
  ctx.arc(-14, 28 + footSwing, 9, 0, Math.PI * 2);
  const footGradL = ctx.createRadialGradient(-16, 26 + footSwing, 1, -14, 28 + footSwing, 9);
  footGradL.addColorStop(0, '#FFF5EA');
  footGradL.addColorStop(0.6, '#E0C7AF');
  footGradL.addColorStop(1, '#A88B70');
  ctx.fillStyle = footGradL;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(14, 28 - footSwing, 9, 0, Math.PI * 2);
  const footGradR = ctx.createRadialGradient(12, 26 - footSwing, 1, 14, 28 - footSwing, 9);
  footGradR.addColorStop(0, '#FFF5EA');
  footGradR.addColorStop(0.6, '#E0C7AF');
  footGradR.addColorStop(1, '#A88B70');
  ctx.fillStyle = footGradR;
  ctx.fill();

  // Torso
  ctx.beginPath();
  ctx.arc(0, 10, 24, 0, Math.PI * 2);
  const bodyGrad = ctx.createRadialGradient(-6, 2, 2, 0, 10, 24);
  bodyGrad.addColorStop(0, '#FFFBF5');
  bodyGrad.addColorStop(0.4, '#EFE0D0');
  bodyGrad.addColorStop(0.8, '#D1B499');
  bodyGrad.addColorStop(1, '#987A60');
  ctx.fillStyle = bodyGrad;
  ctx.fill();

  // Gold Star Badge on Chest
  ctx.save();
  ctx.translate(0, 12);
  ctx.beginPath();
  ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = '#F1D5A5';
  ctx.fill();
  ctx.restore();

  // Paws
  const pawWave = Math.sin(time * 0.0025) * 6;
  ctx.beginPath();
  ctx.arc(-22, 2 - pawWave, 7.5, 0, Math.PI * 2);
  ctx.fillStyle = '#EFE0D0';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(20, 0 + pawWave * 0.5, 7.5, 0, Math.PI * 2);
  ctx.fillStyle = '#EFE0D0';
  ctx.fill();

  // Ears
  ctx.beginPath();
  ctx.arc(-19, -32, 9, 0, Math.PI * 2);
  ctx.fillStyle = '#E0C7AF';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-19, -32, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#F1A8D0';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(19, -32, 9, 0, Math.PI * 2);
  ctx.fillStyle = '#E0C7AF';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(19, -32, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#F1A8D0';
  ctx.fill();

  // Head
  ctx.beginPath();
  ctx.arc(0, -18, 22, 0, Math.PI * 2);
  const headGrad = ctx.createRadialGradient(-7, -25, 2, 0, -18, 22);
  headGrad.addColorStop(0, '#FFFFFF');
  headGrad.addColorStop(0.35, '#FFF2E2');
  headGrad.addColorStop(0.75, '#DEBEA0');
  headGrad.addColorStop(1, '#9E7E63');
  ctx.fillStyle = headGrad;
  ctx.fill();

  // Cheeks
  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.beginPath();
  ctx.arc(-12, -12, 4.5, 0, Math.PI * 2);
  ctx.fillStyle = '#F1A8D0';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(12, -12, 4.5, 0, Math.PI * 2);
  ctx.fillStyle = '#F1A8D0';
  ctx.fill();
  ctx.restore();

  // Snout
  ctx.beginPath();
  ctx.ellipse(0, -12, 9, 6.5, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFDF9';
  ctx.fill();

  // Nose
  ctx.beginPath();
  ctx.ellipse(0, -14.5, 3.5, 2.5, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#2A1C38';
  ctx.fill();

  // Smile
  ctx.beginPath();
  ctx.arc(0, -13, 3, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.strokeStyle = '#3A284C';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Eyes
  [-7, 7].forEach((eyeX) => {
    ctx.beginPath();
    ctx.arc(eyeX, -20, 2.8, 0, Math.PI * 2);
    ctx.fillStyle = '#1D1328';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(eyeX - 0.9, -21, 1, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
  });

  // Astronaut Visor Bubble
  ctx.save();
  const helmetR = 30;
  ctx.beginPath();
  ctx.arc(0, -17, helmetR, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(100, 200, 255, 0.45)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, -17, helmetR - 3, -Math.PI * 0.75, -Math.PI * 0.35);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  const visorGrad = ctx.createLinearGradient(-helmetR, -helmetR, helmetR, helmetR);
  visorGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
  visorGrad.addColorStop(0.4, 'rgba(100, 139, 255, 0.08)');
  visorGrad.addColorStop(0.8, 'rgba(213, 138, 207, 0.08)');
  visorGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = visorGrad;
  ctx.fill();
  ctx.restore();

  ctx.restore();
}
