"use client";

import { 
  Trash2, PlayCircle, Sword, Skull, Zap, Target 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
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
      case "Fácil": return "bg-green-500/20 text-green-400 border-green-500/50";
      case "Médio": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "Difícil": return "bg-red-500/20 text-red-400 border-red-500/50";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-500 animate-pulse">Carregando dados do laboratório...</div>;
  }

  if (strategies.length === 0) {
    return (
        <div className="py-20 text-center flex flex-col items-center justify-center text-slate-500 bg-[#1e202b]/50 rounded-xl border border-dashed border-[#2f3245]">
            <div className="bg-[#15161e] p-6 rounded-full mb-4 border border-[#2f3245]">
                <Target className="w-12 h-12 opacity-20 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-300">Nenhuma estratégia encontrada</h3>
            <p className="text-sm mt-2 max-w-md mx-auto text-slate-500">
                Não encontramos ataques para o CV{selectedTH} com este nome.
                {isAdmin && (
                    <>
                        <br/> 
                        <span 
                            className="text-purple-400 cursor-pointer hover:underline" 
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
            <Card key={strat.id} className="card-clash bg-[#1e202b] border-[#2f3245] flex flex-col md:flex-row overflow-hidden group hover:border-purple-500/40 transition-colors relative">
                
                {/* Botão de Excluir (Admin) */}
                {isAdmin && (
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="text-red-400 hover:bg-red-900/20 hover:text-red-300" onClick={() => onDelete(strat.id)}>
                            <Trash2 className="w-4 h-4"/>
                        </Button>
                    </div>
                )}

                {/* Lado Esquerdo: Info Principal */}
                <div className="p-6 flex-1 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#2f3245]">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className={`font-bold border px-3 py-1 ${getDifficultyColor(strat.difficulty)}`}>
                                {strat.difficulty}
                            </Badge>
                            <span className="text-xs text-slate-500 font-mono">META TH{strat.thLevel}</span>
                        </div>
                        <CardTitle className="text-2xl text-white mb-2 group-hover:text-purple-400 transition-colors">{strat.title}</CardTitle>
                        <CardDescription className="text-slate-400 text-base leading-relaxed">
                            {strat.description}
                        </CardDescription>
                    </div>
                    
                    <div className="mt-6">
                        {strat.videoUrl ? (
                            <a href={strat.videoUrl} target="_blank" rel="noopener noreferrer">
                                <Button className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold gap-2 shadow-lg">
                                    <PlayCircle className="w-5 h-5" /> Assistir Tutorial
                                </Button>
                            </a>
                        ) : (
                            <Button disabled className="w-full md:w-auto bg-slate-700 text-slate-400 font-bold gap-2">
                                <PlayCircle className="w-5 h-5" /> Sem Vídeo
                            </Button>
                        )}
                    </div>
                </div>

                {/* Lado Direito: Composição do Exército */}
                <div className="p-6 w-full md:w-[400px] bg-[#15161e]">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Sword className="w-4 h-4" /> Composição Sugerida
                    </h4>
                    
                    <ScrollArea className="h-full max-h-[200px]">
                        <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap bg-[#1e202b] p-3 rounded-lg border border-[#2f3245]">
                            {strat.army}
                        </div>
                        
                        <div className="mt-4 flex gap-2">
                            <div className="flex items-center gap-1 text-xs text-orange-400 bg-orange-900/10 px-2 py-1 rounded border border-orange-900/30">
                                <Skull className="w-3 h-3"/> Tropas
                            </div>
                            <div className="flex items-center gap-1 text-blue-400 bg-blue-900/10 px-2 py-1 rounded border border-blue-900/30">
                                <Zap className="w-3 h-3"/> Feitiços
                            </div>
                        </div>
                    </ScrollArea>
                </div>

            </Card>
        ))}
    </div>
  );
}