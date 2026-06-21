"use client";

import { useState } from "react";
import { 
  Search, Shield, ShieldAlert, Copy, Check, AlertCircle, Lock, 
  Filter, Users, UserX, UserCheck 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Member } from "./types";

interface PreparationViewProps {
  members: Member[];
  currentUserTag: string;
  isAdmin: boolean;
  onToggleStatus: (id: string, tag: string) => Promise<void>;
}

export function PreparationView({ members, currentUserTag, isAdmin, onToggleStatus }: PreparationViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'in' | 'out'>('all');
  const [copied, setCopied] = useState(false);

  // --- LÓGICA DE FILTRO ---
  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.tag.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' 
      ? true 
      : statusFilter === 'in' ? m.warStatus === 'IN' : m.warStatus === 'OUT';

    return matchesSearch && matchesStatus;
  });

  // --- ESTATÍSTICAS ---
  const activeCount = members.filter(m => m.warStatus === 'IN').length;
  // Calcula o próximo tamanho de guerra ideal (10, 15, 20...)
  const nextWarSize = Math.ceil((activeCount + 1) / 5) * 5; 
  const neededForWar = nextWarSize - activeCount;
  const isExactSize = activeCount % 5 === 0 && activeCount >= 10;

  const canToggle = (targetTag: string) => isAdmin || targetTag === currentUserTag;

  // --- VISUAL DO TH ---
  const getThStyle = (level: number) => {
    if (level >= 15) return "bg-primary/50 text-primary border-primary/50"; // TH Alto
    if (level >= 12) return "bg-primary/50 text-primary border-primary/50";     // TH Médio
    return "bg-muted text-muted-foreground border-border";                          // TH Baixo
  };

  // --- TEXTO WHATSAPP ---
  const generateListText = () => {
    const activeMembers = members.filter(m => m.warStatus === 'IN');
    // Ordena por TH (maior para menor) para ficar bonito na lista
    activeMembers.sort((a, b) => b.thLevel - a.thLevel);

    const date = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    
    let text = `⚔️ *GUERRA ${date}* ⚔️\n`;
    text += `🔥 *${activeMembers.length} Guerreiros Confirmados*\n\n`;
    text += `👇 *Escalação:*\n`;
    
    activeMembers.forEach((m, index) => {
      text += `${index + 1}. ${m.name} (CV${m.thLevel})\n`;
    });
    
    text += `\n⚠️ *Mantenham o status atualizado!*`;
    return text;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateListText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUNA ESQUERDA: LISTA */}
        <div className="lg:col-span-2 space-y-4">
            
            {/* Barra de Ferramentas */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar guerreiro..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="pl-10 bg-background border-border text-white focus-visible:ring-primary" 
                    />
                </div>
                
                <div className="flex bg-background p-1 rounded-lg border border-border shrink-0">
                    <Button 
                        size="sm" 
                        variant={statusFilter === 'all' ? 'secondary' : 'ghost'} 
                        onClick={() => setStatusFilter('all')}
                        className="h-8 text-xs gap-1"
                    >
                        <Users className="w-3 h-3"/> Todos
                    </Button>
                    <Button 
                        size="sm" 
                        variant={statusFilter === 'in' ? 'secondary' : 'ghost'} 
                        onClick={() => setStatusFilter('in')}
                        className={`h-8 text-xs gap-1 ${statusFilter === 'in' ? 'text-success' : 'text-muted-foreground'}`}
                    >
                        <UserCheck className="w-3 h-3"/> IN
                    </Button>
                    <Button 
                        size="sm" 
                        variant={statusFilter === 'out' ? 'secondary' : 'ghost'} 
                        onClick={() => setStatusFilter('out')}
                        className={`h-8 text-xs gap-1 ${statusFilter === 'out' ? 'text-destructive' : 'text-muted-foreground'}`}
                    >
                        <UserX className="w-3 h-3"/> OUT
                    </Button>
                </div>
            </div>

            {/* Lista de Membros */}
            <div className="panel-clash overflow-hidden shadow-lg">
                <CardHeader className="bg-card border-b border-border py-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Filter className="w-4 h-4"/> Alistamento
                    </CardTitle>
                    <Badge variant="outline" className="bg-background border-border text-muted-foreground">
                        {filteredMembers.length}
                    </Badge>
                </CardHeader>
                
                <div className="h-[500px]">
                    <ScrollArea className="h-full">
                        <div className="divide-y divide-border">
                            {filteredMembers.length > 0 ? filteredMembers.map((member) => {
                                const isMe = member.tag === currentUserTag;
                                const canChange = canToggle(member.tag);
                                
                                return (
                                    <div 
                                        key={member.id} 
                                        onClick={() => canChange && onToggleStatus(member.id, member.tag)} 
                                        className={`
                                            flex items-center justify-between p-4 transition-all duration-200 group
                                            ${canChange ? 'cursor-pointer hover:bg-accent' : 'opacity-60 cursor-not-allowed bg-background'} 
                                            ${member.warStatus === 'IN' ? 'bg-success/5 border-l-4 border-l-success' : 'border-l-4 border-l-transparent'} 
                                            ${isMe ? 'bg-primary/10' : ''}
                                        `}
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Ícone Status */}
                                            <div className={`
                                                w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all shadow-lg
                                                ${member.warStatus === 'IN' 
                                                    ? 'bg-success/10 border-success text-success shadow-success/20' 
                                                    : 'bg-muted border-border text-muted-foreground'}
                                            `}>
                                                {member.warStatus === 'IN' ? <Shield className="w-5 h-5 fill-current" /> : <ShieldAlert className="w-5 h-5" />}
                                            </div>
                                            
                                            {/* Info Membro */}
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className={`font-bold text-sm ${member.warStatus === 'IN' ? 'text-white' : 'text-muted-foreground'}`}>
                                                        {member.name}
                                                    </p>
                                                    {isMe && <Badge className="bg-primary text-[9px] h-4 px-1 hover:bg-primary">VOCÊ</Badge>}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline" className={`text-[10px] h-4 px-1 font-mono border ${getThStyle(member.thLevel)}`}>
                                                        TH {member.thLevel}
                                                    </Badge>
                                                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{member.role}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Toggle Action */}
                                        <div className="flex items-center gap-4">
                                            <span className={`text-xs font-bold uppercase w-12 text-right transition-colors ${member.warStatus === 'IN' ? 'text-success' : 'text-muted-foreground'}`}>
                                                {member.warStatus === 'IN' ? 'DENTRO' : 'FORA'}
                                            </span>
                                            <div onClick={(e) => e.stopPropagation()}>
                                                {canChange ? (
                                                    <Switch 
                                                        checked={member.warStatus === 'IN'} 
                                                        onCheckedChange={() => onToggleStatus(member.id, member.tag)}
                                                        className="data-[state=checked]:bg-success data-[state=unchecked]:bg-muted" 
                                                    />
                                                ) : (
                                                    <Lock className="w-4 h-4 text-muted-foreground" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                                    <Filter className="w-10 h-10 mb-2 opacity-20"/>
                                    <p>Nenhum guerreiro encontrado.</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>

        {/* COLUNA DIREITA: RESUMO & COPY */}
        <div className="space-y-6">
            
            {/* Card de Status do Time */}
            <div className={`panel-clash shadow-lg transition-colors ${isExactSize ? '!border-success/40' : ''}`}>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Tamanho da Guerra</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end justify-between mb-2">
                        <div className="text-3xl font-bold text-white">{activeCount} <span className="text-lg text-muted-foreground font-medium">/ {nextWarSize}</span></div>
                        <Badge variant={isExactSize ? "default" : "secondary"} className={isExactSize ? "bg-success" : "bg-primary text-black"}>
                            {isExactSize ? "Time Fechado" : `Faltam ${neededForWar}`}
                        </Badge>
                    </div>
                    
                    <Progress 
                        value={(activeCount % 5 === 0 && activeCount > 0) ? 100 : (activeCount % 5) * 20} 
                        className="h-2 bg-muted" 
                        indicatorClassName={isExactSize ? "bg-success" : "bg-primary"} 
                    />
                    
                    <div className="mt-3 flex gap-2 items-start bg-background p-2 rounded text-xs text-muted-foreground">
                        <AlertCircle className={`w-4 h-4 shrink-0 ${isExactSize ? 'text-success' : 'text-primary'}`} />
                        <p>
                            {isExactSize 
                                ? "Número de participantes válido (múltiplo de 5)." 
                                : `Precisa de mais ${neededForWar} ou remover ${activeCount % 5} para fechar guerra de ${nextWarSize}vs${nextWarSize}.`
                            }
                        </p>
                    </div>
                </CardContent>
            </div>

            {/* Card do WhatsApp */}
            <div className="panel-clash shadow-lg sticky top-6">
                <CardHeader className="bg-card border-b border-border pb-4">
                    <CardTitle className="text-white flex items-center gap-2 text-lg">
                        <Copy className="w-5 h-5 text-success" /> WhatsApp
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="bg-background p-4 min-h-[250px] max-h-[400px] overflow-y-auto text-[11px] font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed border-b border-border">
                        {generateListText()}
                    </div>
                </CardContent>
                <div className="p-4 bg-card">
                    <Button 
                        className="btn-clash-green w-full h-12 text-lg gap-2 shadow-xl" 
                        onClick={copyToClipboard}
                    >
                        {copied ? <><Check className="w-5 h-5" /> Copiado!</> : <><Copy className="w-5 h-5" /> Copiar Lista</>}
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
}