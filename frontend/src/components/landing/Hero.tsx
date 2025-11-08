"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

export default function Hero() {
  const variants = useMemo(() => ({
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.08 } },
  }), []);

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      <video className="absolute inset-0 w-full h-full object-cover opacity-20" autoPlay muted loop playsInline src="/hero-bg.mp4" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={variants}
        className="relative z-10 mx-auto max-w-4xl text-center px-6"
      >
        <motion.h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow"
          variants={variants}
        >
          Tokenized Subscriptions
        </motion.h1>
        <motion.p className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto" variants={variants}>
          Monetize Your Subscriptions with Tokens – Secure, Decentralized Sharing.
        </motion.p>
        <motion.div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4" variants={variants}>
          <a href="/install" className="btn-primary-landing" role="button" aria-label="Install extension">Install</a>
          <a href="#features" className="btn-secondary-landing" role="button" aria-label="Learn more">Learn More</a>
        </motion.div>
      </motion.div>
    </section>
  );
}
