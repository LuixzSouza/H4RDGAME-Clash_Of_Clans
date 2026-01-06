import { LayoutDashboard, Zap, BookOpen, Crown, Gem, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export function Features() {
  const features = [
    {
      icon: LayoutDashboard,
      title: "Biblioteca de Layouts",
      desc: "Copie layouts de Guerra, Farm e Rush direto para o jogo com um clique. Atualizados semanalmente.",
      color: "text-blue-400",
      glow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
      borderHover: "group-hover:border-blue-500/50",
      bgHover: "group-hover:bg-blue-500/5"
    },
    {
      icon: Zap,
      title: "Meta Troops & Exércitos",
      desc: "Análises do meta atual. Saiba qual tropa está forte e copie o link do exército pronto para treinar.",
      color: "text-yellow-400",
      glow: "shadow-[0_0_20px_rgba(250,204,21,0.3)]",
      borderHover: "group-hover:border-yellow-500/50",
      bgHover: "group-hover:bg-yellow-500/5"
    },
    {
      icon: BookOpen,
      title: "Academia de Guerra",
      desc: "Guias passo-a-passo de Queen Walk, Lavaloon e Hybrid. Aprenda a dar PT em qualquer CV.",
      color: "text-green-400",
      glow: "shadow-[0_0_20px_rgba(74,222,128,0.3)]",
      borderHover: "group-hover:border-green-500/50",
      bgHover: "group-hover:bg-green-500/5"
    },
    {
      icon: Crown,
      title: "Gestão Financeira",
      desc: "Painel exclusivo para controle de doações, participação em guerras e sorteios de Skins (Gold Pass).",
      color: "text-purple-400",
      glow: "shadow-[0_0_20px_rgba(192,132,252,0.3)]",
      borderHover: "group-hover:border-purple-500/50",
      bgHover: "group-hover:bg-purple-500/5"
    },
  ];

  return (
    <section id="recursos" className="py-24 bg-[#0f111a] border-t border-white/5 relative overflow-hidden">
      
      {/* Background Grid (Consistência Visual) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Cabeçalho */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold uppercase tracking-wider mb-4">
            <Gem className="w-4 h-4" /> Benefícios Exclusivos
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            O Arsenal do <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Membro de Elite</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Não jogue no escuro. Ao acessar nosso portal, você desbloqueia ferramentas profissionais para acelerar sua evolução.
          </p>
        </div>

        {/* Grid de Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((f, idx) => (
            <div key={idx} className={`group relative bg-[#151720] border border-white/5 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-2 ${f.borderHover} ${f.bgHover}`}>
              
              {/* Ícone com Glow */}
              <div className={`w-14 h-14 rounded-xl bg-[#0b0d14] border border-white/10 flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 ${f.glow}`}>
                <f.icon className={`w-7 h-7 ${f.color}`} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                {f.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {f.desc}
              </p>

              {/* Seta decorativa no hover */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                <ArrowRight className={`w-5 h-5 ${f.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* CTA (Chamada para Ação) - Estilo "Acesso Restrito" */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10">
          {/* Background do Card */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-900/40 to-[#0f111a] z-0" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0 mix-blend-overlay" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8">
            
            <div className="text-center md:text-left max-w-2xl">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 flex items-center justify-center md:justify-start gap-3">
                <Lock className="w-6 h-6 text-orange-500" />
                Área Restrita do Clã
              </h3>
              <p className="text-slate-300 text-lg">
                Veja sua posição no ranking de doações, status de guerra e gerencie seu perfil.
                <span className="block text-sm text-slate-500 mt-2 font-medium">
                  * Acesso permitido apenas para membros com Tag verificada.
                </span>
              </p>
            </div>

            <Link 
              href="/login" 
              className="group relative overflow-hidden rounded-xl bg-white px-8 py-4 text-black font-black text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-transform hover:scale-105 active:scale-95 shrink-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 group-hover:text-white transition-colors flex items-center gap-2">
                Acessar Painel <ArrowRight className="w-5 h-5" />
              </span>
            </Link>

          </div>
        </div>

      </div>
    </section>
  );
}