"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Swords, Menu, X, User, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Links da navegação — o href precisa bater com o id da <section> correspondente.
const NAV_LINKS = [
  { label: "Início", href: "#inicio" },      // Hero
  { label: "O Clã", href: "#sobre" },         // Welcome
  { label: "Liderança", href: "#lideranca" }, // Leadership
  { label: "Regras", href: "#regras" },       // WarRules
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");

  // Muda o estilo da navbar ao rolar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll-spy: marca a seção visível como ativa
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Trava o scroll do body com o menu mobile aberto
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300 border-b",
          isScrolled
            ? "bg-background/85 backdrop-blur-md border-primary/20 shadow-2xl py-2.5"
            : "bg-transparent border-transparent py-5"
        )}
      >
        {/* Fio dourado no topo quando rolado */}
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent transition-opacity duration-300",
            isScrolled ? "opacity-100" : "opacity-0"
          )}
        />

        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* --- LOGO (Emblema em losango) --- */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative h-10 w-10 rounded-lg rotate-45 bg-gradient-to-br from-amber-300 to-amber-700 border-2 border-amber-800/60 flex items-center justify-center shadow-[0_4px_14px_-2px_rgba(240,169,43,0.5)] group-hover:shadow-[0_4px_22px_-2px_rgba(240,169,43,0.75)] transition-all duration-300 overflow-hidden">
                <Swords className="w-5 h-5 text-amber-950 -rotate-45 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black tracking-tight text-white font-heading leading-none">
                H4RD G4ME
              </span>
              <span className="text-[10px] font-bold text-primary tracking-[0.25em] uppercase -mt-0.5">
                Clash Clan
              </span>
            </div>
          </Link>

          {/* --- NAVEGAÇÃO DESKTOP --- */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((item) => {
              const active = activeSection === item.href.replace("#", "");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative text-sm font-bold uppercase tracking-wider transition-colors group/link py-2",
                    active ? "text-primary" : "text-muted-foreground hover:text-white"
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300",
                      active ? "w-full" : "w-0 group-hover/link:w-full"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* --- CTA DESKTOP (Botão dourado) --- */}
          <div className="hidden md:flex items-center">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-b from-amber-300 to-amber-600 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-amber-950 border-b-2 border-amber-800 shadow-lg hover:brightness-110 active:translate-y-0.5 active:border-b-0 transition-all"
            >
              <User className="w-4 h-4" />
              <span>Área do Membro</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* --- BOTÃO MOBILE --- */}
          <button
            aria-label="Abrir menu"
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* --- MENU MOBILE --- */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* brilho de fundo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative flex flex-col items-center justify-center h-full gap-7 p-6">
          {/* Emblema */}
          <div className="h-16 w-16 rounded-xl rotate-45 bg-gradient-to-br from-amber-300 to-amber-700 border-4 border-amber-800/60 flex items-center justify-center shadow-lg mb-2">
            <Swords className="w-7 h-7 text-amber-950 -rotate-45" />
          </div>

          {NAV_LINKS.map((item) => {
            const active = activeSection === item.href.replace("#", "");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "text-2xl font-bold uppercase tracking-wider transition-colors",
                  active ? "text-primary" : "text-white hover:text-primary"
                )}
              >
                {item.label}
              </Link>
            );
          })}

          <Link
            href="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-6 w-full max-w-xs btn-clash text-base"
          >
            <User className="w-5 h-5 mr-2" />
            Área do Membro
          </Link>
        </div>
      </div>
    </>
  );
}
