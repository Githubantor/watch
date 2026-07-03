"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 101, suffix: "", label: "Years of Heritage" },
  { value: 250, suffix: "+", label: "Master Artisans" },
  { value: 48, suffix: "", label: "Global Boutiques" },
  { value: 15, suffix: "", label: "Patents Held" },
];

export default function CraftsmanshipSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".craft-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".craft-text",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".craft-image",
        { opacity: 0, x: -60, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      statsRef.current.forEach((el, i) => {
        if (!el) return;

        const valueEl = el.querySelector(".stat-value");
        if (!valueEl) return;

        const target = stats[i].value;

        gsap.fromTo(
          valueEl,
          { textContent: 0 },
          {
            textContent: target,
            duration: 2.5,
            ease: "power2.out",
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );

        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="craftsmanship"
      className="relative bg-cream-dark py-28 px-6"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="craft-image relative aspect-[4/5] overflow-hidden rounded-sm">
            <Image
              src="/images/watch-heritage.jpg"
              alt="Craftsmanship"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8">
              <div className="h-px w-16 bg-gold/40 mb-4" />
              <span className="text-xs tracking-[0.25em] uppercase text-white/60">
                Artisan Crafted
              </span>
            </div>
          </div>

          <div className="craft-text">
            <span className="text-xs tracking-[0.3em] uppercase text-gold">
              Our Heritage
            </span>
            <h2 className="craft-title font-serif text-4xl md:text-5xl text-charcoal mt-4 mb-6">
              A Century of
              <br />
              Masterful Craftsmanship
            </h2>
            <p className="text-text-body/80 leading-relaxed mb-8">
              Since 1924, our atelier has been dedicated to the art of fine
              watchmaking.每一只 Horologe 时计都承载着超过百年的制表传统与技术积淀.
              From the careful selection of materials to the final
              hand-finishing of each movement, every timepiece undergoes
              rigorous scrutiny by our master watchmakers.
            </p>
            <p className="text-text-body/70 leading-relaxed mb-10">
              Our commitment to excellence has earned us the trust of
              discerning collectors worldwide, with each creation representing
              the pinnacle of Swiss horological tradition blended with
              contemporary innovation.
            </p>
            <a
              href="#"
              className="group inline-flex items-center gap-3 border border-gold px-7 py-3 text-sm tracking-[0.2em] uppercase text-gold transition-all duration-500 hover:bg-gold hover:text-charcoal"
            >
              Discover Our Process
              <svg
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              ref={(el) => { statsRef.current[i] = el; }}
              className="text-center opacity-0"
            >
              <div className="stat-value font-serif text-4xl md:text-5xl text-gold mb-2">
                0
              </div>
              <div className="text-sm text-text-body/60 tracking-[0.1em] uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
