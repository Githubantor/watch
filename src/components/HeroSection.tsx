"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        ".hero-line",
        { width: "0%" },
        { width: "100%", duration: 1.2, delay: 0.4, stagger: 0.3 }
      )
        .to(
          ".char",
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1.2,
            stagger: 0.04,
            ease: "power3.out",
          },
          "-=0.8"
        )
        .to(
          subtitleRef.current,
          { opacity: 1, y: 0, duration: 1 },
          "-=0.4"
        )
        .to(
          ctaRef.current,
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.4"
        )
        .to(
          indicatorRef.current,
          { opacity: 1, duration: 0.6 },
          "-=0.2"
        );

      gsap.to(".hero-image", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".hero-overlay", {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom center",
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const title = "Timeless Elegance";
  const chars = title.split("");

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative h-screen w-full overflow-hidden"
    >
      <div className="hero-image absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal-light to-charcoal">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.08)_0%,transparent_70%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-gold/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-gold/5" />
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <Image
            src="/images/watch-heritage.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="hero-overlay absolute inset-0 bg-gradient-to-t from-cream/20 via-transparent to-charcoal/60" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="hero-line h-px w-0 bg-gold" />
          <span className="text-xs tracking-[0.3em] uppercase text-gold">
            Since 1924
          </span>
          <div className="hero-line h-px w-0 bg-gold" />
        </div>

        <h1
          ref={headingRef}
          className="font-serif text-6xl md:text-8xl lg:text-9xl font-light text-white tracking-[0.05em] mb-6"
        >
          {chars.map((char, i) => (
            <span
              key={i}
              className="char inline-block"
              style={{ display: char === " " ? "inline" : "inline-block" }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>

        <p
          ref={subtitleRef}
          className="max-w-lg text-lg text-white/60 font-light tracking-[0.15em] uppercase translate-y-8 opacity-0"
        >
          Where Craftsmanship Meets Perfection
        </p>

        <div
          ref={ctaRef}
          className="mt-12 flex items-center gap-6 translate-y-8 opacity-0"
        >
          <a
            href="#collections"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-gold px-8 py-3.5 text-sm tracking-[0.2em] uppercase text-gold transition-all duration-500 hover:bg-gold hover:text-charcoal"
          >
            <span className="relative z-10">Explore Collection</span>
            <svg
              className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <div className="absolute inset-0 -translate-x-full transition-transform duration-500 group-hover:translate-x-0" />
          </a>
          <a
            href="#craftsmanship"
            className="text-sm tracking-[0.2em] uppercase text-white/60 transition-colors duration-300 hover:text-white"
          >
            Our Story
          </a>
        </div>
      </div>

      <div
        ref={indicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0"
      >
        <span className="text-[10px] tracking-[0.25em] uppercase text-white/40">
          Scroll
        </span>
        <div className="h-10 w-px bg-gradient-to-b from-gold/60 to-transparent" />
      </div>
    </section>
  );
}
