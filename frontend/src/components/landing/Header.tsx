"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X, Coins, Zap, Phone } from "lucide-react";
import { ConnectButton } from "@/components/ConnectButton";

export default function Header() {
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastYRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY || 0;

      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          const delta = currentY - lastYRef.current;

          if (currentY <= 0) {
            setVisible(true);
          } else if (Math.abs(delta) > 6) {
            setVisible(delta < 0);
          }

          lastYRef.current = currentY;
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const smoothScrollTo = (targetPosition: number, duration: number = 1200) => {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;

    const easeInOutCubic = (t: number): number => {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);

      window.scrollTo(0, startPosition + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLButtonElement>, sectionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setMobileMenuOpen(false);
    
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 120;
      const targetPosition = element.offsetTop - navbarHeight;
      smoothScrollTo(targetPosition, 1200);
    }
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-out ${
          visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="flex justify-center mt-4 sm:mt-6 md:mt-8 lg:mt-10 px-4">
          {/* Desktop Navbar */}
          <nav className="hidden md:flex z-10 items-center gap-3 lg:gap-5 py-2.5 lg:py-3 px-4 lg:px-6 rounded-full bg-white/10 backdrop-blur-lg border text-white border-white/20 shadow-xl">
            <button 
              onClick={(e) => handleSmoothScroll(e, "hero")}
              className="hover:scale-110 transition-transform flex items-center gap-2"
              aria-label="Home"
              title="TokenShare"
            >
              <Coins className="w-7 h-7 lg:w-8 lg:h-8 text-purple-400" />
              <span className="font-bold text-lg lg:text-xl hidden lg:inline">TokenShare</span>
            </button>

            <div className="h-6 w-px bg-white/20 mx-1" />

            <button 
              onClick={(e) => handleSmoothScroll(e, "how-it-works")}
              className="hover:text-gray-300 transition-all hover:scale-105 text-sm lg:text-base flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4" />
              <span>How It Works</span>
            </button>

            <button 
              onClick={(e) => handleSmoothScroll(e, "cta")}
              className="hover:text-gray-300 transition-all hover:scale-105 text-sm lg:text-base flex items-center gap-1.5"
            >
              <Phone className="w-4 h-4" />
              <span>Get Started</span>
            </button>

            <div className="ml-2">
              <ConnectButton />
            </div>
          </nav>

          {/* Mobile Navbar */}
          <nav className="md:hidden z-10 flex items-center justify-between w-full max-w-md py-3 px-5 rounded-full bg-white/10 backdrop-blur-lg border text-white border-white/20 shadow-xl">
            <button 
              onClick={(e) => handleSmoothScroll(e, "hero")}
              className="hover:scale-110 transition-transform flex items-center gap-2"
              aria-label="Home"
              title="TokenShare"
            >
              <Coins className="w-7 h-7 text-purple-400" />
              <span className="font-bold text-lg">TokenShare</span>
            </button>

            <div className="flex items-center gap-3">
              <ConnectButton />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${
          mobileMenuOpen && visible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Menu Content */}
        <div
          className={`absolute top-20 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md transition-all duration-300 ${
            mobileMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0"
          }`}
        >
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex flex-col py-4">
              <button
                onClick={(e) => handleSmoothScroll(e, "how-it-works")}
                className="px-6 py-4 text-white hover:bg-white/10 transition-all active:bg-white/20 text-left text-lg flex items-center gap-3"
              >
                <Zap className="w-5 h-5" />
                <span>How It Works</span>
              </button>
              <div className="h-px bg-white/10 mx-4" />
              
              <button
                onClick={(e) => handleSmoothScroll(e, "cta")}
                className="px-6 py-4 text-white hover:bg-white/10 transition-all active:bg-white/20 text-left text-lg flex items-center gap-3"
              >
                <Phone className="w-5 h-5" />
                <span>Get Started</span>
              </button>
              <div className="h-px bg-white/10 mx-4" />
              
              <div className="mx-4 my-2">
                <ConnectButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}