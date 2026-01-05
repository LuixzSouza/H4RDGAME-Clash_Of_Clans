"use client";

import { Trophy, Swords, Castle, CalendarDays, Trash2, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Tipos
type EventDB = {
  id: string;
  title: string;
  description: string;
  type: string;
  date: Date | string; // Suporta data real para o timer
};

interface EventListProps {
  events: EventDB[];
  loading: boolean;
  isAdmin: boolean;
  onDelete: (id: string) => void;
}

// Helper para calcular tempo restante de forma simples
const getTimeRemaining = (dateString: Date | string) => {
    try {
        const eventDate = new Date(dateString);
        const now = new Date();
        const total = eventDate.getTime() - now.getTime();

        if (total <= 0) return "Acontecendo agora!";
        
        const days = Math.floor(total / (1000 * 60 * 60 * 24));
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        
        if (days > 0) return `${days}d ${hours}h restantes`;
        return `${hours}h restantes`;
    } catch (e) {
        return "Data indefinida";
    }
};

export function EventList({ events, loading, isAdmin, onDelete }: EventListProps) {
  
  const getEventStyle = (type: string) => {
    switch (type) {
        case 'war': return { icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/10 border-yellow-500/30", label: "Guerra" };
        case 'games': return { icon: Swords, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30", label: "Jogos" };
        case 'raid': return { icon: Castle, color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/30", label: "Capital" };
        default: return { icon: CalendarDays, color: "text-slate-300", bg: "bg-slate-800 border-slate-700", label: "Aviso" };
    }
  };

  // Loading State
  if (loading) {
    return (
        <div className="col-span-full h-60 flex flex-col items-center justify-center text-slate-500 gap-3 animate-pulse">
            <CalendarDays className="w-10 h-10 opacity-50"/>
            <p>Carregando mural tático...</p>
        </div>
    );
  }

  // Empty State
  if (events.length === 0) {
    return (
        <div className="col-span-full text-center py-16 bg-[#1e202b] rounded-xl border border-dashed border-[#2f3245] text-slate-500 flex flex-col items-center gap-2">
            <CalendarDays className="w-12 h-12 opacity-30"/>
            <p className="font-medium">Nenhuma ordem de comando no mural.</p>
            {isAdmin && <p className="text-xs">Crie um novo aviso para começar.</p>}
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {events.map((event) => {
            const style = getEventStyle(event.type);
            const Icon = style.icon;
            const timer = getTimeRemaining(event.date);
            
            return (
              <Card key={event.id} className={`bg-[#1e202b] border ${style.bg} border-t-4 shadow-xl relative group flex flex-col hover:translate-y-[-2px] transition-transform duration-200`}>
                
                {isAdmin && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-950/20 rounded-full" onClick={() => onDelete(event.id)}>
                                    <Trash2 className="w-4 h-4"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-red-900 text-white border-red-800"><p>Apagar Aviso</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                  </div>
                )}

                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3 w-full">
                        <div className={`p-2.5 rounded-xl bg-[#15161e] border border-[#2f3245] shrink-0`}>
                            <Icon className={`w-6 h-6 ${style.color}`} />
                        </div>
                        <div className="flex flex-col w-full">
                            <div className="flex justify-between items-center w-full pr-8">
                                <Badge variant="outline" className={`${style.color} border-current opacity-70 text-[10px] uppercase tracking-wider`}>
                                    {style.label}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 font-mono bg-[#15161e] self-start px-2 py-0.5 rounded border border-[#2f3245]/50">
                                <Clock className="w-3 h-3" />
                                {timer}
                            </div>
                        </div>
                    </div>
                  </div>
                  <CardTitle className="text-white mt-4 text-xl leading-tight font-bold line-clamp-2">{event.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </CardContent>

                <CardFooter className="pt-3 border-t border-[#2f3245] bg-[#15161e]/30 mt-auto">
                    <Button variant="ghost" size="sm" className="w-full text-xs text-slate-400 hover:text-green-400 hover:bg-green-900/10 gap-2 h-8">
                        <CheckCircle2 className="w-4 h-4" /> Ciente / Participar
                    </Button>
                </CardFooter>
              </Card>
            );
        })}
    </div>
  );
}