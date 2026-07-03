"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMember, getNextTier } from "@/context/MemberContext";
import MembershipSignup from "./MembershipSignup";

gsap.registerPlugin(ScrollTrigger);

const tiers = [
  {
    id: "classic" as const,
    name: "Classic",
    price: "Free",
    color: "border-gold/40",
    bg: "bg-white",
    textColor: "text-charcoal",
    perks: [
      "500 welcome bonus points",
      "Early access to new collections",
      "Birthday reward annually",
      "Member-only newsletters",
      "Priority customer support",
    ],
  },
  {
    id: "silver" as const,
    name: "Silver",
    price: "Free",
    color: "border-gold",
    bg: "bg-cream-dark",
    textColor: "text-charcoal",
    featured: true,
    perks: [
      "All Classic benefits",
      "Complimentary shipping on all orders",
      "Free engraving service",
      "Extended 5-year warranty",
      "Invitations to virtual events",
    ],
  },
  {
    id: "gold" as const,
    name: "Gold",
    price: "Free",
    color: "border-gold",
    bg: "bg-charcoal",
    textColor: "text-white",
    perks: [
      "All Silver benefits",
      "Personal concierge service",
      "Exclusive VIP event access",
      "Priority reservation on limited editions",
      "Complimentary annual maintenance",
    ],
  },
];

export default function MemberPerks() {
  const sectionRef = useRef<HTMLElement>(null);
  const { member } = useMember();
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".perk-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none reverse" },
        }
      );
      gsap.fromTo(
        ".perk-card",
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.2, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%", toggleActions: "play none none reverse" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <section ref={sectionRef} id="membership" className="relative bg-cream py-28 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="perk-title mb-4 text-center opacity-0">
            <span className="text-xs tracking-[0.3em] uppercase text-gold">Loyalty Program</span>
          </div>
          <h2 className="perk-title font-serif text-4xl md:text-5xl text-center text-charcoal mb-4 opacity-0">
            Horologe Membership
          </h2>
          <p className="perk-title mx-auto max-w-xl text-center text-text-body/70 text-base mb-16 opacity-0">
            Join free and unlock a world of exclusive benefits. The more you engage,
            the more you earn.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`perk-card relative flex flex-col rounded-sm border ${
                  tier.featured ? "border-gold ring-1 ring-gold/20" : tier.color
                } ${tier.bg} transition-all duration-500 hover:shadow-lg`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold px-4 py-1">
                    <span className="text-[9px] tracking-[0.2em] uppercase text-charcoal font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <h3 className={`font-serif text-xl mb-1 ${tier.textColor}`}>
                    {tier.name}
                  </h3>
                  <p className={`text-sm mb-5 ${tier.textColor === "text-white" ? "text-white/60" : "text-text-muted"}`}>
                    {tier.price}
                  </p>
                  <ul className="space-y-3">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2.5">
                        <svg
                          className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
                            tier.textColor === "text-white" ? "text-gold" : "text-gold"
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span className={`text-sm ${tier.textColor === "text-white" ? "text-white/80" : "text-text-body"}`}>
                          {perk}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto px-8 pb-8">
                  {member ? (
                    <div className={`text-center text-xs ${tier.textColor === "text-white" ? "text-white/50" : "text-text-muted"}`}>
                      {member.tier === tier.id
                        ? "✓ Your current tier"
                        : getNextTier(member.tier)?.tier === tier.id
                          ? `Unlock with ${getNextTier(member.tier)!.needed}`
                          : ""}
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowSignup(true)}
                      className={`w-full border px-5 py-3 text-xs tracking-[0.2em] uppercase transition-all duration-500 ${
                        tier.featured
                          ? "border-gold bg-gold text-charcoal hover:bg-transparent hover:text-gold"
                          : tier.textColor === "text-white"
                            ? "border-white/30 text-white hover:bg-white hover:text-charcoal"
                            : "border-charcoal/20 text-charcoal hover:border-gold hover:text-gold"
                      }`}
                    >
                      Join Free
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showSignup && <MembershipSignup onClose={() => setShowSignup(false)} />}
    </>
  );
}
