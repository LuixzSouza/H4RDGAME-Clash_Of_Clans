"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Megaphone, CalendarDays, Swords, ChevronRight } from "lucide-react";

interface DashboardHeaderProps {
  currentUser: { name: string; tag: string; role: string } | null;
  isAdmin: boolean;
  loading: boolean;
}

export function DashboardHeader({ currentUser, isAdmin, loading }: DashboardHeaderProps) {
  const roleName = (role: string) => {
    const map: Record<string, string> = { LIDER: "Líder", COLIDER: "Colíder", ANCIAO: "Ancião", MEMBRO: "Membro" };
    return map[role] || role;
  };

  // Calculado só no cliente para evitar mismatch de hidratação (fuso/locale)
  const [today, setToday] = useState("");
  useEffect(() => {
    setToday(new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" }));
  }, []);

  return (
    <div className="panel-clash p-6 md:p-8 overflow-hidden group">
      {/* Glow dourado */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <Swords className="absolute -right-6 bottom-[-30px] w-48 h-48 text-primary/[0.05] -rotate-12 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          {/* Emblema */}
          <div className="hidden sm:flex shrink-0 h-14 w-14 rounded-xl rotate-45 bg-gradient-to-br from-amber-300 to-amber-700 border-2 border-amber-800/60 items-center justify-center shadow-[0_6px_18px_-4px_rgba(240,169,43,0.5)]">
            <Swords className="w-6 h-6 text-amber-950 -rotate-45" />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="eyebrow !py-0.5">{loading ? "..." : roleName(currentUser?.role || "MEMBRO")}</span>
              <span className="h-1 w-1 bg-muted-foreground/50 rounded-full" />
              <span className="text-muted-foreground text-xs font-mono flex items-center gap-1 uppercase">
                <CalendarDays className="w-3 h-3" /> {today}
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl clash-title leading-none">
              {isAdmin ? "Central de Comando" : "Quartel General"}
            </h2>
            <p className="text-muted-foreground font-medium max-w-lg text-sm md:text-base leading-relaxed">
              {isAdmin
                ? "Resumo tático e operacional do clã. Todas as funções administrativas estão online."
                : `Bem-vindo, ${currentUser?.name || "Guerreiro"}. Confira seus status e as últimas ordens do dia.`}
            </p>
          </div>
        </div>

        {isAdmin && (
          <Link href="/dashboard/ferramentas" className="btn-clash shrink-0 group/btn">
            <Megaphone className="mr-2 h-5 w-5" /> Criar Aviso
            <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
}
