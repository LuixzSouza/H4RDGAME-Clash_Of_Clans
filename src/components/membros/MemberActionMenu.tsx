"use client";

import { useState } from "react";
import { 
  MoreHorizontal, Edit, Trash2, Lock, Copy, Phone, Eye, ExternalLink, ShieldAlert, Shield
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Member } from "./types"; 
import { markAsSeen } from "@/app/dashboard/membros/actions";

// --- FUNÇÃO AUXILIAR DE PESO ---
const getRoleWeight = (role: string | undefined | null) => {
  if (!role) return 0;
  const normalized = role.toString().toUpperCase().trim();

  if (['LIDER', 'LÍDER', 'LEADER'].includes(normalized)) return 4;
  if (['COLIDER', 'COLÍDER', 'COLEADER', 'CO-LEADER'].includes(normalized)) return 3;
  if (['ANCIAO', 'ANCIÃO', 'ELDER', 'ADMIN'].includes(normalized)) return 2;
  if (['MEMBRO', 'MEMBER'].includes(normalized)) return 1;

  return 0;
};

interface MemberActionMenuProps {
  member: Member;
  currentUserRole: string; 
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
}

export function MemberActionMenu({ member, currentUserRole, onEdit, onDelete }: MemberActionMenuProps) {
  const [copied, setCopied] = useState(false);

  // --- LÓGICA DE PERMISSÃO CORRIGIDA ---
  const hasPermission = () => {
    const myWeight = getRoleWeight(currentUserRole);
    const targetWeight = getRoleWeight(member.role);

    // REGRA 1: Se eu sou LÍDER (4), posso editar tudo (inclusive eu mesmo)
    if (myWeight === 4) return true;

    // REGRA 2: Para os demais (Colíderes), só pode mexer em quem é MENOR
    // Colíder (3) não mexe em Colíder (3) nem Líder (4)
    return myWeight > targetWeight;
  };

  const canManage = hasPermission();
  const isTargetLeader = getRoleWeight(member.role) === 4;

  // Funções de Ação
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
      } catch (e) {
        console.error("Erro ao marcar como visto", e);
      }
  };

  // --- RENDERIZAÇÃO ---

  // CASO 1: SEM PERMISSÃO (Cadeado)
  if (!canManage) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex justify-end px-2 opacity-40 cursor-not-allowed group">
                        <Lock className="w-4 h-4 text-slate-500 group-hover:text-red-400 transition-colors"/>
                    </div>
                </TooltipTrigger>
                <TooltipContent className="bg-[#1e202b] border-red-900/50 text-slate-300 text-xs p-3 shadow-xl z-50">
                    <p className="font-bold text-red-400 mb-1 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> Acesso Negado
                    </p>
                    <p>Hierarquia insuficiente.</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
  }

  // CASO 2: COM PERMISSÃO (Menu Completo)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-[#2f3245] data-[state=open]:bg-[#2f3245] data-[state=open]:text-white transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="bg-[#1e202b] border-[#2f3245] text-slate-300 w-64 shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200">
        
        {/* CABEÇALHO */}
        <DropdownMenuLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 flex justify-between items-center bg-[#15161e] rounded py-1.5 mb-1">
            <span className="flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-emerald-500" /> Gestão
            </span>
            <span className="text-[10px] font-mono text-slate-600 bg-[#1e202b] px-1.5 rounded">{member.tag}</span>
        </DropdownMenuLabel>
        
        <DropdownMenuGroup>
            <DropdownMenuItem onClick={copyTag} className="cursor-pointer hover:bg-[#2f3245] focus:bg-[#2f3245] gap-2 rounded-md transition-colors">
                <Copy className={`w-4 h-4 ${copied ? "text-green-500" : "text-blue-400"}`} /> 
                {copied ? "Copiado!" : "Copiar Tag"}
            </DropdownMenuItem>

            {member.phone && (
                <DropdownMenuItem onClick={openWhatsApp} className="cursor-pointer hover:bg-[#2f3245] focus:bg-[#2f3245] gap-2 rounded-md transition-colors">
                    <Phone className="w-4 h-4 text-green-400" /> WhatsApp
                    <ExternalLink className="w-3 h-3 text-slate-600 ml-auto" />
                </DropdownMenuItem>
            )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-[#2f3245] my-1 opacity-50" />

        <DropdownMenuLabel className="text-[9px] font-bold text-slate-600 uppercase tracking-widest px-2 py-1">Controle</DropdownMenuLabel>
        <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleMarkSeen} className="cursor-pointer hover:bg-[#2f3245] focus:bg-[#2f3245] gap-2 rounded-md transition-colors">
                <Eye className="w-4 h-4 text-emerald-400" /> 
                <div className="flex flex-col">
                    <span className="font-medium">Confirmar Presença</span>
                    <span className="text-[9px] text-slate-500 leading-none">Reseta dias offline</span>
                </div>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onEdit(member)} className="cursor-pointer hover:bg-[#2f3245] focus:bg-[#2f3245] gap-2 rounded-md text-white transition-colors">
                <Edit className="w-4 h-4 text-yellow-500" /> Editar Dados
            </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-[#2f3245] my-1 opacity-50" />
        
        {/* GRUPO 3: ZONA DE PERIGO */}
        {/* Se o alvo for LÍDER, esconde o botão de expulsar para evitar auto-delete acidental */}
        {!isTargetLeader ? (
            <DropdownMenuItem 
                onClick={() => onDelete(member.id)} 
                className="group cursor-pointer hover:bg-red-950/30 focus:bg-red-950/30 gap-2 rounded-md mt-1 transition-all"
            >
                <div className="p-1.5 bg-red-500/10 rounded group-hover:bg-red-600 text-red-500 group-hover:text-white transition-colors">
                    <Trash2 className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                    <span className="text-red-500 font-bold text-xs group-hover:text-red-400">EXPULSAR MEMBRO</span>
                    <span className="text-[9px] text-red-500/60 group-hover:text-red-400/80">Ação irreversível</span>
                </div>
            </DropdownMenuItem>
        ) : (
            <div className="px-2 py-1 text-[9px] text-slate-600 text-center italic">
                Líderes não podem ser expulsos.
            </div>
        )}

      </DropdownMenuContent>
    </DropdownMenu>
  );
}