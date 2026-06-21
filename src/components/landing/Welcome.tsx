import { Quote, Shield, Swords, Heart } from "lucide-react";

const PILLARS = [
  { icon: Shield, title: "Lealdade", desc: "Defendemos cada membro como família." },
  { icon: Swords, title: "Estratégia", desc: "Vitórias nascem do planejamento, não da sorte." },
  { icon: Heart, title: "Diversão", desc: "Acima de tudo, jogamos pra rir junto." },
];

export function Welcome() {
  return (
    <section id="sobre" className="py-24 bg-background border-y border-white/5 relative overflow-hidden">
      {/* glow lateral sutil */}
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="eyebrow mb-5">
            <Heart className="w-3.5 h-3.5" /> Nossa Tribo
          </div>
          <h2 className="text-4xl md:text-6xl clash-title mb-4">Bem-vindo ao Clã</h2>
          <div className="gold-rule max-w-xs mx-auto mb-10" />

          {/* Painel da mensagem */}
          <div className="panel-clash p-8 md:p-12 text-left">
            <Quote className="w-10 h-10 text-primary/40 mb-4" />
            <div className="space-y-5 text-muted-foreground text-base md:text-lg leading-relaxed font-medium">
              <p>
                É com honra que recebemos cada guerreiro nesta fortaleza. Juntos, enfrentamos
                desafios, conquistamos vitórias e construímos uma história que ninguém esquece.
              </p>
              <p>
                Cooperação e trabalho em equipe são o coração do H4RD G4ME. Compartilhe sua
                experiência, aprenda com os veteranos e forje amizades que duram além do jogo.
              </p>
            </div>
            <p className="mt-8 text-xl md:text-2xl font-heading text-primary italic text-center">
              &quot;Que nossa jornada seja épica. Avante, guerreiros!&quot;
            </p>
          </div>

          {/* Pilares */}
          <div className="grid sm:grid-cols-3 gap-4 mt-8">
            {PILLARS.map((p) => (
              <div key={p.title} className="plaque p-6 flex flex-col items-center text-center group">
                <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <p.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{p.title}</h3>
                <p className="text-muted-foreground text-sm">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
