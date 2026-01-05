import Link from "next/link";
import { Trophy, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section id="inicio" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Mágico */}
      <div className="absolute inset-0 bg-[#0b0d14] -z-20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0b0d14] to-[#0b0d14] -z-10" />
      
      <div className="container mx-auto px-6 text-center relative z-10">
        
        <div className="inline-flex items-center rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-1.5 text-sm font-bold text-yellow-500 mb-8 uppercase tracking-widest shadow-[0_0_15px_rgba(234,179,8,0.2)]">
          <Trophy className="mr-2 h-4 w-4" /> Recrutamento Aberto
        </div>
        
        <h1 className="text-5xl md:text-7xl font-heading text-white mb-6 drop-shadow-xl leading-tight">
          Estratégia, União e <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-red-600">
            Guerra Total
          </span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 font-medium leading-relaxed">
          Junte-se ao <strong className="text-white">H4RD G4ME</strong>. Um clã focado em evolução constante, guerras organizadas e uma comunidade ativa pronta para te ajudar a evoluir.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <button className="btn-clash text-lg h-14 px-10 shadow-orange-900/50">
            Quero me Alistar
          </button>
          <Link href="/login" className="btn-clash-green text-lg h-14 px-10 shadow-green-900/50 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5"/> Login de Membro
          </Link>
        </div>

      </div>
    </section>
  );
}