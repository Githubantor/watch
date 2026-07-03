"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "Jonathan Pierce",
    title: "Collector, Geneva",
    quote:
      "An extraordinary experience from start to finish. The attention to detail in every timepiece is unmatched. My Heritage Chronograph is a true work of art.",
    rating: 5,
  },
  {
    name: "Victoria Chen",
    title: "CEO, Horizon Group",
    quote:
      "I have owned many luxury watches, but none compare to the craftsmanship of Horologe. The Diamond collection is simply breathtaking.",
    rating: 5,
  },
  {
    name: "Marcus Webb",
    title: "Watch Enthusiast, London",
    quote:
      "The tourbillon is a masterpiece of engineering. The level of skill and precision required to create such a piece is truly humbling.",
    rating: 5,
  },
  {
    name: "Sophie Laurent",
    title: "Fashion Director, Paris",
    quote:
      "Elegance personified. Every Horologe timepiece makes a statement without trying. It is understated luxury at its finest.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonial-title",
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
        ".testimonial-card",
        { opacity: 0, y: 60, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
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
      id="testimonials"
      className="relative bg-cream py-28 px-6"
    >
      <div className="mx-auto max-w-7xl">
        <div className="testimonial-title mb-4 text-center opacity-0">
          <span className="text-xs tracking-[0.3em] uppercase text-gold">
            Client Voices
          </span>
        </div>
        <h2 className="testimonial-title font-serif text-4xl md:text-5xl text-center text-charcoal mb-4 opacity-0">
          What Our Clients Say
        </h2>
        <p className="testimonial-title mx-auto max-w-xl text-center text-text-body/70 text-base mb-16 opacity-0">
          The trust of our discerning clientele is our greatest achievement.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="testimonial-card group relative rounded-sm bg-white p-8 shadow-sm transition-all duration-500 hover:shadow-lg"
            >
              <div className="absolute top-0 left-0 h-1 w-0 bg-gold transition-all duration-500 group-hover:w-full" />

              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <svg
                    key={i}
                    className="h-4 w-4 text-gold"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <blockquote className="font-serif text-lg text-text-body leading-relaxed mb-6 italic">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-cream-dark flex items-center justify-center">
                  <span className="text-xs font-serif text-charcoal font-medium">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-charcoal">
                    {t.name}
                  </div>
                  <div className="text-xs text-text-muted">{t.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
