"use client";

import { useState, useEffect, useMemo } from "react";

// Ações do servidor
import { getRecentLogs, getCurrentUser } from "@/app/actions";
import { getMembers } from "@/app/dashboard/membros/actions";
import { getFinanceEvents } from "@/app/dashboard/financeiro/actions";

// Componentes
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { ActionPanel } from "@/components/dashboard/ActionPanel";
import { QuickLinks } from "@/components/dashboard/QuickLinks";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";

// --- TIPOS E INTERFACES ---

// 1. O que vem do Banco de Dados (Raw Data)
interface RawMember {
  id: string;
  name: string;
  role: string; // Prisma retorna string/enum
  tag: string;
  warStatus: string; // Prisma retorna string/enum
  tickets?: number; // Opcional pois foi removido, mas para garantir compatibilidade
}

interface RawEventParticipation {
  memberId: string;
  tickets: number;
}

interface RawFinanceEvent {
  id: string;
  status: string;
  ticketPrice: number;
  participations: RawEventParticipation[];
}

interface RawLog {
  id: string;
  action: string;
  details?: string | null;
  description?: string | null; // Caso o campo varie no banco
  createdAt: Date | string;
  member: { name: string } | null;
}

// 2. O que usamos no Front (Clean Data)
export interface Log {
  id: string;
  action: string;
  details: string;
  createdAt: Date;
  member: { name: string } | null;
}

export type DashboardStats = {
  totalMembers: number;
  warParticipants: number;
  totalTreasury: number;
  paidMembers: number;
};

export type UserData = {
  id: string;
  name: string;
  role: string;
  tag: string;
  warStatus: string;
  activeTickets: number;
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  
  // Estados com Tipagem Explícita
  const [members, setMembers] = useState<RawMember[]>([]);
  const [events, setEvents] = useState<RawFinanceEvent[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);

  const quickWarText = "⚔️ Guerra ativa! Ataquem seus espelhos nas primeiras 12h.";

  // --- CARREGAMENTO DE DADOS ---
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);

        const [sessionUser, membersData, logsData, eventsData] = await Promise.all([
          getCurrentUser(),
          getMembers(),
          getRecentLogs(),
          getFinanceEvents()
        ]);

        // 1. Processar Membros
        // Forçamos o tipo aqui pois sabemos o retorno do Prisma
        const safeMembers = Array.isArray(membersData) ? (membersData as unknown as RawMember[]) : [];
        setMembers(safeMembers);

        // 2. Processar Eventos
        const safeEvents = Array.isArray(eventsData) ? (eventsData as unknown as RawFinanceEvent[]) : [];
        setEvents(safeEvents);
        
        // 3. Processar Logs (Normalização)
        const rawLogs = Array.isArray(logsData) ? (logsData as unknown as RawLog[]) : [];
        const formattedLogs: Log[] = rawLogs.map((log) => ({
            id: log.id,
            action: log.action,
            // Fallback seguro para o texto do log
            details: log.details || log.description || "Sem detalhes",
            createdAt: new Date(log.createdAt),
            member: log.member
        }));
        setLogs(formattedLogs);

        // 4. Configurar Usuário Atual
        if (sessionUser) {
          const role = sessionUser.role as string; // Garantir string
          if (role === 'LIDER' || role === 'COLIDER') {
            setIsAdmin(true);
          }
          
          // Calcula tickets ativos do usuário logado (Sem any)
          const myActiveTickets = safeEvents
            .filter(e => e.status === 'ACTIVE')
            .reduce<number>((acc, evt) => {
               const participation = evt.participations.find(p => p.memberId === sessionUser.id);
               return acc + (participation ? participation.tickets : 0);
            }, 0);

          setCurrentUser({
            id: sessionUser.id,
            name: sessionUser.name,
            role: role,
            tag: sessionUser.tag,
            warStatus: (sessionUser.warStatus as string) || 'OUT',
            activeTickets: myActiveTickets
          });
        }

      } catch (error) {
        console.error("Erro crítico ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  // --- CÁLCULOS ESTATÍSTICOS ---
  const stats = useMemo<DashboardStats>(() => {
    // 1. Total de Membros
    const totalMembers = members.length;

    // 2. Participantes de Guerra (Verdes)
    const warParticipants = members.filter(m => m.warStatus === 'IN').length;

    // 3. Tesouraria
    const activeEvents = events.filter(e => e.status === 'ACTIVE');
    
    let totalTreasury = 0;
    const payingMemberIds = new Set<string>();

    activeEvents.forEach(event => {
        event.participations.forEach(p => {
            if (p.tickets > 0) {
                totalTreasury += p.tickets * event.ticketPrice;
                payingMemberIds.add(p.memberId);
            }
        });
    });

    return {
      totalMembers,
      warParticipants,
      totalTreasury,
      paidMembers: payingMemberIds.size
    };
  }, [members, events]);

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* 1. Header Dinâmico */}
      <DashboardHeader 
        currentUser={currentUser} 
        isAdmin={isAdmin} 
        loading={loading} 
      />

      {/* 2. Grid de Estatísticas */}
      <StatsGrid stats={stats} loading={loading} />

      {/* 3. Área Principal */}
      <div className="grid gap-6 lg:grid-cols-3 h-full items-start">
        
        {/* Coluna Esquerda */}
        <div className="lg:col-span-2 space-y-6">
            <ActionPanel 
                isAdmin={isAdmin} 
                currentUser={currentUser} 
                quickWarText={quickWarText} 
            />
            <QuickLinks isAdmin={isAdmin} />
        </div>

        {/* Coluna Direita */}
        <div className="lg:col-span-1">
            <ActivityFeed logs={logs} loading={loading} />
        </div>

      </div>
    </div>
  );
}