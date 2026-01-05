import { Shield } from "lucide-react";
import { Member } from "./types";
import { MemberCard } from "./grid/MemberCard"; // Importando o subcomponente

interface MembrosGridProps {
  members: Member[];
  isHighCommand: boolean;
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
}

export function MembrosGrid({ members, isHighCommand, onEdit, onDelete }: MembrosGridProps) {

  // Tratamento para lista vazia (Reutilizando estilo do TableEmptyState mas adaptado)
  if (members.length === 0) {
    return (
      <div className="col-span-full rounded-xl border border-[#2f3245] bg-[#1e202b] p-12 flex flex-col items-center justify-center text-slate-500">
        <Shield className="w-12 h-12 mb-4 opacity-20" />
        <p>Nenhum guerreiro encontrado.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {members.map((member) => (
        <MemberCard 
            key={member.id}
            member={member}
            isHighCommand={isHighCommand}
            onEdit={onEdit}
            onDelete={onDelete}
        />
      ))}
    </div>
  );
}