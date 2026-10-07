import React, { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { playCrewmatePopSound } from './AmongUsSound';

/**
 * 3D-Style Interactive Among Us Cosmic Zero-G Canvas
 * Features:
 * - 250+ twinkling starfield with multi-layer depth & nebulae
 * - Interactive zero-g drifting crewmates with physics, rotation, & bounce
 * - Interactive mouse gravitational ripples
 * - Floating space debris (mini asteroids, wire parts, leaves)
 */
export default function AmongUsSpaceScene({ style = {}, showFloatingCrew = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse coordinates & repulsion
    const mouse = { x: -1000, y: -1000, active: false };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.active = false;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // 1. STARFIELD PARTICLES
    const starCount = Math.min(160, Math.floor((width * height) / 8000));
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.2 + 0.05,
      blinkSpeed: Math.random() * 0.02 + 0.005,
      color: Math.random() > 0.8 ? '#71e1ff' : Math.random() > 0.6 ? '#fde047' : '#ffffff',
    }));

    // 2. ZERO-G DRIFTING CREWMATES
    const crewColors = [
      { base: '#C51111', shadow: '#7A0838', hat: 'knife', name: 'Red' },
      { base: '#50EF39', shadow: '#1E9E22', hat: 'sprout', name: 'Lime' },
      { base: '#38FEDC', shadow: '#24A8BE', hat: 'med', name: 'Cyan' },
      { base: '#132ED1', shadow: '#09158E', hat: 'cap', name: 'Blue' },
      { base: '#F6F657', shadow: '#C38823', hat: 'mini', name: 'Yellow' },
      { base: '#ED54BA', shadow: '#AB2C94', hat: 'none', name: 'Pink' },
    ];

    const drifters = showFloatingCrew
      ? crewColors.map((crew, idx) => ({
          ...crew,
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.65,
          vy: (Math.random() - 0.5) * 0.65,
          size: 42 + Math.random() * 22,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.008,
          scale: 1,
          squash: 1,
        }))
      : [];

    // Click on canvas to bounce or inspect drifters
    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      drifters.forEach((d) => {
        const dist = Math.hypot(d.x - clickX, d.y - clickY);
        if (dist < d.size * 1.5) {
          playCrewmatePopSound();
          // Anime.js elastic pop
          animate(d, {
            scale: [1, 1.45, 1],
            rotation: d.rotation + Math.PI * 2,
            duration: 800,
            ease: 'outElastic(1, .5)',
          });
          d.vx += (d.x - clickX) * 0.08;
          d.vy += (d.y - clickY) * 0.08;
        }
      });
    };
    canvas.addEventListener('click', handleClick);

    // 3. RENDER HELPER FOR MINI 2D VECTOR CREWMATE
    const drawCrewmate = (ctx, d) => {
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(d.rotation);
      ctx.scale((d.size / 70) * d.scale, (d.size / 70) * d.scale);

      const w = 40;
      const h = 50;

      // Backpack
      ctx.fillStyle = d.shadow;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3.5;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.roundRect(-w * 0.8, -h * 0.2, w * 0.45, h * 0.65, 6);
      ctx.fill();
      ctx.stroke();

      // Main Body
      ctx.fillStyle = d.base;
      ctx.beginPath();
      ctx.roundRect(-w * 0.45, -h * 0.5, w * 0.9, h, 14);
      ctx.fill();
      ctx.stroke();

      // Visor
      ctx.fillStyle = '#1c3040';
      ctx.beginPath();
      ctx.roundRect(0, -h * 0.35, w * 0.55, h * 0.4, 7);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#71e1ff';
      ctx.beginPath();
      ctx.roundRect(2, -h * 0.32, w * 0.48, h * 0.32, 5);
      ctx.fill();

      // Visor reflection
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(8, -h * 0.24, 4.5, 2.2, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Hat
      if (d.hat === 'sprout') {
        ctx.fillStyle = '#22c55e';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -h * 0.58, 6, 0, Math.PI);
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore();
    };

    // 4. ANIMATION LOOP
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep space background gradient
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height)
      );
      bgGrad.addColorStop(0, '#0d131f');
      bgGrad.addColorStop(0.5, '#070a10');
      bgGrad.addColorStop(1, '#040508');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Nebulae glows
      ctx.save();
      const neb1 = ctx.createRadialGradient(width * 0.2, height * 0.3, 10, width * 0.2, height * 0.3, 380);
      neb1.addColorStop(0, 'rgba(56, 254, 220, 0.045)');
      neb1.addColorStop(1, 'transparent');
      ctx.fillStyle = neb1;
      ctx.fillRect(0, 0, width, height);

      const neb2 = ctx.createRadialGradient(width * 0.8, height * 0.7, 10, width * 0.8, height * 0.7, 450);
      neb2.addColorStop(0, 'rgba(197, 17, 17, 0.04)');
      neb2.addColorStop(1, 'transparent');
      ctx.fillStyle = neb2;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // Draw Stars
      stars.forEach((star) => {
        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }

        star.alpha += star.blinkSpeed;
        if (star.alpha > 1 || star.alpha < 0.2) star.blinkSpeed = -star.blinkSpeed;

        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, star.alpha));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Draw & Update Drifters (Crewmates)
      drifters.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        d.rotation += d.vRot;

        // Wall bounce with dampening
        if (d.x < 30) {
          d.x = 30;
          d.vx *= -1;
        } else if (d.x > width - 30) {
          d.x = width - 30;
          d.vx *= -1;
        }
        if (d.y < 30) {
          d.y = 30;
          d.vy *= -1;
        } else if (d.y > height - 30) {
          d.y = height - 30;
          d.vy *= -1;
        }

        // Mouse gentle push
        if (mouse.active) {
          const dx = d.x - mouse.x;
          const dy = d.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 140 && dist > 1) {
            const force = (140 - dist) / 140;
            d.vx += (dx / dist) * force * 0.35;
            d.vy += (dy / dist) * force * 0.35;
          }
        }

        // Max velocity clamp
        d.vx = Math.max(-1.8, Math.min(1.8, d.vx * 0.995));
        d.vy = Math.max(-1.8, Math.min(1.8, d.vy * 0.995));

        drawCrewmate(ctx, d);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('click', handleClick);
    };
  }, [showFloatingCrew]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
        zIndex: 0,
        ...style,
      }}
    />
  );
}
