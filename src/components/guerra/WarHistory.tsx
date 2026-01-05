"use client";

import { useState, useMemo } from "react";
import { 
  Trophy, Skull, Minus, Calendar, Star, Swords, 
  Search, Filter, TrendingUp, Medal, Flame, ShieldAlert 
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { WarHistoryEntry, AttackData } from "./types";

// --- Helpers e Tipos ---

type ResultType = "win" | "loss" | "draw";

const getWarTags = (war: WarHistoryEntry, avgDest: number) => {
  const tags = [];
  if (avgDest === 100) tags.push({ label: "War Perfeita", color: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50", icon: Flame });
  else if (avgDest >= 90) tags.push({ label: "Destruição Alta", color: "bg-orange-500/20 text-orange-400 border-orange-500/50", icon: FireIcon });
  
  // Lógica simples para "Disputada" (assumindo que score é string "30-29")
  if (war.score) {
    const [us, them] = war.score.split('-').map(Number);
    if (Math.abs(us - them) <= 2) tags.push({ label: "Disputada", color: "bg-blue-500/20 text-blue-400 border-blue-500/50", icon: Swords });
  }

  return tags;
};

// Ícone fake para o exemplo acima
const FireIcon = ({className}: {className?: string}) => <Flame className={className} />;

export function WarHistory({ history }: { history: WarHistoryEntry[] }) {
  const [filter, setFilter] = useState<"all" | "win" | "loss">("all");
  const [search, setSearch] = useState("");

  // --- Lógica de Estatísticas Globais ---
  const stats = useMemo(() => {
    const total = history.length;
    const wins = history.filter(h => h.result === 'win').length;
    const winRate = total > 0 ? (wins / total) * 100 : 0;
    
    // Cálculo de Streak (Sequência Atual)
    let currentStreak = 0;
    for (let i = 0; i < history.length; i++) {
        // Assumindo que a lista vem ordenada da mais recente para a mais antiga
        if (history[i].result === 'win') currentStreak++;
        else break;
    }

    const totalStars = history.reduce((acc, curr) => acc + curr.attacks.reduce((a, b) => a + b.stars, 0), 0);
    const avgStarsPerWar = total > 0 ? (totalStars / total).toFixed(1) : "0";

    return { winRate, currentStreak, avgStarsPerWar, total };
  }, [history]);

  // --- Filtragem da Lista ---
  const filteredHistory = useMemo(() => {
    return history.filter(war => {
      const matchesFilter = filter === "all" || war.result === filter;
      const matchesSearch = war.opponentName.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [history, filter, search]);

  return (
    <div className="space-y-6">
      
      {/* 1. Dashboard de Performance (HUD) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard 
            label="Win Rate" 
            value={`${stats.winRate.toFixed(0)}%`} 
            icon={<Trophy className="w-4 h-4 text-yellow-500"/>}
            subtext="Taxa de Vitória"
        />
        <StatsCard 
            label="Sequência" 
            value={stats.currentStreak.toString()} 
            icon={<Flame className="w-4 h-4 text-orange-500"/>}
            subtext="Vitórias seguidas"
        />
        <StatsCard 
            label="Média Estrelas" 
            value={stats.avgStarsPerWar} 
            icon={<Star className="w-4 h-4 text-purple-500"/>}
            subtext="Por guerra"
        />
        <StatsCard 
            label="Total Guerras" 
            value={stats.total.toString()} 
            icon={<Swords className="w-4 h-4 text-blue-500"/>}
            subtext="Registradas"
        />
      </div>

      {/* 2. Lista Principal */}
      <Card className="bg-[#1e202b] border-[#2f3245] shadow-xl">
        <CardHeader className="border-b border-[#2f3245] py-4 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h3 className="font-bold text-white flex items-center gap-2 text-lg">
                <Swords className="w-5 h-5 text-blue-500"/> Histórico de Batalhas
            </h3>
            
            {/* Controles de Filtro */}
            <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-48">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <Input 
                        placeholder="Buscar clã..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 bg-[#15161e] border-[#2f3245] text-white focus-visible:ring-blue-500 h-9"
                    />
                </div>
              <Select 
                  value={filter} 
                  onValueChange={(value) => setFilter(value as "all" | "win" | "loss")}
              >
                  <SelectTrigger className="w-[110px] bg-[#15161e] border-[#2f3245] text-white h-9">
                      <div className="flex items-center gap-2">
                          <Filter className="w-3 h-3"/> 
                          <SelectValue />
                      </div>
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e202b] border-[#2f3245] text-white">
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="win">Vitórias</SelectItem>
                      <SelectItem value="loss">Derrotas</SelectItem>
                  </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {filteredHistory.length > 0 ? (
            <ScrollArea className="h-[600px] pr-2">
               <Accordion type="single" collapsible className="w-full">
                  {filteredHistory.map((war) => (
                      <HistoryItem key={war.id} war={war} />
                  ))}
               </Accordion>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 gap-3">
                <ShieldAlert className="w-12 h-12 opacity-20" />
                <p>Nenhuma batalha encontrada com estes filtros.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// --- Sub-componente: Item da Lista (Row) ---
function HistoryItem({ war }: { war: WarHistoryEntry }) {
    // Cálculos por Guerra
    const totalDestruction = war.attacks.reduce((acc, curr) => acc + curr.destruction, 0);
    const avgDest = war.attacks.length > 0 ? totalDestruction / war.attacks.length : 0;
    const totalStars = war.attacks.reduce((acc, curr) => acc + curr.stars, 0);
    
    // Identificar MVP (Quem deu PT com maior destruction ou apenas stars)
    const mvp = war.attacks.length > 0 
        ? war.attacks.reduce((prev, current) => (prev.stars > current.stars) ? prev : current)
        : null;

    // Estilos Visuais
    const getResultStyle = (result: string | null) => {
        switch (result) {
            case "win": return { border: "border-l-green-500", text: "text-green-500", bg: "hover:bg-green-500/5", badge: "bg-green-500/20 text-green-400" };
            case "loss": return { border: "border-l-red-500", text: "text-red-500", bg: "hover:bg-red-500/5", badge: "bg-red-500/20 text-red-400" };
            default: return { border: "border-l-slate-500", text: "text-slate-400", bg: "hover:bg-slate-500/5", badge: "bg-slate-500/20 text-slate-400" };
        }
    };
    
    const style = getResultStyle(war.result);
    const tags = getWarTags(war, avgDest);

    return (
        <AccordionItem value={war.id} className="border-b border-[#2f3245]">
            <AccordionTrigger className={`px-4 py-4 hover:no-underline transition-colors ${style.bg} border-l-4 ${style.border}`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 pr-4">
                    
                    {/* Infos Principais */}
                    <div className="flex items-center gap-4 text-left">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-lg">{war.opponentName}</span>
                                {war.isLeague && <Badge variant="secondary" className="text-[10px] bg-purple-500/20 text-purple-300 border-purple-500/30">CWL</Badge>}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                <Calendar className="w-3 h-3"/>
                                {new Date(war.endDate).toLocaleDateString('pt-BR')}
                                <span className="mx-1">•</span>
                                {war.size} vs {war.size}
                            </div>
                        </div>
                    </div>

                    {/* Stats Resumidos */}
                    <div className="flex items-center gap-6 sm:gap-8 w-full sm:w-auto justify-between sm:justify-end">
                         {/* Tags Dinâmicas (escondidas em mobile muito pequeno) */}
                         <div className="hidden md:flex gap-1">
                            {tags.map((tag, i) => (
                                <Badge key={i} variant="outline" className={`text-[10px] h-5 ${tag.color}`}>
                                    <tag.icon className="w-3 h-3 mr-1"/> {tag.label}
                                </Badge>
                            ))}
                         </div>

                        <div className="text-right min-w-[60px]">
                            <span className="text-[10px] text-slate-500 font-bold uppercase block">Placar</span>
                            <span className={`text-xl font-black ${style.text}`}>{war.score || "-"}</span>
                        </div>
                        
                        <div className="text-right hidden sm:block">
                             <div className="flex items-center justify-end gap-1 text-yellow-500 font-bold">
                                <Star className="w-4 h-4 fill-current"/> {totalStars}
                             </div>
                             <div className="text-[10px] text-slate-500">
                                {avgDest.toFixed(1)}% Dest.
                             </div>
                        </div>
                    </div>
                </div>
            </AccordionTrigger>
            
            <AccordionContent className="bg-[#15161e] px-4 py-4 border-t border-[#2f3245]/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Coluna 1: Métricas Detalhadas */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <TrendingUp className="w-4 h-4"/> Estatísticas da Guerra
                        </h4>
                        
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-xs mb-1 text-slate-300">
                                    <span>Destruição Total</span>
                                    <span className="font-bold">{avgDest.toFixed(1)}%</span>
                                </div>
                                <Progress value={avgDest} className="h-2 bg-[#2f3245]" indicatorClassName={avgDest > 90 ? "bg-green-500" : "bg-yellow-500"} />
                            </div>
                            
                            <div className="flex justify-between items-center p-3 bg-[#1e202b] rounded-lg border border-[#2f3245]">
                                <span className="text-sm text-slate-400">Total de Ataques</span>
                                <span className="font-bold text-white">{war.attacks.length} <span className="text-slate-500 text-xs">/ {war.size * (war.isLeague ? 1 : 2)}</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Coluna 2: MVP */}
                    <div className="space-y-2">
                         <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Medal className="w-4 h-4 text-yellow-500"/> MVP da Batalha
                        </h4>
                        {mvp ? (
                            <div className="flex items-center gap-3 p-3 bg-[#1e202b] rounded-lg border border-yellow-500/20 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
                                <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-400">
                                    {/* Placeholder para foto se tivesse */}
                                    {mvp.memberId ? "JG" : "?"} 
                                </div>
                                <div>
                                    <div className="text-white font-bold text-sm">Guerreiro #{mvp.memberId}</div> {/* Idealmente buscar nome pelo ID */}
                                    <div className="text-xs text-yellow-500 flex items-center gap-2">
                                        <span className="flex items-center"><Star className="w-3 h-3 fill-current mr-0.5"/> {mvp.stars}</span>
                                        <span className="text-slate-500">•</span>
                                        <span>{mvp.destruction}% Destruição</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-slate-500 italic">Dados insuficientes para calcular MVP.</p>
                        )}
                        
                        <div className="mt-4 pt-2 border-t border-[#2f3245]">
                             <p className="text-[10px] text-slate-500 text-center">
                                ID da Guerra: <span className="font-mono text-slate-400">{war.id.substring(0,8)}...</span>
                             </p>
                        </div>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}

// --- Sub-componente: Card do Dashboard ---
function StatsCard({label, value, icon, subtext}: {label: string, value: string, icon: React.ReactNode, subtext: string}) {
    return (
        <Card className="bg-[#1e202b] border-[#2f3245] shadow-lg">
            <CardContent className="p-4 flex flex-col gap-1">
                <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
                    {icon}
                </div>
                <div className="text-2xl font-black text-white mt-1">{value}</div>
                <div className="text-[10px] text-slate-500 truncate">{subtext}</div>
            </CardContent>
        </Card>
    )
}