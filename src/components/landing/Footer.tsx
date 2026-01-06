import Link from "next/link";
import { Swords, Instagram, Youtube, MessageCircle, Heart, ShieldCheck } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050608] border-t border-white/5 relative overflow-hidden pt-16 pb-8">
      
      {/* Luz de Fundo (Glow) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* --- CONTEÚDO PRINCIPAL (GRID) --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Coluna 1: A Marca */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-orange-500 to-yellow-500 p-2 rounded-lg border border-yellow-200/20">
                 <Swords className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white font-heading">
                H4RD G4ME
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Mais que um clã, uma família focada em evolução e estratégia. 
              Domine as guerras, suba de liga e faça parte da nossa história no Clash of Clans.
            </p>
            <div className="flex gap-4 pt-2">
              {/* Botões Sociais (Exemplos) */}
              <a href="#" className="w-10 h-10 rounded-full bg-[#12141c] border border-white/10 flex items-center justify-center text-slate-400 hover:text-pink-500 hover:border-pink-500/50 hover:bg-pink-500/10 transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#12141c] border border-white/10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/10 transition-all duration-300">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://wa.me/5535997354797" className="w-10 h-10 rounded-full bg-[#12141c] border border-white/10 flex items-center justify-center text-slate-400 hover:text-green-500 hover:border-green-500/50 hover:bg-green-500/10 transition-all duration-300">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Coluna 2: Navegação */}
          <div>
            <h4 className="text-white font-bold mb-6 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-500"/> Navegação
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link href="#inicio" className="hover:text-orange-400 hover:translate-x-1 transition-all inline-block">Início</Link>
              </li>
              <li>
                <Link href="#sobre" className="hover:text-orange-400 hover:translate-x-1 transition-all inline-block">Sobre o Clã</Link>
              </li>
              <li>
                <Link href="#regras" className="hover:text-orange-400 hover:translate-x-1 transition-all inline-block">Regras de Guerra</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-orange-400 hover:translate-x-1 transition-all inline-block">Área de Membros</Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Links Úteis / Externos */}
          <div>
            <h4 className="text-white font-bold mb-6">Links Úteis</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <a href="https://clashofclans.com/pt/" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">
                  Site Oficial Supercell
                </a>
              </li>
              <li>
                <a href="https://www.clashofstats.com/" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">
                  Clash of Stats
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Wiki do Clash
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* --- BARRA INFERIOR (COPYRIGHT) --- */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="text-center md:text-left">
            <p className="text-slate-500 text-sm font-medium">
              &copy; {currentYear} <span className="text-white font-bold">H4RD G4ME</span>. Todos os direitos reservados.
            </p>
            <p className="text-slate-600 text-[10px] mt-2 max-w-lg leading-tight">
              Este conteúdo não é afiliado, endossado, patrocinado ou especificamente aprovado pela Supercell e a Supercell não é responsável por ele. Para mais informações, consulte a Política de Conteúdo de Fãs da Supercell.
            </p>
          </div>

          <div className="flex items-center gap-1 text-sm text-slate-500">
            <span>Desenvolvido com</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
            <span>por</span>
            <a 
              href="https://luixzsouza.com.br" 
              target="_blank" 
              className="text-orange-400 hover:text-orange-300 font-bold transition-colors"
            >
              Luixz
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}