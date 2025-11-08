"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

const testimonials = [
  {
    quote: "I was skeptical at first, but the proxy system is genius! I rented 3 days of Adobe Creative Cloud for a client project and saved $47. Zero hassle, instant access.",
    author: "Alex Chen",
    role: "Freelance Designer",
    avatar: "👨‍💼",
    rating: 5,
    savings: "$47",
    color: "from-blue-500 to-cyan-500",
  },
  {
    quote: "As a lender, I've earned back 30% of my annual Canva subscription cost in just 2 months. The smart contracts make payouts automatic and trustless.",
    author: "Priya Sharma",
    role: "Content Creator",
    avatar: "👩‍🎨",
    rating: 5,
    earnings: "$89",
    color: "from-purple-500 to-pink-500",
  },
  {
    quote: "The security is incredible. I can rent subscriptions without worrying about my credentials being exposed. The session expires automatically — pure magic!",
    author: "Jamal Williams",
    role: "Marketing Manager",
    avatar: "👨‍💻",
    rating: 5,
    sessions: "12",
    color: "from-pink-500 to-rose-500",
  },
  {
    quote: "Game changer for students! I only needed Grammarly for finals week. Instead of $30/month, I paid $8 for 5 days. Saved me so much money.",
    author: "Sarah Kim",
    role: "University Student",
    avatar: "👩‍🎓",
    rating: 5,
    savings: "$22",
    color: "from-teal-500 to-emerald-500",
  },
  {
    quote: "The AI matching connected me with borrowers instantly. I listed my unused Notion seats and started earning within hours. Best passive income ever.",
    author: "Marcus Johnson",
    role: "Team Lead",
    avatar: "👨‍💼",
    rating: 5,
    earnings: "$124",
    color: "from-orange-500 to-yellow-500",
  },
  {
    quote: "I love that everything is on-chain. Full transparency, instant settlements, and my reputation score helps me get better deals. This is the future!",
    author: "Elena Rodriguez",
    role: "Web3 Enthusiast",
    avatar: "👩‍💻",
    rating: 5,
    transactions: "28",
    color: "from-indigo-500 to-purple-500",
  },
];

const stats = [
  { label: "Tokens Minted", value: 847293, suffix: "", icon: "🎫" },
  { label: "Active Rentals", value: 12847, suffix: "", icon: "⚡" },
  { label: "Total Saved", value: 2.4, suffix: "M", prefix: "$", icon: "💰" },
  { label: "Avg. Savings", value: 67, suffix: "%", icon: "📈" },
];

export default function Testimonials() {
  const controls = useAnimation();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    controls.start((i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
    }));
  }, [controls]);

  useEffect(() => {
    let ctx: any;
    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      const el = sectionRef.current;
      if (!el) return;

      const badge = el.querySelector("[data-badge]");
      const title = el.querySelector("[data-title]");
      const subtitle = el.querySelector("[data-subtitle]");

      ctx = gsap.context(() => {
        gsap.from(badge, {
          y: -20,
          opacity: 0,
          duration: 0.8,
          scrollTrigger: { trigger: el, start: "top 80%" },
        });

        gsap.from(title, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          delay: 0.2,
          scrollTrigger: { trigger: el, start: "top 80%" },
        });

        gsap.from(subtitle, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          delay: 0.3,
          scrollTrigger: { trigger: el, start: "top 80%" },
        });
      }, el);
    })();
    return () => ctx?.revert?.();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 overflow-hidden bg-gradient-to-b from-black via-gray-900/30 to-black"
    >
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 border border-blue-500/20 rounded-full animate-float" />
        <div className="absolute top-40 right-20 w-16 h-16 border border-purple-500/20 rounded-lg rotate-45 animate-float-delayed" />
        <div className="absolute bottom-40 left-1/3 w-24 h-24 border border-pink-500/20 rounded-full animate-float" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <div
            data-badge
            className="inline-flex items-center gap-2 px-5 py-2 mb-6 text-xs font-semibold tracking-wider uppercase bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-full text-yellow-400"
          >
            <span className="text-lg">⭐</span>
            <span>Trusted by Thousands</span>
          </div>
          <h2
            data-title
            className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-yellow-100 to-orange-200 bg-clip-text text-transparent mb-6"
          >
            Real Stories, Real Savings
          </h2>
          <p data-subtitle className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            Join thousands of users who are saving money and earning passive income through tokenized subscriptions
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              custom={i}
              initial={{ opacity: 0, y: 50 }}
              animate={controls}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              <div className="relative h-full p-8 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl hover:border-white/20 transition-all duration-500 overflow-hidden">
                {/* Gradient glow on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}
                />

                <div className="relative z-10">
                  {/* Quote icon */}
                  <div className="mb-4">
                    <svg
                      className="w-10 h-10 text-white/20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  {/* Quote */}
                  <p className="text-white/90 text-sm leading-relaxed mb-6 min-h-[120px]">
                    {t.quote}
                  </p>

                  {/* Rating stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Author info */}
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-2xl shadow-lg`}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-white">{t.author}</div>
                      <div className="text-xs text-white/60">{t.role}</div>
                    </div>
                  </div>

                  {/* Stat badge */}
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${t.color} bg-opacity-10 border border-white/10 rounded-full`}
                  >
                    {t.savings && (
                      <span className="text-sm font-bold text-white">
                        💰 Saved {t.savings}
                      </span>
                    )}
                    {t.earnings && (
                      <span className="text-sm font-bold text-white">
                        💎 Earned {t.earnings}
                      </span>
                    )}
                    {t.sessions && (
                      <span className="text-sm font-bold text-white">
                        ⚡ {t.sessions} Sessions
                      </span>
                    )}
                    {t.transactions && (
                      <span className="text-sm font-bold text-white">
                        🔗 {t.transactions} Deals
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-20 opacity-60">
          <div className="text-white/60 text-sm font-medium">TRUSTED BY</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔒</span>
            <span className="text-white/60 text-sm">Audited by OpenZeppelin</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="text-white/60 text-sm">Built on Polygon</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <span className="text-white/60 text-sm">SOC 2 Compliant</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Stat key={i} {...stat} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-3xl backdrop-blur-xl">
            <div className="text-2xl">🚀</div>
            <h3 className="text-2xl font-bold text-white">
              Ready to Save or Earn?
            </h3>
            <p className="text-white/60 text-sm max-w-md">
              Join our community and start experiencing the future of subscription sharing
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300">
              Get Started Now →
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) rotate(45deg);
          }
          50% {
            transform: translateY(-25px) rotate(45deg);
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1.5s;
        }
      `}</style>
    </section>
  );
}

function Stat({
  label,
  value,
  suffix = "",
  prefix = "",
  icon,
  index,
}: {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="group relative p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl hover:border-white/20 transition-all duration-300 overflow-hidden"
    >
      {/* Gradient glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500" />

      <div className="relative z-10">
        {/* Icon */}
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>

        {/* Value */}
        <div className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
          {prefix}
          {value >= 1000000
            ? `${(value / 1000000).toFixed(1)}M`
            : value.toLocaleString()}
          {suffix}
        </div>

        {/* Label */}
        <div className="text-white/60 text-sm font-medium">{label}</div>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}