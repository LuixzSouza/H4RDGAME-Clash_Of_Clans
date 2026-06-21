"use client";

import { ImageIcon, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreateLayoutDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (formData: FormData) => Promise<void>;
}

export function CreateLayoutDialog({ isOpen, onOpenChange, onConfirm }: CreateLayoutDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-white">
        <DialogHeader>
            <DialogTitle>Novo Layout</DialogTitle>
        </DialogHeader>
        <form action={onConfirm} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Nome do Layout</Label>
                    <Input name="name" placeholder="Ex: Anti-3 Estrelas" className="bg-background border-border text-white" required/>
                </div>
                <div className="space-y-2">
                    <Label>Nível CV (TH)</Label>
                    <Select name="thLevel" defaultValue="16">
                        <SelectTrigger className="bg-background border-border text-white"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-card border-border text-white">
                            {[16,15,14,13,12,11,10,9].map(i => <SelectItem key={i} value={i.toString()}>{i}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Objetivo</Label>
                <Select name="type" defaultValue="war">
                    <SelectTrigger className="bg-background border-border text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-card border-border text-white">
                        <SelectItem value="war">Guerra (Anti-3 Stars)</SelectItem>
                        <SelectItem value="farm">Farm (Proteção Recursos)</SelectItem>
                        <SelectItem value="push">Push (Proteção Troféus)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Link do Layout (Supercell ID)</Label>
                <div className="relative">
                    <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                    <Input name="link" placeholder="https://link.clashofclans.com/..." className="bg-background border-border text-white pl-10" required/>
                </div>
            </div>

            <div className="space-y-2">
                <Label>URL da Imagem (Print)</Label>
                <div className="relative">
                    <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                    <Input name="imageUrl" placeholder="https://imgur.com/..." className="bg-background border-border text-white pl-10" required/>
                </div>
                <p className="text-[10px] text-muted-foreground">Dica: Use sites como imgur.com para hospedar o print.</p>
            </div>

            <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea name="description" placeholder="Detalhes sobre armadilhas, pathing, etc..." className="bg-background border-border text-white" required/>
            </div>

            <DialogFooter>
                <Button type="submit" className="btn-clash w-full">Salvar Layout</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}