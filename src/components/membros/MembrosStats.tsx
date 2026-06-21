"use client";

import { Users, Shield, Zap, Crown, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Member } from "./types";

interface MembrosStatsProps {
  members: Member[];
}

export function MembrosStats({ members }: MembrosStatsProps) {
  // 1. Efetivo e Capacidade
  const totalMembers = members.length;
  const maxCapacity = 50;
  const capacityPercentage = (totalMembers / maxCapacity) * 100;

  // 2. Potencial de Guerra
  const warReadyCount = members.filter((m) => m.warStatus === "IN").length;
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

  // 3. Atividade (24h)
  const activeLast24h = members.filter((m) => {
    if (!m.lastSeen) return false;
    const oneDay = 1000 * 60 * 60 * 24;
    return new Date().getTime() - new Date(m.lastSeen).getTime() < oneDay;
  }).length;
  const activityRate = totalMembers > 0 ? Math.round((activeLast24h / totalMembers) * 100) : 0;

  // 4. Força de Elite (TH15+)
  const eliteCount = members.filter((m) => m.thLevel >= 15).length;
  const avgTh =
    totalMembers > 0
      ? (members.reduce((acc, curr) => acc + curr.thLevel, 0) / totalMembers).toFixed(1)
      : "0";

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Lotação */}
        <div className="panel-clash p-5 group overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">Lotação</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-black text-white">{totalMembers}</p>
                  <span className="text-muted-foreground text-sm font-medium">/50</span>
                </div>
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="bg-popover border-border text-popover-foreground">
                <p>{Math.max(0, 50 - totalMembers)} vagas disponíveis</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-primary/40 transition-all duration-1000" style={{ width: `${capacityPercentage}%` }} />
        </div>

        {/* Card 2: Escalação */}
        <div className="panel-clash p-5 group">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-success/10 border border-success/25 flex items-center justify-center text-success group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">Escalação</p>
              <p className="text-2xl font-black text-white">
                {warReadyCount} <span className="text-sm font-normal text-muted-foreground">IN</span>
              </p>
              <span className="text-[10px] text-success font-bold uppercase tracking-wide">Sugestão: {possibleWarSize}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Online (24h) */}
        <div className="panel-clash p-5 group">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">Online (24h)</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-white">{activeLast24h}</p>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${activityRate > 50 ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}`}>
                  {activityRate}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Elite */}
        <div className="panel-clash p-5 group">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">Elite (TH15+)</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-white">{eliteCount}</p>
                <span className="text-muted-foreground text-xs font-medium">Média: TH{avgTh}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
