import { Megaphone, Radio } from "lucide-react";

export function ToolHeader() {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-card p-6 rounded-xl border border-border shadow-lg relative overflow-hidden">
        
        {/* Elemento Decorativo de Fundo */}
        <Megaphone className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 rotate-12 pointer-events-none" />

        <div className="flex items-start gap-4 relative z-10">
            {/* Emblema em destaque */}
            <div className="hidden sm:flex shrink-0 h-12 w-12 rounded-xl rotate-45 bg-gradient-to-br from-amber-300 to-amber-700 border-2 border-amber-800/60 items-center justify-center shadow-[0_4px_14px_-2px_rgba(240,169,43,0.5)]">
                <Megaphone className="w-5 h-5 text-amber-950 -rotate-45" />
            </div>

            <div>
                <div className="eyebrow mb-2">Liderança</div>
                <h1 className="text-2xl md:text-4xl clash-title leading-none">
                    Centro de Comunicação
                </h1>
                <p className="text-muted-foreground text-sm max-w-xl leading-relaxed mt-2">
                    Envie ordens táticas, coordene guerras e padronize a comunicação do clã.
                    <span className="text-muted-foreground/80"> Mensagens claras vencem batalhas.</span>
                </p>
            </div>
        </div>

        {/* Indicador de Status (Visual) */}
        <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-lg border border-border relative z-10">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
            </span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                Sistema Online
                <Radio className="w-3 h-3 text-muted-foreground" />
            </span>
        </div>
    </div>
  );
}