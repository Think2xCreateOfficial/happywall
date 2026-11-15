"use client";

import React, { useRef, useEffect, forwardRef, useImperativeHandle } from "react";

export interface SnapCanvasHandle {
  triggerBurst: (originXPercent?: number, originYPercent?: number) => void;
  clearParticles: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  spin: number;
  spinSpeed: number;
  flicker: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
}

export const SnapCanvas = forwardRef<SnapCanvasHandle>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const shockwavesRef = useRef<Shockwave[]>([]);
  const animFrameId = useRef<number | null>(null);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, []);

  const runAnimationLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    let activeEntities = 0;

    // 1. Render & Update Shockwaves
    for (let i = 0; i < shockwavesRef.current.length; i++) {
      const sw = shockwavesRef.current[i];
      if (sw.alpha > 0.01) {
        activeEntities++;
        sw.radius += sw.speed;
        sw.alpha *= 0.94; // smooth exponential decay

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(245, 183, 0, ${sw.alpha * 0.8})`;
        ctx.lineWidth = Math.max(1, 4 * (1 - sw.radius / sw.maxRadius));
        ctx.shadowColor = "#F5B700";
        ctx.shadowBlur = 15;
        ctx.stroke();

        // Secondary softer inner ring
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 230, 150, ${sw.alpha * 0.5})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }
    }

    // 2. Render & Update Particles
    const GOLD_COLORS = [
      "rgba(255, 215, 0,",
      "rgba(245, 183, 0,",
      "rgba(255, 240, 180,",
      "rgba(255, 170, 0,",
      "rgba(255, 255, 255,",
    ];

    for (let i = 0; i < particlesRef.current.length; i++) {
      const p = particlesRef.current[i];
      if (p.alpha > 0.01) {
        activeEntities++;

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96; // air drag
        p.vy *= 0.96;
        p.vy += 0.04; // subtle gravity
        p.alpha -= p.decay;
        p.spin += p.spinSpeed;

        const dynamicAlpha = Math.max(0, p.alpha * (0.8 + 0.2 * Math.sin(p.flicker += 0.2)));

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.spin);

        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${dynamicAlpha})`;
        ctx.shadowColor = "#F5B700";
        ctx.shadowBlur = p.size * 2.5;
        ctx.fill();

        // Tiny cosmic star spark on larger particles
        if (p.size > 2.5) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${dynamicAlpha * 0.6})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(-p.size * 1.8, 0);
          ctx.lineTo(p.size * 1.8, 0);
          ctx.moveTo(0, -p.size * 1.8);
          ctx.lineTo(0, p.size * 1.8);
          ctx.stroke();
        }

        ctx.restore();
      }
    }

    if (activeEntities > 0) {
      animFrameId.current = requestAnimationFrame(runAnimationLoop);
    } else {
      ctx.clearRect(0, 0, rect.width, rect.height);
      animFrameId.current = null;
    }
  };

  useImperativeHandle(ref, () => ({
    triggerBurst: (originXPercent = 50, originYPercent = 40) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();

      const originX = (originXPercent / 100) * rect.width;
      const originY = (originYPercent / 100) * rect.height;

      // 1. Shockwaves
      shockwavesRef.current = [
        {
          x: originX,
          y: originY,
          radius: 10,
          maxRadius: Math.max(rect.width, rect.height) * 0.75,
          alpha: 1.0,
          speed: Math.max(8, rect.width * 0.018),
        },
        {
          x: originX,
          y: originY,
          radius: 5,
          maxRadius: Math.max(rect.width, rect.height) * 0.5,
          alpha: 0.8,
          speed: Math.max(5, rect.width * 0.012),
        },
      ];

      // 2. Cosmic Particles (180 - 240 particles based on screen size)
      const count = rect.width < 640 ? 120 : 220;
      const GOLD_COLORS = [
        "rgba(255, 215, 0,",
        "rgba(245, 183, 0,",
        "rgba(255, 240, 180,",
        "rgba(255, 175, 20,",
        "rgba(255, 255, 255,",
      ];

      const newParticles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * (rect.width < 640 ? 7 : 11) + 1.5;
        const color = GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)];

        newParticles.push({
          x: originX + (Math.random() - 0.5) * 30,
          y: originY + (Math.random() - 0.5) * 30,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed * 0.75, // slightly flatter explosion across the wall
          size: Math.random() * 2.8 + 1.2,
          color,
          alpha: Math.random() * 0.4 + 0.6,
          decay: Math.random() * 0.012 + 0.008,
          spin: Math.random() * Math.PI,
          spinSpeed: (Math.random() - 0.5) * 0.1,
          flicker: Math.random() * Math.PI * 2,
        });
      }

      particlesRef.current = newParticles;

      if (!animFrameId.current) {
        animFrameId.current = requestAnimationFrame(runAnimationLoop);
      }
    },

    clearParticles: () => {
      particlesRef.current = [];
      shockwavesRef.current = [];
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
        animFrameId.current = null;
      }
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    },
  }));

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-30"
    />
  );
});

SnapCanvas.displayName = "SnapCanvas";

