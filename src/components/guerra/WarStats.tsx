import { useState, useEffect, useMemo } from "react";
import { Star, Skull, Swords, Crown, Clock, Trophy, TrendingUp, AlertTriangle } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { WarData, AttackData } from "./types";

// Função auxiliar para formatar duração
const formatDuration = (ms: number) => {
  if (ms <= 0) return "Finalizada";
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

export function WarStats({ activeWar }: { activeWar: WarData }) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isUrgent, setIsUrgent] = useState(false);

  // 1. Timer em Tempo Real
  useEffect(() => {
    const updateTimer = () => {
      const endDate = new Date(activeWar.endDate).getTime();
      const now = new Date().getTime();
      const diff = endDate - now;

      setTimeLeft(formatDuration(diff));
      setIsUrgent(diff > 0 && diff < 1000 * 60 * 60 * 4); // Menos de 4h
    };

    updateTimer(); // Chama na hora
    const interval = setInterval(updateTimer, 60000); // Atualiza a cada minuto

    return () => clearInterval(interval);
  }, [activeWar.endDate]);

  // 2. Cálculos Memorizados (Performance)
  const stats = useMemo(() => {
    const attacks = activeWar.attacks || [];
    const totalAttacks = activeWar.size * (activeWar.isLeague ? 1 : 2);
    const usedAttacks = attacks.length;
    
    // Estrelas
    const currentStars = attacks.reduce((acc, curr) => acc + curr.stars, 0);
    const maxStars = activeWar.size * 3;
    
    // Destruição
    const totalDestruction = attacks.reduce((acc, curr) => acc + curr.destruction, 0);
    const avgDestruction = usedAttacks > 0 ? totalDestruction / usedAttacks : 0;
    
    // Taxa de PT (3 Estrelas)
    const triples = attacks.filter(a => a.stars === 3).length;
    const tripleRate = usedAttacks > 0 ? (triples / usedAttacks) * 100 : 0;

    return {
      currentStars,
      maxStars,
      starPercentage: (currentStars / maxStars) * 100,
      avgDestruction,
      usedAttacks,
      totalAttacks,
      attacksLeft: totalAttacks - usedAttacks,
      attackPercentage: (usedAttacks / totalAttacks) * 100,
      triples,
      tripleRate
    };
  }, [activeWar]);

  // Helpers de Cor
  const getScoreColor = (value: number) => {
    if (value >= 90) return "text-success";
    if (value >= 70) return "text-primary";
    return "text-destructive";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* --- 1. ESTRELAS & PTs --- */}
      <div className="panel-clash overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        <CardHeader className="pb-2 relative z-10">
           <div className="flex justify-between items-center">
             <CardTitle className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
               <Trophy className="w-4 h-4"/> Desempenho
             </CardTitle>
             <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                {stats.triples} PTs
             </Badge>
           </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-black text-white">{stats.currentStars}</span>
            <span className="text-sm font-medium text-muted-foreground">/ {stats.maxStars}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Estrelas Totais</span>
            <span className="text-primary font-bold">{stats.starPercentage.toFixed(1)}%</span>
          </div>
          <Progress 
            value={stats.starPercentage} 
            className="h-2 bg-background" 
            indicatorClassName="bg-gradient-to-r from-primary to-primary" 
          />
        </CardContent>
      </div>
      
      {/* --- 2. DESTRUIÇÃO --- */}
      <div className="panel-clash overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent pointer-events-none" />
        <CardHeader className="pb-2 relative z-10">
           <CardTitle className="text-xs font-bold text-destructive uppercase tracking-widest flex items-center gap-2">
             <Skull className="w-4 h-4"/> Danos Médios
           </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex items-baseline gap-2 mb-1">
            <span className={`text-3xl font-black ${getScoreColor(stats.avgDestruction)}`}>
                {stats.avgDestruction.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Por Ataque</span>
            {stats.avgDestruction >= 95 && <span className="text-success font-bold flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Brutal</span>}
          </div>
          <Progress 
            value={stats.avgDestruction} 
            className="h-2 bg-background" 
            indicatorClassName={`transition-all duration-1000 ${
                stats.avgDestruction > 85 ? 'bg-gradient-to-r from-success to-success' : 
                stats.avgDestruction > 50 ? 'bg-gradient-to-r from-primary to-primary' : 
                'bg-gradient-to-r from-destructive to-destructive'
            }`} 
          />
        </CardContent>
      </div>

      {/* --- 3. ATAQUES --- */}
      <div className="panel-clash overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        <CardHeader className="pb-2 relative z-10">
           <div className="flex justify-between items-center">
             <CardTitle className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
               <Swords className="w-4 h-4"/> Ofensiva
             </CardTitle>
             <span className="text-[10px] font-mono text-muted-foreground">
                {stats.usedAttacks}/{stats.totalAttacks}
             </span>
           </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-black text-white">{stats.attacksLeft}</span>
            <span className="text-sm font-bold text-muted-foreground uppercase">Restantes</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Participação</span>
            <span className="text-primary font-bold">{stats.attackPercentage.toFixed(0)}%</span>
          </div>
          <Progress 
            value={stats.attackPercentage} 
            className="h-2 bg-background" 
            indicatorClassName="bg-primary" 
          />
        </CardContent>
      </div>

      {/* --- 4. TEMPO --- */}
      <div className={`panel-clash overflow-hidden relative ${timeLeft === "Finalizada" ? 'opacity-60 grayscale' : ''}`}>
        <div className={`absolute inset-0 bg-gradient-to-br pointer-events-none ${isUrgent ? 'from-destructive/10' : 'from-success/10'}`} />
        <CardHeader className="pb-2 relative z-10">
           <CardTitle className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${isUrgent ? 'text-destructive' : 'text-success'}`}>
             <Clock className="w-4 h-4"/> Status
           </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className={`text-2xl font-black uppercase tracking-tight mb-3 ${isUrgent ? 'text-destructive animate-pulse' : 'text-white'}`}>
            {timeLeft || "Calculando..."}
          </div>
          
          {timeLeft === "Finalizada" ? (
             <Badge variant="outline" className="w-full justify-center bg-muted border-border text-muted-foreground">
                Guerra Encerrada
             </Badge>
          ) : (
             <div className="flex items-center gap-2">
                {isUrgent ? (
                    <Badge variant="destructive" className="w-full justify-center animate-pulse">
                        <AlertTriangle className="w-3 h-3 mr-1"/> Reta Final
                    </Badge>
                ) : (
                    <Badge variant="outline" className="w-full justify-center bg-success/10 border-success/30 text-success">
                        <Crown className="w-3 h-3 mr-1"/> Em Andamento
                    </Badge>
                )}
             </div>
          )}
        </CardContent>
      </div>
    </div>
  );
}