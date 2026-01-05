import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Member } from "./types";
import { TableEmptyState } from "./table/TableEmptyState";
import { MemberRow } from "./table/MemberRow";

interface MembrosTableProps {
  members: Member[];
  isHighCommand: boolean;
  onEdit: (m: Member) => void;
  onDelete: (id: string) => void;
  getDaysOffline: (d?: Date | string | null) => number;
}

export function MembrosTable({ members, isHighCommand, onEdit, onDelete, getDaysOffline }: MembrosTableProps) {
  
  if (members.length === 0) {
    return <TableEmptyState />;
  }

  return (
    <div className="rounded-xl border border-[#2f3245] bg-[#1e202b] overflow-hidden shadow-xl">
      <Table>
        <TableHeader className="bg-[#15161e] border-b border-[#2f3245]">
          <TableRow className="hover:bg-transparent border-[#2f3245]">
            <TableHead className="text-slate-500 text-xs w-[280px] pl-6">GUERREIRO</TableHead>
            <TableHead className="text-slate-500 text-xs">CARGO</TableHead>
            <TableHead className="text-center text-slate-500 text-xs">ATIVIDADE</TableHead>
            <TableHead className="text-center text-slate-500 text-xs">WAR STATUS</TableHead>
            <TableHead className="text-right text-slate-500 text-xs pr-6">AÇÕES</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <MemberRow 
                key={member.id}
                member={member}
                isHighCommand={isHighCommand}
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