"use client";

import { useEffect, useRef } from "react";

export default function HowItWorks() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ctx: any;
    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      const el = rootRef.current;
      if (!el) return;
      const steps = el.querySelectorAll("[data-step]");
      ctx = gsap.context(() => {
        gsap.from(steps, {
          opacity: 0,
          x: -40,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          },
        });
      }, el);
    })();
    return () => ctx?.revert?.();
  }, []);

  const steps = [
    {
      title: "Link & Mint",
      desc: "Connect your subscription and mint time-bound access tokens.",
    },
    { title: "Browse", desc: "Discover available tokens across categories and durations." },
    { title: "Rent & Proxy", desc: "Borrow via secure proxy without sharing credentials." },
    { title: "Earn", desc: "Lenders receive escrowed payouts on-chain when sessions complete." },
  ];

  return (
    <section className="py-20 bg-gray-900/50 border-y border-white/10">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl sm:text-4xl font-bold text-white mb-12">How It Works</h2>
        <div ref={rootRef} className="flex flex-col lg:flex-row gap-8">
          {steps.map((s, i) => (
            <div key={i} data-step className="flex-1 card-hover">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 border border-teal-500/50 text-teal-300 flex items-center justify-center font-bold">
                {i + 1}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-white/70 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
