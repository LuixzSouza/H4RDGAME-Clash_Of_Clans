"use client";

import { useState } from "react";
import { 
  Search, Shield, ShieldAlert, Copy, Check, AlertCircle, Lock, 
  Filter, Users, UserX, UserCheck 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    if (level >= 15) return "bg-purple-900/50 text-purple-200 border-purple-500/50"; // TH Alto
    if (level >= 12) return "bg-blue-900/50 text-blue-200 border-blue-500/50";     // TH Médio
    return "bg-slate-800 text-slate-400 border-slate-700";                          // TH Baixo
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
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input 
                        placeholder="Buscar guerreiro..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="pl-10 bg-[#15161e] border-[#2f3245] text-white focus-visible:ring-blue-500" 
                    />
                </div>
                
                <div className="flex bg-[#15161e] p-1 rounded-lg border border-[#2f3245] shrink-0">
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
                        className={`h-8 text-xs gap-1 ${statusFilter === 'in' ? 'text-green-400' : 'text-slate-400'}`}
                    >
                        <UserCheck className="w-3 h-3"/> IN
                    </Button>
                    <Button 
                        size="sm" 
                        variant={statusFilter === 'out' ? 'secondary' : 'ghost'} 
                        onClick={() => setStatusFilter('out')}
                        className={`h-8 text-xs gap-1 ${statusFilter === 'out' ? 'text-red-400' : 'text-slate-400'}`}
                    >
                        <UserX className="w-3 h-3"/> OUT
                    </Button>
                </div>
            </div>

            {/* Lista de Membros */}
            <Card className="bg-[#1e202b] border-[#2f3245] overflow-hidden shadow-lg">
                <CardHeader className="bg-[#1a1b26] border-b border-[#2f3245] py-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Filter className="w-4 h-4"/> Alistamento
                    </CardTitle>
                    <Badge variant="outline" className="bg-[#0c1216] border-[#2f3245] text-slate-400">
                        {filteredMembers.length}
                    </Badge>
                </CardHeader>
                
                <div className="h-[500px]">
                    <ScrollArea className="h-full">
                        <div className="divide-y divide-[#2f3245]">
                            {filteredMembers.length > 0 ? filteredMembers.map((member) => {
                                const isMe = member.tag === currentUserTag;
                                const canChange = canToggle(member.tag);
                                
                                return (
                                    <div 
                                        key={member.id} 
                                        onClick={() => canChange && onToggleStatus(member.id, member.tag)} 
                                        className={`
                                            flex items-center justify-between p-4 transition-all duration-200 group
                                            ${canChange ? 'cursor-pointer hover:bg-[#252836]' : 'opacity-60 cursor-not-allowed bg-[#15161e]'} 
                                            ${member.warStatus === 'IN' ? 'bg-green-900/5 border-l-4 border-l-green-500' : 'border-l-4 border-l-transparent'} 
                                            ${isMe ? 'bg-blue-900/10' : ''}
                                        `}
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Ícone Status */}
                                            <div className={`
                                                w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all shadow-lg
                                                ${member.warStatus === 'IN' 
                                                    ? 'bg-green-500/10 border-green-600 text-green-500 shadow-green-900/20' 
                                                    : 'bg-slate-800 border-slate-700 text-slate-600'}
                                            `}>
                                                {member.warStatus === 'IN' ? <Shield className="w-5 h-5 fill-current" /> : <ShieldAlert className="w-5 h-5" />}
                                            </div>
                                            
                                            {/* Info Membro */}
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className={`font-bold text-sm ${member.warStatus === 'IN' ? 'text-white' : 'text-slate-500'}`}>
                                                        {member.name}
                                                    </p>
                                                    {isMe && <Badge className="bg-blue-600 text-[9px] h-4 px-1 hover:bg-blue-500">VOCÊ</Badge>}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline" className={`text-[10px] h-4 px-1 font-mono border ${getThStyle(member.thLevel)}`}>
                                                        TH {member.thLevel}
                                                    </Badge>
                                                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">{member.role}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Toggle Action */}
                                        <div className="flex items-center gap-4">
                                            <span className={`text-xs font-bold uppercase w-12 text-right transition-colors ${member.warStatus === 'IN' ? 'text-green-400' : 'text-slate-600'}`}>
                                                {member.warStatus === 'IN' ? 'DENTRO' : 'FORA'}
                                            </span>
                                            <div onClick={(e) => e.stopPropagation()}>
                                                {canChange ? (
                                                    <Switch 
                                                        checked={member.warStatus === 'IN'} 
                                                        onCheckedChange={() => onToggleStatus(member.id, member.tag)}
                                                        className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-slate-700" 
                                                    />
                                                ) : (
                                                    <Lock className="w-4 h-4 text-slate-700" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                                    <Filter className="w-10 h-10 mb-2 opacity-20"/>
                                    <p>Nenhum guerreiro encontrado.</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </Card>
        </div>

        {/* COLUNA DIREITA: RESUMO & COPY */}
        <div className="space-y-6">
            
            {/* Card de Status do Time */}
            <Card className={`bg-[#1e202b] border shadow-lg transition-colors ${isExactSize ? 'border-green-500/30' : 'border-yellow-500/30'}`}>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-widest">Tamanho da Guerra</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end justify-between mb-2">
                        <div className="text-3xl font-bold text-white">{activeCount} <span className="text-lg text-slate-600 font-medium">/ {nextWarSize}</span></div>
                        <Badge variant={isExactSize ? "default" : "secondary"} className={isExactSize ? "bg-green-600" : "bg-yellow-600 text-black"}>
                            {isExactSize ? "Time Fechado" : `Faltam ${neededForWar}`}
                        </Badge>
                    </div>
                    
                    <Progress 
                        value={(activeCount % 5 === 0 && activeCount > 0) ? 100 : (activeCount % 5) * 20} 
                        className="h-2 bg-slate-800" 
                        indicatorClassName={isExactSize ? "bg-green-500" : "bg-yellow-500"} 
                    />
                    
                    <div className="mt-3 flex gap-2 items-start bg-[#15161e] p-2 rounded text-xs text-slate-400">
                        <AlertCircle className={`w-4 h-4 shrink-0 ${isExactSize ? 'text-green-500' : 'text-yellow-500'}`} />
                        <p>
                            {isExactSize 
                                ? "Número de participantes válido (múltiplo de 5)." 
                                : `Precisa de mais ${neededForWar} ou remover ${activeCount % 5} para fechar guerra de ${nextWarSize}vs${nextWarSize}.`
                            }
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Card do WhatsApp */}
            <Card className="bg-[#1e202b] border-[#2f3245] shadow-lg sticky top-6">
                <CardHeader className="bg-[#1a1b26] border-b border-[#2f3245] pb-4">
                    <CardTitle className="text-white flex items-center gap-2 text-lg">
                        <Copy className="w-5 h-5 text-green-500" /> WhatsApp
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="bg-[#0c1216] p-4 min-h-[250px] max-h-[400px] overflow-y-auto text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed border-b border-[#2f3245]">
                        {generateListText()}
                    </div>
                </CardContent>
                <div className="p-4 bg-[#1a1b26]">
                    <Button 
                        className="btn-clash-green w-full h-12 text-lg gap-2 shadow-xl" 
                        onClick={copyToClipboard}
                    >
                        {copied ? <><Check className="w-5 h-5" /> Copiado!</> : <><Copy className="w-5 h-5" /> Copiar Lista</>}
                    </Button>
                </div>
            </Card>
        </div>
    </div>
  );
}