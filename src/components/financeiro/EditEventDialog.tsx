"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface FinanceEvent {
  id: string;
  title: string;
  ticketPrice: number;
  goalAmount: number | null;
}

interface EditEventDialogProps {
  event: FinanceEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: FormData) => Promise<void>;
}

export function EditEventDialog({ event, isOpen, onClose, onSave }: EditEventDialogProps) {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1e202b] border-[#2f3245] text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Evento</DialogTitle>
        </DialogHeader>
        <form action={async (formData) => { await onSave(formData); onClose(); }} className="space-y-4 pt-4">
          <input type="hidden" name="id" value={event.id} />
          
          <div className="space-y-2">
            <Label htmlFor="title">Nome do Evento</Label>
            <Input 
                id="title"
                name="title" 
                defaultValue={event.title} 
                className="bg-[#15161e] border-[#2f3245] focus-visible:ring-yellow-500" 
                required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ticketPrice">Valor da Cota (R$)</Label>
              <Input 
                id="ticketPrice"
                name="ticketPrice" 
                type="number" 
                step="0.01" 
                defaultValue={event.ticketPrice} 
                className="bg-[#15161e] border-[#2f3245] focus-visible:ring-yellow-500" 
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goalAmount">Meta (Opcional)</Label>
              <Input 
                id="goalAmount"
                name="goalAmount" 
                type="number" 
                step="0.01" 
                defaultValue={event.goalAmount || ""} 
                placeholder="Sem meta"
                className="bg-[#15161e] border-[#2f3245] focus-visible:ring-yellow-500" 
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="mr-auto text-slate-400 hover:text-white">Cancelar</Button>
            <Button type="submit" className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold">Salvar Alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}