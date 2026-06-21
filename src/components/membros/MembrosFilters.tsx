"use client";

import { 
  Search, Shield, UserX, List, LayoutGrid, Copy, Check, ArrowUpDown, 
  Download, Filter, X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FilterMode, ViewMode, SortOption, Member } from "./types";
import { useState } from "react";

interface MembrosFiltersProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  filterMode: FilterMode;
  setFilterMode: (v: FilterMode) => void;
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  sortBy: SortOption;
  setSortBy: (v: SortOption) => void;
  filteredCount: number;
  totalCount: number;
  filteredMembers: Member[];
}

export function MembrosFilters({
  searchTerm, setSearchTerm,
  filterMode, setFilterMode,
  viewMode, setViewMode,
  sortBy, setSortBy,
  filteredCount,
  totalCount,
  filteredMembers
}: MembrosFiltersProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyNames = () => {
    const names = filteredMembers.map(m => `@${m.name}`).join("\n");
    navigator.clipboard.writeText(names);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCSV = () => {
    const headers = "Nome,Tag,Cargo,TH,Guerra,UltimaVez\n";
    const rows = filteredMembers.map(m => 
      `${m.name},${m.tag},${m.role},${m.thLevel},${m.warStatus},${m.lastSeen || '-'}`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `membros_cla_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="bg-card p-3 md:p-4 rounded-xl border border-border shadow-lg space-y-4">
      
      {/* Container Principal Flexível */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
        
        {/* GRUPO 1: Busca e Filtros (Ocupa espaço disponível) */}
        <div className="flex flex-col md:flex-row gap-3 w-full xl:flex-1 overflow-hidden">
            
            {/* Campo de Busca (100% no mobile, fixo no desktop) */}
            <div className="relative w-full md:w-64 lg:w-72 shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Buscar nome ou tag..." 
                    className="pl-10 bg-background border-border text-white focus-visible:ring-primary h-10 w-full" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
                {searchTerm && (
                    <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white p-1">
                        <X className="w-3 h-3"/>
                    </button>
                )}
            </div>

            {/* Filtros Rápidos (Scroll Horizontal no Mobile para não quebrar) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto mask-linear-fade">
                <Button 
                    variant={filterMode === 'all' ? 'secondary' : 'outline'} 
                    size="sm" 
                    onClick={() => setFilterMode('all')} 
                    className={`h-10 md:h-9 text-xs border-border whitespace-nowrap px-4 ${filterMode === 'all' ? 'bg-muted text-white' : 'bg-transparent text-muted-foreground hover:bg-accent'}`}
                >
                    Todos
                </Button>
                
                <Button 
                    variant={filterMode === 'war' ? 'secondary' : 'outline'} 
                    size="sm" 
                    onClick={() => setFilterMode('war')} 
                    className={`h-10 md:h-9 text-xs border-border whitespace-nowrap gap-1.5 px-4 ${filterMode === 'war' ? 'bg-success/40 text-success border-success/50' : 'bg-transparent text-muted-foreground hover:bg-accent'}`}
                >
                    <Shield className="w-3 h-3" /> Guerra
                </Button>

                <Button 
                    variant={filterMode === 'inactive' ? 'secondary' : 'outline'} 
                    size="sm" 
                    onClick={() => setFilterMode('inactive')} 
                    className={`h-10 md:h-9 text-xs border-border whitespace-nowrap gap-1.5 px-4 ${filterMode === 'inactive' ? 'bg-destructive/40 text-destructive border-destructive/50' : 'bg-transparent text-muted-foreground hover:bg-accent'}`}
                >
                    <UserX className="w-3 h-3" /> Inativos
                </Button>

                {/* Dropdown Mais Filtros */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-10 md:h-9 text-xs border-border bg-transparent text-muted-foreground hover:bg-accent gap-1.5 px-3">
                            <Filter className="w-3 h-3"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-card border-border text-muted-foreground">
                        <DropdownMenuLabel>Outros Filtros</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-accent"/>
                        <DropdownMenuItem onClick={() => setFilterMode('debt')} className="cursor-pointer hover:bg-accent">
                            <span className="w-2 h-2 rounded-full bg-primary mr-2"/>
                            Sem Tickets (0)
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

        {/* Separador Mobile Visual */}
        <div className="h-px bg-accent w-full xl:hidden"></div>

        {/* GRUPO 2: Controles e Ações (Wrap para telas médias) */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center justify-between xl:justify-end w-full xl:w-auto">
             
             {/* Contador */}
             <span className="text-xs text-muted-foreground font-medium whitespace-nowrap mr-auto sm:mr-0">
                Exibindo <strong className="text-white">{filteredCount}</strong>/{totalCount}
             </span>

             <div className="flex gap-2 w-full sm:w-auto justify-end">
                
                {/* Select de Ordenação */}
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                    <SelectTrigger className="w-[140px] sm:w-[160px] bg-background border-border text-white h-9 text-xs">
                        <div className="flex items-center gap-2"><ArrowUpDown className="w-3 h-3 text-muted-foreground"/> <SelectValue /></div>
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-white">
                        <SelectItem value="role">Por Hierarquia</SelectItem>
                        <SelectItem value="th_desc">Maior TH (Forte)</SelectItem>
                        <SelectItem value="th_asc">Menor TH (Fraco)</SelectItem>
                        <SelectItem value="name">Alfabética (A-Z)</SelectItem>
                        <SelectItem value="active">Mais Recentes</SelectItem>
                    </SelectContent>
                </Select>

                {/* Botões de Ação */}
                <div className="flex gap-1 bg-background rounded-lg border border-border p-1 shrink-0">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleCopyNames} 
                        className="h-7 w-7 text-muted-foreground hover:text-white hover:bg-accent"
                        title="Copiar lista"
                    >
                        {copied ? <Check className="w-4 h-4 text-success"/> : <Copy className="w-4 h-4"/>}
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleExportCSV} 
                        className="h-7 w-7 text-muted-foreground hover:text-white hover:bg-accent"
                        title="Baixar CSV"
                    >
                        <Download className="w-4 h-4"/>
                    </Button>
                </div>

                {/* Toggle View (Esconde em telas muito pequenas se necessário, ou mantém) */}
                <div className="flex gap-1 bg-background rounded-lg border border-border p-1 shrink-0">
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => setViewMode('table')} 
                        className={`h-7 w-7 ${viewMode === 'table' ? 'bg-accent text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <List className="w-4 h-4"/>
                    </Button>
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => setViewMode('grid')} 
                        className={`h-7 w-7 ${viewMode === 'grid' ? 'bg-accent text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <LayoutGrid className="w-4 h-4"/>
                    </Button>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
}