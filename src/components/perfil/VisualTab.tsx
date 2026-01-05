"use client";

import { Sparkles, Dices, Check, Loader2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VisualTabProps {
  selectedSeed: string;
  setSelectedSeed: (val: string) => void;
  avatarGrid: string[];
  onShuffle: () => void;
  onSave: () => void;
  saving: boolean;
  currentSeed: string | null | undefined;
}

export function VisualTab({ 
  selectedSeed, setSelectedSeed, avatarGrid, onShuffle, onSave, saving, currentSeed 
}: VisualTabProps) {
  return (
    <Card className="bg-[#1e202b] border-[#2f3245] shadow-xl">
        <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" /> Customizar Visual
            </CardTitle>
            <CardDescription className="text-slate-400">
                Escolha uma skin abaixo ou crie uma única digitando um código.
            </CardDescription>
        </CardHeader>
        <CardContent>
            
            {/* Input Manual de Seed */}
            <div className="flex gap-2 mb-6">
                <Input 
                    value={selectedSeed}
                    onChange={(e) => setSelectedSeed(e.target.value)}
                    placeholder="Digite algo para gerar um avatar único (ex: MagoDeGelo)"
                    className="bg-[#15161e] border-[#2f3245] text-white focus-visible:ring-yellow-500"
                />
                <Button onClick={onShuffle} variant="outline" className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 gap-2">
                    <Dices className="w-4 h-4"/> Rolar Dados
                </Button>
            </div>

            {/* Grid de Opções */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {avatarGrid.map((seed, idx) => (
                    <div 
                        key={idx}
                        onClick={() => setSelectedSeed(seed)}
                        className={`
                            cursor-pointer rounded-2xl overflow-hidden border-2 transition-all p-2 bg-[#15161e] relative group
                            ${selectedSeed === seed 
                                ? 'border-yellow-500 ring-2 ring-yellow-500/30 scale-105 z-10 bg-[#252a3b]' 
                                : 'border-[#2f3245] hover:border-slate-500 hover:scale-105 opacity-80 hover:opacity-100'}
                        `}
                    >
                        <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} 
                            alt={seed}
                            className="w-full h-auto drop-shadow-md"
                        />
                        {selectedSeed === seed && (
                            <div className="absolute top-1 right-1 bg-yellow-500 rounded-full p-0.5 shadow-lg">
                                <Check className="w-3 h-3 text-black" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            <div className="mt-8 flex items-center justify-between border-t border-[#2f3245] pt-6">
                <span className="text-xs text-slate-500">
                    *A alteração será visível para todo o clã instantaneamente.
                </span>
                <Button 
                    onClick={onSave} 
                    disabled={saving || selectedSeed === currentSeed}
                    className="btn-clash-green shadow-lg gap-2 px-8"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
                    Equipar Skin
                </Button>
            </div>
        </CardContent>
    </Card>
  );
}