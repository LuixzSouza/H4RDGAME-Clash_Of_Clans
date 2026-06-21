"use client";

import { 
  Trash2, PlayCircle, Sword, Skull, Zap, Target 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Tipo compatível
type Strategy = {
  id: string;
  title: string;
  description: string;
  thLevel: number;
  difficulty: string;
  videoUrl: string | null;
  army: string;
};

interface StrategyListProps {
  strategies: Strategy[];
  loading: boolean;
  isAdmin: boolean;
  onDelete: (id: string) => void;
  selectedTH: string;
  onAddClick: () => void;
}

export function StrategyList({
  strategies, loading, isAdmin, onDelete, selectedTH, onAddClick
}: StrategyListProps) {

  // Helper
  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case "Fácil": return "bg-success/20 text-success border-success/50";
      case "Médio": return "bg-primary/20 text-primary border-primary/50";
      case "Difícil": return "bg-destructive/20 text-destructive border-destructive/50";
      default: return "bg-muted/20 text-muted-foreground";
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-muted-foreground animate-pulse">Carregando dados do laboratório...</div>;
  }

  if (strategies.length === 0) {
    return (
        <div className="py-20 text-center flex flex-col items-center justify-center text-muted-foreground bg-card/50 rounded-xl border border-dashed border-border">
            <div className="bg-background p-6 rounded-full mb-4 border border-border">
                <Target className="w-12 h-12 opacity-20 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-muted-foreground">Nenhuma estratégia encontrada</h3>
            <p className="text-sm mt-2 max-w-md mx-auto text-muted-foreground">
                Não encontramos ataques para o CV{selectedTH} com este nome.
                {isAdmin && (
                    <>
                        <br/> 
                        <span 
                            className="text-primary cursor-pointer hover:underline" 
                            onClick={onAddClick}
                        >
                            Clique aqui para adicionar uma nova.
                        </span>
                    </>
                )}
            </p>
        </div>
    );
  }

  return (
    <div className="grid gap-6">
        {strategies.map((strat) => (
            <div key={strat.id} className="panel-clash flex flex-col md:flex-row overflow-hidden group hover:border-primary/40 transition-colors relative">
                
                {/* Botão de Excluir (Admin) */}
                {isAdmin && (
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/20 hover:text-destructive" onClick={() => onDelete(strat.id)}>
                            <Trash2 className="w-4 h-4"/>
                        </Button>
                    </div>
                )}

                {/* Lado Esquerdo: Info Principal */}
                <div className="p-6 flex-1 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className={`font-bold border px-3 py-1 ${getDifficultyColor(strat.difficulty)}`}>
                                {strat.difficulty}
                            </Badge>
                            <span className="text-xs text-muted-foreground font-mono">META TH{strat.thLevel}</span>
                        </div>
                        <CardTitle className="text-2xl text-white mb-2 group-hover:text-primary transition-colors">{strat.title}</CardTitle>
                        <CardDescription className="text-muted-foreground text-base leading-relaxed">
                            {strat.description}
                        </CardDescription>
                    </div>
                    
                    <div className="mt-6">
                        {strat.videoUrl ? (
                            <a href={strat.videoUrl} target="_blank" rel="noopener noreferrer">
                                <Button className="w-full md:w-auto bg-destructive hover:bg-destructive text-white font-bold gap-2 shadow-lg">
                                    <PlayCircle className="w-5 h-5" /> Assistir Tutorial
                                </Button>
                            </a>
                        ) : (
                            <Button disabled className="w-full md:w-auto bg-muted text-muted-foreground font-bold gap-2">
                                <PlayCircle className="w-5 h-5" /> Sem Vídeo
                            </Button>
                        )}
                    </div>
                </div>

                {/* Lado Direito: Composição do Exército */}
                <div className="p-6 w-full md:w-[400px] bg-background">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Sword className="w-4 h-4" /> Composição Sugerida
                    </h4>
                    
                    <ScrollArea className="h-full max-h-[200px]">
                        <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap bg-card p-3 rounded-lg border border-border">
                            {strat.army}
                        </div>
                        
                        <div className="mt-4 flex gap-2">
                            <div className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded border border-primary/30">
                                <Skull className="w-3 h-3"/> Tropas
                            </div>
                            <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-1 rounded border border-primary/30">
                                <Zap className="w-3 h-3"/> Feitiços
                            </div>
                        </div>
                    </ScrollArea>
                </div>

            </div>
        ))}
    </div>
  );
}