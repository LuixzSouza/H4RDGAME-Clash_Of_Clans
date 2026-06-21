import Link from "next/link";
import { Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="panel-clash p-10 max-w-md text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-xl rotate-45 bg-gradient-to-br from-amber-300 to-amber-700 border-2 border-amber-800/60 flex items-center justify-center shadow-lg">
          <Compass className="w-7 h-7 text-amber-950 -rotate-45" />
        </div>
        <h1 className="text-7xl clash-title leading-none mb-2">404</h1>
        <h2 className="text-xl font-bold text-white mb-2">Território inexplorado</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Esta página não está no nosso mapa de guerra.
        </p>
        <Link href="/" className="btn-clash text-sm">
          <Home className="w-4 h-4 mr-2" /> Voltar à base
        </Link>
      </div>
    </div>
  );
}
