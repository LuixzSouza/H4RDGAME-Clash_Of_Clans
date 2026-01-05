import { TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Phone, XCircle, CheckCircle2 } from "lucide-react"; // Novos ícones
import { Member } from "../types";
import { MemberActionMenu } from "../MemberActionMenu";
import { WarStatusBadge } from "./StatusBadges";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MemberRowProps {
  member: Member;
  isHighCommand: boolean;
  onEdit: (m: Member) => void;
  onDelete: (id: string) => void;
  getDaysOffline: (d?: Date | string | null) => number;
}

// Helpers
const getRoleBadge = (role: string) => {
  switch(role) {
    case "LIDER": return "bg-red-500/10 text-red-400 border-red-500/20";
    case "COLIDER": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    case "ANCIAO": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    default: return "bg-slate-800 text-slate-400 border-slate-700";
  }
};

const formatRole = (role: string) => {
  const roles: Record<string, string> = { "LIDER": "Líder", "COLIDER": "Colíder", "ANCIAO": "Ancião", "MEMBRO": "Membro" };
  return roles[role] || role;
};

const getWhatsAppLink = (phone: string) => {
  const cleanNum = phone.replace(/\D/g, '');
  return `https://wa.me/55${cleanNum}`;
};

export function MemberRow({ member, isHighCommand, onEdit, onDelete, getDaysOffline }: MemberRowProps) {
  const daysOff = getDaysOffline(member.lastSeen);
  const isInactive = daysOff >= 5; // Regra de expulsão: 5 dias
  const isInGroup = !!member.phone; // Se tem telefone, consideramos que está no grupo/contato

  return (
    <TableRow className={`border-[#2f3245] transition-colors group ${isInactive ? 'bg-red-950/10 hover:bg-red-950/20' : 'hover:bg-[#252836]'}`}>
      
      {/* Coluna GUERREIRO */}
      <TableCell className="py-4 pl-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-[#2f3245] bg-[#15161e] shadow-sm">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.avatarSeed || member.name}`} />
            <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xs">{member.name.substring(0,2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className={`font-bold truncate max-w-[140px] ${member.role === 'LIDER' ? 'text-red-400' : 'text-zinc-100'}`}>
                {member.name}
              </span>
              
              {/* Indicador de Grupo WhatsApp */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {isInGroup ? (
                      <a 
                        href={getWhatsAppLink(member.phone!)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-green-500 hover:text-green-400 transition-colors bg-green-500/10 p-1 rounded-md"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <div className="text-slate-600 bg-slate-800/50 p-1 rounded-md cursor-help opacity-50 hover:opacity-100 transition-opacity">
                         <XCircle className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </TooltipTrigger>
                  <TooltipContent className="bg-black border-slate-800 text-white text-xs">
                    {isInGroup ? `WhatsApp: ${member.phone}` : "Sem WhatsApp cadastrado"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="secondary" className="text-[9px] h-4 px-1 bg-[#0c1216] border-[#2f3245] text-slate-500 hover:bg-[#0c1216]">
                TH {member.thLevel}
              </Badge>
              <span className="text-[10px] text-slate-600 font-mono tracking-tight">{member.tag}</span>
            </div>
          </div>
        </div>
      </TableCell>

      {/* Coluna CARGO */}
      <TableCell>
        <Badge variant="outline" className={`${getRoleBadge(member.role as string)} text-[10px] font-medium border`}>
          {formatRole(member.role as string)}
        </Badge>
      </TableCell>

      {/* Coluna ATIVIDADE (Lógica Aprimorada) */}
      <TableCell className="text-center">
        <div className="flex flex-col items-center justify-center">
            <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full border ${
              daysOff === 0 
                ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20' 
                : isInactive 
                  ? 'text-red-400 bg-red-500/10 border-red-500/30 animate-pulse' // Pisca se for expulsão
                  : 'text-slate-400 border-transparent'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${daysOff === 0 ? 'bg-emerald-500' : isInactive ? 'bg-red-500' : 'bg-slate-500'}`} />
              {daysOff === 0 ? "Online Hoje" : `${daysOff} dias off`}
            </div>
            {isInactive && (
                <span className="text-[9px] text-red-500 font-bold uppercase tracking-wider mt-1">Expulsar</span>
            )}
        </div>
      </TableCell>

      {/* Coluna STATUS GUERRA */}
      <TableCell className="text-center">
          <div className="flex justify-center">
            <WarStatusBadge status={member.warStatus} />
          </div>
      </TableCell>

      {/* Coluna AÇÕES */}
      <TableCell className="text-right pr-6">
        <MemberActionMenu 
          member={member} 
          isHighCommand={isHighCommand} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      </TableCell>
    </TableRow>
  );
}