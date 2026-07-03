"use client";

import { useEffect } from "react";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CollectionsSection from "@/components/CollectionsSection";
import FeaturedWatches from "@/components/FeaturedWatches";
import CraftsmanshipSection from "@/components/CraftsmanshipSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import MemberPerks from "@/components/MemberPerks";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ScrollTrigger.config({
      limitCallbacks: true,
      ignoreMobileResize: true,
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={mainRef} className="relative">
      <Header />
      <main>
        <HeroSection />
        <CollectionsSection />
        <FeaturedWatches />
        <CraftsmanshipSection />
        <TestimonialsSection />
        <MemberPerks />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}
