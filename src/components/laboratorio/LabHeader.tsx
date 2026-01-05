"use client";

import { FlaskConical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LabHeaderProps {
  isAdmin: boolean;
  onOpenDialog: () => void;
}

export function LabHeader({ isAdmin, onOpenDialog }: LabHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md flex items-center gap-3">
          <FlaskConical className="w-8 h-8 text-purple-500" /> Laboratório
        </h1>
        <p className="text-slate-400 font-medium">
          O meta atual. Aprenda as melhores composições de ataque.
        </p>
      </div>
      
      {isAdmin && (
        <Button onClick={onOpenDialog} className="btn-clash-green shadow-lg">
            <Plus className="w-4 h-4 mr-2"/> Nova Estratégia
        </Button>
      )}
    </div>
  );
}