"use client";

import { Users, Shield, Zap, Crown, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Member } from "./types";

interface MembrosStatsProps {
  members: Member[];
}

export function MembrosStats({ members }: MembrosStatsProps) {
  
  // 1. Cálculos de Efetivo
  const totalMembers = members.length;
  const maxCapacity = 50;
  const capacityPercentage = (totalMembers / maxCapacity) * 100;

  // 2. Cálculos de Guerra (Inteligência)
  const warReadyCount = members.filter(m => m.warStatus === 'IN').length;
  
  // Calcula o maior tamanho de guerra possível (múltiplos de 5 comuns)
  const getWarSize = (count: number) => {
    if (count >= 50) return "50v50";
    if (count >= 40) return "40v40";
    if (count >= 30) return "30v30";
    if (count >= 25) return "25v25";
    if (count >= 20) return "20v20";
    if (count >= 15) return "15v15";
    if (count >= 10) return "10v10";
    return "Insuficiente";
  };
  const possibleWarSize = getWarSize(warReadyCount);

  // 3. Cálculos de Atividade (24h)
  const activeLast24h = members.filter(m => {
    if (!m.lastSeen) return false;
    const oneDay = 1000 * 60 * 60 * 24;
    return (new Date().getTime() - new Date(m.lastSeen).getTime()) < oneDay;
  }).length;
  const activityRate = totalMembers > 0 ? Math.round((activeLast24h / totalMembers) * 100) : 0;

  // 4. Cálculos de Força (Elite TH15+)
  const eliteCount = members.filter(m => m.thLevel >= 15).length;
  const avgTh = totalMembers > 0 
    ? (members.reduce((acc, curr) => acc + curr.thLevel, 0) / totalMembers).toFixed(1)
    : "0";

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Efetivo e Capacidade */}
        <Card className="bg-[#1e202b] border-[#2f3245] shadow-lg relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 h-1 bg-blue-600 transition-all duration-1000" style={{ width: `${capacityPercentage}%` }} />
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20 transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Lotação</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-white">{totalMembers}</p>
                  <span className="text-slate-600 text-sm font-medium">/50</span>
                </div>
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-slate-600 hover:text-blue-400 transition-colors cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="bg-[#0b0d14] border-slate-800 text-white">
                <p>{50 - totalMembers} vagas disponíveis</p>
              </TooltipContent>
            </Tooltip>
          </CardContent>
        </Card>

        {/* Card 2: Potencial de Guerra */}
        <Card className="bg-[#1e202b] border-[#2f3245] shadow-lg relative overflow-hidden group">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-500/10 text-green-500 group-hover:bg-green-500/20 transition-colors">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Escalação</p>
                <div className="flex flex-col">
                  <p className="text-2xl font-bold text-white">{warReadyCount} <span className="text-sm font-normal text-slate-500">IN</span></p>
                  <span className="text-[10px] text-green-400 font-bold uppercase tracking-wide">
                    Sugestão: {possibleWarSize}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Atividade Recente (Pulse) */}
        <Card className="bg-[#1e202b] border-[#2f3245] shadow-lg relative overflow-hidden group">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-yellow-500/10 text-yellow-500 group-hover:bg-yellow-500/20 transition-colors">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Online (24h)</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-white">{activeLast24h}</p>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${activityRate > 50 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {activityRate}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Força de Elite */}
        <Card className="bg-[#1e202b] border-[#2f3245] shadow-lg relative overflow-hidden group">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-500/10 text-purple-500 group-hover:bg-purple-500/20 transition-colors">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Elite (TH15+)</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-white">{eliteCount}</p>
                  <span className="text-slate-500 text-xs font-medium">Média: TH{avgTh}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </TooltipProvider>
  );
}