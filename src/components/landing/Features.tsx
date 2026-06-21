import { LayoutDashboard, Zap, BookOpen, Crown, Gem, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  {
    icon: LayoutDashboard,
    title: "Biblioteca de Layouts",
    desc: "Copie layouts de Guerra, Farm e Rush direto para o jogo com um clique. Atualizados semanalmente.",
  },
  {
    icon: Zap,
    title: "Meta Troops & Exércitos",
    desc: "Análises do meta atual. Saiba qual tropa está forte e copie o link do exército pronto para treinar.",
  },
  {
    icon: BookOpen,
    title: "Academia de Guerra",
    desc: "Guias passo-a-passo de Queen Walk, Lavaloon e Hybrid. Aprenda a dar PT em qualquer CV.",
  },
  {
    icon: Crown,
    title: "Gestão & Tesouraria",
    desc: "Painel para controle de cotas, participação em guerras e sorteios de Skins (Gold Pass).",
  },
];

export function Features() {
  return (
    <section id="recursos" className="py-24 bg-card border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-72 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Cabeçalho */}
        <div className="text-center mb-16">
          <div className="eyebrow mb-5">
            <Gem className="w-3.5 h-3.5" /> Arsenal Exclusivo
          </div>
          <h2 className="text-4xl md:text-6xl clash-title mb-5">O Arsenal de Elite</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Não jogue no escuro. Ao acessar o portal, você desbloqueia ferramentas profissionais
            para acelerar sua evolução.
          </p>
        </div>

        {/* Grid de Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {FEATURES.map((f, idx) => (
            <div
              key={idx}
              className="group panel-clash p-6 hover:border-primary/50 hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 shadow-[0_0_20px_rgba(240,169,43,0.15)] group-hover:shadow-[0_0_28px_rgba(240,169,43,0.35)]">
                <f.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                {f.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                <ArrowRight className="w-5 h-5 text-primary" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA — Banner dourado de acesso restrito */}
        <div className="relative rounded-3xl overflow-hidden panel-clash">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-transparent z-0" />
          <div className="absolute -right-10 -bottom-10 opacity-[0.06] z-0">
            <Lock className="w-64 h-64 text-primary" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8">
            <div className="text-center md:text-left max-w-2xl">
              <h3 className="text-2xl md:text-3xl font-heading text-white mb-3 flex items-center justify-center md:justify-start gap-3">
                <Lock className="w-6 h-6 text-primary" />
                Área Restrita do Clã
              </h3>
              <p className="text-muted-foreground text-lg">
                Veja sua posição no ranking de cotas, status de guerra e gerencie seu perfil.
                <span className="block text-sm text-muted-foreground/80 mt-2 font-medium">
                  * Acesso liberado apenas para membros com Tag verificada.
                </span>
              </p>
            </div>

            <Link href="/login" className="btn-clash shrink-0 text-base group">
              Acessar Painel
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
