"use client";

import { Shield } from "lucide-react";

const WOOD_PATTERN = `data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%233e2723' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E`;

interface GateAnimationProps {
  isOpen: boolean;
}

export function GateAnimation({ isOpen }: GateAnimationProps) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
      
      {/* Arco de Pedra Superior */}
      <div className={`absolute top-0 w-full h-1/2 transition-transform duration-[2000ms] ease-in-out z-30 ${isOpen ? '-translate-y-full' : 'translate-y-0'}`}>
           <div className="w-full h-full bg-gradient-to-b from-[#1a1b26] to-[#0f1016] border-b-8 border-[#2f3245] shadow-2xl relative">
               <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <Shield className="w-24 h-24 text-[#2f3245] mb-4"/>
                  <h1 className="text-4xl font-black text-[#2f3245] tracking-[1em] uppercase">H4RD G4ME</h1>
               </div>
           </div>
      </div>

      {/* Portão Esquerdo */}
      <div 
        className={`absolute left-0 bottom-0 w-1/2 h-full bg-[#1a0f0a] border-r-4 border-[#2f3245] transition-transform duration-[2000ms] ease-in-out z-20 ${
          isOpen ? '-translate-x-full' : 'translate-x-0'
        }`}
        style={{ backgroundImage: `url("${WOOD_PATTERN}")` }}
      >
         <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-32 bg-[#2f3245] rounded-full shadow-xl"></div>
         <div className="absolute right-0 top-1/4 w-full h-4 bg-[#000]/30"></div>
         <div className="absolute right-0 bottom-1/4 w-full h-4 bg-[#000]/30"></div>
      </div>

      {/* Portão Direito */}
      <div 
        className={`absolute right-0 bottom-0 w-1/2 h-full bg-[#1a0f0a] border-l-4 border-[#2f3245] transition-transform duration-[2000ms] ease-in-out z-20 ${
          isOpen ? 'translate-x-full' : 'translate-x-0'
        }`}
        style={{ backgroundImage: `url("${WOOD_PATTERN}")` }}
      >
         <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-32 bg-[#2f3245] rounded-full shadow-xl"></div>
         <div className="absolute left-0 top-1/4 w-full h-4 bg-[#000]/30"></div>
         <div className="absolute left-0 bottom-1/4 w-full h-4 bg-[#000]/30"></div>
      </div>

      {/* Névoa de entrada */}
      {isOpen && (
          <div className="absolute inset-0 bg-black/40 z-10 animate-out fade-out duration-[3000ms] pointer-events-none"></div>
      )}
    </div>
  );
}