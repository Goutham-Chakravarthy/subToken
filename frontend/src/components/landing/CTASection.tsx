"use client";

import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-20 gradient-bg border-t border-white/10">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-3xl sm:text-4xl font-extrabold text-white">
          Ready to Tokenize?
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.6 }} className="mt-4 text-white/80">
          Install the extension or join the waitlist to get early access.
        </motion.p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <a href="/install" className="btn-primary-landing" role="button" aria-label="Install extension">Install</a>
          <a href="/waitlist" className="btn-secondary-landing" role="button" aria-label="Join waitlist">Join Waitlist</a>
        </div>
      </div>
    </section>
  );
}
