import { Swords, Clock, AlertTriangle, Shield, Skull, Star } from "lucide-react";

export function WarRules() {
  return (
    <section id="regras" className="py-24 bg-[#0b0d14]">
      <div className="container mx-auto px-6">
        
        <div className="text-center mb-16">
          <span className="text-red-500 font-bold tracking-widest uppercase text-sm">Lei Marcial</span>
          <h2 className="text-4xl md:text-5xl font-heading text-white mt-2 drop-shadow-lg">
            Regras de Guerra
          </h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            A disciplina é o que separa a vitória da derrota. Leia com atenção.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            
            {/* Bloco 1: O Básico */}
            <div className="bg-[#1a1b26] rounded-2xl border-2 border-[#2f3245] p-6 md:p-8 hover:border-red-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-red-500/10 p-3 rounded-xl"><Swords className="w-6 h-6 text-red-500"/></div>
                    <h3 className="text-2xl font-bold text-white">Combate & Espelho</h3>
                </div>
                <ul className="space-y-4 text-slate-300">
                    <li className="flex gap-3">
                        <span className="text-red-500 font-bold">•</span>
                        <span>As guerras iniciam entre <strong>19h-20h</strong> (dia sim, dia não).</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="text-red-500 font-bold">•</span>
                        <span>Ataque <strong>SEMPRE o seu espelho</strong> (mesmo número) no primeiro ataque.</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="text-red-500 font-bold">•</span>
                        <span>Use <strong>APENAS 1 ataque</strong> inicialmente, para dar chance aos outros garantirem recursos.</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="text-red-500 font-bold">•</span>
                        <span>Objetivo mínimo: <strong>2 Estrelas</strong>. Se não conseguir, peça ajuda para melhorar o layout/tropas.</span>
                    </li>
                </ul>
            </div>

            {/* Bloco 2: Heróis e Tropas */}
            <div className="bg-[#1a1b26] rounded-2xl border-2 border-[#2f3245] p-6 md:p-8 hover:border-yellow-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-yellow-500/10 p-3 rounded-xl"><Star className="w-6 h-6 text-yellow-500"/></div>
                    <h3 className="text-2xl font-bold text-white">Heróis & Preparação</h3>
                </div>
                <ul className="space-y-4 text-slate-300">
                    <li className="flex gap-3">
                        <span className="text-yellow-500 font-bold">•</span>
                        <span>Não esqueça de pedir tropas no Castelo do Clã. Elas salvam vidas.</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="text-yellow-500 font-bold">•</span>
                        <span><strong>War Normal:</strong> Mínimo 2 heróis disponíveis. Se todos estiverem dormindo, fique de fora (Escudo Vermelho).</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="text-yellow-500 font-bold">•</span>
                        <span><strong>Liga (CWL):</strong> 4 Heróis são <strong>OBRIGATÓRIOS</strong>.</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="text-yellow-500 font-bold">•</span>
                        <span>Trocas de alvo são permitidas, mas <strong>avise no WhatsApp</strong> antes.</span>
                    </li>
                </ul>
            </div>

            {/* Bloco 3: O Segundo Ataque */}
            <div className="bg-[#1a1b26] rounded-2xl border-2 border-[#2f3245] p-6 md:p-8 hover:border-blue-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-500/10 p-3 rounded-xl"><Clock className="w-6 h-6 text-blue-500"/></div>
                    <h3 className="text-2xl font-bold text-white">Segundo Ataque</h3>
                </div>
                <p className="text-slate-300 leading-relaxed mb-4">
                    A partir das <strong>12h do dia seguinte</strong>, o segundo ataque é liberado para limpeza (&quot;faxina&quot;).
                </p>
                <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-lg">
                    <p className="text-blue-200 text-sm font-medium">
                        💡 Dica: Ataque quem você conseguir fechar (3 estrelas) ou siga as instruções dos líderes no WhatsApp.
                    </p>
                </div>
            </div>

            {/* Bloco 4: Punições */}
            <div className="bg-[#2b1616] rounded-2xl border-2 border-red-900/50 p-6 md:p-8 hover:border-red-600 transition-colors">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-red-500/10 p-3 rounded-xl"><Skull className="w-6 h-6 text-red-500"/></div>
                    <h3 className="text-2xl font-bold text-red-100">Punições</h3>
                </div>
                <ul className="space-y-4 text-red-200/80">
                    <li className="flex gap-3">
                        <span className="text-red-500 font-bold">⚠️</span>
                        <span>Furou regras? <strong>1 Notificação</strong>.</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="text-red-500 font-bold">🚫</span>
                        <span>Furou 2 vezes? <strong>Fora da próxima Guerra</strong>.</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="text-red-500 font-bold">☠️</span>
                        <span>Não atacou nenhuma vez (sem justificativa)? <strong>Banimento da próxima Guerra</strong> ou Expulsão.</span>
                    </li>
                </ul>
            </div>

        </div>
      </div>
    </section>
  );
}