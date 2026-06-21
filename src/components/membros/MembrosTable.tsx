import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Member } from "./types";
import { TableEmptyState } from "./table/TableEmptyState";
import { MemberRow } from "./table/MemberRow";

interface MembrosTableProps {
  members: Member[];
  currentUserRole: string; // MUDANÇA: Agora recebemos o cargo exato, não apenas se é comando
  onEdit: (m: Member) => void;
  onDelete: (id: string) => void;
  getDaysOffline: (d?: Date | string | null) => number;
}

export function MembrosTable({ members, currentUserRole, onEdit, onDelete, getDaysOffline }: MembrosTableProps) {
  
  if (members.length === 0) {
    return <TableEmptyState />;
  }

  return (
    <div className="panel-clash overflow-hidden shadow-xl">
      <Table>
        <TableHeader className="bg-background border-b border-border">
          <TableRow className="hover:bg-transparent border-border">
            <TableHead className="text-muted-foreground text-xs w-[280px] pl-6">GUERREIRO</TableHead>
            <TableHead className="text-muted-foreground text-xs">CARGO</TableHead>
            <TableHead className="text-center text-muted-foreground text-xs">ATIVIDADE</TableHead>
            <TableHead className="text-center text-muted-foreground text-xs">WAR STATUS</TableHead>
            <TableHead className="text-right text-muted-foreground text-xs pr-6">AÇÕES</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <MemberRow 
                key={member.id}
                member={member}
                currentUserRole={currentUserRole} // Passando o cargo para a linha fazer a verificação
                onEdit={onEdit}
                onDelete={onDelete}
                getDaysOffline={getDaysOffline}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}