"use client";

import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface StrategyFiltersProps {
  selectedTH: string;
  setSelectedTH: (val: string) => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

export function StrategyFilters({ selectedTH, setSelectedTH, searchTerm, setSearchTerm }: StrategyFiltersProps) {
  return (
    <div className="bg-card border border-border p-4 rounded-xl shadow-xl flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
      
      {/* Seletor de CV */}
      <div className="w-full md:w-auto">
          <span className="text-[10px] font-bold text-muted-foreground uppercase mb-2 block tracking-widest flex items-center gap-2">
              <Filter className="w-3 h-3"/> Filtro de Centro de Vila
          </span>
          <div className="flex flex-wrap gap-2">
              {[16, 15, 14, 13, 12, 11, 10, 9].map((th) => (
                  <button
                      key={th}
                      onClick={() => setSelectedTH(th.toString())}
                      className={`
                          h-10 w-12 rounded-lg font-bold text-sm transition-all border-b-4 active:border-b-0 active:translate-y-1
                          ${selectedTH === th.toString() 
                              ? 'bg-primary text-white border-primary shadow-[0_0_10px_rgba(240,169,43,0.3)]' 
                              : 'bg-accent text-muted-foreground border-border hover:bg-accent hover:text-white'}
                      `}
                  >
                      {th}
                  </button>
              ))}
          </div>
      </div>

      {/* Busca por Nome */}
      <div className="w-full md:w-64">
          <span className="text-[10px] font-bold text-muted-foreground uppercase mb-2 block tracking-widest">Buscar Estratégia</span>
          <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                  placeholder="Ex: Lavaloon..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border text-white focus-visible:ring-primary"
              />
          </div>
      </div>
    </div>
  );
}