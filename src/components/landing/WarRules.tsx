import { Swords, Clock, Star, Skull, ScrollText } from "lucide-react";

const RULE_BLOCKS = [
  {
    icon: Swords,
    title: "Combate & Espelho",
    items: [
      "As guerras iniciam entre <strong>19h–20h</strong> (dia sim, dia não).",
      "Ataque <strong>SEMPRE o seu espelho</strong> (mesmo número) no primeiro ataque.",
      "Use <strong>APENAS 1 ataque</strong> no início, dando chance aos outros garantirem recursos.",
      "Objetivo mínimo: <strong>2 estrelas</strong>. Não conseguiu? Peça ajuda de layout/tropas.",
    ],
  },
  {
    icon: Star,
    title: "Heróis & Preparação",
    items: [
      "Sempre peça tropas no Castelo do Clã — elas salvam vidas.",
      "<strong>War normal:</strong> mínimo 2 heróis acordados. Todos dormindo? Fique de fora.",
      "<strong>Liga (CWL):</strong> 4 heróis são <strong>OBRIGATÓRIOS</strong>.",
      "Troca de alvo é permitida, mas <strong>avise no WhatsApp</strong> antes.",
    ],
  },
  {
    icon: Clock,
    title: "Segundo Ataque",
    items: [
      "A partir das <strong>12h do dia seguinte</strong>, o segundo ataque é liberado para limpeza.",
      "Feche o que conseguir (3 estrelas) ou siga as instruções dos líderes no WhatsApp.",
    ],
    tip: "💡 Faxina bem feita decide guerras apertadas. Não deixe estrela na mesa.",
  },
];

export function WarRules() {
  return (
    <section id="regras" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-destructive/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="eyebrow mb-5 !border-destructive/30 !bg-destructive/10 !text-destructive">
            <ScrollText className="w-3.5 h-3.5" /> Lei Marcial
          </div>
          <h2 className="text-4xl md:text-6xl clash-title">Regras de Guerra</h2>
          <p className="text-muted-foreground mt-5 max-w-2xl mx-auto">
            A disciplina separa a vitória da derrota. Leia com atenção, guerreiro.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {RULE_BLOCKS.map((block) => (
            <div key={block.title} className="panel-clash p-6 md:p-8 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 border border-primary/25 p-3 rounded-xl">
                  <block.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white">{block.title}</h3>
              </div>
              <ul className="space-y-4 text-muted-foreground">
                {block.items.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-primary font-bold mt-0.5">▸</span>
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ul>
              {block.tip && (
                <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg mt-6">
                  <p className="text-primary text-sm font-medium">{block.tip}</p>
                </div>
              )}
            </div>
          ))}

          {/* Bloco de Punições — tema perigo */}
          <div className="relative rounded-2xl border-2 border-destructive/50 bg-gradient-to-b from-destructive/10 to-background p-6 md:p-8 hover:border-destructive transition-colors shadow-[0_12px_36px_-12px_rgba(0,0,0,0.75)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-destructive/15 border border-destructive/30 p-3 rounded-xl">
                <Skull className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-2xl font-bold text-destructive">Punições</h3>
            </div>
            <ul className="space-y-4 text-destructive/80">
              <li className="flex gap-3">
                <span className="font-bold">⚠️</span>
                <span>Furou regras? <strong>1 notificação</strong>.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">🚫</span>
                <span>Furou 2 vezes? <strong>Fora da próxima guerra</strong>.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">☠️</span>
                <span>Não atacou sem justificativa? <strong>Banimento da guerra</strong> ou expulsão.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
