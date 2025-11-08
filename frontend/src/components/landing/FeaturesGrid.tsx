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
      
      const badge = el.querySelector("[data-badge]");
      const title = el.querySelector("[data-title]");
      const subtitle = el.querySelector("[data-subtitle]");
      const cards = el.querySelectorAll("[data-card]");
      const showcase = el.querySelector("[data-showcase]");

      ctx = gsap.context(() => {
        // Animate header elements
        gsap.from(badge, {
          y: -20,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
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
            start: "top 85%",
          },
        });

        gsap.from(subtitle, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          delay: 0.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        });

        // Animate feature cards
        gsap.from(cards, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: cards[0],
            start: "top 85%",
          },
        });

        // Animate showcase section
        if (showcase) {
          gsap.from(showcase, {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: showcase,
              start: "top 85%",
            },
          });
        }
      }, el);
    })();
    return () => ctx?.revert?.();
  }, []);

  const features = [
    {
      icon: "/lock.svg",
      title: "Zero-Credential Sharing",
      desc: "Revolutionary proxy-based session technology ensures borrowers never access your credentials. Each session runs in an isolated sandbox with automated expiry.",
      highlight: "Security First: Military-grade encryption with KMS/HSM storage",
    },
    {
      icon: "/dollar.svg",
      title: "Smart Contract Escrow",
      desc: "Trustless transactions powered by ERC-1155 tokens. Funds are automatically released upon successful session completion with full blockchain auditability.",
      highlight: "100% Transparent: Every transaction verifiable on-chain",
    },
    {
      icon: "/proxy.svg",
      title: "AI-Powered Optimization",
      desc: "Machine learning algorithms dynamically adjust pricing, predict demand patterns, and match lenders with borrowers for optimal marketplace efficiency.",
      highlight: "Smart Matching: Real-time fraud detection & risk scoring",
    },
    {
      icon: "/ai.svg",
      title: "Browser Extension Interface",
      desc: "Seamless integration with Manifest V3. Access the marketplace, manage sessions, and monitor earnings directly from your browser with wallet connectivity.",
      highlight: "One-Click Access: MetaMask & WalletConnect supported",
    },
    {
      icon: "/lock.svg",
      title: "Reputation System",
      desc: "On-chain reputation scoring tracks completion rates and dispute history. Build trust through transparent performance metrics visible to all users.",
      highlight: "Community Driven: Earn rewards for reliable lending",
    },
    {
      icon: "/dollar.svg",
      title: "Fractional Token Marketplace",
      desc: "Mint time-unit tokens representing hours or days of access. List, trade, and monetize unused subscription time in a decentralized secondary market.",
      highlight: "Maximum Flexibility: Trade tokens anytime, anywhere",
    },
  ];

  const showcaseMetrics = [
    { label: "Active Sessions", value: "2,847", sublabel: "Live concurrent sessions", badge: "+32% this week", color: "green" },
    { label: "Total Value Locked", value: "$847K", sublabel: "In smart contracts", badge: "Secured", color: "blue" },
    { label: "Avg Session Time", value: "3.2 days", sublabel: "Per rental", badge: "Optimal", color: "purple" },
  ];

  return (
    <section id="features" className="relative py-32 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div ref={containerRef} className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <div
            data-badge
            className="inline-block px-5 py-2 mb-6 text-xs font-semibold tracking-wider uppercase bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400"
          >
            Revolutionary Platform
          </div>
          <h2
            data-title
            className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-6"
          >
            Tokenized Access, Unlimited Possibilities
          </h2>
          <p
            data-subtitle
            className="text-lg text-white/60 max-w-3xl mx-auto leading-relaxed"
          >
            Experience the future of digital subscriptions with blockchain-powered security, AI-driven optimization, and seamless proxy-based access
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((f, i) => (
            <div
              key={i}
              data-card
              className="group relative p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:border-blue-500/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 overflow-hidden"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:via-blue-500/5 group-hover:to-purple-500/10 transition-all duration-500 rounded-3xl" />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-blue-500/20 to-purple-500/10 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  <Image
                    src={f.icon}
                    alt={f.title}
                    width={32}
                    height={32}
                    className="brightness-0 invert"
                  />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {f.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-white/60 leading-relaxed mb-4">
                  {f.desc}
                </p>

                {/* Highlight */}
                <div className="px-4 py-3 bg-blue-500/10 border-l-2 border-blue-500 rounded-lg">
                  <p className="text-xs text-blue-300 font-medium">
                    {f.highlight}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise Showcase */}
        <div
          data-showcase
          className="relative p-12 lg:p-16 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-blue-500/5 backdrop-blur-xl border border-blue-500/20 rounded-3xl overflow-hidden"
        >
          {/* Floating glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              <h3 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-6">
                Enterprise-Grade Architecture
              </h3>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                Built on Polygon with Supabase backend, containerized Playwright proxies, and IPFS metadata storage. Scalable microservices architecture handles thousands of concurrent sessions.
              </p>
              <ul className="space-y-4">
                {[
                  "Manifest V3 browser extension with React",
                  "Solidity smart contracts audited by OpenZeppelin",
                  "Docker-orchestrated proxy sandboxes",
                  "Real-time WebSocket session streaming",
                  "Automated CI/CD with GitHub Actions",
                  "Prometheus monitoring & Grafana dashboards",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-blue-500/20 rounded-full text-blue-400 text-sm font-bold mt-0.5">
                      ✓
                    </span>
                    <span className="text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right metrics */}
            <div className="relative h-[400px]">
              {showcaseMetrics.map((metric, i) => {
                const positions = [
                  "top-0 left-0",
                  "top-32 right-0",
                  "bottom-0 left-10",
                ];
                const delays = ["delay-0", "delay-300", "delay-700"];
                const badgeColors = {
                  green: "bg-green-500/20 text-green-400",
                  blue: "bg-blue-500/20 text-blue-400",
                  purple: "bg-purple-500/20 text-purple-400",
                };

                return (
                  <div
                    key={i}
                    className={`absolute ${positions[i]} w-64 p-6 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-float ${delays[i]}`}
                  >
                    <div className="text-xs text-white/50 uppercase tracking-wider mb-3">
                      {metric.label}
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                      {metric.value}
                    </div>
                    <div className="text-sm text-white/60 mb-3">
                      {metric.sublabel}
                    </div>
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        badgeColors[metric.color as keyof typeof badgeColors]
                      }`}
                    >
                      {metric.badge}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .delay-300 {
          animation-delay: 1s;
        }
        .delay-700 {
          animation-delay: 2s;
        }
        .delay-1000 {
          animation-delay: 1.5s;
        }
      `}</style>
    </section>
  );
}