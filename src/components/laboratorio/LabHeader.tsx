"use client";

import { FlaskConical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LabHeaderProps {
  isAdmin: boolean;
  onOpenDialog: () => void;
}

export function LabHeader({ isAdmin, onOpenDialog }: LabHeaderProps) {
  return (
    <div className="panel-clash flex flex-col md:flex-row md:items-center justify-between gap-4 p-6">
      <div className="flex items-start gap-4">
        <div className="hidden sm:flex shrink-0 h-12 w-12 rounded-xl rotate-45 bg-gradient-to-br from-amber-300 to-amber-700 border-2 border-amber-800/60 items-center justify-center shadow-[0_4px_14px_-2px_rgba(240,169,43,0.5)]">
          <FlaskConical className="w-5 h-5 text-amber-950 -rotate-45" />
        </div>
        <div>
          <div className="eyebrow mb-2">Laboratório</div>
          <h1 className="text-3xl md:text-4xl clash-title leading-none">Meta de Ataque</h1>
          <p className="text-muted-foreground mt-2 text-sm">Aprenda as melhores composições de tropas.</p>
        </div>
      </div>
      
      {isAdmin && (
        <Button onClick={onOpenDialog} className="btn-clash-green shadow-lg">
            <Plus className="w-4 h-4 mr-2"/> Nova Estratégia
        </Button>
      )}
    </div>
  );
}