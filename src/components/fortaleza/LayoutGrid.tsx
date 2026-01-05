"use client";

import { 
  Castle, Swords, Coins, Trophy, Copy, ExternalLink, ShieldCheck, Trash2, Plus 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Tipo compatível
type Layout = {
  id: string;
  name: string;
  description: string;
  thLevel: number;
  type: string;
  imageUrl: string;
  link: string;
};

interface LayoutGridProps {
  layouts: Layout[];
  loading: boolean;
  isAdmin: boolean;
  onDelete: (id: string) => void;
  onCopyLink: (link: string) => void;
  selectedTH: string;
  selectedType: string;
  onClearFilter: () => void;
  onAddClick: () => void;
}

export function LayoutGrid({
  layouts, loading, isAdmin, onDelete, onCopyLink, 
  selectedTH, selectedType, onClearFilter, onAddClick
}: LayoutGridProps) {

  // Helpers
  const getTypeIcon = (type: string) => {
    switch(type) {
      case "war": return <Swords className="w-4 h-4 text-red-500" />;
      case "farm": return <Coins className="w-4 h-4 text-green-500" />;
      case "push": return <Trophy className="w-4 h-4 text-yellow-500" />;
      default: return <Castle className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
        case "war": return "Guerra";
        case "farm": return "Farm";
        case "push": return "Push";
        default: return type;
      }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
        case "war": return "border-red-500/50 bg-red-950/40 text-red-400";
        case "farm": return "border-green-500/50 bg-green-950/40 text-green-400";
        case "push": return "border-yellow-500/50 bg-yellow-950/40 text-yellow-400";
        default: return "border-slate-500/50 bg-slate-500/10";
      }
  };

  if (loading) {
    return <div className="col-span-full py-20 text-center text-slate-500 animate-pulse">Carregando a fortaleza...</div>;
  }

  if (layouts.length === 0) {
    return (
        <div className="col-span-full py-20 text-center flex flex-col items-center justify-center text-slate-500 bg-[#1e202b]/50 rounded-xl border border-dashed border-[#2f3245]">
            <div className="bg-[#15161e] p-6 rounded-full mb-4 border border-[#2f3245]">
                <ShieldCheck className="w-12 h-12 opacity-20 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-300">Nenhum layout encontrado</h3>
            <p className="text-sm mt-2 max-w-md mx-auto text-slate-500">
                Ainda não adicionamos layouts para o CV{selectedTH} do tipo {getTypeLabel(selectedType)}. 
                <br/>
                {isAdmin ? "Como líder, você pode adicionar um novo agora." : "Tente mudar os filtros ou peça no chat."}
            </p>
            {isAdmin ? (
                <Button variant="outline" className="mt-6 border-slate-600 text-slate-400 hover:text-white" onClick={onAddClick}>
                    <Plus className="w-4 h-4 mr-2"/> Adicionar Layout
                </Button>
            ) : (
                <Button variant="outline" className="mt-6 border-slate-600 text-slate-400 hover:text-white" onClick={onClearFilter}>
                    Limpar Filtros
                </Button>
            )}
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {layouts.map((layout) => (
            <div 
                key={layout.id} 
                className="group relative bg-[#1e202b] border border-[#2f3245] rounded-xl overflow-hidden hover:border-slate-500 transition-all duration-300 shadow-lg flex flex-col"
            >
                {/* Botão Excluir (Admin) */}
                {isAdmin && (
                    <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="destructive" className="h-8 w-8 shadow-lg" onClick={() => onDelete(layout.id)}>
                            <Trash2 className="w-4 h-4"/>
                        </Button>
                    </div>
                )}

                {/* Imagem do Layout */}
                <div className="relative aspect-video w-full overflow-hidden bg-[#0c1216] border-b border-[#2f3245]">
                    
                    {/* Badge TH Flutuante */}
                    <div className="absolute top-3 left-3 z-10">
                        <Badge className="bg-blue-600 border-blue-400 text-white font-bold text-xs shadow-black/50 shadow-md">
                            TH {layout.thLevel}
                        </Badge>
                    </div>
                    {/* Badge Tipo Flutuante */}
                    <div className={`absolute top-3 z-10 ${isAdmin ? 'right-12' : 'right-3'}`}>
                        <Badge variant="outline" className={`font-bold text-xs shadow-black/50 shadow-md backdrop-blur-md ${getTypeColor(layout.type)}`}>
                            {getTypeIcon(layout.type)} <span className="ml-1">{getTypeLabel(layout.type)}</span>
                        </Badge>
                    </div>
                    
                    {/* Imagem */}
                    <img 
                        src={layout.imageUrl} 
                        alt={layout.name}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/600x400/1a1b26/FFF?text=Imagem+Indisponivel"
                        }}
                    />
                    
                    {/* Overlay com Botão Primário */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <a href={layout.link} target="_blank" rel="noopener noreferrer">
                            <Button variant="secondary" className="font-bold gap-2 scale-90 group-hover:scale-100 transition-transform">
                                <ExternalLink className="w-4 h-4"/> Abrir no Jogo
                            </Button>
                        </a>
                    </div>
                </div>

                <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg line-clamp-1" title={layout.name}>{layout.name}</CardTitle>
                    <CardDescription className="text-slate-400 line-clamp-2 text-sm min-h-[40px]">
                        {layout.description}
                    </CardDescription>
                </CardHeader>

                <CardFooter className="mt-auto pt-0 p-4 bg-[#1a1b26]/50 border-t border-[#2f3245]">
                    <Button 
                        variant="outline"
                        className="w-full bg-transparent border-slate-700 text-slate-300 hover:bg-[#2f3245] hover:text-white hover:border-slate-500 transition-all gap-2"
                        onClick={() => onCopyLink(layout.link)}
                    >
                        <Copy className="w-4 h-4" /> Copiar Link
                    </Button>
                </CardFooter>
            </div>
        ))}
    </div>
  );
}