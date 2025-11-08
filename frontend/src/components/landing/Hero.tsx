"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, Shield, Zap, ArrowRight, Lock, TrendingUp } from "lucide-react";

export default function Hero() {
  const variants = useMemo(() => ({
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  }), []);

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.1,
        duration: 0.6,
        ease: [0.25, 0.4, 0.25, 1]
      }
    })
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <video 
          className="absolute inset-0 w-full h-full object-cover opacity-10" 
          autoPlay 
          muted 
          loop 
          playsInline 
          src="/hero-bg.mp4" 
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.15),transparent_50%)]" />
      </div>

      {/* Floating Orbs */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-20 left-[10%] w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "1s" }}
        className="absolute bottom-20 right-[10%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
      />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:py-32">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variants}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            variants={variants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-8"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-white/90">The Future of Subscription Sharing</span>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            variants={variants}
            className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight mb-6"
          >
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white">
              Tokenized
            </span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mt-2">
              Subscriptions
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={variants}
            className="mt-8 text-xl sm:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Monetize your subscriptions with blockchain technology. 
            <span className="text-white font-medium"> Secure, decentralized</span>, and profitable.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={variants}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a 
              href="/install" 
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-semibold text-white text-lg shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#features" 
              className="group px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl font-semibold text-white text-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
            >
              <span>Watch Demo</span>
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            </a>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            variants={variants}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/50 text-sm"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span>Bank-grade Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Instant Transactions</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>Blockchain Verified</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          initial="hidden"
          animate="visible"
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {[
            {
              icon: <Shield className="w-8 h-8" />,
              title: "Secure Sharing",
              desc: "Military-grade encryption for all transactions",
              gradient: "from-blue-500/20 to-cyan-500/20",
              iconColor: "text-blue-400"
            },
            {
              icon: <TrendingUp className="w-8 h-8" />,
              title: "Earn Passive Income",
              desc: "Monetize unused subscription slots instantly",
              gradient: "from-purple-500/20 to-pink-500/20",
              iconColor: "text-purple-400"
            },
            {
              icon: <Zap className="w-8 h-8" />,
              title: "Lightning Fast",
              desc: "Instant verification and access management",
              gradient: "from-yellow-500/20 to-orange-500/20",
              iconColor: "text-yellow-400"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative overflow-hidden rounded-3xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative z-10">
                <div className={`${feature.iconColor} mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
        >
          {[
            { value: "50K+", label: "Active Users" },
            { value: "$2M+", label: "Earned by Users" },
            { value: "99.9%", label: "Uptime" },
            { value: "24/7", label: "Support" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                {stat.value}
              </div>
              <div className="text-white/60 text-sm mt-2">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
    </section>
  );
}