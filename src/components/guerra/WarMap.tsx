"use client";

import { useState, useMemo } from "react";
import { 
  Star, Target, ChevronRight, CheckCircle2, 
  AlertCircle, Search, X, Swords, ArrowUpDown, Copy, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
// Importe seus tipos. Se não existirem, o TS vai reclamar, então garanta que estão no arquivo types.ts
import { WarData, Member, AttackData } from "@/components/guerra/types";

// --- TIPAGENS AUXILIARES PARA EVITAR 'ANY' ---
type FilterType = 'all' | 'pending' | 'done';
type SortType = 'name' | 'th' | 'stars' | 'attacks';

// Interface estendida para o membro com dados calculados
interface ProcessedMember extends Member {
  attacks: AttackData[];
  stars: number;
  isDone: boolean;
  attacksLeft: number;
}

interface WarMapProps {
  activeWar: WarData;
  members: Member[];
  onRegisterAttack: (formData: FormData) => Promise<void>;
}

export function WarMap({ activeWar, members, onRegisterAttack }: WarMapProps) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  
  // Estados de Controle
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortType>('th');
  
  // Estado para feedback de cópia
  const [isCopied, setIsCopied] = useState(false);

  const getMaxAttacks = (): number => activeWar.isLeague ? 1 : 2;

  // --- LÓGICA DE DADOS (MEMORIZADA) ---
  const processedMembers: ProcessedMember[] = useMemo(() => {
    const max = getMaxAttacks();

    return members
      .map((member) => {
        // Garante que attacks é um array mesmo que venha undefined
        const userAttacks = activeWar.attacks?.filter((a) => a.memberId === member.id) ?? [];
        const starsCount = userAttacks.reduce((acc, curr) => acc + (curr.stars || 0), 0);
        
        return {
          ...member,
          attacks: userAttacks,
          stars: starsCount,
          isDone: userAttacks.length >= max,
          attacksLeft: max - userAttacks.length
        };
      })
      .filter((member) => {
        // Filtro de Status
        if (filter === 'pending' && member.isDone) return false;
        if (filter === 'done' && !member.isDone) return false;
        
        // Filtro de Texto
        if (searchTerm && !member.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name': return a.name.localeCompare(b.name);
          case 'th': return b.thLevel - a.thLevel;
          case 'stars': return b.stars - a.stars; // Quem tem mais estrelas primeiro
          case 'attacks': return a.attacksLeft - b.attacksLeft; // Quem falta menos ataques primeiro
          default: return 0;
        }
      });
  }, [members, activeWar.attacks, activeWar.isLeague, filter, searchTerm, sortBy]);

  // --- FUNÇÃO PARA GERAR RELATÓRIO WHATSAPP ---
  const copyToClipboard = () => {
    const titleMap = {
      all: "RELATÓRIO GERAL",
      pending: "COBRANÇA DE ATAQUES",
      done: "GUERREIROS FINALIZADOS"
    };

    const header = `*⚔️ ${titleMap[filter]} - CLASH OF CLANS*\n\n`;
    
    const body = processedMembers.map((m, i) => {
      const statusIcon = m.isDone ? "✅" : m.attacksLeft === 1 ? "⚠️" : "❌";
      return `${i + 1}. *${m.name}* (TH${m.thLevel})\n   ${statusIcon} ${m.attacks.length}/${getMaxAttacks()} Atks | ${m.stars}⭐`;
    }).join("\n\n");

    const footer = `\n\nTotal listado: ${processedMembers.length}`;
    
    const fullText = header + body + footer;

    navigator.clipboard.writeText(fullText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  // --- HANDLERS ---
  const handleRegisterWrapper = async (fd: FormData) => {
    await onRegisterAttack(fd);
    setSelectedMember(null);
  };

  // Helpers de UI
  const getThColor = (th: number) => {
    if (th >= 15) return "bg-primary/20 text-primary border-primary/30";
    if (th >= 13) return "bg-primary/20 text-primary border-primary/30";
    return "bg-muted/20 text-muted-foreground border-border/30";
  };

  return (
    <div className="panel-clash shadow-xl flex flex-col h-[650px] w-full max-w-full overflow-hidden">
      
      {/* --- HEADER --- */}
      <CardHeader className="border-b border-border py-4 space-y-4 bg-card z-10 shrink-0">
        
        {/* Topo: Título + Botão WhatsApp */}
        <div className="flex flex-wrap items-center justify-between gap-3">
           <h3 className="font-bold text-white flex items-center gap-2 text-lg truncate">
            <Swords className="w-5 h-5 text-primary shrink-0"/> 
            <span className="truncate">Mapa de Guerra</span>
            <Badge variant="outline" className="ml-2 border-border text-muted-foreground hidden sm:inline-flex">
                {processedMembers.length}
            </Badge>
          </h3>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={copyToClipboard}
            className={`border-primary/30 text-primary hover:bg-primary/10 transition-all ${isCopied ? 'bg-success/20 text-success border-success/50' : ''}`}
          >
            {isCopied ? (
                <> <Check className="w-4 h-4 mr-2" /> Copiado! </>
            ) : (
                <> <Copy className="w-4 h-4 mr-2" /> Relatório Zap </>
            )}
          </Button>
        </div>
        
        {/* Controles de Filtro (Responsivo) */}
        <div className="flex flex-col md:flex-row gap-2">
            
            {/* Busca */}
            <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Buscar..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-background border-border text-white focus-visible:ring-primary h-9 text-sm w-full"
                />
                {searchTerm && (
                    <button onClick={() => setSearchTerm("")} className="absolute right-3 top-2.5 text-muted-foreground hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Grupo de Filtros */}
            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
                <div className="flex bg-background p-1 rounded-md border border-border shrink-0 h-9 items-center">
                    <Button size="sm" variant="ghost" onClick={() => setFilter('all')} className={`h-7 px-3 text-xs rounded-sm ${filter === 'all' ? 'bg-accent text-white' : 'text-muted-foreground'}`}>Todos</Button>
                    <Button size="sm" variant="ghost" onClick={() => setFilter('pending')} className={`h-7 px-3 text-xs rounded-sm ${filter === 'pending' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}>Pendentes</Button>
                    <Button size="sm" variant="ghost" onClick={() => setFilter('done')} className={`h-7 px-3 text-xs rounded-sm ${filter === 'done' ? 'bg-success/20 text-success' : 'text-muted-foreground'}`}>Prontos</Button>
                </div>

                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortType)}>
                    <SelectTrigger className="w-[110px] bg-background border-border text-white h-9 text-xs">
                        <div className="flex items-center gap-2 truncate">
                            <ArrowUpDown className="w-3 h-3 text-muted-foreground shrink-0"/>
                            <SelectValue />
                        </div>
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-white">
                        <SelectItem value="th">Nível TH</SelectItem>
                        <SelectItem value="stars">Estrelas</SelectItem>
                        <SelectItem value="name">Nome</SelectItem>
                        <SelectItem value="attacks">Ataques</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
      </CardHeader>
      
      {/* --- LISTA (SCROLL AREA) --- */}
      <CardContent className="p-0 flex-1 min-h-0 overflow-hidden relative">
        <ScrollArea className="h-full w-full">
            <div className="divide-y divide-border">
            {processedMembers.length > 0 ? processedMembers.map((member, index) => {
                const maxAttacks = getMaxAttacks();
                const progress = (member.attacks.length / maxAttacks) * 100;
                
                return (
                <div key={member.id} 
                     className="flex items-center justify-between p-3 sm:p-4 hover:bg-accent transition-all cursor-pointer group"
                     onClick={() => setSelectedMember(member)}
                >
                    {/* Esquerda: Info Principal */}
                    <div className="flex items-center gap-3 flex-1 min-w-0"> {/* min-w-0 impede scroll horizontal */}
                        
                        {/* Avatar/Index */}
                        <div className="relative shrink-0">
                            <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center font-bold text-muted-foreground text-sm">
                                {index + 1}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-[2px] border-border flex items-center justify-center ${
                                member.isDone ? 'bg-success' : member.attacks.length > 0 ? 'bg-primary' : 'bg-destructive'
                            }`}>
                                {member.isDone && <CheckCircle2 className="w-2.5 h-2.5 text-black" />}
                            </div>
                        </div>
                        
                        {/* Texto e Barra */}
                        <div className="flex-1 min-w-0"> {/* min-w-0 crucial aqui */}
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-white text-sm truncate">{member.name}</span>
                                <Badge variant="outline" className={`text-[10px] h-4 px-1 font-bold shrink-0 ${getThColor(member.thLevel)}`}>
                                    TH{member.thLevel}
                                </Badge>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 flex-1 max-w-[100px] bg-background rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-500 ${member.isDone ? 'bg-success' : 'bg-primary'}`} 
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">
                                    {member.attacks.length}/{maxAttacks}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Direita: Estrelas */}
                    <div className="flex items-center gap-2 pl-2 shrink-0">
                        <div className="flex items-center gap-1 text-primary bg-primary/5 px-2 py-1 rounded-md border border-primary/10">
                            <Star className="w-3.5 h-3.5 fill-current"/>
                            <span className="font-bold text-sm">{member.stars}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors"/>
                    </div>
                </div>
                );
            }) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground gap-3">
                    <AlertCircle className="w-10 h-10 opacity-20"/>
                    <p className="text-sm">Nenhum guerreiro encontrado.</p>
                </div>
            )}
            </div>
        </ScrollArea>
      </CardContent>

      {/* --- SHEET (DETALHES) --- */}
      <Sheet open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
        <SheetContent className="bg-card border-l border-border text-white w-full sm:max-w-md flex flex-col h-full p-0 z-50">
            {selectedMember && (() => {
                // Como processedMembers é recalculado se members mudar, precisamos buscar o dado mais atual
                // Ou podemos confiar no selectedMember se ele for estático até fechar o modal.
                // Para segurança, buscamos os ataques direto do activeWar usando o ID
                const currentAttacks = activeWar.attacks?.filter(a => a.memberId === selectedMember.id) || [];
                const maxAttacks = getMaxAttacks();
                const attacksLeft = maxAttacks - currentAttacks.length;
                const totalStars = currentAttacks.reduce((a, b) => a + b.stars, 0);

                return (
                    <>
                        <SheetHeader className="px-6 py-6 border-b border-border bg-background">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 border-2 border-border">
                                    <AvatarFallback className="bg-muted text-foreground font-bold">
                                        {selectedMember.name.substring(0, 1)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <SheetTitle className="text-white text-lg">{selectedMember.name}</SheetTitle>
                                    <SheetDescription className="text-muted-foreground flex items-center gap-2 mt-0.5 text-xs">
                                        <Badge variant="outline" className={`${getThColor(selectedMember.thLevel)} border-opacity-50`}>TH {selectedMember.thLevel}</Badge>
                                        <span>•</span>
                                        <span className="text-primary flex items-center gap-1"><Star className="w-3 h-3 fill-current"/> {totalStars} Estrelas</span>
                                    </SheetDescription>
                                </div>
                            </div>
                        </SheetHeader>

                        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-border">
                            <div className="space-y-6">
                                {/* Histórico */}
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Histórico</h4>
                                        <span className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded border border-border">{currentAttacks.length}/{maxAttacks} usados</span>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {currentAttacks.length > 0 ? currentAttacks.map((att, i) => (
                                            <div key={i} className="bg-background border border-border p-3 rounded-lg relative overflow-hidden">
                                                <div className="flex justify-between items-start relative z-10">
                                                    <div>
                                                        <span className="text-[10px] text-muted-foreground font-bold uppercase block">Alvo</span>
                                                        <span className="text-base font-bold text-white">#{att.target}</span>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <div className="flex gap-0.5">
                                                            {[1, 2, 3].map(s => (
                                                                <Star key={s} className={`w-3.5 h-3.5 ${s <= att.stars ? "text-primary fill-primary" : "text-muted-foreground"}`} />
                                                            ))}
                                                        </div>
                                                        <span className={`text-xs font-bold mt-1 ${att.destruction === 100 ? 'text-primary' : 'text-muted-foreground'}`}>
                                                            {att.destruction}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-4 border border-dashed border-border rounded-lg text-muted-foreground text-xs">
                                                Sem registros de ataque.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Formulário */}
                                {attacksLeft > 0 ? (
                                    <div className="bg-card rounded-lg border border-border p-4 shadow-lg">
                                        <div className="flex items-center gap-2 mb-4 text-white font-bold text-sm">
                                            <Target className="w-4 h-4 text-primary"/>
                                            Novo Ataque
                                        </div>
                                        
                                        <form action={handleRegisterWrapper} className="space-y-3">
                                            <input type="hidden" name="warId" value={activeWar.id} />
                                            <input type="hidden" name="memberId" value={selectedMember.id} />
                                            <input type="hidden" name="attackNumber" value={currentAttacks.length + 1} />
                                            
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <Label className="text-muted-foreground text-[10px] uppercase font-bold">Alvo</Label>
                                                    <Input name="target" type="number" placeholder="#" className="bg-background border-border text-white h-9 text-sm" required />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-muted-foreground text-[10px] uppercase font-bold">Destruição %</Label>
                                                    <Input name="destruction" type="number" min="0" max="100" placeholder="%" className="bg-background border-border text-white h-9 text-sm" required />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <Label className="text-muted-foreground text-[10px] uppercase font-bold">Estrelas</Label>
                                                <Select name="stars" defaultValue="0">
                                                    <SelectTrigger className="bg-background border-border text-white h-9 text-sm">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-card border-border text-white">
                                                        <SelectItem value="0">0 Estrelas</SelectItem>
                                                        <SelectItem value="1">1 Estrela</SelectItem>
                                                        <SelectItem value="2">2 Estrelas</SelectItem>
                                                        <SelectItem value="3">3 Estrelas (PT)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <Button type="submit" className="btn-clash w-full h-10 mt-2 text-sm">
                                                Confirmar
                                            </Button>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-success/10 border border-success/20 rounded-lg flex items-center justify-center gap-2 text-success text-sm font-medium">
                                        <CheckCircle2 className="w-5 h-5" />
                                        Missão Cumprida!
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                );
            })()}
        </SheetContent>
      </Sheet>
    </div>
  );
}