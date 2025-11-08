"use client";

import { useEffect, useRef } from "react";

export default function HowItWorks() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ctx: any = null;
    let mounted = true;
    
    const initAnimations = async (gsap: any) => {
      if (!mounted || !rootRef.current) return;
      
      const el = rootRef.current;
      const badge = el.querySelector("[data-badge]");
      const title = el.querySelector("[data-title]");
      const subtitle = el.querySelector("[data-subtitle]");
      const steps = Array.from(el.querySelectorAll("[data-step]"));
      const connectors = Array.from(el.querySelectorAll("[data-connector]"));

      // Make sure elements are visible initially
      const elements = [badge, title, subtitle, ...steps, ...connectors].filter(Boolean) as HTMLElement[];
      gsap.set(elements, {
        opacity: 1,
        y: 0
      });

      // Initialize GSAP context
      ctx = gsap.context(() => {
          // Animate header
          gsap.from(badge, {
            y: -20,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              onEnter: () => gsap.to(badge, { opacity: 1, y: 0, duration: 0.8 }),
              onLeaveBack: () => gsap.set(badge, { opacity: 1, y: 0 })
            },
          });

          gsap.from(title, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            delay: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              onEnter: () => gsap.to(title, { opacity: 1, y: 0, duration: 0.8 }),
              onLeaveBack: () => gsap.set(title, { opacity: 1, y: 0 })
            },
          });

          gsap.from(subtitle, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            delay: 0.3,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              onEnter: () => gsap.to(subtitle, { opacity: 1, y: 0, duration: 0.8 }),
              onLeaveBack: () => gsap.set(subtitle, { opacity: 1, y: 0 })
            },
          });

        // Animate steps with stagger
        gsap.from(steps, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: steps[0],
            start: "top 85%",
          },
        });

        // Animate connectors
        if (connectors.length > 0) {
          gsap.from(connectors, {
            scaleX: 0,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.2,
            scrollTrigger: {
              trigger: el,
              start: "top 80%"
            }
          });
        }
      }); // Close gsap.context
    }; // Close initAnimations
    // Load GSAP and initialize animations
    (async () => {
      try {
        const gsap = (await import("gsap")).default;
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        gsap.registerPlugin(ScrollTrigger);
        
        if (mounted) {
          await initAnimations(gsap);
        }
      } catch (error) {
        console.error('Error initializing animations:', error);
      }
    })();
    
    // Cleanup function
    return () => {
      mounted = false;
      if (ctx && typeof ctx.revert === 'function') {
        ctx.revert();
      }
    };
  }, []);

  const steps = [
    {
      number: "01",
      title: "Link & Mint",
      desc: "Connect your subscription via OAuth and mint time-bound ERC-1155 tokens representing unused days or hours.",
      icon: "🔗",
      detail: "Encrypted storage • Zero credential exposure",
      color: "from-blue-500 to-cyan-500",
      glowColor: "blue-500",
    },
    {
      number: "02",
      title: "Browse Marketplace",
      desc: "Discover available tokens across categories, compare pricing, and view lender reputation scores in real-time.",
      icon: "🔍",
      detail: "AI-powered matching • Dynamic pricing",
      color: "from-purple-500 to-pink-500",
      glowColor: "purple-500",
    },
    {
      number: "03",
      title: "Rent via Proxy",
      desc: "Purchase tokens and access services through isolated sandbox sessions without ever seeing credentials.",
      icon: "⚡",
      detail: "Headless browser • Auto-expiry",
      color: "from-pink-500 to-rose-500",
      glowColor: "pink-500",
    },
    {
      number: "04",
      title: "Earn & Complete",
      desc: "Lenders receive automatic payouts from smart contract escrow when sessions complete successfully.",
      icon: "💎",
      detail: "On-chain settlement • Instant rewards",
      color: "from-teal-500 to-emerald-500",
      glowColor: "teal-500",
    },
  ];

  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden bg-gradient-to-b from-black via-gray-900/50 to-black">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div ref={rootRef} className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <div
            data-badge
            className="inline-block px-5 py-2 mb-6 text-xs font-semibold tracking-wider uppercase bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-full text-blue-400"
          >
            Simple 4-Step Process
          </div>
          <h2
            data-title
            className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-6"
          >
            How It Works
          </h2>
          <p
            data-subtitle
            className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed"
          >
            From minting tokens to earning rewards — experience seamless tokenized subscription sharing in minutes
          </p>
        </div>

        {/* Desktop Timeline View */}
        <div className="hidden lg:block relative">
          {/* Connection line */}
          <div className="absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20" />
          
          <div className="grid grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                {/* Connector dots */}
                {i < steps.length - 1 && (
                  <div
                    data-connector
                    className="absolute top-24 left-[calc(50%+40px)] right-[-50%] h-0.5 bg-gradient-to-r from-white/30 to-transparent z-0"
                  />
                )}

                <div
                  data-step
                  className="relative group"
                >
                  {/* Step card */}
                  <div className="relative p-6 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl hover:border-white/20 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl overflow-hidden">
                    {/* Gradient glow on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`} />
                    
                    {/* Number badge at top */}
                    <div className="relative flex items-center justify-center mb-6">
                      <div className={`absolute w-20 h-20 bg-gradient-to-br ${step.color} opacity-20 rounded-full blur-xl group-hover:opacity-40 transition-opacity duration-500`} />
                      <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                        {step.icon}
                      </div>
                    </div>

                    {/* Step number */}
                    <div className="text-center mb-3">
                      <span className={`inline-block px-3 py-1 text-xs font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent border border-white/10 rounded-full`}>
                        STEP {step.number}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white text-center mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-blue-200 transition-all duration-300">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-white/60 text-center leading-relaxed mb-4">
                      {step.desc}
                    </p>

                    {/* Detail tag */}
                    <div className={`p-3 bg-gradient-to-r ${step.color} bg-opacity-5 border border-white/5 rounded-xl text-center`}>
                      <p className="text-xs text-white/70 font-medium">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Vertical View */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, i) => (
            <div key={i} className="relative" data-step>
              {/* Vertical connector line */}
              {i < steps.length - 1 && (
                <div className="absolute top-20 left-8 bottom-[-32px] w-0.5 bg-gradient-to-b from-white/20 to-transparent" />
              )}

              <div className="relative group">
                <div className="flex gap-6">
                  {/* Icon circle */}
                  <div className="relative flex-shrink-0">
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-30 rounded-full blur-lg group-hover:opacity-50 transition-opacity duration-500`} />
                    <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-2xl font-bold shadow-lg z-10`}>
                      {step.icon}
                    </div>
                  </div>

                  {/* Content card */}
                  <div className="flex-1 p-6 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`} />
                    
                    <div className="relative">
                      <div className="mb-2">
                        <span className={`inline-block px-2 py-1 text-xs font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent border border-white/10 rounded-full`}>
                          STEP {step.number}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-white/60 leading-relaxed mb-3">
                        {step.desc}
                      </p>
                      <div className={`p-2 bg-gradient-to-r ${step.color} bg-opacity-5 border border-white/5 rounded-lg`}>
                        <p className="text-xs text-white/70 font-medium">
                          {step.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA section */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-full">
            <span className="text-white/70 text-sm">Ready to get started?</span>
            <span className="text-blue-400 font-semibold text-sm">Connect your wallet →</span>
          </div>
        </div>
      </div>
    </section>
  );
}