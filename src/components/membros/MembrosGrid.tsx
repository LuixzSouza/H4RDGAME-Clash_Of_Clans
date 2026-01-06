import { Shield } from "lucide-react";
import { Member } from "./types";
import { MemberCard } from "./grid/MemberCard"; 

interface MembrosGridProps {
  members: Member[];
  currentUserRole: string; // ✅ CORRIGIDO: Recebe a string do cargo
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
}

export function MembrosGrid({ members, currentUserRole, onEdit, onDelete }: MembrosGridProps) {

  // Tratamento para lista vazia
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
            currentUserRole={currentUserRole} // ✅ Passando para o card
            onEdit={onEdit}
            onDelete={onDelete}
        />
      ))}
    </div>
  );
}