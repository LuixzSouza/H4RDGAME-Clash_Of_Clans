"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Users, Wand2, Copy, Check, Shield, Smartphone, Hash, Crown, RefreshCw } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface RecruitModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (formData: FormData) => void;
}

export function RecruitModal({ isOpen, onOpenChange, onConfirm }: RecruitModalProps) {
  // Estados para controle
  const [name, setName] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [tag, setTag] = useState("");
  const [copiedPass, setCopiedPass] = useState(false);
  const [copiedWelcome, setCopiedWelcome] = useState(false);

  // --- FUNÇÕES DE GERAÇÃO (Memorizadas com useCallback) ---

  const generatePassword = useCallback(() => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Sem caracteres confusos
    let pass = "H4RD-";
    for (let i = 0; i < 4; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    setGeneratedPassword(pass);
  }, []);

  const generateRandomTag = useCallback(() => {
    // Caracteres comuns em tags de jogos
    const chars = "0289PYLQGRJCUV"; 
    let newTag = "#";
    // Gera uma tag de 8 caracteres
    for (let i = 0; i < 8; i++) {
        newTag += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTag(newTag);
  }, []);

  // --- EFEITOS ---

  // Gera senha ao abrir o modal se estiver vazio
  useEffect(() => {
    if (isOpen && !generatedPassword) {
        // CORREÇÃO: Usamos setTimeout para evitar atualização síncrona dentro do efeito
        const timer = setTimeout(() => {
            generatePassword();
        }, 0);
        
        return () => clearTimeout(timer);
    }
  }, [isOpen, generatedPassword, generatePassword]); 

  // --- HANDLERS ---

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase();
    // Garante que comece com # se tiver texto
    if (value.length > 0 && !value.startsWith("#")) {
        value = "#" + value;
    }
    // Remove caracteres inválidos (mantém apenas letras, números e #)
    value = value.replace(/[^A-Z0-9#]/g, "");
    setTag(value);
  };

  const copyToClipboard = (text: string, setCopied: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setName("");
    setTag("");
    setGeneratedPassword(""); // Limpa para gerar nova na próxima abertura
  };

  // Mensagem automática para enviar no Chat do Jogo ou WhatsApp
  const welcomeMessage = `Bem-vindo ao H4RD G4ME, ${name || "Guerreiro"}! 
🛡️ Sua Tag: ${tag}
🔑 Senha do Painel: ${generatedPassword}
Acesse: painel.h4rdgame.com`;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1e202b] border-[#2f3245] text-white sm:max-w-[500px] shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-yellow-500">
            <UserPlusIcon /> Recrutar Guerreiro
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Cadastre os dados do novo membro para liberar o acesso ao quartel.
          </DialogDescription>
        </DialogHeader>

        <form action={(fd) => { onConfirm(fd); resetForm(); }} className="grid gap-5 py-2">
          
          {/* Linha 1: Tag e Nome */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="flex items-center gap-2 text-xs uppercase font-bold text-slate-400">
                        <Hash className="w-3 h-3 text-blue-500"/> Tag (#)
                    </Label>
                    <button 
                        type="button" 
                        onClick={generateRandomTag} 
                        className="text-[10px] text-blue-400 hover:text-white flex items-center gap-1 transition-colors"
                        title="Gerar Tag Aleatória"
                    >
                        <RefreshCw className="w-3 h-3"/> Gerar
                    </button>
                </div>
                <Input 
                    name="tag" 
                    value={tag} 
                    onChange={handleTagChange} 
                    placeholder="#P028..." 
                    className="bg-[#15161e] border-[#2f3245] text-white font-mono uppercase focus-visible:ring-yellow-500" 
                    required 
                    maxLength={12}
                />
            </div>
            <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs uppercase font-bold text-slate-400">
                    <Users className="w-3 h-3 text-green-500"/> Nickname
                </Label>
                <Input 
                    name="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: KingSlayer" 
                    className="bg-[#15161e] border-[#2f3245] text-white focus-visible:ring-yellow-500" 
                    required 
                />
            </div>
          </div>

          {/* Linha 2: Cargo e TH */}
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs uppercase font-bold text-slate-400">
                    <Crown className="w-3 h-3 text-yellow-600"/> Cargo Inicial
                </Label>
                <Select name="role" defaultValue="Membro">
                  <SelectTrigger className="bg-[#15161e] border-[#2f3245] text-white focus:ring-yellow-500">
                      <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e202b] border-[#2f3245] text-white">
                    <SelectItem value="Membro">Membro</SelectItem>
                    <SelectItem value="Ancião">Ancião</SelectItem>
                  </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs uppercase font-bold text-slate-400">
                    <Shield className="w-3 h-3 text-blue-400"/> Centro de Vila
                </Label>
                <Select name="thLevel" defaultValue="12">
                  <SelectTrigger className="bg-[#15161e] border-[#2f3245] text-white focus:ring-yellow-500">
                      <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e202b] border-[#2f3245] text-white">
                    {[9,10,11,12,13,14,15,16].map(level => (
                        <SelectItem key={level} value={level.toString()}>TH {level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
          </div>

          {/* Linha 3: WhatsApp */}
          <div className="space-y-2">
             <Label className="flex items-center gap-2 text-xs uppercase font-bold text-slate-400">
                <Smartphone className="w-3 h-3 text-green-400"/> WhatsApp (Opcional)
             </Label>
             <Input name="phone" placeholder="(11) 99999-9999" className="bg-[#15161e] border-[#2f3245] text-white" />
          </div>

          {/* Área de Segurança (Senha) */}
          <div className="bg-gradient-to-r from-[#15161e] to-[#0f1116] p-4 rounded-lg border border-[#2f3245] space-y-3 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wand2 className="w-24 h-24 text-yellow-500 -rotate-12"/>
            </div>
            
            <div className="flex justify-between items-center relative z-10">
              <Label className="text-yellow-500 font-bold text-sm tracking-wide">CREDENCIAL DE ACESSO</Label>
              <button type="button" onClick={generatePassword} className="text-[10px] text-blue-400 hover:text-white transition-colors flex items-center gap-1 bg-blue-900/20 px-2 py-1 rounded">
                  <Wand2 className="w-3 h-3"/> Gerar Nova
              </button>
            </div>
            <div className="flex gap-2 relative z-10">
              <Input 
                name="password" 
                value={generatedPassword} 
                readOnly 
                className="bg-black/50 border-[#2f3245] text-white font-mono text-center tracking-widest text-lg h-12 focus-visible:ring-0" 
              />
              <Button 
                type="button" 
                className={`h-12 w-12 transition-all ${copiedPass ? "bg-green-600 text-white" : "bg-[#2f3245] hover:bg-[#3a3f55]"}`}
                onClick={() => copyToClipboard(generatedPassword, setCopiedPass)}
              >
                {copiedPass ? <Check className="w-5 h-5"/> : <Copy className="w-5 h-5"/>}
              </Button>
            </div>
          </div>

          {/* Área de Boas Vindas (Copia Rápida) */}
          <div className="space-y-2">
             <div className="flex justify-between items-end">
                <Label className="text-xs uppercase font-bold text-slate-500">Texto de Boas-Vindas</Label>
                <button 
                    type="button" 
                    onClick={() => copyToClipboard(welcomeMessage, setCopiedWelcome)}
                    className="text-[10px] text-slate-400 hover:text-green-400 transition-colors flex items-center gap-1"
                >
                    {copiedWelcome ? <><Check className="w-3 h-3"/> Copiado!</> : <><Copy className="w-3 h-3"/> Copiar Texto</>}
                </button>
             </div>
             <Textarea 
                value={welcomeMessage} 
                readOnly 
                className="bg-[#0b0d14] border-[#2f3245] text-slate-400 text-xs font-mono h-20 resize-none focus-visible:ring-0"
             />
          </div>

          <DialogFooter className="pt-2">
             <Button type="submit" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 w-full font-bold h-12 shadow-lg border border-green-500/20 text-white">
                <Users className="w-4 h-4 mr-2"/> Confirmar Recrutamento
             </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Ícone Auxiliar
function UserPlusIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" x2="20" y1="8" y2="14"/><line x1="23" x2="17" y1="11" y2="11"/></svg>
    )
}