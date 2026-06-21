"use client";

import { Swords, Coins, Trophy } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FilterBarProps {
  selectedTH: string;
  setSelectedTH: (val: string) => void;
  selectedType: string;
  setSelectedType: (val: string) => void;
}

export function FilterBar({ selectedTH, setSelectedTH, selectedType, setSelectedType }: FilterBarProps) {
  return (
    <div className="bg-card border border-border p-4 rounded-xl shadow-xl flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center">
            
        {/* Seletor de CV (Botões) */}
        <div className="w-full xl:w-auto">
            <span className="text-[10px] font-bold text-muted-foreground uppercase mb-2 block tracking-widest">Nível do Centro de Vila</span>
            <div className="flex flex-wrap gap-2">
                {[16, 15, 14, 13, 12, 11, 10, 9].map((th) => (
                    <button
                        key={th}
                        onClick={() => setSelectedTH(th.toString())}
                        className={`
                            h-10 w-12 rounded-lg font-bold text-sm transition-all border-b-4 active:border-b-0 active:translate-y-1
                            ${selectedTH === th.toString() 
                                ? 'bg-primary text-white border-primary shadow-[0_0_10px_rgba(240,169,43,0.3)]' 
                                : 'bg-accent text-muted-foreground border-border hover:bg-accent hover:text-white'}
                        `}
                    >
                        {th}
                    </button>
                ))}
            </div>
        </div>

        {/* Seletor de Tipo (Tabs) */}
        <div className="w-full xl:w-auto">
            <span className="text-[10px] font-bold text-muted-foreground uppercase mb-2 block tracking-widest">Objetivo Estratégico</span>
            <Tabs defaultValue="all" value={selectedType} onValueChange={setSelectedType} className="w-full">
                <TabsList className="bg-background border border-border h-12 p-1 w-full xl:w-auto grid grid-cols-4 xl:flex gap-1">
                    <TabsTrigger value="all" className="data-[state=active]:bg-muted data-[state=active]:text-white text-xs">Todos</TabsTrigger>
                    <TabsTrigger value="war" className="data-[state=active]:bg-destructive/40 data-[state=active]:text-destructive text-xs gap-2"><Swords className="w-3 h-3"/> Guerra</TabsTrigger>
                    <TabsTrigger value="farm" className="data-[state=active]:bg-success/40 data-[state=active]:text-success text-xs gap-2"><Coins className="w-3 h-3"/> Farm</TabsTrigger>
                    <TabsTrigger value="push" className="data-[state=active]:bg-primary/40 data-[state=active]:text-primary text-xs gap-2"><Trophy className="w-3 h-3"/> Push</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    </div>
  );
}