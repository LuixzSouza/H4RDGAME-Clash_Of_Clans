"use client";

import { RefreshCw, Plus, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MembersHeaderProps {
  isHighCommand: boolean;
  canRecruit: boolean;
  isSyncing: boolean;
  onSync: () => void;
  onRecruit: () => void;
}

export function MembersHeader({ 
  isHighCommand, 
  canRecruit, 
  isSyncing, 
  onSync, 
  onRecruit 
}: MembersHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#1e202b]/50 p-6 rounded-2xl border border-[#2f3245] shadow-lg backdrop-blur-sm">
      <div className="space-y-1">
         {/* Breadcrumb Simples */}
         <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3"/>
            <span className="text-yellow-500">Membros</span>
         </div>
         
         <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg hidden sm:block">
                <Users className="w-6 h-6 text-yellow-500"/>
            </div>
            <div>
                <h1 className="text-3xl font-bold text-white drop-shadow-md font-heading leading-none">Quartel General</h1>
                <p className="text-slate-400 font-medium text-sm mt-1">Gestão tática e controle de efetivo do clã.</p>
            </div>
         </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
         {isHighCommand && (
           <Button 
             onClick={onSync} 
             disabled={isSyncing} 
             variant="outline" 
             className="h-12 border-blue-900/50 bg-blue-950/20 text-blue-400 hover:bg-blue-900/30 hover:text-blue-300 hover:border-blue-500/50 transition-all shadow-lg"
           >
             <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} /> 
             {isSyncing ? "Sincronizando..." : "Sincronizar Dados"}
           </Button>
         )}
         {canRecruit && (
           <Button 
             onClick={onRecruit} 
             className="h-12 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white font-bold shadow-xl border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1 transition-all"
           >
             <Plus className="w-5 h-5 mr-2" /> Recrutar Guerreiro
           </Button>
         )}
      </div>
    </div>
  );
}