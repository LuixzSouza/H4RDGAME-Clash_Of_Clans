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
    <div className="bg-[#1e202b] border border-[#2f3245] p-4 rounded-xl shadow-xl flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center">
            
        {/* Seletor de CV (Botões) */}
        <div className="w-full xl:w-auto">
            <span className="text-[10px] font-bold text-slate-500 uppercase mb-2 block tracking-widest">Nível do Centro de Vila</span>
            <div className="flex flex-wrap gap-2">
                {[16, 15, 14, 13, 12, 11, 10, 9].map((th) => (
                    <button
                        key={th}
                        onClick={() => setSelectedTH(th.toString())}
                        className={`
                            h-10 w-12 rounded-lg font-bold text-sm transition-all border-b-4 active:border-b-0 active:translate-y-1
                            ${selectedTH === th.toString() 
                                ? 'bg-blue-600 text-white border-blue-800 shadow-[0_0_10px_rgba(37,99,235,0.3)]' 
                                : 'bg-[#2f3245] text-slate-400 border-[#1a1b26] hover:bg-[#3a3f55] hover:text-white'}
                        `}
                    >
                        {th}
                    </button>
                ))}
            </div>
        </div>

        {/* Seletor de Tipo (Tabs) */}
        <div className="w-full xl:w-auto">
            <span className="text-[10px] font-bold text-slate-500 uppercase mb-2 block tracking-widest">Objetivo Estratégico</span>
            <Tabs defaultValue="all" value={selectedType} onValueChange={setSelectedType} className="w-full">
                <TabsList className="bg-[#15161e] border border-[#2f3245] h-12 p-1 w-full xl:w-auto grid grid-cols-4 xl:flex gap-1">
                    <TabsTrigger value="all" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-xs">Todos</TabsTrigger>
                    <TabsTrigger value="war" className="data-[state=active]:bg-red-900/40 data-[state=active]:text-red-400 text-xs gap-2"><Swords className="w-3 h-3"/> Guerra</TabsTrigger>
                    <TabsTrigger value="farm" className="data-[state=active]:bg-green-900/40 data-[state=active]:text-green-400 text-xs gap-2"><Coins className="w-3 h-3"/> Farm</TabsTrigger>
                    <TabsTrigger value="push" className="data-[state=active]:bg-yellow-900/40 data-[state=active]:text-yellow-400 text-xs gap-2"><Trophy className="w-3 h-3"/> Push</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    </div>
  );
}