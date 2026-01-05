"use client";

import { useState, useEffect } from "react";

// Actions
import { getCurrentUser } from "@/app/actions";
import { getLayouts, createLayout, deleteLayout } from "@/app/dashboard/fortaleza/actions";

// Componentes
import { FortalezaHeader } from "@/components/fortaleza/FortalezaHeader";
import { FilterBar } from "@/components/fortaleza/FilterBar";
import { LayoutGrid } from "@/components/fortaleza/LayoutGrid";
import { CreateLayoutDialog } from "@/components/fortaleza/CreateLayoutDialog";

// Tipo compatível
type Layout = {
  id: string;
  name: string;
  description: string;
  thLevel: number;
  type: string;
  imageUrl: string;
  link: string;
};

export default function FortalezaPage() {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filtros
  const [selectedTH, setSelectedTH] = useState("16");
  const [selectedType, setSelectedType] = useState("all");

  // Carregar dados
  useEffect(() => {
    async function load() {
      const [user, data] = await Promise.all([
        getCurrentUser(),
        getLayouts()
      ]);

      if (user && (user.role === 'LIDER' || user.role === 'COLIDER')) {
        setIsAdmin(true);
      }

      setLayouts(data);
      setLoading(false);
    }
    load();
  }, []);

  // --- ACTIONS ---
  const handleCreate = async (formData: FormData) => {
    await createLayout(formData);
    setIsDialogOpen(false);
    const data = await getLayouts();
    setLayouts(data);
  };

  const handleDelete = async (id: string) => {
    if(confirm("Tem certeza que deseja remover este layout da biblioteca?")) {
        await deleteLayout(id);
        const data = await getLayouts();
        setLayouts(data);
    }
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    alert("Link copiado! Cole no navegador ou no chat do clã.");
  };

  // --- FILTRAGEM ---
  const filteredLayouts = layouts.filter(layout => {
    const thMatch = layout.thLevel.toString() === selectedTH;
    const typeMatch = selectedType === "all" || layout.type === selectedType;
    return thMatch && typeMatch;
  });

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto">
      
      {/* 1. Header e Modal de Criação */}
      <FortalezaHeader isAdmin={isAdmin} onOpenDialog={() => setIsDialogOpen(true)} />
      
      {isAdmin && (
        <CreateLayoutDialog 
            isOpen={isDialogOpen} 
            onOpenChange={setIsDialogOpen} 
            onConfirm={handleCreate} 
        />
      )}

      {/* 2. Barra de Filtros */}
      <FilterBar 
        selectedTH={selectedTH} 
        setSelectedTH={setSelectedTH}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />

      {/* 3. Grid de Layouts */}
      <LayoutGrid 
        layouts={filteredLayouts}
        loading={loading}
        isAdmin={isAdmin}
        onDelete={handleDelete}
        onCopyLink={copyLink}
        selectedTH={selectedTH}
        selectedType={selectedType}
        onClearFilter={() => setSelectedType('all')}
        onAddClick={() => setIsDialogOpen(true)}
      />

    </div>
  );
}