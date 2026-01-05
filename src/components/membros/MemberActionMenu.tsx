"use client";

import { 
  MoreHorizontal, Edit, Trash2, Lock, Copy, Phone, Eye, ExternalLink, ShieldCheck 
} from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuGroup 
} from "@/components/ui/dropdown-menu";
import { Member } from "./types";
import { useState } from "react";
import { markAsSeen } from "@/app/dashboard/membros/actions";

interface MemberActionMenuProps {
  member: Member;
  isHighCommand: boolean;
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
}

export function MemberActionMenu({ member, isHighCommand, onEdit, onDelete }: MemberActionMenuProps) {
  const [copied, setCopied] = useState(false);

  const copyTag = () => {
    navigator.clipboard.writeText(member.tag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openWhatsApp = () => {
    if (member.phone) {
        const cleanNum = member.phone.replace(/\D/g, '');
        window.open(`https://wa.me/55${cleanNum}`, '_blank');
    }
  };

  const handleMarkSeen = async () => {
      try {
        await markAsSeen(member.id);
        // O revalidatePath no server action atualizará a tabela automaticamente
      } catch (e) {
        console.error("Erro ao marcar como visto", e);
      }
  };

  // Se não for liderança, mostra apenas um ícone travado visual
  if (!isHighCommand) {
    return (
        <div className="flex justify-end opacity-20 cursor-not-allowed" title="Acesso Restrito">
            <Lock className="w-4 h-4 text-slate-400"/>
        </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-[#2f3245] data-[state=open]:bg-[#2f3245] data-[state=open]:text-white transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="bg-[#1e202b] border-[#2f3245] text-slate-300 w-64 shadow-2xl p-2">
        
        {/* CABEÇALHO DO MEMBRO */}
        <DropdownMenuLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 flex justify-between items-center">
            <span>Ações</span>
            <span className="text-[10px] font-mono text-slate-600">{member.tag}</span>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-[#2f3245] my-1" />

        {/* GRUPO 1: COMUNICAÇÃO & DADOS */}
        <DropdownMenuGroup>
            <DropdownMenuItem onClick={copyTag} className="cursor-pointer hover:bg-[#2f3245] focus:bg-[#2f3245] gap-2 rounded-md">
                <Copy className={`w-4 h-4 ${copied ? "text-green-500" : "text-blue-400"}`} /> 
                {copied ? "Tag Copiada!" : "Copiar Tag"}
            </DropdownMenuItem>

            {member.phone && (
                <DropdownMenuItem onClick={openWhatsApp} className="cursor-pointer hover:bg-[#2f3245] focus:bg-[#2f3245] gap-2 rounded-md">
                    <Phone className="w-4 h-4 text-green-400" /> Chamar no Zap
                    <ExternalLink className="w-3 h-3 text-slate-600 ml-auto" />
                </DropdownMenuItem>
            )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-[#2f3245] my-1" />

        {/* GRUPO 2: GESTÃO TÁTICA */}
        <DropdownMenuLabel className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2 py-1">Administração</DropdownMenuLabel>
        <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleMarkSeen} className="cursor-pointer hover:bg-[#2f3245] focus:bg-[#2f3245] gap-2 rounded-md">
                <Eye className="w-4 h-4 text-emerald-400" /> 
                <div className="flex flex-col">
                    <span>Marcar como Online</span>
                    <span className="text-[9px] text-slate-500 leading-none">Zerar contador de dias</span>
                </div>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onEdit(member)} className="cursor-pointer hover:bg-[#2f3245] focus:bg-[#2f3245] gap-2 rounded-md text-white">
                <Edit className="w-4 h-4 text-yellow-500" /> Editar Dados
            </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-[#2f3245] my-1" />
        
        {/* GRUPO 3: ZONA DE PERIGO (EXPULSÃO) */}
        <DropdownMenuItem 
            onClick={() => onDelete(member.id)} 
            className="group cursor-pointer hover:bg-red-950/30 focus:bg-red-950/30 gap-2 rounded-md mt-1"
        >
            <div className="p-1 bg-red-500/10 rounded group-hover:bg-red-500 text-red-500 group-hover:text-white transition-colors">
                <Trash2 className="w-4 h-4" />
            </div>
            <span className="text-red-500 font-medium group-hover:text-red-400">Expulsar do Clã</span>
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}