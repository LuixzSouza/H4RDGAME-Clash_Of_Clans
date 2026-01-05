"use client";

import { DollarSign, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FinanceHeaderProps {
  isAdmin: boolean;
  onCreateEvent: (formData: FormData) => Promise<void>;
}

export function FinanceHeader({ isAdmin, onCreateEvent }: FinanceHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#1e202b] p-6 rounded-xl border border-[#2f3245] shadow-lg">
      <div>
        <h1 className="text-3xl font-heading text-white flex items-center gap-2">
          <DollarSign className="text-yellow-500 w-8 h-8" /> Tesouraria & Eventos
        </h1>
        <p className="text-slate-400 mt-1">Gerencie sorteios, vaquinhas e arrecadações do clã.</p>
      </div>

      {isAdmin && (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-500 text-white font-bold shadow-lg transition-transform active:scale-95">
              <Plus className="w-5 h-5 mr-2" /> Novo Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1e202b] border-[#2f3245] text-white">
            <DialogHeader>
              <DialogTitle>Criar Novo Evento Financeiro</DialogTitle>
            </DialogHeader>
            <form action={onCreateEvent} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Nome do Evento</Label>
                <Input name="title" placeholder="Ex: Sorteio Passe Ouro" className="bg-[#15161e] border-[#2f3245] focus-visible:ring-yellow-500" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Valor da Cota (R$)</Label>
                  <Input name="ticketPrice" type="number" step="0.50" placeholder="2.50" className="bg-[#15161e] border-[#2f3245] focus-visible:ring-yellow-500" required />
                </div>
                <div className="space-y-2">
                  <Label>Meta (Opcional)</Label>
                  <Input name="goalAmount" type="number" step="1.00" placeholder="44.90" className="bg-[#15161e] border-[#2f3245] focus-visible:ring-yellow-500" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-green-600 w-full font-bold">Criar Evento</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}