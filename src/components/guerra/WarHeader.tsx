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
    <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Swords className="w-8 h-8 text-red-500" /> 
          {activeWar ? `Vs. ${activeWar.opponentName}` : "Preparação de Guerra"}
        </h1>
        {activeWar ? (
          <div className="flex gap-3 mt-2">
            <Badge variant="outline" className="border-red-500/50 text-red-400 bg-red-950/30">
              {activeWar.size}v{activeWar.size}
            </Badge>
            {activeWar.isLeague && (
              <Badge variant="outline" className="border-purple-500/50 text-purple-400 bg-purple-950/30">
                <Trophy className="w-3 h-3 mr-1"/> CWL
              </Badge>
            )}
          </div>
        ) : (
          <p className="text-slate-400 font-medium mt-1">Organize o esquadrão para a próxima batalha.</p>
        )}
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
              <DialogContent className="bg-[#1e202b] border-[#2f3245] text-white">
                <DialogHeader><DialogTitle>Declarar Guerra</DialogTitle></DialogHeader>
                <form action={handleStartWrapper} className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Oponente</Label>
                    <Input name="opponent" placeholder="Nome do Clã Inimigo" className="bg-[#15161e] border-[#2f3245]" required/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tamanho</Label>
                      <Select name="size" defaultValue={activeCount > 0 ? activeCount.toString() : "15"}>
                        <SelectTrigger className="bg-[#15161e] border-[#2f3245]"><SelectValue/></SelectTrigger>
                        <SelectContent className="bg-[#1e202b] border-[#2f3245]">
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
                        <input type="checkbox" name="isLeague" id="cwl" className="w-4 h-4 accent-purple-500"/>
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
                <Button variant="destructive" className="shadow-lg gap-2 border border-red-400/30">
                  <Flag className="w-4 h-4"/> Encerrar Guerra
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1e202b] border-[#2f3245] text-white">
                <DialogHeader>
                  <DialogTitle>Relatório de Batalha</DialogTitle>
                  <DialogDescription className="text-slate-400">Registre o resultado final.</DialogDescription>
                </DialogHeader>
                <form action={handleEndWrapper} className="grid gap-4 py-4">
                  <input type="hidden" name="warId" value={activeWar.id} />
                  <div className="space-y-2">
                    <Label>Resultado</Label>
                    <Select name="result" defaultValue="win">
                      <SelectTrigger className="bg-[#15161e] border-[#2f3245] text-white"><SelectValue/></SelectTrigger>
                      <SelectContent className="bg-[#1e202b] border-[#2f3245] text-white">
                        <SelectItem value="win">Vitória 🏆</SelectItem>
                        <SelectItem value="loss">Derrota 💀</SelectItem>
                        <SelectItem value="draw">Empate 🤝</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Placar Final</Label>
                    <Input name="score" placeholder="Ex: 42-38" className="bg-[#15161e] border-[#2f3245] text-white" required/>
                  </div>
                  <Button type="submit" className="w-full bg-slate-700 hover:bg-slate-600 mt-2 text-white">Arquivar Guerra</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
    </div>
  );
}