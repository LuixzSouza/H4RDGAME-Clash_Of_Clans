"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Swords, Menu, X, User } from "lucide-react";
import { cn } from "@/lib/utils"; // Certifique-se de ter essa função ou remova e use string template
// Se não tiver a função cn, pode substituir cn(...) por `classe fixa ${condicional}`

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Detecta o scroll para mudar o estilo da navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
          isScrolled
            ? "bg-[#0b0d14]/80 backdrop-blur-md border-white/10 shadow-2xl py-3"
            : "bg-transparent border-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          
          {/* --- LOGO --- */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 to-yellow-600 p-2.5 rounded-xl border border-yellow-500/30 shadow-[0_0_15px_rgba(234,88,12,0.3)] group-hover:shadow-[0_0_25px_rgba(234,88,12,0.5)] transition-all duration-300">
              <Swords className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300" />
              {/* Brilho passando no logo */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black tracking-tight text-white font-heading leading-none">
                H4RD G4ME
              </span>
              <span className="text-[10px] font-bold text-orange-400 tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mt-1">
                Clash Clan
              </span>
            </div>
          </Link>

          {/* --- DESKTOP NAVIGATION --- */}
          <nav className="hidden md:flex items-center gap-8">
            {["Início", "O Clã", "Liderança", "Regras"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-").replace("ç", "c").replace("ã", "a")}`}
                className="relative text-sm font-bold text-slate-300 uppercase tracking-wider hover:text-white transition-colors group/link py-2"
              >
                {item}
                {/* Linha animada embaixo do link */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 transition-all duration-300 group-hover/link:w-full" />
              </Link>
            ))}
          </nav>

          {/* --- ACTION BUTTONS (Desktop) --- */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="group relative px-6 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 hover:border-orange-500/50 transition-all duration-300 flex items-center gap-2"
            >
              <User className="w-4 h-4 text-orange-400 group-hover:text-white transition-colors" />
              <span>Área do Membro</span>
            </Link>
          </div>

          {/* --- MOBILE MENU BUTTON --- */}
          <button
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* --- MOBILE MENU OVERLAY --- */}
      <div
        className={`fixed inset-0 z-40 bg-[#0b0d14]/95 backdrop-blur-xl md:hidden transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 p-6">
          <div className="w-16 h-1 bg-white/10 rounded-full mb-8" />
          
          {["Início", "O Clã", "Liderança", "Regras"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-bold text-white hover:text-orange-500 transition-colors"
            >
              {item}
            </Link>
          ))}

          <Link
            href="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-8 w-full max-w-xs bg-orange-600 py-4 rounded-xl text-center text-white font-bold text-lg shadow-lg shadow-orange-900/20 active:scale-95 transition-transform"
          >
            Área do Membro
          </Link>
        </div>
      </div>
    </>
  );
}