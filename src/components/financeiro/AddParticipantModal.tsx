"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Loader2, UserX, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- TIPAGEM ---
interface Member {
  id: string;
  name: string;
  tag: string;
  avatarSeed?: string | null;
  role: string; // Adicionado para exibir o cargo
}

interface AddParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (memberId: string) => Promise<void>; // Agora aceita Promise para loading
  allMembers: Member[];
}

// --- HELPER DE ESTILO DE CARGO ---
const getRoleStyle = (role: string) => {
  switch (role) {
    case "LIDER": return "bg-red-900/30 text-red-400 border-red-800";
    case "COLIDER": return "bg-orange-900/30 text-orange-400 border-orange-800";
    case "ANCIAO": return "bg-blue-900/30 text-blue-400 border-blue-800";
    default: return "bg-slate-800 text-slate-400 border-slate-700";
  }
};

const formatRole = (role: string) => {
    const map: Record<string, string> = { "LIDER": "Líder", "COLIDER": "Colíder", "ANCIAO": "Ancião", "MEMBRO": "Membro" };
    return map[role] || role;
};

export function AddParticipantModal({ isOpen, onClose, onAdd, allMembers }: AddParticipantModalProps) {
  const [search, setSearch] = useState("");
  const [addingId, setAddingId] = useState<string | null>(null); // Controla qual ID está sendo adicionado

  // Filtro
  const filteredMembers = allMembers
    .filter(m => 
        m.name.toLowerCase().includes(search.toLowerCase()) || 
        m.tag.toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, 50); // Aumentei o limite para mostrar mais opções no scroll

  const handleAdd = async (id: string) => {
      if (addingId) return; // Previne duplo clique
      setAddingId(id);
      await onAdd(id);
      setAddingId(null);
      onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1e202b] border-[#2f3245] text-white top-[20%] max-w-md shadow-2xl p-0 gap-0 overflow-hidden">
        
        {/* HEADER */}
        <div className="p-6 pb-4 border-b border-[#2f3245] bg-[#15161e]">
            <DialogHeader>
            <DialogTitle className="text-xl font-heading tracking-wide flex items-center gap-2">
                <div className="bg-green-600/20 p-2 rounded-lg text-green-500">
                    <Plus className="w-5 h-5" />
                </div>
                Registrar Pagamento
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs mt-1">
                Selecione o membro para adicionar uma cota ao evento.
            </DialogDescription>
            </DialogHeader>

            {/* BUSCA FIXA NO TOPO */}
            <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                    placeholder="Buscar por nome ou tag..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-[#0b0d14] border-[#2f3245] pl-10 focus-visible:ring-green-500 h-11 text-sm"
                    autoFocus
                />
            </div>
        </div>

        {/* LISTA DE MEMBROS */}
        <div className="max-h-[300px] overflow-y-auto p-2 space-y-1 bg-[#1e202b] scrollbar-thin scrollbar-thumb-[#2f3245] scrollbar-track-transparent">
          {filteredMembers.length > 0 ? (
              filteredMembers.map(m => (
                <div
                  key={m.id}
                  onClick={() => handleAdd(m.id)}
                  className="flex justify-between items-center p-3 rounded-xl border border-transparent hover:bg-[#252836] hover:border-[#2f3245] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-[#2f3245] bg-[#0b0d14]">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.avatarSeed || m.name}`} />
                        <AvatarFallback className="text-xs bg-slate-800 text-slate-400">{m.name.substring(0,2)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-200 group-hover:text-white transition-colors">
                              {m.name}
                          </span>
                          <Badge variant="outline" className={`text-[9px] h-4 px-1 rounded border ${getRoleStyle(m.role)}`}>
                              {formatRole(m.role)}
                          </Badge>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                          <Shield className="w-2.5 h-2.5" /> {m.tag}
                      </span>
                    </div>
                  </div>

                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 rounded-full bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all"
                    disabled={addingId === m.id}
                  >
                    {addingId === m.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Plus className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              ))
          ) : (
              // ESTADO VAZIO
              <div className="flex flex-col items-center justify-center py-8 text-slate-500 gap-2">
                  <div className="bg-[#252836] p-4 rounded-full">
                    <UserX className="w-8 h-8 opacity-50" />
                  </div>
                  <p className="text-sm">Nenhum membro encontrado.</p>
              </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}