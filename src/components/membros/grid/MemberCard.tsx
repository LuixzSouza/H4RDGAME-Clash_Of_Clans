import { Shield, ShieldAlert, Star, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Member } from "../types";
import { MemberActionMenu } from "../MemberActionMenu";

interface MemberCardProps {
  member: Member;
  currentUserRole: string; // ✅ CORRIGIDO: Recebe a string do cargo
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
}

// Helpers
const getRoleBadge = (role: string) => {
  switch(role) {
    case "LIDER": return "bg-red-900/30 text-red-400 border-red-600 font-bold";
    case "COLIDER": return "bg-orange-900/30 text-orange-400 border-orange-500 font-bold";
    case "ANCIAO": return "bg-blue-900/30 text-blue-400 border-blue-500";
    default: return "bg-slate-800 text-slate-400 border-slate-600";
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

export function MemberCard({ member, currentUserRole, onEdit, onDelete }: MemberCardProps) {
  return (
    <Card className="bg-[#1e202b] border-[#2f3245] overflow-hidden group hover:border-slate-500 transition-all relative">
      
      {/* Menu de Ações (Posicionado Absoluto) */}
      <div className="absolute top-2 right-2 z-10">
        <MemberActionMenu 
            member={member} 
            currentUserRole={currentUserRole} // ✅ Passando a string correta para o menu
            onEdit={onEdit} 
            onDelete={onDelete} 
        />
      </div>

      <CardContent className="p-5 flex flex-col items-center text-center pt-8">
        
        {/* Avatar Grande */}
        <div className="relative mb-3">
            <Avatar className="h-20 w-20 border-4 border-[#15161e] shadow-lg">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.avatarSeed || member.name}`} />
                <AvatarFallback className="bg-slate-700 text-xl font-bold text-slate-300">
                    {member.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            {/* Indicador de TH Flutuante */}
            <div className="absolute -bottom-2 -right-2 bg-[#15161e] border border-[#2f3245] text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                TH {member.thLevel}
            </div>
        </div>

        {/* Informações Principais */}
        <div className="flex items-center gap-2 justify-center w-full">
            <h3 className={`font-bold text-lg truncate max-w-[150px] ${member.role === 'LIDER' ? 'text-red-400' : 'text-white'}`}>
                {member.name}
            </h3>
            {/* WhatsApp Icon no Grid */}
            {member.phone && (
                <a 
                  href={getWhatsAppLink(member.phone)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-green-500 hover:text-green-400 transition-colors bg-green-500/10 p-1 rounded-full"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
            )}
        </div>
        
        <span className="text-[10px] text-slate-500 font-mono mb-2">{member.tag}</span>
        
        <Badge variant="outline" className={`${getRoleBadge(member.role as string)} mb-4`}>
            {formatRole(member.role as string)}
        </Badge>
        
        {/* Grid de Status Interno */}
        <div className="grid grid-cols-2 gap-2 w-full mt-auto">
            
            {/* Status Guerra */}
            <div className={`p-2 rounded border flex flex-col items-center justify-center gap-1 ${
                member.warStatus === 'IN' 
                ? 'bg-green-500/5 border-green-500/20' 
                : 'bg-red-500/5 border-red-500/20'
            }`}>
                <span className="text-[9px] text-slate-500 uppercase font-bold">Guerra</span>
                {member.warStatus === 'IN' ? (
                    <div className="flex items-center gap-1 text-green-400 text-xs font-bold">
                        <Shield className="w-3 h-3 fill-current" /> IN
                    </div>
                ) : (
                    <div className="flex items-center gap-1 text-red-400 text-xs font-bold">
                        <ShieldAlert className="w-3 h-3" /> OUT
                    </div>
                )}
            </div>

            {/* Status Tickets */}
            <div className={`p-2 rounded border border-[#2f3245] bg-[#15161e] flex flex-col items-center justify-center gap-1`}>
                <span className="text-[9px] text-slate-500 uppercase font-bold">Tickets</span>
                <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                    <Star className="w-3 h-3 fill-current" /> {member.tickets || 0}
                </div>
            </div>
        </div>

      </CardContent>
    </Card>
  );
}