"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectButton } from "@/components/ConnectButton";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur bg-black/40 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-2xl text-teal-400 tracking-tight" aria-label="TokenSub home">
          TokenSub
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#features" className="text-white/80 hover:text-white transition" aria-label="Go to Features">Features</a>
          <a href="#marketplace" className="text-white/80 hover:text-white transition" aria-label="Go to Marketplace">Marketplace</a>
          <Link href="/docs" className="text-white/80 hover:text-white transition" aria-label="Open Docs">Docs</Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ConnectButton />
        </div>

        <button
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 text-white/90"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="sr-only">Open menu</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden border-t border-white/10 bg-black/70"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              <a href="#features" className="text-white/90" onClick={() => setOpen(false)}>Features</a>
              <a href="#marketplace" className="text-white/90" onClick={() => setOpen(false)}>Marketplace</a>
              <Link href="/docs" className="text-white/90" onClick={() => setOpen(false)}>Docs</Link>
              <div className="pt-2">
                <ConnectButton />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
