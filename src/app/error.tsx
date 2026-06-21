"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erro na aplicação:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="panel-clash p-10 max-w-md text-center">
        <div className="mx-auto mb-5 h-16 w-16 rounded-xl rotate-45 bg-gradient-to-br from-destructive to-red-900 border-2 border-destructive/60 flex items-center justify-center shadow-lg">
          <AlertTriangle className="w-7 h-7 text-white -rotate-45" />
        </div>
        <h2 className="text-3xl clash-title mb-2">Erro inesperado</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Algo quebrou no caminho. Tente recarregar — se persistir, avise a liderança.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-clash text-sm">
            <RotateCw className="w-4 h-4 mr-2" /> Recarregar
          </button>
          <Link href="/" className="btn-clash-outline text-sm">
            <Home className="w-4 h-4" /> Início
          </Link>
        </div>
      </div>
    </div>
  );
}
