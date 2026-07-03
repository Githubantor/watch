"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCart } from "@/context/CartContext";
import { useMember, getTierName } from "@/context/MemberContext";
import CartDrawer from "./CartDrawer";
import MembershipSignup from "./MembershipSignup";

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { label: "Collections", href: "#collections" },
  { label: "Watches", href: "#watches" },
  { label: "Craftsmanship", href: "#craftsmanship" },
  { label: "Membership", href: "#membership" },
];

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showMemberMenu, setShowMemberMenu] = useState(false);
  const { totalItems } = useCart();
  const { member, logout } = useMember();
  const badgeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    gsap.fromTo(
      header,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.3 }
    );

    const links = header.querySelectorAll(".nav-link");
    gsap.fromTo(
      links,
      { y: -20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.6,
      }
    );

    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setShowMemberMenu(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (badgeRef.current && totalItems > 0) {
      gsap.fromTo(
        badgeRef.current,
        { scale: 1.4 },
        { scale: 1, duration: 0.3, ease: "back.out(2)" }
      );
    }
  }, [totalItems]);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-cream/95 backdrop-blur-md shadow-[0_1px_0_rgba(201,169,110,0.15)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-5">
          <a href="#" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full border-2 border-gold flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-gold" />
            </div>
            <span
              className={`font-serif text-xl tracking-[0.25em] uppercase transition-colors duration-500 ${
                scrolled ? "text-charcoal" : "text-white"
              }`}
            >
              Horologe
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`nav-link text-sm tracking-[0.15em] uppercase transition-colors duration-300 hover:text-gold ${
                  scrolled ? "text-charcoal-light" : "text-white/80"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {member ? (
              <div className="relative">
                <button
                  onClick={() => setShowMemberMenu(!showMemberMenu)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs tracking-[0.1em] uppercase transition-all duration-300 ${
                    scrolled
                      ? "border-gold/40 text-charcoal hover:border-gold"
                      : "border-white/30 text-white/80 hover:border-gold"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-gold" />
                  {member.name.split(" ")[0]}
                </button>
                {showMemberMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-sm bg-white shadow-xl border border-border">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-medium text-charcoal">{member.name}</p>
                      <p className="text-xs text-text-muted">{member.email}</p>
                    </div>
                    <div className="px-4 py-3 border-b border-border">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-text-muted">Tier</span>
                        <span className="text-gold font-medium">{getTierName(member.tier)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-text-muted">Points</span>
                        <span className="text-charcoal font-medium">{member.points}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-muted">Purchases</span>
                        <span className="text-charcoal font-medium">{member.purchases}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => { logout(); setShowMemberMenu(false); }}
                      className="w-full px-4 py-2.5 text-xs text-left text-text-muted transition-colors hover:text-red-500 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowSignup(true)}
                className={`text-xs tracking-[0.15em] uppercase transition-all duration-300 hover:text-gold ${
                  scrolled ? "text-charcoal-light" : "text-white/80"
                }`}
              >
                Join Free
              </button>
            )}

            <button
              onClick={() => setCartOpen(true)}
              aria-label="Cart"
              className={`relative transition-colors duration-300 hover:text-gold ${
                scrolled ? "text-charcoal-light" : "text-white/80"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {totalItems > 0 && (
                <span
                  ref={badgeRef}
                  className="absolute -top-2 -right-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gold text-[9px] font-medium text-charcoal"
                >
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      {showSignup && <MembershipSignup onClose={() => setShowSignup(false)} />}
    </>
  );
}
