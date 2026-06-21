import { TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, XCircle } from "lucide-react";
import { Member } from "../types";
import { MemberActionMenu } from "../MemberActionMenu";
import { WarStatusBadge } from "./StatusBadges";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MemberRowProps {
  member: Member;
  currentUserRole: string; // ✅ GARANTIA: Recebe o cargo exato (ex: "LIDER", "COLIDER")
  onEdit: (m: Member) => void;
  onDelete: (id: string) => void;
  getDaysOffline: (d?: Date | string | null) => number;
}

// Helpers
const getRoleBadge = (role: string) => {
  switch(role) {
    case "LIDER": return "bg-primary/15 text-primary border-primary/40";
    case "COLIDER": return "bg-primary/10 text-primary/80 border-primary/25";
    case "ANCIAO": return "bg-secondary text-foreground/80 border-border";
    default: return "bg-muted text-muted-foreground border-border";
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

export function MemberRow({ member, currentUserRole, onEdit, onDelete, getDaysOffline }: MemberRowProps) {
  const daysOff = getDaysOffline(member.lastSeen);
  const isInactive = daysOff >= 5; 
  const isInGroup = !!member.phone; 

  return (
    <TableRow className={`border-border transition-colors group ${isInactive ? 'bg-destructive/5 hover:bg-destructive/10' : 'hover:bg-accent'}`}>
      
      {/* Coluna GUERREIRO */}
      <TableCell className="py-4 pl-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-border bg-background shadow-sm">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.avatarSeed || member.name}`} />
            <AvatarFallback className="bg-muted text-muted-foreground text-xs">{member.name.substring(0,2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className={`font-bold truncate max-w-[140px] ${member.role === 'LIDER' ? 'text-primary' : 'text-foreground'}`}>
                {member.name}
              </span>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {isInGroup ? (
                      <a 
                        href={getWhatsAppLink(member.phone!)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-success hover:text-success/80 transition-colors bg-success/10 p-1 rounded-md"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <div className="text-muted-foreground bg-muted/50 p-1 rounded-md cursor-help opacity-50 hover:opacity-100 transition-opacity">
                         <XCircle className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </TooltipTrigger>
                  <TooltipContent className="bg-popover border-border text-popover-foreground text-xs">
                    {isInGroup ? `WhatsApp: ${member.phone}` : "Sem WhatsApp cadastrado"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="secondary" className="text-[9px] h-4 px-1 bg-background border-border text-muted-foreground hover:bg-background">
                TH {member.thLevel}
              </Badge>
              <span className="text-[10px] text-muted-foreground font-mono tracking-tight">{member.tag}</span>
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

      {/* Coluna ATIVIDADE */}
      <TableCell className="text-center">
        <div className="flex flex-col items-center justify-center">
            <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full border ${
              daysOff === 0
                ? 'text-success bg-success/5 border-success/20'
                : isInactive
                  ? 'text-destructive bg-destructive/10 border-destructive/30 animate-pulse'
                  : 'text-muted-foreground border-transparent'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${daysOff === 0 ? 'bg-success' : isInactive ? 'bg-destructive' : 'bg-muted-foreground'}`} />
              {daysOff === 0 ? "Online Hoje" : `${daysOff} dias off`}
            </div>
            {isInactive && (
                <span className="text-[9px] text-destructive font-bold uppercase tracking-wider mt-1">Expulsar</span>
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
          currentUserRole={currentUserRole} // ✅ Passando a prop corretamente
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      </TableCell>
    </TableRow>
  );
}