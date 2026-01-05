import { LayoutDashboard, Zap, BookOpen, Crown } from "lucide-react";
import Link from "next/link";

export function Features() {
  const features = [
    {
      icon: LayoutDashboard,
      title: "Melhores Layouts",
      desc: "Acesso a uma biblioteca de layouts de guerra e farm atualizados para todos os níveis de CV.",
      color: "text-blue-400",
      bg: "bg-blue-500/10"
    },
    {
      icon: Zap,
      title: "Meta Troops",
      desc: "Saiba quais tropas estão mais fortes no meta atual e copie links de exército direto pro jogo.",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10"
    },
    {
      icon: BookOpen,
      title: "Guias de Ataque",
      desc: "Tutoriais passo-a-passo de como dar PT em CVs difíceis usando estratégias híbridas.",
      color: "text-green-400",
      bg: "bg-green-500/10"
    },
    {
      icon: Crown,
      title: "Gestão do Clã",
      desc: "Ferramentas exclusivas para o Staff controlar doações, ataques e pagamentos de Skins.",
      color: "text-purple-400",
      bg: "bg-purple-500/10"
    },
  ];

  return (
    <section id="recursos" className="py-24 bg-[#0f111a] border-t border-white/5">
      <div className="container mx-auto px-6 text-center">
        
        <h2 className="text-3xl md:text-5xl font-heading text-white mb-6">
          Vantagens do Membro
        </h2>
        <p className="text-slate-400 mb-16 max-w-2xl mx-auto">
          Ao fazer login no nosso portal, você desbloqueia conteúdos que vão acelerar sua evolução no jogo.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, idx) => (
            <div key={idx} className="bg-[#1a1b26] p-6 rounded-2xl border-2 border-[#2f3245] hover:-translate-y-2 transition-transform duration-300">
              <div className={`w-14 h-14 ${f.bg} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                <f.icon className={`w-7 h-7 ${f.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-3xl p-8 md:p-12 border border-orange-500/30 relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Pronto para a Guerra?</h3>
                <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                    Acesse agora a área restrita e veja sua posição no ranking de doações e guerra.
                </p>
                <Link href="/login" className="btn-clash px-8 py-4 h-auto text-base">
                    Acessar Painel Agora
                </Link>
             </div>
        </div>

      </div>
    </section>
  );
}