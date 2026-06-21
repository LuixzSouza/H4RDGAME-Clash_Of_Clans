"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, User, Shield, ShieldAlert, Ticket } from "lucide-react";

interface ActionPanelProps {
  isAdmin: boolean;
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
      <div className="panel-clash p-6 overflow-hidden">
        <Sparkles className="absolute right-4 top-4 w-20 h-20 text-primary/[0.07] pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3 mb-1">
          <div className="h-10 w-10 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">Ordem de Comando Rápida</h3>
            <p className="text-muted-foreground text-xs">Mobilize o clã no WhatsApp/Discord.</p>
          </div>
        </div>

        <div className="relative z-10 mt-4">
          <div className="bg-background p-4 rounded-xl border border-border text-foreground/80 font-mono text-xs mb-4 leading-relaxed shadow-inner">
            {quickWarText}
          </div>
          <button onClick={copyQuickText} className="btn-clash w-full text-sm">
            {copied ? (
              <><Check className="mr-2 h-4 w-4" /> Comando Copiado!</>
            ) : (
              <><Copy className="mr-2 h-4 w-4" /> Copiar Ordem</>
            )}
          </button>
        </div>
      </div>
    );
  }

  // --- VISÃO DE MEMBRO (Cartão de Identidade) ---
  const inWar = currentUser?.warStatus === "IN";
  return (
    <div className="panel-clash overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 border-b border-border bg-secondary/40">
        <h3 className="text-white flex items-center gap-2 text-lg font-bold">
          <User className="w-5 h-5 text-primary" /> Identidade Tática
        </h3>
        <span className="eyebrow !py-0.5">Ativo</span>
      </div>

      <div className="p-6 grid grid-cols-2 gap-4">
        {/* Status de Guerra */}
        <div
          className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
            inWar ? "bg-success/10 border-success/30" : "bg-destructive/10 border-destructive/30"
          }`}
        >
          <div className={`p-2 rounded-full ${inWar ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}`}>
            {inWar ? <Shield className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Status Guerra</p>
            <p className={`text-lg font-black ${inWar ? "text-success" : "text-destructive"}`}>
              {inWar ? "CONFIRMADO" : "INDISPONÍVEL"}
            </p>
          </div>
        </div>

        {/* Cotas */}
        <div className="plaque p-4 flex flex-col items-center justify-center gap-2">
          <div className="p-2 rounded-full bg-primary/20 text-primary">
            <Ticket className="w-5 h-5" />
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Minhas Cotas</p>
            <p className="text-lg font-black text-white">
              {currentUser?.activeTickets || 0} <span className="text-xs font-medium text-muted-foreground">un</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
