"use client";

import { useState, useEffect } from "react";

// Actions
import { getCurrentUser } from "@/app/actions";
import { getStrategies, createStrategy, deleteStrategy } from "@/app/dashboard/laboratorio/actions";

// Componentes
import { LabHeader } from "@/components/laboratorio/LabHeader";
import { StrategyFilters } from "@/components/laboratorio/StrategyFilters";
import { StrategyList } from "@/components/laboratorio/StrategyList";
import { CreateStrategyDialog } from "@/components/laboratorio/CreateStrategyDialog";

// Tipo compatível com o Banco de Dados
type Strategy = {
  id: string;
  title: string;
  description: string;
  thLevel: number;
  difficulty: string;
  videoUrl: string | null;
  army: string;
};

export default function LaboratorioPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filtros
  const [selectedTH, setSelectedTH] = useState("16");
  const [searchTerm, setSearchTerm] = useState("");

  // Carregar dados
  useEffect(() => {
    async function load() {
      const [user, data] = await Promise.all([
        getCurrentUser(),
        getStrategies()
      ]);

      if (user && (user.role === 'LIDER' || user.role === 'COLIDER')) {
        setIsAdmin(true);
      }

      setStrategies(data);
      setLoading(false);
    }
    load();
  }, []);

  // --- ACTIONS ---
  const handleCreate = async (formData: FormData) => {
    await createStrategy(formData);
    setIsDialogOpen(false);
    const data = await getStrategies(); // Recarrega
    setStrategies(data);
  };

  const handleDelete = async (id: string) => {
    if(confirm("Tem certeza que deseja apagar esta estratégia?")) {
        await deleteStrategy(id);
        const data = await getStrategies();
        setStrategies(data);
    }
  };

  // --- FILTRAGEM ---
  const filteredStrategies = strategies.filter(strat => {
    const matchTH = strat.thLevel.toString() === selectedTH;
    const matchName = strat.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTH && matchName;
  });

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto">
      
      {/* 1. Header e Modal */}
      <LabHeader isAdmin={isAdmin} onOpenDialog={() => setIsDialogOpen(true)} />
      
      {isAdmin && (
        <CreateStrategyDialog 
            isOpen={isDialogOpen} 
            onOpenChange={setIsDialogOpen} 
            onConfirm={handleCreate} 
        />
      )}

      {/* 2. Barra de Filtros */}
      <StrategyFilters 
        selectedTH={selectedTH} 
        setSelectedTH={setSelectedTH}
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
      />

      {/* 3. Lista de Estratégias */}
      <StrategyList 
        strategies={filteredStrategies}
        loading={loading}
        isAdmin={isAdmin}
        onDelete={handleDelete}
        selectedTH={selectedTH}
        onAddClick={() => setIsDialogOpen(true)}
      />

    </div>
  );
}