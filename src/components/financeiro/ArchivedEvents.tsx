"use client";

import { Archive, RefreshCw, Calendar, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// 1. Definimos a estrutura dos dados (Interfaces)
interface Participation {
  tickets: number;
}

interface ArchivedEvent {
  id: string;
  title: string;
  updatedAt: Date | string; // Aceita Data ou String (comum ao vir do banco/JSON)
  ticketPrice: number;
  participations: Participation[];
}

interface ArchivedEventsProps {
  events: ArchivedEvent[]; // Substituímos 'any[]' pela interface correta
  isAdmin: boolean;
  onReopen: (eventId: string) => void;
}

export function ArchivedEvents({ events, isAdmin, onReopen }: ArchivedEventsProps) {
  if (events.length === 0) return null;

  return (
    <div className="pt-10 border-t border-[#2f3245] mt-8">
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-slate-800 rounded-lg">
            <Archive className="w-5 h-5 text-slate-400" />
        </div>
        <div>
            <h3 className="text-lg font-bold text-slate-300">Arquivo Morto</h3>
            <p className="text-xs text-slate-500">Histórico de eventos e arrecadações passadas.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {events.map((e) => {
          // 2. Agora o TypeScript sabe que 'p' tem 'tickets' e 'e' tem 'ticketPrice'
          const totalRaised = e.participations.reduce((acc, p) => acc + (p.tickets * e.ticketPrice), 0);

          return (
            <div 
                key={e.id} 
                className="group relative bg-[#0b0d14] p-4 rounded-xl border border-[#1e202b] hover:border-[#2f3245] transition-all overflow-hidden"
            >
              {/* Marca d'água de fundo */}
              <Archive className="absolute -right-4 -bottom-4 w-24 h-24 text-[#15161e] group-hover:text-[#1e202b] transition-colors -z-0 pointer-events-none" />

              <div className="relative z-10 flex justify-between items-start">
                <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-400 group-hover:text-slate-200 transition-colors line-clamp-1" title={e.title}>
                        {e.title}
                    </h4>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <Calendar className="w-3 h-3" />
                        {new Date(e.updatedAt).toLocaleDateString()}
                    </div>
                </div>

                {isAdmin && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => onReopen(e.id)} 
                                    className="h-8 w-8 text-slate-600 hover:text-yellow-500 hover:bg-yellow-900/10 -mt-1 -mr-1"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-yellow-900 border-yellow-800 text-yellow-100">
                                <p>Reabrir Evento</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
              </div>

              {/* Rodapé com Valor Final */}
              <div className="relative z-10 mt-4 pt-3 border-t border-[#1e202b] flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-600">Total Final</span>
                  <div className="flex items-center gap-1.5 text-slate-500 group-hover:text-slate-300 transition-colors">
                      <Coins className="w-3.5 h-3.5" />
                      <span className="text-sm font-mono font-bold">R$ {totalRaised.toFixed(2)}</span>
                  </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}