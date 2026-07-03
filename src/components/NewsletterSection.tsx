"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function NewsletterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".newsletter-content",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
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
      className="relative bg-charcoal py-28 px-6 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.05)_0%,transparent_70%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="newsletter-content relative mx-auto max-w-2xl text-center opacity-0">
        <div className="mb-6 flex justify-center gap-3">
          <div className="h-px w-12 bg-gold/40 self-center" />
          <span className="text-xs tracking-[0.3em] uppercase text-gold">
            Stay Connected
          </span>
          <div className="h-px w-12 bg-gold/40 self-center" />
        </div>

        <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
          Join the Legacy
        </h2>
        <p className="text-white/50 text-sm mb-10 max-w-md mx-auto leading-relaxed">
          Be the first to discover new collections, exclusive events, and
          behind-the-scenes stories from our atelier.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto flex max-w-md flex-col items-center gap-4 sm:flex-row"
        >
          <div className="relative flex-1 w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full border border-white/20 bg-transparent px-5 py-3.5 text-sm text-white placeholder-white/30 outline-none transition-colors duration-300 focus:border-gold"
              required
            />
          </div>
          <button
            type="submit"
            className="whitespace-nowrap border border-gold bg-gold px-7 py-3.5 text-xs tracking-[0.2em] uppercase text-charcoal transition-all duration-500 hover:bg-transparent hover:text-gold"
          >
            Subscribe
          </button>
        </form>

        <p className="mt-6 text-xs text-white/30">
          By subscribing, you agree to our Privacy Policy.
        </p>
      </div>
    </section>
  );
}
