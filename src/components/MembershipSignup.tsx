"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useMember } from "@/context/MemberContext";

interface MembershipSignupProps {
  onClose: () => void;
}

const perks = [
  { label: "Welcome Bonus", desc: "500 bonus points on signup" },
  { label: "Early Access", desc: "Preview new collections first" },
  { label: "Birthday Reward", desc: "Exclusive birthday bonus" },
  { label: "Free Shipping", desc: "On all orders (Silver+)" },
];

export default function MembershipSignup({ onClose }: MembershipSignupProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { signup } = useMember();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (overlayRef.current && modalRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, y: 40, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }
      );
    }
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleClose = () => {
    if (modalRef.current && overlayRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0, y: 20, scale: 0.97, duration: 0.3, ease: "power2.in",
      });
      gsap.to(overlayRef.current, {
        opacity: 0, duration: 0.3, onComplete: onClose,
      });
    } else onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup(name, email);
    setDone(true);
  };

  if (done) {
    return (
      <div ref={overlayRef} className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div ref={modalRef} className="relative w-full max-w-md bg-cream shadow-2xl px-8 py-16 text-center">
          <div className="mb-5 flex justify-center">
            <div className="h-px w-12 bg-gold" />
          </div>
          <h2 className="font-serif text-2xl text-charcoal mb-2">Welcome to Horologe</h2>
          <p className="text-text-body/70 text-sm mb-2">
            You&apos;re now a <span className="text-gold font-medium">Classic</span> member
          </p>
          <p className="text-text-muted text-xs mb-1">500 bonus points credited</p>
          <p className="text-text-muted text-xs mb-8">Start earning toward Silver status</p>
          <button
            onClick={handleClose}
            className="border border-gold bg-gold px-8 py-3 text-xs tracking-[0.2em] uppercase text-charcoal transition-all duration-500 hover:bg-transparent hover:text-gold"
          >
            Start Exploring
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div ref={modalRef} className="relative w-full max-w-lg bg-cream shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-8 py-5">
          <h2 className="font-serif text-xl text-charcoal">Join Free</h2>
          <button
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-gold hover:text-gold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-8 py-6">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {perks.map((p) => (
              <div key={p.label} className="rounded-sm border border-border bg-white p-3 text-left">
                <div className="h-px w-6 bg-gold/60 mb-2" />
                <p className="text-xs font-medium text-charcoal">{p.label}</p>
                <p className="text-[10px] text-text-muted">{p.desc}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-border bg-white px-4 py-3 text-sm text-charcoal outline-none transition-colors placeholder:text-text-muted/50 focus:border-gold"
            />
            <input
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border bg-white px-4 py-3 text-sm text-charcoal outline-none transition-colors placeholder:text-text-muted/50 focus:border-gold"
            />
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
                className="mt-0.5 accent-gold"
              />
              <span className="text-xs text-text-muted leading-relaxed">
                I agree to receive updates about new collections, exclusive events, and
                member benefits. View our{" "}
                <a href="#" className="text-gold underline">Privacy Policy</a>.
              </span>
            </label>
            <button
              type="submit"
              disabled={!name || !email || !agreed}
              className="w-full bg-charcoal px-6 py-3.5 text-xs tracking-[0.2em] uppercase text-cream transition-all duration-500 hover:bg-gold hover:text-charcoal disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Become a Member — Free
            </button>
          </form>
          <p className="text-[10px] text-text-muted/60 text-center mt-4">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
