"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

const testimonials = [
  { quote: "Saved 50% on Canva!", author: "Alex" },
  { quote: "Frictionless lending and payouts.", author: "Priya" },
  { quote: "Proxies felt magically secure.", author: "Jamal" },
];

export default function Testimonials() {
  const controls = useAnimation();

  useEffect(() => {
    controls.start(i => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" } }));
  }, [controls]);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center text-3xl sm:text-4xl font-bold text-white mb-12">Loved by Early Users</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i} className="card-hover min-h-[140px]" custom={i} initial={{ opacity: 0, y: 50 }} animate={controls}>
              <p className="text-white/90">“{t.quote}”</p>
              <p className="mt-3 text-white/60 text-sm">— {t.author}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <Stat label="Tokens Minted" value={10000} />
          <Stat label="Active Rentals" value={1200} />
          <Stat label="Avg. Savings" value={45} suffix="%" />
          <Stat label="Chains" value={3} />
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="p-6 rounded-xl border border-white/10 bg-white/5">
      <div className="text-3xl font-extrabold text-white">{value.toLocaleString()}{suffix}</div>
      <div className="text-white/60 text-sm mt-1">{label}</div>
    </motion.div>
  );
}
