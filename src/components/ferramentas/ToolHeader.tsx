import { Megaphone, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ToolHeader() {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-[#1e202b] p-6 rounded-xl border border-[#2f3245] shadow-lg relative overflow-hidden">
        
        {/* Elemento Decorativo de Fundo */}
        <Megaphone className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 rotate-12 pointer-events-none" />

        <div className="flex items-start gap-5 relative z-10">
            {/* Ícone em destaque */}
            <div className="p-3.5 bg-gradient-to-br from-yellow-500/20 to-yellow-600/5 rounded-xl border border-yellow-500/20 shadow-inner shrink-0">
                <Megaphone className="w-8 h-8 text-yellow-500" />
            </div>

            <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl md:text-3xl font-heading text-white tracking-wide">
                        Centro de Comunicação
                    </h1>
                    <Badge variant="outline" className="border-yellow-500/30 text-yellow-500 bg-yellow-500/5 text-[10px] uppercase tracking-wider h-5 hidden sm:flex">
                        Liderança
                    </Badge>
                </div>
                <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
                    Envie ordens táticas, coordene guerras e padronize a comunicação do clã. 
                    <span className="text-slate-500"> Mensagens claras vencem batalhas.</span>
                </p>
            </div>
        </div>

        {/* Indicador de Status (Visual) */}
        <div className="flex items-center gap-2 px-4 py-2 bg-[#15161e] rounded-lg border border-[#2f3245] relative z-10">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                Sistema Online
                <Radio className="w-3 h-3 text-slate-500" />
            </span>
        </div>
    </div>
  );
}