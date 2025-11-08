"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function FeaturesGrid() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ctx: any;
    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      const el = containerRef.current;
      if (!el) return;
      const cards = el.querySelectorAll("[data-card]");
      ctx = gsap.context(() => {
        gsap.from(cards, {
          x: -100,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          },
        });
      }, el);
    })();
    return () => ctx?.revert?.();
  }, []);

  const items = [
    {
      icon: "/lock.svg",
      title: "Secure Proxies",
      desc: "Share access via revocable proxies. Your credentials never leave your vault.",
    },
    {
      icon: "/dollar.svg",
      title: "Monetize Time",
      desc: "Lenders mint time-bound tokens; borrowers rent only what they need.",
    },
    {
      icon: "/proxy.svg",
      title: "Blockchain Trust",
      desc: "Escrow and settlement on-chain with transparent rules.",
    },
    {
      icon: "/ai.svg",
      title: "AI Matching",
      desc: "Smart matching connects demand and supply across categories.",
    },
  ];

  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-3xl sm:text-4xl font-bold text-white mb-12">Why Tokenize?</h2>
        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((f, i) => (
            <div key={i} data-card className="card-hover">
              <div className="flex items-center gap-4">
                <Image src={f.icon} alt="" width={40} height={40} className="shrink-0" />
                <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              </div>
              <p className="mt-3 text-white/70 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
