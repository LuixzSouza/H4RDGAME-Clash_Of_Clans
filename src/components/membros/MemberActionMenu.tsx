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
                        <Lock className="w-4 h-4 text-muted-foreground group-hover:text-destructive transition-colors"/>
                    </div>
                </TooltipTrigger>
                <TooltipContent className="bg-popover border-destructive/50 text-popover-foreground text-xs p-3 shadow-xl z-50">
                    <p className="font-bold text-destructive mb-1 flex items-center gap-1">
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
        <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent data-[state=open]:bg-accent data-[state=open]:text-foreground transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground w-64 shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200">

        {/* CABEÇALHO */}
        <DropdownMenuLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2 flex justify-between items-center bg-background rounded py-1.5 mb-1">
            <span className="flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-success" /> Gestão
            </span>
            <span className="text-[10px] font-mono text-muted-foreground bg-card px-1.5 rounded">{member.tag}</span>
        </DropdownMenuLabel>
        
        <DropdownMenuGroup>
            <DropdownMenuItem onClick={copyTag} className="cursor-pointer hover:bg-accent focus:bg-accent gap-2 rounded-md transition-colors">
                <Copy className={`w-4 h-4 ${copied ? "text-success" : "text-primary"}`} />
                {copied ? "Copiado!" : "Copiar Tag"}
            </DropdownMenuItem>

            {member.phone && (
                <DropdownMenuItem onClick={openWhatsApp} className="cursor-pointer hover:bg-accent focus:bg-accent gap-2 rounded-md transition-colors">
                    <Phone className="w-4 h-4 text-success" /> WhatsApp
                    <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto" />
                </DropdownMenuItem>
            )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-border my-1 opacity-50" />

        <DropdownMenuLabel className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest px-2 py-1">Controle</DropdownMenuLabel>
        <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleMarkSeen} className="cursor-pointer hover:bg-accent focus:bg-accent gap-2 rounded-md transition-colors">
                <Eye className="w-4 h-4 text-success" />
                <div className="flex flex-col">
                    <span className="font-medium">Confirmar Presença</span>
                    <span className="text-[9px] text-muted-foreground leading-none">Reseta dias offline</span>
                </div>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onEdit(member)} className="cursor-pointer hover:bg-accent focus:bg-accent gap-2 rounded-md text-white transition-colors">
                <Edit className="w-4 h-4 text-primary" /> Editar Dados
            </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-border my-1 opacity-50" />
        
        {/* GRUPO 3: ZONA DE PERIGO */}
        {/* Se o alvo for LÍDER, esconde o botão de expulsar para evitar auto-delete acidental */}
        {!isTargetLeader ? (
            <DropdownMenuItem 
                onClick={() => onDelete(member.id)} 
                className="group cursor-pointer hover:bg-destructive/15 focus:bg-destructive/15 gap-2 rounded-md mt-1 transition-all"
            >
                <div className="p-1.5 bg-destructive/10 rounded group-hover:bg-destructive text-destructive group-hover:text-destructive-foreground transition-colors">
                    <Trash2 className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                    <span className="text-destructive font-bold text-xs group-hover:text-destructive/80">EXPULSAR MEMBRO</span>
                    <span className="text-[9px] text-destructive/60 group-hover:text-destructive/80">Ação irreversível</span>
                </div>
            </DropdownMenuItem>
        ) : (
            <div className="px-2 py-1 text-[9px] text-muted-foreground text-center italic">
                Líderes não podem ser expulsos.
            </div>
        )}

      </DropdownMenuContent>
    </DropdownMenu>
  );
}