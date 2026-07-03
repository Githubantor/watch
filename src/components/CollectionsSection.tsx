"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { collections } from "@/lib/products";

gsap.registerPlugin(ScrollTrigger);

export default function CollectionsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".collection-card",
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".collections-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="collections"
      className="relative bg-cream py-28 px-6"
    >
      <div className="mx-auto max-w-7xl">
        <div className="collections-title mb-4 text-center opacity-0">
          <span className="text-xs tracking-[0.3em] uppercase text-gold">
            Curated Selection
          </span>
        </div>
        <h2 className="collections-title font-serif text-4xl md:text-5xl text-center text-charcoal mb-4 opacity-0">
          Our Collections
        </h2>
        <p className="collections-title mx-auto max-w-xl text-center text-text-body/70 text-base mb-16 opacity-0">
          Each collection tells a unique story of precision, heritage, and
          uncompromising quality.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {collections.map((collection, index) => (
            <div
              key={collection.id}
              className="collection-card group relative cursor-pointer"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="mb-2 h-px w-12 bg-gold/60" />
                  <span className="text-xs tracking-[0.25em] uppercase text-white/60 mb-2">
                    {collection.subtitle}
                  </span>
                  <h3 className="font-serif text-2xl text-white mb-2">
                    {collection.name}
                  </h3>
                  <p className="text-sm text-white/70 max-w-xs">
                    {collection.description}
                  </p>
                </div>

                <div className="absolute top-8 right-8">
                  <div className="h-16 w-16 rounded-full border border-white/20 flex items-center justify-center">
                    <span className="text-white/60 text-xs tracking-[0.15em]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
