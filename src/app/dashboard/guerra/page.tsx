"use client";

import { useState, useEffect } from "react";
import { BarChart3, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- IMPORTAÇÕES DE ACTIONS (CORRIGIDAS) ---

// 1. Core / Autenticação (Arquivo Raiz)
import { getCurrentUser } from "@/app/actions";

// 2. Ações de Membros (Listagem e Status IN/OUT)
import { getMembers, toggleWarStatus } from "@/app/dashboard/membros/actions";

// 3. Ações de Guerra (Gestão de Batalha)
import { 
  getActiveWar, 
  startWar, 
  endWar, 
  registerAttack, 
  getWarHistory 
} from "@/app/dashboard/guerra/actions";

// --- COMPONENTES ---
import { WarHeader } from "@/components/guerra/WarHeader";
import { WarStats } from "@/components/guerra/WarStats";
import { WarMap } from "@/components/guerra/WarMap";
import { WarHistory } from "@/components/guerra/WarHistory";
import { PreparationView } from "@/components/guerra/PreparationView";
import { WarData, Member, WarHistoryEntry } from "@/components/guerra/types";

export default function PainelGuerra() {
  const [activeWar, setActiveWar] = useState<WarData | null>(null);
  const [history, setHistory] = useState<WarHistoryEntry[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [currentUserTag, setCurrentUserTag] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- CARREGAMENTO INICIAL ---
  useEffect(() => {
    async function load() {
      try {
        const [user, warData, historyData, membersData] = await Promise.all([
          getCurrentUser(),
          getActiveWar(),
          getWarHistory(),
          getMembers()
        ]);

        if (user) {
          setCurrentUserTag(user.tag);
          // Verifica se o cargo é elegível para administração
          if (user.role === 'LIDER' || user.role === 'COLIDER') setIsAdmin(true);
        }
        
        // Atribuição com validação de tipo para evitar erros de compilação
        setActiveWar(warData as WarData | null);
        setHistory((historyData as unknown as WarHistoryEntry[]) || []);
        // Força o tipo aqui pois o Prisma retorna o objeto do banco, e o frontend espera o tipo Member local
        setMembers((membersData as unknown as Member[]) || []);
        
      } catch (error) {
        console.error("Erro crítico ao carregar a Sala de Guerra:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // --- HANDLERS (COMUNICAÇÃO COM ACTIONS) ---
  
  const handleStartWar = async (fd: FormData) => {
    const result = await startWar(fd);
    if (result.success) window.location.reload();
  };

  const handleEndWar = async (fd: FormData) => {
    const result = await endWar(fd);
    if (result.success) window.location.reload();
  };

  const handleRegisterAttack = async (fd: FormData) => {
    const result = await registerAttack(fd);
    if (result.success) window.location.reload();
  };

  const handleToggleStatus = async (id: string, targetTag: string) => {
    // Se a guerra já começou, ninguém mais muda status IN/OUT
    if (activeWar) return; 
    
    // UI Otimista: Muda na tela antes de ir pro banco (Dá sensação de rapidez)
    setMembers(prev => prev.map(m => 
      m.id === id ? { ...m, warStatus: m.warStatus === 'IN' ? 'OUT' : 'IN' } : m
    ));
    
    try { 
      await toggleWarStatus(id); 
    } catch (e) { 
      console.error("Falha ao atualizar status:", e);
      window.location.reload(); // Reverte em caso de erro real
    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-destructive"></div>
        <p className="text-muted-foreground font-medium animate-pulse">Sincronizando estratégia com o quartel...</p>
      </div>
    );
  }

  // Cálculos rápidos para o Header
  const activeCount = members.filter(m => m.warStatus === 'IN').length;
  // Filtra apenas membros que estão marcados como IN para a lista de batalha
  const battleMembers = members.filter(m => m.warStatus === 'IN');

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto pb-24">
      
      {/* 1. Cabeçalho com Título e Botões de Admin */}
      <WarHeader 
        activeWar={activeWar} 
        isAdmin={isAdmin} 
        activeCount={activeCount}
        onStartWar={handleStartWar}
        onEndWar={handleEndWar}
      />

      {activeWar ? (
        <>
          {/* 2. DASHBOARD DE BATALHA (Aparece se houver guerra ativa) */}
          <WarStats activeWar={activeWar} />
          
          <Tabs defaultValue="map" className="w-full">
            <TabsList className="bg-background border border-border p-1">
              <TabsTrigger value="map" className="gap-2 data-[state=active]:bg-accent">
                <Target className="w-4 h-4"/> Mapa de Guerra
              </TabsTrigger>
              <TabsTrigger value="stats" className="gap-2 data-[state=active]:bg-accent">
                <BarChart3 className="w-4 h-4"/> Histórico & Performance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="map" className="mt-6">
               <WarMap 
                  activeWar={activeWar} 
                  members={battleMembers} 
                  onRegisterAttack={handleRegisterAttack} 
               />
            </TabsContent>

            <TabsContent value="stats" className="mt-6">
               <WarHistory history={history} />
            </TabsContent>
          </Tabs>
        </>
      ) : (
        /* 3. MODO PREPARAÇÃO (Aparece se o clã estiver em paz) */
        <div className="space-y-12 animate-in fade-in duration-700">
            <PreparationView 
              members={members} 
              currentUserTag={currentUserTag} 
              isAdmin={isAdmin} 
              onToggleStatus={handleToggleStatus} 
            />
            
            {/* Seção de Histórico no rodapé da preparação */}
            <div className="pt-8 border-t border-border">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <BarChart3 className="w-6 h-6 text-primary"/>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Arquivos de Guerra</h2>
                        <p className="text-muted-foreground text-sm">Analise o desempenho das últimas campanhas.</p>
                    </div>
                </div>
                <WarHistory history={history} />
            </div>
        </div>
      )}
    </div>
  );
}