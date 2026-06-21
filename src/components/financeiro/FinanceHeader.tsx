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
    <div className="panel-clash flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
      <div className="flex items-start gap-4">
        <div className="hidden sm:flex shrink-0 h-12 w-12 rounded-xl rotate-45 bg-gradient-to-br from-amber-300 to-amber-700 border-2 border-amber-800/60 items-center justify-center shadow-[0_4px_14px_-2px_rgba(240,169,43,0.5)]">
          <DollarSign className="w-5 h-5 text-amber-950 -rotate-45" />
        </div>
        <div>
          <div className="eyebrow mb-2">Tesouraria</div>
          <h1 className="text-3xl md:text-4xl clash-title leading-none">Cofre &amp; Eventos</h1>
          <p className="text-muted-foreground mt-2 text-sm">Gerencie sorteios, vaquinhas e arrecadações do clã.</p>
        </div>
      </div>

      {isAdmin && (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="btn-clash-green shadow-lg">
              <Plus className="w-5 h-5 mr-2" /> Novo Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border text-white">
            <DialogHeader>
              <DialogTitle>Criar Novo Evento Financeiro</DialogTitle>
            </DialogHeader>
            <form action={onCreateEvent} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Nome do Evento</Label>
                <Input name="title" placeholder="Ex: Sorteio Passe Ouro" className="bg-background border-border focus-visible:ring-primary" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Valor da Cota (R$)</Label>
                  <Input name="ticketPrice" type="number" step="0.50" placeholder="2.50" className="bg-background border-border focus-visible:ring-primary" required />
                </div>
                <div className="space-y-2">
                  <Label>Meta (Opcional)</Label>
                  <Input name="goalAmount" type="number" step="1.00" placeholder="44.90" className="bg-background border-border focus-visible:ring-primary" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="btn-clash-green w-full">Criar Evento</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}