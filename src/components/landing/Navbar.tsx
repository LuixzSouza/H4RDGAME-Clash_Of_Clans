import Link from "next/link";
import { Swords } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#0f111a]/80 backdrop-blur-md shadow-2xl">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-orange-500 to-yellow-500 p-2 rounded-xl border-2 border-yellow-200 shadow-lg">
             <Swords className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white drop-shadow-md font-heading">
            H4RD G4ME
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-300 uppercase tracking-wider">
          <Link href="#inicio" className="hover:text-yellow-400 transition-colors">Início</Link>
          <Link href="#sobre" className="hover:text-yellow-400 transition-colors">O Clã</Link>
          <Link href="#regras" className="hover:text-yellow-400 transition-colors">Regras de Guerra</Link>
          <Link href="#recursos" className="hover:text-yellow-400 transition-colors">Recursos</Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link href="/login" className="btn-clash text-xs px-6 py-2 h-10">
            Área do Membro
          </Link>
        </div>
      </div>
    </header>
  );
}