"use client";

import Link from "next/link";
import { Megaphone, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  currentUser: { name: string; tag: string; role: string } | null;
  isAdmin: boolean;
  loading: boolean;
}

export function DashboardHeader({ currentUser, isAdmin, loading }: DashboardHeaderProps) {
  
  const roleName = (role: string) => {
    const map: Record<string, string> = { "LIDER": "Líder", "COLIDER": "Colíder", "ANCIAO": "Ancião", "MEMBRO": "Membro" };
    return map[role] || role;
  };

  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="relative bg-[#1e202b] p-6 md:p-8 rounded-2xl border border-[#2f3245] shadow-2xl overflow-hidden group">
        
        {/* Background Gradient & Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1b26] to-transparent pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
               <Badge variant="outline" className="border-yellow-600/50 text-yellow-500 bg-yellow-500/10 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider">
                 {loading ? "..." : roleName(currentUser?.role || "MEMBRO")}
               </Badge>
               <div className="h-1 w-1 bg-slate-600 rounded-full"></div>
               <span className="text-slate-500 text-xs font-mono flex items-center gap-1 uppercase">
                 <CalendarDays className="w-3 h-3" /> {today}
               </span>
            </div>
            
            <div>
                <h2 className="text-3xl md:text-5xl text-white font-heading tracking-wide leading-none">
                  {isAdmin ? "Central de Comando" : "Quartel General"}
                </h2>
                <p className="text-slate-400 font-medium mt-2 max-w-lg text-sm md:text-base leading-relaxed">
                  {isAdmin 
                    ? "Resumo tático e operacional do clã. Todas as funções administrativas estão online."
                    : `Bem-vindo, ${currentUser?.name || "Guerreiro"}. Confira seus status e as últimas ordens do dia.`
                  }
                </p>
            </div>
          </div>
          
          {/* Botão de Ação Primária */}
          {isAdmin && (
            <div className="shrink-0">
               <Button asChild className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold h-12 px-6 shadow-lg shadow-yellow-900/20 transition-all hover:scale-105">
                 <Link href="/dashboard/ferramentas">
                    <Megaphone className="mr-2 h-5 w-5" /> Criar Novo Aviso
                 </Link>
               </Button>
            </div>
          )}
        </div>
      </div>
  );
}