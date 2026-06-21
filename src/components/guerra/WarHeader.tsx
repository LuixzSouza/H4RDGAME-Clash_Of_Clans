"use client";

import { useState } from "react";
import { Swords, Plus, Trophy, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WarData } from "./types";

interface WarHeaderProps {
  activeWar: WarData | null;
  isAdmin: boolean;
  activeCount: number;
  onStartWar: (formData: FormData) => Promise<void>;
  onEndWar: (formData: FormData) => Promise<void>;
}

export function WarHeader({ activeWar, isAdmin, activeCount, onStartWar, onEndWar }: WarHeaderProps) {
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  const handleStartWrapper = async (fd: FormData) => {
    await onStartWar(fd);
    setIsStartOpen(false);
  };

  const handleEndWrapper = async (fd: FormData) => {
    await onEndWar(fd);
    setIsEndOpen(false);
  };

  return (
    <div className="panel-clash flex flex-col md:flex-row justify-between gap-4 items-start md:items-center p-6">
      <div className="flex items-start gap-4">
        <div className="hidden sm:flex shrink-0 h-12 w-12 rounded-xl rotate-45 bg-gradient-to-br from-amber-300 to-amber-700 border-2 border-amber-800/60 items-center justify-center shadow-[0_4px_14px_-2px_rgba(240,169,43,0.5)]">
          <Swords className="w-5 h-5 text-amber-950 -rotate-45" />
        </div>
        <div>
          <div className="eyebrow mb-2">Sala de Guerra</div>
          <h1 className="text-3xl md:text-4xl clash-title leading-none">
            {activeWar ? `Vs. ${activeWar.opponentName}` : "Preparação"}
          </h1>
          {activeWar ? (
            <div className="flex gap-3 mt-3">
              <Badge variant="outline" className="border-primary/50 text-primary bg-primary/15">
                {activeWar.size}v{activeWar.size}
              </Badge>
              {activeWar.isLeague && (
                <Badge variant="outline" className="border-primary/50 text-primary bg-primary/15">
                  <Trophy className="w-3 h-3 mr-1"/> CWL
                </Badge>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground font-medium mt-2 text-sm">Organize o esquadrão para a próxima batalha.</p>
          )}
        </div>
      </div>

      {isAdmin && (
        <div className="flex gap-2">
          {!activeWar && (
            <Dialog open={isStartOpen} onOpenChange={setIsStartOpen}>
              <DialogTrigger asChild>
                <Button className="btn-clash-green shadow-lg gap-2">
                  <Plus className="w-4 h-4"/> Iniciar Guerra
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border text-white">
                <DialogHeader><DialogTitle>Declarar Guerra</DialogTitle></DialogHeader>
                <form action={handleStartWrapper} className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Oponente</Label>
                    <Input name="opponent" placeholder="Nome do Clã Inimigo" className="bg-background border-border" required/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tamanho</Label>
                      <Select name="size" defaultValue={activeCount > 0 ? activeCount.toString() : "15"}>
                        <SelectTrigger className="bg-background border-border"><SelectValue/></SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="10">10v10</SelectItem>
                          <SelectItem value="15">15v15</SelectItem>
                          <SelectItem value="20">20v20</SelectItem>
                          <SelectItem value="30">30v30</SelectItem>
                          <SelectItem value="40">40v40</SelectItem>
                          <SelectItem value="50">50v50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end pb-2">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" name="isLeague" id="cwl" className="w-4 h-4 accent-primary"/>
                        <Label htmlFor="cwl" className="cursor-pointer">É Liga (CWL)?</Label>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="btn-clash w-full mt-2">QUE COMECE A BATALHA!</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}

          {activeWar && (
            <Dialog open={isEndOpen} onOpenChange={setIsEndOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="shadow-lg gap-2 border border-destructive/30">
                  <Flag className="w-4 h-4"/> Encerrar Guerra
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border text-white">
                <DialogHeader>
                  <DialogTitle>Relatório de Batalha</DialogTitle>
                  <DialogDescription className="text-muted-foreground">Registre o resultado final.</DialogDescription>
                </DialogHeader>
                <form action={handleEndWrapper} className="grid gap-4 py-4">
                  <input type="hidden" name="warId" value={activeWar.id} />
                  <div className="space-y-2">
                    <Label>Resultado</Label>
                    <Select name="result" defaultValue="win">
                      <SelectTrigger className="bg-background border-border text-white"><SelectValue/></SelectTrigger>
                      <SelectContent className="bg-card border-border text-white">
                        <SelectItem value="win">Vitória 🏆</SelectItem>
                        <SelectItem value="loss">Derrota 💀</SelectItem>
                        <SelectItem value="draw">Empate 🤝</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Placar Final</Label>
                    <Input name="score" placeholder="Ex: 42-38" className="bg-background border-border text-white" required/>
                  </div>
                  <Button type="submit" className="w-full bg-muted hover:bg-accent mt-2 text-white">Arquivar Guerra</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
    </div>
  );
}