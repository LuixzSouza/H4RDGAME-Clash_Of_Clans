"use client";

import { CalendarDays, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventsHeaderProps {
  isAdmin: boolean;
  onOpenDialog: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
}

export function EventsHeader({ 
  isAdmin, onOpenDialog, searchTerm, setSearchTerm, filterType, setFilterType 
}: EventsHeaderProps) {
  return (
    <div className="flex flex-col gap-6 bg-[#1e202b] p-6 rounded-xl border border-[#2f3245] shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-heading text-white flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-orange-500" /> Mural de Guerra
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Central de inteligência e calendário oficial do clã.
          </p>
        </div>

        {isAdmin && (
          <Button onClick={onOpenDialog} className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold shadow-lg transition-transform active:scale-95">
            <Plus className="w-5 h-5 mr-2"/> Novo Aviso
          </Button>
        )}
      </div>

      {/* Barra de Ferramentas */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500"/>
            <Input 
                placeholder="Pesquisar aviso..." 
                className="pl-10 bg-[#15161e] border-[#2f3245] focus-visible:ring-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[180px] bg-[#15161e] border-[#2f3245]">
                <Filter className="w-4 h-4 mr-2 text-slate-500"/>
                <SelectValue placeholder="Filtrar por..." />
            </SelectTrigger>
            <SelectContent className="bg-[#1e202b] border-[#2f3245] text-white">
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="war">Guerras</SelectItem>
                <SelectItem value="games">Jogos do Clã</SelectItem>
                <SelectItem value="raid">Capital</SelectItem>
            </SelectContent>
        </Select>
      </div>
    </div>
  );
}