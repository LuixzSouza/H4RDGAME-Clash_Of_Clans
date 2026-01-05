"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreateStrategyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (formData: FormData) => Promise<void>;
}

export function CreateStrategyDialog({ isOpen, onOpenChange, onConfirm }: CreateStrategyDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1e202b] border-[#2f3245] text-white">
        <DialogHeader>
            <DialogTitle>Registrar Meta</DialogTitle>
        </DialogHeader>
        <form action={onConfirm} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Nome da Estratégia</Label>
                    <Input name="title" placeholder="Ex: Queen Walk Hybrid" className="bg-[#15161e] border-[#2f3245] text-white" required/>
                </div>
                <div className="space-y-2">
                    <Label>Nível CV (TH)</Label>
                    <Select name="thLevel" defaultValue="16">
                        <SelectTrigger className="bg-[#15161e] border-[#2f3245] text-white"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-[#1e202b] border-[#2f3245] text-white">
                            {[16,15,14,13,12,11,10,9].map(i => <SelectItem key={i} value={i.toString()}>{i}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Dificuldade</Label>
                    <Select name="difficulty" defaultValue="Médio">
                        <SelectTrigger className="bg-[#15161e] border-[#2f3245] text-white"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-[#1e202b] border-[#2f3245] text-white">
                            <SelectItem value="Fácil">Fácil</SelectItem>
                            <SelectItem value="Médio">Médio</SelectItem>
                            <SelectItem value="Difícil">Difícil</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Link YouTube (Opcional)</Label>
                    <Input name="videoUrl" placeholder="https://youtube.com/..." className="bg-[#15161e] border-[#2f3245] text-white"/>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Descrição Tática</Label>
                <Textarea name="description" placeholder="Como executar o ataque..." className="bg-[#15161e] border-[#2f3245] text-white" required/>
            </div>

            <div className="space-y-2">
                <Label>Composição (Resumo)</Label>
                <Textarea name="army" placeholder="Ex: 5 Curadoras, 14 Mineiros, 13 Corredores..." className="bg-[#15161e] border-[#2f3245] text-white h-20" required/>
            </div>

            <DialogFooter>
                <Button type="submit" className="btn-clash w-full">Salvar Estratégia</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}