"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreateEventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (formData: FormData) => Promise<void>;
}

export function CreateEventDialog({ isOpen, onOpenChange, onConfirm }: CreateEventDialogProps) {
  
  const handleSubmit = async (formData: FormData) => {
      await onConfirm(formData);
      onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1e202b] border-[#2f3245] text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Convocar Clã / Novo Aviso</DialogTitle>
        </DialogHeader>
        
        <form action={handleSubmit} className="space-y-5 py-2">
          
          <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Evento</Label>
                <Select name="type" defaultValue="war">
                  <SelectTrigger className="bg-[#15161e] border-[#2f3245] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e202b] border-[#2f3245] text-white">
                    <SelectItem value="war">⚔️ Guerra</SelectItem>
                    <SelectItem value="games">🎯 Jogos do Clã</SelectItem>
                    <SelectItem value="raid">🏰 Capital</SelectItem>
                    <SelectItem value="other">📢 Aviso Geral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Data/Hora de Início</Label>
                <Input 
                    type="datetime-local" 
                    name="date" 
                    className="bg-[#15161e] border-[#2f3245] text-white [color-scheme:dark]" 
                    required 
                />
              </div>
          </div>

          <div className="space-y-2">
            <Label>Título do Comando</Label>
            <Input name="title" placeholder="Ex: Guerra 50v50 - Todos atacam!" className="bg-[#15161e] border-[#2f3245] text-white focus-visible:ring-yellow-500" required />
          </div>
          
          <div className="space-y-2">
            <Label>Instruções / Estratégia</Label>
            <Textarea 
                name="description" 
                placeholder="Descreva a estratégia, alvos prioritários ou regras..." 
                className="bg-[#15161e] border-[#2f3245] text-white min-h-[120px] focus-visible:ring-yellow-500" 
                required 
            />
          </div>

          <DialogFooter>
             <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-400">Cancelar</Button>
             <Button type="submit" className="bg-green-600 hover:bg-green-500 text-white font-bold w-full sm:w-auto">
                Publicar no Mural
             </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}