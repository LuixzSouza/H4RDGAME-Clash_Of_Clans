"use client";

import { Archive, Users, Plus, X, Trophy, Crown, Coins, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// --- TIPAGEM (Exportada para ser usada na Page) ---
export interface Member {
  id: string; // Adicionado ID aqui para garantir compatibilidade
  name: string;
  tag: string;
  role: string;
  avatarSeed: string | null;
}

export interface Participant {
  id: string;
  memberId: string;
  tickets: number;
  member: Member;
}

// Interface compatível com o Prisma e o Modal de Edição
export interface FinanceEvent {
  id: string;
  title: string;
  ticketPrice: number;
  goalAmount: number | null;
  status: string;
  updatedAt: Date | string; // <--- ADICIONADO PARA CORRIGIR O ERRO
  participations: Participant[];
}

interface EventCardProps {
  event: FinanceEvent;
  isAdmin: boolean;
  onAddParticipant: (eventId: string) => void;
  onIncreaseTicket: (eventId: string, memberId: string) => void;
  onDecreaseTicket: (eventId: string, memberId: string) => void;
  onToggleStatus: (eventId: string) => void;
  onEditEvent: (event: FinanceEvent) => void; 
}

export function EventCard({ 
  event, 
  isAdmin, 
  onAddParticipant, 
  onIncreaseTicket, 
  onDecreaseTicket, 
  onToggleStatus,
  onEditEvent 
}: EventCardProps) {
  
  // --- CÁLCULOS ---
  const totalRaised = event.participations.reduce((acc, p) => acc + (p.tickets * event.ticketPrice), 0);
  
  const progress = event.goalAmount 
    ? Math.min((totalRaised / event.goalAmount) * 100, 100) 
    : 0;
    
  const uniqueParticipants = event.participations.length;

  const topContributor = event.participations.length > 0 
    ? [...event.participations].sort((a, b) => b.tickets - a.tickets)[0] 
    : null;

  return (
    <Card className="bg-[#1e202b] border-[#2f3245] shadow-2xl overflow-hidden flex flex-col h-full relative group transition-all hover:border-slate-600">
      
      <div className="absolute top-0 left-0 w-full h-1.5 bg-[#15161e]">
        <div 
            className="h-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-orange-500 shadow-[0_0_10px_rgba(234,179,8,0.5)] transition-all duration-1000 ease-out" 
            style={{ width: `${event.goalAmount ? progress : 100}%` }} 
        />
      </div>

      <CardHeader className="pb-2 pt-6">
        <div className="flex justify-between items-start gap-4">
          
          <div className="space-y-1 overflow-hidden">
            <CardTitle className="text-xl text-white font-bold tracking-wide leading-tight truncate" title={event.title}>
                {event.title}
            </CardTitle>
            <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-[#15161e] border-[#2f3245] text-slate-400 font-mono text-[10px] tracking-wider">
                   COTA: <span className="text-green-400 ml-1 font-bold">R$ {event.ticketPrice.toFixed(2)}</span>
                </Badge>
                {event.status === 'CLOSED' && <Badge variant="destructive" className="text-[10px]">ENCERRADO</Badge>}
            </div>
          </div>
          
          {isAdmin && (
            <div className="flex items-center -mr-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => onEditEvent(event)} 
                                className="text-slate-500 hover:text-yellow-400 hover:bg-yellow-950/20" 
                            >
                                <Edit className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900 border-slate-800 text-white"><p>Editar Dados</p></TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => onToggleStatus(event.id)} 
                                className="text-slate-500 hover:text-red-400 hover:bg-red-950/20" 
                            >
                                <Archive className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-red-900 border-red-800 text-white"><p>Arquivar/Desarquivar</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 flex-1 flex flex-col">
        
        <div className="relative bg-gradient-to-br from-[#15161e] to-[#0b0d14] p-5 rounded-xl border border-[#2f3245] overflow-hidden group/stats">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/stats:opacity-10 transition-opacity pointer-events-none">
                <Coins className="w-24 h-24 text-yellow-500" />
            </div>

            <div className="relative z-10 flex justify-between items-end">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Total Arrecadado</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-white drop-shadow-md">
                            <span className="text-green-500 text-lg mr-1">R$</span>
                            {totalRaised.toFixed(2)}
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Meta</p>
                    {event.goalAmount ? (
                        <div className="text-sm font-bold text-yellow-500">
                            {progress.toFixed(0)}% <span className="text-slate-600 text-[10px] ml-1">/ R$ {event.goalAmount}</span>
                        </div>
                    ) : (
                        <span className="text-xs text-slate-600 font-medium">--</span>
                    )}
                </div>
            </div>
        </div>

        {topContributor && topContributor.tickets > 0 && (
            <div className="bg-yellow-900/10 border border-yellow-700/30 rounded-lg p-2 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-yellow-500/20 p-1.5 rounded-full">
                    <Crown className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-yellow-600 font-bold uppercase tracking-wide">Top Apoiador</p>
                    <p className="text-sm text-yellow-100 font-bold truncate">{topContributor.member.name}</p>
                </div>
                <div className="text-xs font-bold text-yellow-500 bg-yellow-900/40 px-2 py-1 rounded border border-yellow-500/20">
                    {topContributor.tickets} Cotas
                </div>
            </div>
        )}

        <div className="flex-1 flex flex-col min-h-[220px]">
          <div className="flex justify-between items-center mb-3 px-1">
            <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              <Users className="w-3 h-3" /> Membros ({uniqueParticipants})
            </h4>
            {isAdmin && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-[10px] text-green-400 hover:text-white hover:bg-green-900/30 px-2 rounded-full border border-green-900/30 hover:border-green-500 transition-colors" 
                onClick={() => onAddParticipant(event.id)}
              >
                <Plus className="w-3 h-3 mr-1" /> Adicionar
              </Button>
            )}
          </div>

          <div className="flex-1 bg-[#15161e] rounded-xl border border-[#2f3245] relative overflow-hidden">
            <div className="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent p-2 space-y-1">
              
              {event.participations.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-3 opacity-60">
                  <Trophy className="w-10 h-10" />
                  <p className="text-xs font-medium text-center px-4">A lista de apoiadores está vazia.</p>
                </div>
              ) : (
                event.participations.map((p) => (
                  <div key={p.id} className="flex justify-between items-center bg-[#1e202b]/50 hover:bg-[#252836] p-2 rounded-lg border border-transparent hover:border-slate-700 transition-all group/item">
                    
                    <div className="flex items-center gap-3 overflow-hidden">
                      <Avatar className="h-8 w-8 border border-[#2f3245] shadow-sm">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.member.avatarSeed || p.member.name}`} />
                        <AvatarFallback className="text-[10px] bg-slate-800 text-slate-400">{p.member.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-200 block truncate">{p.member.name}</span>
                        <span className="text-[9px] text-slate-500 font-mono truncate">{p.member.tag}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded border border-[#2f3245] min-w-[3rem] justify-center">
                        <span className="text-xs font-bold text-yellow-500">{p.tickets}</span>
                        <span className="text-[9px] text-slate-600 hidden sm:inline">un</span>
                      </div>
                      
                      {isAdmin && (
                        <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                          <button 
                            onClick={() => onIncreaseTicket(event.id, p.memberId)} 
                            className="p-1 hover:bg-green-900/30 rounded text-green-500 transition-colors"
                            title="Adicionar +1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => onDecreaseTicket(event.id, p.memberId)} 
                            className="p-1 hover:bg-red-900/30 rounded text-red-500 transition-colors"
                            title="Remover 1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}