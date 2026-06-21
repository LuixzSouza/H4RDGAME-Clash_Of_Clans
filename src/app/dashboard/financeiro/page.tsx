"use client";

import { useState, useEffect, useMemo } from "react";
import { DollarSign, Loader2 } from "lucide-react";

// Components
import { FinanceHeader } from "@/components/financeiro/FinanceHeader";
import { EventCard } from "@/components/financeiro/EventCard";
import { AddParticipantModal } from "@/components/financeiro/AddParticipantModal";
import { ArchivedEvents } from "@/components/financeiro/ArchivedEvents";
import { EditEventDialog } from "@/components/financeiro/EditEventDialog"; // Importado o Modal de Edição

// Actions
import { getCurrentUser } from "@/app/actions";
import { getMembers } from "@/app/dashboard/membros/actions";
import { 
  getFinanceEvents, 
  createFinanceEvent, 
  updateFinanceEvent, // Action de atualização
  addParticipation, 
  removeParticipation, 
  toggleEventStatus 
} from "./actions";

// --- DEFINIÇÃO DE TIPOS ---
interface Member {
  id: string;
  name: string;
  tag: string;
  role: string;
  avatarSeed: string | null;
}

interface Participation {
  id: string;
  memberId: string;
  tickets: number;
  member: Member;
}

// Interface principal
export interface FinanceEvent {
  id: string;
  title: string;
  ticketPrice: number;
  goalAmount: number | null;
  status: string; // 'ACTIVE' | 'CLOSED'
  updatedAt: Date | string;
  participations: Participation[];
}

export default function FinanceiroPage() {
  // --- ESTADOS ---
  const [events, setEvents] = useState<FinanceEvent[]>([]);
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Controle de Modais
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<FinanceEvent | null>(null); // Estado para o evento sendo editado

  // --- CARREGAMENTO DE DADOS ---
  const refreshData = async () => {
      try {
        const data = await getFinanceEvents();
        // Casting necessário pois dados do servidor podem vir como string/Date misturados
        setEvents(data as unknown as FinanceEvent[]);
      } catch (error) {
        console.error("Erro ao atualizar dados:", error);
      }
  };

  useEffect(() => {
    async function load() {
      try {
        const [user, eventsData, membersData] = await Promise.all([
          getCurrentUser(),
          getFinanceEvents(),
          getMembers()
        ]);
        
        if (user?.role === 'LIDER' || user?.role === 'COLIDER') setIsAdmin(true);
        
        setEvents(eventsData as unknown as FinanceEvent[]);
        setAllMembers(membersData as unknown as Member[]);
      } catch (e) {
        console.error("Erro crítico ao carregar página financeira:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // --- MEMOIZATION ---
  const activeEvents = useMemo(() => events.filter(e => e.status === 'ACTIVE'), [events]);
  const closedEvents = useMemo(() => events.filter(e => e.status === 'CLOSED'), [events]);

  // --- HANDLERS (Ações) ---
  const handleCreateEvent = async (formData: FormData) => {
    await createFinanceEvent(formData);
    await refreshData();
  };

  const handleUpdateEvent = async (formData: FormData) => {
    await updateFinanceEvent(formData);
    await refreshData();
    setEditingEvent(null); // Fecha o modal
  };

  const handleAddParticipant = async (memberId: string) => {
    if (!selectedEventId) return;
    await addParticipation(selectedEventId, memberId);
    await refreshData();
  };

  const handleIncreaseTicket = async (eventId: string, memberId: string) => {
    await addParticipation(eventId, memberId);
    await refreshData();
  };

  const handleDecreaseTicket = async (eventId: string, memberId: string) => {
    await removeParticipation(eventId, memberId);
    await refreshData();
  };

  const handleToggleStatus = async (eventId: string) => {
    await toggleEventStatus(eventId);
    await refreshData();
  };

  // Abre o modal de adicionar membro
  const openAddModal = (eventId: string) => {
      setSelectedEventId(eventId);
      setIsAddModalOpen(true);
  };

  // --- LOADING UI ---
  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground gap-4 animate-pulse">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-sm font-medium tracking-widest uppercase">Acessando Cofre do Clã...</p>
        </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto pb-20">
      
      {/* Cabeçalho */}
      <FinanceHeader isAdmin={isAdmin} onCreateEvent={handleCreateEvent} />

      {/* Grid de Eventos Ativos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {activeEvents.map(event => (
            <EventCard 
                key={event.id}
                event={event}
                isAdmin={isAdmin}
                onAddParticipant={openAddModal}
                onIncreaseTicket={handleIncreaseTicket}
                onDecreaseTicket={handleDecreaseTicket}
                onToggleStatus={handleToggleStatus}
                onEditEvent={setEditingEvent} // Passa o evento para o estado de edição
            />
        ))}
        
        {/* Estado Vazio */}
        {activeEvents.length === 0 && (
            <div className="col-span-full border-2 border-dashed border-border rounded-xl p-12 md:p-16 flex flex-col items-center justify-center text-muted-foreground bg-card/30">
                <div className="bg-background p-4 rounded-full mb-4">
                    <DollarSign className="w-10 h-10 opacity-30 text-primary"/>
                </div>
                <h3 className="text-lg font-bold text-muted-foreground">Nenhum evento ativo</h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm mt-1">
                    Crie um novo evento (Sorteio, Vaquinha, Bolão) para começar a gerenciar as arrecadações.
                </p>
            </div>
        )}
      </div>

      {/* Histórico */}
      <ArchivedEvents 
        events={closedEvents} 
        isAdmin={isAdmin} 
        onReopen={handleToggleStatus} 
      />

      {/* --- MODAIS --- */}
      
      {/* 1. Adicionar Participante */}
      <AddParticipantModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddParticipant}
        allMembers={allMembers}
      />

      {/* 2. Editar Evento */}
      <EditEventDialog 
        event={editingEvent}
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        onSave={handleUpdateEvent}
      />

    </div>
  );
}