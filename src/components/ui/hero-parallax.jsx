"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "motion/react";

export const HeroParallax = ({ products }) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);

  const ref = useRef(null);

  // Detect mobile screen
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen();

    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = {
    stiffness: 300,
    damping: 30,
    bounce: 100,
  };

  // Horizontal movement
  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );

  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );

  // Rotation
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );

  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );

  // Opacity
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );

  // Different translateY for mobile & desktop
  const translateYValues = isMobile
    ? [-600, 0] // Mobile
    : [-900, 250]; // Desktop

  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], translateYValues),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="
        h-[220vh] md:h-[300vh]
        pb-20
        overflow-hidden
        antialiased
        relative
        flex
        flex-col
        bg-[#070a13]
        [perspective:1000px]
        [transform-style:preserve-3d]
      "
    >
      {/* Background Starfield Grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(56, 254, 220, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 254, 220, 0.3) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <Header />

      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className="flex flex-col gap-6 md:gap-16 mt-10 md:mt-0 relative z-10"
      >
        {/* First Row */}
        <motion.div className="flex flex-row-reverse gap-4 md:gap-10 mb-4 md:mb-10">
          {firstRow.map((product, idx) => (
            <ProductCard
              key={product.title + idx}
              product={product}
              translate={translateX}
              index={idx + 1}
            />
          ))}
        </motion.div>

        {/* Second Row */}
        <motion.div className="flex flex-row gap-4 md:gap-10 mb-4 md:mb-10">
          {secondRow.map((product, idx) => (
            <ProductCard
              key={product.title + idx}
              product={product}
              translate={translateXReverse}
              index={idx + 6}
            />
          ))}
        </motion.div>

        {/* Third Row */}
        <motion.div className="flex flex-row-reverse gap-4 md:gap-10">
          {thirdRow.map((product, idx) => (
            <ProductCard
              key={product.title + idx}
              product={product}
              translate={translateX}
              index={idx + 11}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto px-4 md:px-16 w-full min-h-[100vh] flex flex-col justify-center items-center text-center z-10">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-400/30 mb-6 backdrop-blur-md">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e] animate-pulse" />
        <span className="text-xs font-mono font-bold tracking-[0.25em] text-cyan-300 uppercase">
          SKELD SURVEILLANCE // REC ● LIVE FEED
        </span>
      </div>

      <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white leading-none tracking-tight">
        HAXLR8 3.0 <br/>
        <span style={{ WebkitTextStroke: '2px #38fedc', color: 'transparent', textShadow: '0 0 35px rgba(56, 254, 220, 0.4)' }}>
          RECON LOGS
        </span>
      </h1>

      <p className="max-w-2xl text-sm sm:text-base md:text-lg mt-6 text-slate-400 leading-relaxed font-medium">
        Declassified visual telemetry from national hackathon editions. Relive the high-voltage coding marathons, zero-G prototyping, and student innovations.
      </p>
    </div>
  );
};

export const ProductCard = ({ product, translate, index = 1 }) => {
  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -16, scale: 1.02 }}
      className="
        group/product
        relative
        shrink-0
        rounded-2xl
        overflow-hidden
        border
        border-cyan-500/25
        bg-slate-900/80
        shadow-[0_0_25px_rgba(0,0,0,0.6)]
        hover:border-cyan-400
        hover:shadow-[0_0_35px_rgba(56,254,220,0.3)]
        transition-all duration-300
        h-44 w-[17rem]
        sm:h-56 sm:w-[23rem]
        md:h-96 md:w-[32rem]
      "
    >
      {/* Camera feed overlay bar */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-md border border-cyan-500/30">
        <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38fedc]" />
        <span className="text-[10px] font-mono font-bold text-cyan-300 tracking-wider">
          CAM-0{index} // {product.title.toUpperCase()}
        </span>
      </div>

      {/* Crosshair accents */}
      <div className="absolute bottom-3 right-3 z-20 font-mono text-[10px] text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-white/10">
        24:00:00 [RUNNING]
      </div>

      {product.link ? (
        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full w-full"
        >
          <img
            src={product.thumbnail}
            alt={product.title}
            className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover/product:scale-105"
          />
        </a>
      ) : (
        <div className="block h-full w-full">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover/product:scale-105"
          />
        </div>
      )}

      {/* Subtle CRT Scanline Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25 group-hover/product:opacity-40 transition-opacity"
        style={{
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%), linear-gradient(90deg, rgba(56, 254, 220, 0.03), rgba(0, 0, 0, 0.05))',
          backgroundSize: '100% 4px, 6px 100%',
        }}
      />
    </motion.div>
  );
};