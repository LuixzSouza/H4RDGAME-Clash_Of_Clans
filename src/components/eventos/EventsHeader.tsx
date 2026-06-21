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
    <div className="flex flex-col gap-6 bg-card p-6 rounded-xl border border-border shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-heading text-white flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-primary" /> Mural de Guerra
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Central de inteligência e calendário oficial do clã.
          </p>
        </div>

        {isAdmin && (
          <Button onClick={onOpenDialog} className="bg-gradient-to-b from-amber-300 to-amber-600 hover:brightness-110 text-amber-950 font-bold shadow-lg transition-transform active:scale-95">
            <Plus className="w-5 h-5 mr-2"/> Novo Aviso
          </Button>
        )}
      </div>

      {/* Barra de Ferramentas */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
            <Input 
                placeholder="Pesquisar aviso..." 
                className="pl-10 bg-background border-border focus-visible:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[180px] bg-background border-border">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground"/>
                <SelectValue placeholder="Filtrar por..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-white">
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