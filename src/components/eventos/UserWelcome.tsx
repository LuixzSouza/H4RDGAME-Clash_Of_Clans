import { Megaphone, Lock, ShieldAlert, Zap } from "lucide-react";
import { CardContent } from "@/components/ui/card";

interface UserWelcomeProps {
  user: { role: string; name: string } | null;
  isAdmin: boolean;
}

export function UserWelcome({ user, isAdmin }: UserWelcomeProps) {
  if (!user) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Card de Boas Vindas */}
        <div className="md:col-span-2 panel-clash border-l-4 border-l-primary bg-gradient-to-r from-primary/10 to-transparent shadow-lg overflow-hidden">
            <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-full ${isAdmin ? 'bg-primary/10 text-primary' : 'bg-primary/10 text-primary'}`}>
                    {isAdmin ? <Lock className="w-6 h-6"/> : <Megaphone className="w-6 h-6"/>}
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white">Saudações, {user.name}!</h2>
                    <p className="text-sm text-muted-foreground">
                        {isAdmin 
                            ? "Painel de Comando Ativo. Você tem permissão para convocar guerras e gerenciar o mural." 
                            : "Fique atento aos avisos do mural. A participação na guerra é obrigatória."}
                    </p>
                </div>
            </CardContent>
        </div>

        {/* Card de Status Rápido (Exemplo Estático por enquanto) */}
        <div className="panel-clash shadow-lg flex flex-col justify-center">
            <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-destructive/10 p-2 rounded-lg text-destructive">
                        <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold">Status de Guerra</p>
                        <p className="text-sm font-bold text-white">Preparação (12h)</p>
                    </div>
                </div>
                <Zap className="w-4 h-4 text-primary opacity-50" />
            </CardContent>
        </div>
    </div>
  );
}