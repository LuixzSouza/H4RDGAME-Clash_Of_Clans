"use client";

import { Phone, User, Shield, Briefcase, Save, Lock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Member } from "./types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EditMemberDialogProps {
  member: Member | null;
  currentUser: { id: string; role: string; tag: string } | null; // <--- NOVA PROP
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: FormData) => void;
}

export function EditMemberDialog({ member, currentUser, isOpen, onOpenChange, onSubmit }: EditMemberDialogProps) {
  if (!member || !currentUser) return null;

  // --- REGRAS DE PERMISSÃO ---
  const isMe = currentUser.id === member.id;
  const iAmLeader = currentUser.role === "LIDER";
  const iAmCoLeader = currentUser.role === "COLIDER";

  // Quem pode editar o NOME? Apenas o Líder pode editar qualquer nome (inclusive o dele).
  const canEditName = iAmLeader;

  // Quem pode editar o CARGO? 
  // Líder pode editar de todos.
  // Colíder pode editar de membros/anciãos (mas não dele mesmo para evitar erro, nem de líderes).
  // NINGUÉM deve poder editar o próprio cargo nessa tela para evitar auto-rebaixamento acidental.
  const canEditRole = !isMe && (iAmLeader || (iAmCoLeader && member.role !== "LIDER" && member.role !== "COLIDER"));

  // Quem pode editar TH e Guerra? Liderança ou o próprio dono da conta.
  const canEditGameStats = iAmLeader || iAmCoLeader || isMe;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="bg-card border-border text-white sm:max-w-[600px] shadow-2xl p-0 gap-0 overflow-hidden">
            
            <div className="bg-background p-6 border-b border-border flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-lg">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.avatarSeed || member.name}`} />
                    <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <DialogTitle className="text-xl font-bold text-white">Editar Guerreiro</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        {isMe ? "Editando seu perfil" : <>Editando <span className="text-primary font-bold">{member.name}</span></>}
                    </DialogDescription>
                </div>
            </div>

            <form action={onSubmit} className="p-6 space-y-6">
                <input type="hidden" name="id" value={member.id} />
                
                {/* --- INPUTS OCULTOS DE SEGURANÇA --- */}
                {/* Se o campo estiver desabilitado visualmente, enviamos o valor original escondido para o backend não resetar */}
                {!canEditName && <input type="hidden" name="name" value={member.name} />}
                {!canEditRole && <input type="hidden" name="role" value={member.role} />}
                {!canEditGameStats && <input type="hidden" name="thLevel" value={member.thLevel} />}
                {!canEditGameStats && <input type="hidden" name="warStatus" value={member.warStatus} />}

                {/* Seção 1: Dados Pessoais */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-2">
                        <User className="w-3 h-3" /> Dados Pessoais
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="flex justify-between">
                                Nome de Guerra
                                {!canEditName && <Lock className="w-3 h-3 text-muted-foreground"/>}
                            </Label>
                            <Input 
                                name="name" 
                                defaultValue={member.name} 
                                disabled={!canEditName}
                                className="bg-background border-border text-white focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Phone className="w-3 h-3 text-success" /> WhatsApp
                            </Label>
                            <Input 
                                name="phone" 
                                type="tel" 
                                placeholder="(11) 99999-9999" 
                                defaultValue={member.phone || ""} 
                                className="bg-background border-border text-white placeholder:text-muted-foreground focus-visible:ring-success"
                            />
                        </div>
                    </div>
                </div>

                {/* Seção 2: Dados do Clã */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-2">
                        <Shield className="w-3 h-3" /> Dados Militares
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label className="flex justify-between">
                                Nível TH
                                {!canEditGameStats && <Lock className="w-3 h-3 text-muted-foreground"/>}
                            </Label>
                            <div className="relative">
                                <Input 
                                    name="thLevel" 
                                    type="number" 
                                    defaultValue={member.thLevel} 
                                    disabled={!canEditGameStats}
                                    className="bg-background border-border text-white pl-9 font-bold disabled:opacity-50"
                                />
                                <span className="absolute left-3 top-2.5 text-xs font-bold text-muted-foreground">TH</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="flex justify-between">
                                Cargo
                                {!canEditRole && <Lock className="w-3 h-3 text-muted-foreground"/>}
                            </Label>
                            <Select name="role" defaultValue={member.role as string} disabled={!canEditRole}>
                                <SelectTrigger className="bg-background border-border text-white disabled:opacity-50"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-card border-border text-white">
                                    <SelectItem value="Membro">Membro</SelectItem>
                                    <SelectItem value="Ancião">Ancião</SelectItem>
                                    <SelectItem value="Colíder">Colíder</SelectItem>
                                    <SelectItem value="Líder">Líder</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="flex justify-between">
                                Guerra
                                {!canEditGameStats && <Lock className="w-3 h-3 text-muted-foreground"/>}
                            </Label>
                            <Select name="warStatus" defaultValue={member.warStatus} disabled={!canEditGameStats}>
                                <SelectTrigger className="bg-background border-border text-white disabled:opacity-50"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-card border-border text-white">
                                    <SelectItem value="IN" className="text-success font-bold">Participando (IN)</SelectItem>
                                    <SelectItem value="OUT" className="text-destructive font-bold">De fora (OUT)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <DialogFooter className="pt-4 border-t border-border mt-4">
                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-muted-foreground hover:text-white mr-auto">
                        Cancelar
                    </Button>
                    <Button type="submit" className="bg-primary hover:bg-primary text-white font-bold px-8 shadow-lg transition-all hover:scale-105">
                        <Save className="w-4 h-4 mr-2"/> Salvar Alterações
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
  );
}