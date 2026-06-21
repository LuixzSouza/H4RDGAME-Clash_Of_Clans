"use client";

import { Sparkles, Dices, Check, Loader2, Save } from "lucide-react";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    <div className="panel-clash shadow-xl">
        <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> Customizar Visual
            </CardTitle>
            <CardDescription className="text-muted-foreground">
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
                    className="bg-background border-border text-white focus-visible:ring-primary"
                />
                <Button onClick={onShuffle} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 gap-2">
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
                            cursor-pointer rounded-2xl overflow-hidden border-2 transition-all p-2 bg-background relative group
                            ${selectedSeed === seed 
                                ? 'border-primary ring-2 ring-primary/30 scale-105 z-10 bg-accent' 
                                : 'border-border hover:border-border hover:scale-105 opacity-80 hover:opacity-100'}
                        `}
                    >
                        <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} 
                            alt={seed}
                            className="w-full h-auto drop-shadow-md"
                        />
                        {selectedSeed === seed && (
                            <div className="absolute top-1 right-1 bg-primary rounded-full p-0.5 shadow-lg">
                                <Check className="w-3 h-3 text-black" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
                <span className="text-xs text-muted-foreground">
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
    </div>
  );
}