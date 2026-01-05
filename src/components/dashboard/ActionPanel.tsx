"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, User, Shield, ShieldAlert, Wallet, Ticket } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ActionPanelProps {
  isAdmin: boolean;
  // CORREÇÃO AQUI: Mudamos 'tickets' para 'activeTickets' para bater com o DashboardPage
  currentUser: { activeTickets: number; warStatus: string } | null;
  quickWarText: string;
}

export function ActionPanel({ isAdmin, currentUser, quickWarText }: ActionPanelProps) {
  const [copied, setCopied] = useState(false);

  const copyQuickText = () => {
    navigator.clipboard.writeText(quickWarText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- VISÃO DE ADMINISTRADOR ---
  if (isAdmin) {
    return (
        <Card className="bg-[#1e202b] border-[#2f3245] border-l-4 border-l-red-500 shadow-xl overflow-hidden relative">
            <div className="absolute right-0 top-0 p-3 opacity-10">
                <Sparkles className="w-20 h-20 text-red-500" />
            </div>
            <CardHeader className="pb-3 relative z-10">
                <CardTitle className="text-white flex items-center gap-2 text-lg">
                    <div className="p-2 bg-red-500/20 rounded-lg text-red-500">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    Ordem de Comando Rápida
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                    Envie este comando no WhatsApp/Discord para mobilizar o clã.
                </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="bg-[#0b0d14] p-4 rounded-xl border border-[#2f3245] text-slate-300 font-mono text-xs mb-4 leading-relaxed shadow-inner">
                    {quickWarText}
                </div>
                <Button 
                    onClick={copyQuickText}
                    className="w-full bg-red-600 hover:bg-red-500 text-white font-bold h-10 transition-all shadow-lg shadow-red-900/20"
                >
                    {copied ? <><Check className="mr-2 h-4 w-4"/> Comando Copiado!</> : <><Copy className="mr-2 h-4 w-4"/> Copiar Ordem</>}
                </Button>
            </CardContent>
        </Card>
    );
  }

  // --- VISÃO DE MEMBRO (Cartão de Identidade) ---
  return (
    <Card className="bg-[#1e202b] border-[#2f3245] border-l-4 border-l-blue-500 shadow-xl overflow-hidden">
        <CardHeader className="pb-4 bg-[#15161e] border-b border-[#2f3245]">
            <div className="flex justify-between items-center">
                <CardTitle className="text-white flex items-center gap-2 text-lg">
                    <User className="w-5 h-5 text-blue-500" /> Identidade Tática
                </CardTitle>
                <Badge variant="outline" className="border-blue-500 text-blue-500 bg-blue-500/10">ATIVO</Badge>
            </div>
        </CardHeader>
        
        <CardContent className="pt-6 grid grid-cols-2 gap-4">
            
            {/* Status de Guerra */}
            <div className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all
                ${currentUser?.warStatus === 'IN' 
                    ? 'bg-green-900/10 border-green-500/30' 
                    : 'bg-red-900/10 border-red-500/30'}`
            }>
                <div className={`p-2 rounded-full ${currentUser?.warStatus === 'IN' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
                    {currentUser?.warStatus === 'IN' ? <Shield className="w-5 h-5"/> : <ShieldAlert className="w-5 h-5"/>}
                </div>
                <div className="text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Status Guerra</p>
                    <p className={`text-lg font-black ${currentUser?.warStatus === 'IN' ? 'text-green-400' : 'text-red-400'}`}>
                        {currentUser?.warStatus === 'IN' ? 'CONFIRMADO' : 'INDISPONÍVEL'}
                    </p>
                </div>
            </div>

            {/* Status Financeiro */}
            <div className="p-4 rounded-xl border border-[#2f3245] bg-[#15161e] flex flex-col items-center justify-center gap-2">
                <div className="p-2 rounded-full bg-yellow-500/20 text-yellow-500">
                    <Ticket className="w-5 h-5"/>
                </div>
                <div className="text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Minhas Cotas</p>
                    <p className="text-lg font-black text-white">
                        {/* CORREÇÃO AQUI: Usando activeTickets */}
                        {currentUser?.activeTickets || 0} <span className="text-xs font-medium text-slate-500">un</span>
                    </p>
                </div>
            </div>

        </CardContent>
    </Card>
  );
}