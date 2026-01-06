"use client";

import { useState, useEffect, useMemo } from "react";

// --- ACTIONS DO SERVIDOR ---
import { getCurrentUser } from "@/app/actions";
import { 
  getMembers, createMember, deleteMember, updateMember, syncWithGame 
} from "@/app/dashboard/membros/actions";

// --- TIPOS ---
import { Member, FilterMode, ViewMode, SortOption } from "@/components/membros/types";

// --- COMPONENTES VISUAIS ---
import { MembersHeader } from "@/components/membros/MembersHeader";
import { MembrosStats } from "@/components/membros/MembrosStats";
import { MembrosFilters } from "@/components/membros/MembrosFilters";
import { MembrosTable } from "@/components/membros/MembrosTable";
import { MembrosGrid } from "@/components/membros/MembrosGrid";
import { RecruitModal } from "@/components/membros/RecruitModal";
import { EditMemberDialog } from "@/components/membros/EditMemberDialog";

// Helper de Prioridade para ordenação
const ROLE_PRIORITY: Record<string, number> = { "LIDER": 1, "COLIDER": 2, "ANCIAO": 3, "MEMBRO": 4 };

export default function MembrosPage() {
  // --- ESTADOS GLOBAIS ---
  const [members, setMembers] = useState<Member[]>([]);
  // Agora armazenamos o objeto completo do usuário
  const [currentUser, setCurrentUser] = useState<{ id: string; role: string; tag: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // --- ESTADOS DE FILTRO & VIEW ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [sortBy, setSortBy] = useState<SortOption>('role');

  // --- ESTADOS DE MODAIS ---
  const [isRecruitOpen, setIsRecruitOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // --- PERMISSÕES ---
  // IMPORTANTE: Se o user não carregou ainda, assume MEMBRO (sem poder)
  const currentUserRole = currentUser?.role || "MEMBRO";
  
  // Helpers para botões gerais (Recrutamento/Sync)
  const isHighCommand = currentUserRole === 'LIDER' || currentUserRole === 'COLIDER';
  const canRecruit = isHighCommand || currentUserRole === 'ANCIAO';

  // --- INICIALIZAÇÃO ---
  useEffect(() => {
    async function init() {
      try {
        const user = await getCurrentUser();
        if (user) setCurrentUser(user);
        await loadMembers();
      } catch (error) {
        console.error("Erro na inicialização:", error);
      }
    }
    init();
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await getMembers();
      setMembers(data as unknown as Member[]);
    } catch (error) {
      console.error("Erro ao carregar membros", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper de dias offline
  const getDaysOffline = (dateInput?: Date | string | null) => {
      if (!dateInput) return 0;
      const diff = Math.abs(new Date().getTime() - new Date(dateInput).getTime());
      return Math.floor(diff / (1000 * 3600 * 24));
  };

  // --- FILTRAGEM E ORDENAÇÃO ---
  const processedMembers = useMemo(() => {
    const result = members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            member.tag.toLowerCase().includes(searchTerm.toLowerCase());
      const daysOff = getDaysOffline(member.lastSeen);

      if (filterMode === 'war') return matchesSearch && member.warStatus === 'IN';
      if (filterMode === 'debt') return matchesSearch && member.tickets === 0;
      if (filterMode === 'inactive') return matchesSearch && daysOff >= 5;
      return matchesSearch;
    });

    result.sort((a, b) => {
        if (sortBy === 'role') {
            const pA = ROLE_PRIORITY[a.role as string] || 5;
            const pB = ROLE_PRIORITY[b.role as string] || 5;
            if (pA !== pB) return pA - pB;
            return a.name.localeCompare(b.name);
        }
        if (sortBy === 'th_desc') return b.thLevel - a.thLevel;
        if (sortBy === 'th_asc') return a.thLevel - b.thLevel;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'active') {
             const tA = a.lastSeen ? new Date(a.lastSeen).getTime() : 0;
             const tB = b.lastSeen ? new Date(b.lastSeen).getTime() : 0;
             return tB - tA; 
        }
        return 0;
    });
    return result;
  }, [members, searchTerm, filterMode, sortBy]);

  // --- HANDLERS ---
  const handleSync = async () => {
    if (!isHighCommand) return;
    setSyncing(true);
    try {
        await syncWithGame();
        await loadMembers();
    } catch (e) { console.error(e); } 
    finally { setSyncing(false); }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Confirmar expulsão?")) {
        await deleteMember(id);
        loadMembers();
    }
  };

  const handleUpdateSubmit = async (formData: FormData) => {
    await updateMember(formData);
    setEditingMember(null);
    loadMembers();
  };

  const handleCreateSubmit = async (formData: FormData) => {
    await createMember(formData);
    setIsRecruitOpen(false);
    loadMembers();
  };

  // --- RENDERIZAÇÃO ---
  return (
    <div className="p-4 md:p-6 space-y-8 min-h-screen bg-[#0b0d14]">
      
      <MembersHeader 
        isHighCommand={isHighCommand} // Botões globais ainda usam boolean
        canRecruit={canRecruit}
        isSyncing={syncing}
        onSync={handleSync}
        onRecruit={() => setIsRecruitOpen(true)}
      />

      <MembrosStats members={members} />

      <MembrosFilters 
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        filterMode={filterMode} setFilterMode={setFilterMode}
        viewMode={viewMode} setViewMode={setViewMode}
        sortBy={sortBy} setSortBy={setSortBy}
        filteredCount={processedMembers.length}
        totalCount={members.length}
        filteredMembers={processedMembers}
      />

      {loading ? (
         <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            <p className="text-slate-500 animate-pulse">Carregando dados do servidor...</p>
         </div>
      ) : (
         viewMode === 'table' ? (
            <MembrosTable 
               members={processedMembers} 
               currentUserRole={currentUserRole} // MUDANÇA CRÍTICA: Passando a string do cargo
               onEdit={setEditingMember} 
               onDelete={handleDelete}
               getDaysOffline={getDaysOffline}
            />
         ) : (
            <MembrosGrid 
               members={processedMembers} 
               currentUserRole={currentUserRole} // MUDANÇA CRÍTICA: Passando a string do cargo
               onEdit={setEditingMember} 
               onDelete={handleDelete} 
            />
         )
      )}

      <RecruitModal 
        isOpen={isRecruitOpen} 
        onOpenChange={setIsRecruitOpen} 
        onConfirm={handleCreateSubmit} 
      />

      <EditMemberDialog 
        member={editingMember}
        currentUser={currentUser}
        isOpen={!!editingMember}
        onOpenChange={(open) => !open && setEditingMember(null)}
        onSubmit={handleUpdateSubmit}
      />

    </div>
  );
}