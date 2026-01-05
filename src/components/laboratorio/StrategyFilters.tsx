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
    <div className="bg-[#1e202b] border border-[#2f3245] p-4 rounded-xl shadow-xl flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
      
      {/* Seletor de CV */}
      <div className="w-full md:w-auto">
          <span className="text-[10px] font-bold text-slate-500 uppercase mb-2 block tracking-widest flex items-center gap-2">
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
                              ? 'bg-purple-600 text-white border-purple-800 shadow-[0_0_10px_rgba(147,51,234,0.3)]' 
                              : 'bg-[#2f3245] text-slate-400 border-[#1a1b26] hover:bg-[#3a3f55] hover:text-white'}
                      `}
                  >
                      {th}
                  </button>
              ))}
          </div>
      </div>

      {/* Busca por Nome */}
      <div className="w-full md:w-64">
          <span className="text-[10px] font-bold text-slate-500 uppercase mb-2 block tracking-widest">Buscar Estratégia</span>
          <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input 
                  placeholder="Ex: Lavaloon..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#15161e] border-[#2f3245] text-white focus-visible:ring-purple-500"
              />
          </div>
      </div>
    </div>
  );
}