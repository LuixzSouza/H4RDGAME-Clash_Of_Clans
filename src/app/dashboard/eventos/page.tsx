"use client";

import { useState, useEffect, useMemo } from "react";
import { getCurrentUser } from "@/app/actions";
import { getEvents, createEvent, deleteEvent } from "@/app/dashboard/eventos/actions";

// Componentes
import { EventsHeader } from "@/components/eventos/EventsHeader";
import { CreateEventDialog } from "@/components/eventos/CreateEventDialog";
import { UserWelcome } from "@/components/eventos/UserWelcome";
import { EventList } from "@/components/eventos/EventList";
import { ClashNews } from "@/components/eventos/ClashNews";

// Tipagem
type EventDB = {
  id: string;
  title: string;
  description: string;
  type: string;
  date: Date | string; // Aceita Date do banco ou string do input
};

export default function EventosPage() {
  // --- ESTADOS ---
  const [user, setUser] = useState<{ role: string, name: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [events, setEvents] = useState<EventDB[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Controle de UI
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Filtros e Busca
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // --- CARREGAMENTO DE DADOS ---
  const refreshEvents = async () => {
    const updatedEvents = await getEvents();
    // Casting para garantir compatibilidade de tipos se necessário
    setEvents(updatedEvents as unknown as EventDB[]);
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [userData, eventsData] = await Promise.all([
          getCurrentUser(),
          getEvents()
        ]);

        if (userData) {
          setUser(userData);
          if (userData.role === 'LIDER' || userData.role === 'COLIDER') {
            setIsAdmin(true);
          }
        }
        setEvents(eventsData as unknown as EventDB[]);
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // --- LÓGICA DE FILTRAGEM (MEMOIZED) ---
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // 1. Filtro por Texto (Título ou Descrição)
      const matchesSearch = 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 2. Filtro por Categoria
      const matchesType = filterType === 'all' || event.type === filterType;

      return matchesSearch && matchesType;
    });
  }, [events, searchTerm, filterType]);

  // --- ACTIONS ---
  const handleCreate = async (formData: FormData) => {
    await createEvent(formData);
    await refreshEvents();
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if(confirm("Tem certeza que deseja apagar este aviso do mural?")) {
        await deleteEvent(id);
        await refreshEvents();
    }
  };

  // --- RENDER ---
  return (
    <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto pb-20">
      
      {/* 1. Header com Busca e Filtros */}
      <EventsHeader 
        isAdmin={isAdmin} 
        onOpenDialog={() => setIsDialogOpen(true)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
      />

      {/* 2. Modal de Criação (Apenas Admins) */}
      {isAdmin && (
        <CreateEventDialog 
          isOpen={isDialogOpen} 
          onOpenChange={setIsDialogOpen} 
          onConfirm={handleCreate} 
        />
      )}

      {/* 3. Mensagem de Boas-vindas / Status */}
      <UserWelcome user={user} isAdmin={isAdmin} />

      {/* 4. Lista de Eventos (Filtrada) */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-300 pl-1 border-l-4 border-orange-500">
            Mural Oficial
        </h3>
        <EventList 
            events={filteredEvents} 
            loading={loading} 
            isAdmin={isAdmin} 
            onDelete={handleDelete} 
        />
      </div>

      {/* 5. Seção de Notícias e Comunidade */}
      <div className="pt-8 border-t border-[#2f3245]">
        <ClashNews />
      </div>

    </div>
  );
}