import { useState, useEffect, useMemo } from "react";
import { Star, Skull, Swords, Crown, Clock, Trophy, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    if (value >= 90) return "text-green-400";
    if (value >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* --- 1. ESTRELAS & PTs --- */}
      <Card className="bg-[#1e202b] border-[#2f3245] overflow-hidden relative shadow-lg group">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent pointer-events-none" />
        <CardHeader className="pb-2 relative z-10">
           <div className="flex justify-between items-center">
             <CardTitle className="text-xs font-bold text-yellow-500 uppercase tracking-widest flex items-center gap-2">
               <Trophy className="w-4 h-4"/> Desempenho
             </CardTitle>
             <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-[10px]">
                {stats.triples} PTs
             </Badge>
           </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-black text-white">{stats.currentStars}</span>
            <span className="text-sm font-medium text-slate-500">/ {stats.maxStars}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Estrelas Totais</span>
            <span className="text-yellow-500 font-bold">{stats.starPercentage.toFixed(1)}%</span>
          </div>
          <Progress 
            value={stats.starPercentage} 
            className="h-2 bg-[#15161e]" 
            indicatorClassName="bg-gradient-to-r from-yellow-600 to-yellow-400" 
          />
        </CardContent>
      </Card>
      
      {/* --- 2. DESTRUIÇÃO --- */}
      <Card className="bg-[#1e202b] border-[#2f3245] overflow-hidden relative shadow-lg group">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
        <CardHeader className="pb-2 relative z-10">
           <CardTitle className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
             <Skull className="w-4 h-4"/> Danos Médios
           </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex items-baseline gap-2 mb-1">
            <span className={`text-3xl font-black ${getScoreColor(stats.avgDestruction)}`}>
                {stats.avgDestruction.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Por Ataque</span>
            {stats.avgDestruction >= 95 && <span className="text-green-500 font-bold flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Brutal</span>}
          </div>
          <Progress 
            value={stats.avgDestruction} 
            className="h-2 bg-[#15161e]" 
            indicatorClassName={`transition-all duration-1000 ${
                stats.avgDestruction > 85 ? 'bg-gradient-to-r from-green-600 to-green-400' : 
                stats.avgDestruction > 50 ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' : 
                'bg-gradient-to-r from-red-600 to-red-400'
            }`} 
          />
        </CardContent>
      </Card>

      {/* --- 3. ATAQUES --- */}
      <Card className="bg-[#1e202b] border-[#2f3245] overflow-hidden relative shadow-lg group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
        <CardHeader className="pb-2 relative z-10">
           <div className="flex justify-between items-center">
             <CardTitle className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
               <Swords className="w-4 h-4"/> Ofensiva
             </CardTitle>
             <span className="text-[10px] font-mono text-slate-500">
                {stats.usedAttacks}/{stats.totalAttacks}
             </span>
           </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-black text-white">{stats.attacksLeft}</span>
            <span className="text-sm font-bold text-slate-500 uppercase">Restantes</span>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Participação</span>
            <span className="text-blue-400 font-bold">{stats.attackPercentage.toFixed(0)}%</span>
          </div>
          <Progress 
            value={stats.attackPercentage} 
            className="h-2 bg-[#15161e]" 
            indicatorClassName="bg-blue-500" 
          />
        </CardContent>
      </Card>

      {/* --- 4. TEMPO --- */}
      <Card className={`bg-[#1e202b] border-[#2f3245] overflow-hidden relative shadow-lg ${timeLeft === "Finalizada" ? 'opacity-60 grayscale' : ''}`}>
        <div className={`absolute inset-0 bg-gradient-to-br pointer-events-none ${isUrgent ? 'from-red-500/10' : 'from-green-500/10'}`} />
        <CardHeader className="pb-2 relative z-10">
           <CardTitle className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${isUrgent ? 'text-red-400' : 'text-green-400'}`}>
             <Clock className="w-4 h-4"/> Status
           </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className={`text-2xl font-black uppercase tracking-tight mb-3 ${isUrgent ? 'text-red-400 animate-pulse' : 'text-white'}`}>
            {timeLeft || "Calculando..."}
          </div>
          
          {timeLeft === "Finalizada" ? (
             <Badge variant="outline" className="w-full justify-center bg-slate-800 border-slate-600 text-slate-400">
                Guerra Encerrada
             </Badge>
          ) : (
             <div className="flex items-center gap-2">
                {isUrgent ? (
                    <Badge variant="destructive" className="w-full justify-center animate-pulse">
                        <AlertTriangle className="w-3 h-3 mr-1"/> Reta Final
                    </Badge>
                ) : (
                    <Badge variant="outline" className="w-full justify-center bg-green-500/10 border-green-500/30 text-green-400">
                        <Crown className="w-3 h-3 mr-1"/> Em Andamento
                    </Badge>
                )}
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}