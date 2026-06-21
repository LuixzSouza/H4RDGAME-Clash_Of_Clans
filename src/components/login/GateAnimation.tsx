"use client";

import { Swords } from "lucide-react";

const WOOD_PATTERN = `data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%233e2723' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E`;

interface GateAnimationProps {
  isOpen: boolean;
}

// Banda de ferro com rebites
function IronBand({ side }: { side: "left" | "right" }) {
  return (
    <div className="relative w-full h-5 bg-gradient-to-b from-zinc-500 via-zinc-700 to-zinc-900 border-y border-black/40 shadow-md flex items-center">
      <div className={`absolute ${side === "left" ? "right-3" : "left-3"} flex gap-8`}>
        {[0, 1].map((r) => (
          <span key={r} className="w-2 h-2 rounded-full bg-zinc-300 shadow-[inset_0_-1px_1px_rgba(0,0,0,0.5)]" />
        ))}
      </div>
    </div>
  );
}

export function GateAnimation({ isOpen }: GateAnimationProps) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
      {/* --- Arco de Pedra Superior --- */}
      <div className={`absolute top-0 w-full h-1/2 transition-transform duration-[2000ms] ease-in-out z-30 ${isOpen ? "-translate-y-full" : "translate-y-0"}`}>
        <div className="w-full h-full bg-gradient-to-b from-card via-card to-background border-b-4 border-primary/40 shadow-2xl relative">
          {/* trim dourado na base do arco */}
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
            {/* Brasão dourado */}
            <div className="relative mb-5">
              <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
              <div className="relative h-16 w-16 rounded-xl rotate-45 bg-gradient-to-br from-amber-300 to-amber-700 border-4 border-amber-800/60 flex items-center justify-center shadow-lg">
                <Swords className="w-7 h-7 text-amber-950 -rotate-45" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-primary/30 tracking-[0.6em] md:tracking-[1em] uppercase">
              H4RD G4ME
            </h1>
          </div>
        </div>
      </div>

      {/* --- Portão Esquerdo --- */}
      <div
        className={`absolute left-0 bottom-0 w-1/2 h-full bg-[#1a0f0a] border-r-2 border-black/60 transition-transform duration-[2000ms] ease-in-out z-20 ${isOpen ? "-translate-x-full" : "translate-x-0"}`}
        style={{ backgroundImage: `url("${WOOD_PATTERN}")` }}
      >
        {/* Bandas de ferro */}
        <div className="absolute top-1/4 inset-x-0"><IronBand side="left" /></div>
        <div className="absolute bottom-1/4 inset-x-0"><IronBand side="left" /></div>
        {/* Borda de ferro no encontro */}
        <div className="absolute right-0 inset-y-0 w-3 bg-gradient-to-l from-zinc-700 to-transparent" />
        {/* Argola/puxador */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 border-zinc-600 bg-zinc-800/50 shadow-xl" />
      </div>

      {/* --- Portão Direito --- */}
      <div
        className={`absolute right-0 bottom-0 w-1/2 h-full bg-[#1a0f0a] border-l-2 border-black/60 transition-transform duration-[2000ms] ease-in-out z-20 ${isOpen ? "translate-x-full" : "translate-x-0"}`}
        style={{ backgroundImage: `url("${WOOD_PATTERN}")` }}
      >
        <div className="absolute top-1/4 inset-x-0"><IronBand side="right" /></div>
        <div className="absolute bottom-1/4 inset-x-0"><IronBand side="right" /></div>
        <div className="absolute left-0 inset-y-0 w-3 bg-gradient-to-r from-zinc-700 to-transparent" />
        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 border-zinc-600 bg-zinc-800/50 shadow-xl" />
      </div>

      {/* Névoa de entrada */}
      {isOpen && (
        <div className="absolute inset-0 bg-black/40 z-10 animate-out fade-out duration-[3000ms] pointer-events-none" />
      )}
    </div>
  );
}
