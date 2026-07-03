"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { formatPrice, type Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedWatches() {
  const sectionRef = useRef<HTMLElement>(null);
  const { addItem } = useCart();
  const [watches, setWatches] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchWatches() {
      try {
        const res = await fetch("/api/watches");
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Request failed (${res.status})`);
        }
        const data: Product[] = await res.json();
        setWatches(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchWatches();
  }, []);

  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".watch-section-title",
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

      gsap.fromTo(
        ".watch-card",
        { opacity: 0, y: 60, rotateX: 5 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading]);

  return (
    <section
      ref={sectionRef}
      id="watches"
      className="relative bg-cream py-28 px-6"
    >
      <div className="mx-auto max-w-7xl">
        <div className="watch-section-title mb-4 text-center opacity-0">
          <span className="text-xs tracking-[0.3em] uppercase text-gold">
            Masterpiece Collection
          </span>
        </div>
        <h2 className="watch-section-title font-serif text-4xl md:text-5xl text-center text-charcoal mb-4 opacity-0">
          Featured Timepieces
        </h2>
        <p className="watch-section-title mx-auto max-w-xl text-center text-text-body/70 text-base mb-16 opacity-0">
          Discover our most sought-after creations, each a testament to
          horological mastery.
        </p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          </div>
        ) : error ? (
          <p className="text-center text-red-500 py-20">{error}</p>
        ) : watches.length === 0 ? (
          <p className="text-center text-text-body/50 py-20">No watches available.</p>
        ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {watches.map((product) => (
            <div
              key={product.id}
              className="watch-card group relative overflow-hidden rounded-sm bg-white shadow-sm transition-all duration-500 hover:shadow-xl"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <button
                    onClick={() => addItem(product)}
                    className="w-full border border-white/40 bg-white/10 backdrop-blur-md px-4 py-2.5 text-xs tracking-[0.2em] uppercase text-white transition-all duration-300 hover:bg-gold hover:text-charcoal hover:border-gold"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-serif text-base text-charcoal">
                    {product.name}
                  </h3>
                  <span className="text-[10px] tracking-[0.15em] uppercase text-gold">
                    {product.accent}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">
                    {formatPrice(product.price)}
                  </span>
                  <button
                    onClick={() => addItem(product)}
                    className="text-xs tracking-[0.15em] uppercase text-text-body transition-colors duration-300 hover:text-gold"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        <div className="mt-14 text-center">
          <a
            href="#"
            className="group inline-flex items-center gap-3 border-b border-gold/30 pb-1 text-sm tracking-[0.2em] uppercase text-charcoal transition-all duration-300 hover:text-gold hover:border-gold"
          >
            View All Timepieces
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
    </section>
  );
}
