"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw, Home } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erro no dashboard:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="panel-clash p-8 max-w-md text-center">
        <div className="mx-auto mb-5 h-16 w-16 rounded-xl rotate-45 bg-gradient-to-br from-destructive to-red-900 border-2 border-destructive/60 flex items-center justify-center shadow-lg">
          <AlertTriangle className="w-7 h-7 text-white -rotate-45" />
        </div>
        <h2 className="text-2xl clash-title mb-2">Algo deu errado</h2>
        <p className="text-muted-foreground text-sm mb-6">
          A muralha encontrou um problema ao carregar esta seção. Tente novamente.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-clash text-sm">
            <RotateCw className="w-4 h-4 mr-2" /> Tentar de novo
          </button>
          <Link href="/dashboard" className="btn-clash-outline text-sm">
            <Home className="w-4 h-4" /> Visão Geral
          </Link>
        </div>
      </div>
    </div>
  );
}
