"use client";

import { Castle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FortalezaHeaderProps {
  isAdmin: boolean;
  onOpenDialog: () => void;
}

export function FortalezaHeader({ isAdmin, onOpenDialog }: FortalezaHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md flex items-center gap-3">
          <Castle className="w-8 h-8 text-blue-500" /> Fortaleza
        </h1>
        <p className="text-slate-400 font-medium">
          Biblioteca de layouts estratégicos para proteger o clã.
        </p>
      </div>
      
      {isAdmin && (
        <Button onClick={onOpenDialog} className="btn-clash-green shadow-lg">
            <Plus className="w-4 h-4 mr-2"/> Sugerir Layout
        </Button>
      )}
    </div>
  );
}