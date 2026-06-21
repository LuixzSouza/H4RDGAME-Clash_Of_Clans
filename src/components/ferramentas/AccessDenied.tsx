import { ShieldBan, ArrowLeft, AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        
        {/* Card Principal com Efeito de Glow Vermelho */}
        <div className="bg-card relative overflow-hidden p-1 rounded-2xl border border-destructive/50 shadow-[0_0_40px_-10px_rgba(220,38,38,0.3)] max-w-md w-full animate-in fade-in zoom-in duration-300">
          
          {/* Barra de "Danger" no topo */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-destructive via-destructive to-destructive"></div>

          <div className="bg-background/50 p-8 rounded-xl backdrop-blur-sm">
            
            {/* Ícone Animado */}
            <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 bg-destructive/20 rounded-full animate-ping opacity-75"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-destructive/40 to-black rounded-full flex items-center justify-center border border-destructive/30">
                    <ShieldBan className="w-10 h-10 text-destructive" />
                </div>
            </div>

            <h2 className="text-3xl font-heading text-white mb-2 tracking-wide">
                Acesso Bloqueado
            </h2>
            
            <div className="flex items-center justify-center gap-2 mb-6">
                <AlertOctagon className="w-4 h-4 text-destructive" />
                <span className="text-xs font-mono text-destructive uppercase tracking-widest">Erro: Permissão Insuficiente</span>
            </div>

            <p className="text-muted-foreground mb-8 leading-relaxed text-sm">
              Esta área contém ferramentas táticas restritas ao Alto Comando. 
              Se você acredita que isso é um erro, contate o Líder.
            </p>

            {/* Botão de Ação */}
            <Button 
                variant="outline" 
                className="w-full border-border bg-card hover:bg-destructive/30 text-muted-foreground hover:text-white hover:border-destructive transition-all group h-12" 
                asChild
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Retornar ao Quartel General
              </Link>
            </Button>
          </div>
        </div>
    </div>
  );
}