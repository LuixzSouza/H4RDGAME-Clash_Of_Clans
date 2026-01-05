import { Megaphone, Lock, ShieldAlert, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface UserWelcomeProps {
  user: { role: string; name: string } | null;
  isAdmin: boolean;
}

export function UserWelcome({ user, isAdmin }: UserWelcomeProps) {
  if (!user) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Card de Boas Vindas */}
        <Card className={`md:col-span-2 border-l-4 ${isAdmin ? 'border-l-yellow-500 bg-gradient-to-r from-yellow-900/10 to-transparent' : 'border-l-blue-500 bg-gradient-to-r from-blue-900/10 to-transparent'} border-y-0 border-r-0 shadow-lg bg-[#1e202b]`}>
            <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-full ${isAdmin ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    {isAdmin ? <Lock className="w-6 h-6"/> : <Megaphone className="w-6 h-6"/>}
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white">Saudações, {user.name}!</h2>
                    <p className="text-sm text-slate-400">
                        {isAdmin 
                            ? "Painel de Comando Ativo. Você tem permissão para convocar guerras e gerenciar o mural." 
                            : "Fique atento aos avisos do mural. A participação na guerra é obrigatória."}
                    </p>
                </div>
            </CardContent>
        </Card>

        {/* Card de Status Rápido (Exemplo Estático por enquanto) */}
        <Card className="bg-[#1e202b] border border-[#2f3245] shadow-lg flex flex-col justify-center">
            <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-red-500/10 p-2 rounded-lg text-red-500">
                        <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-bold">Status de Guerra</p>
                        <p className="text-sm font-bold text-white">Preparação (12h)</p>
                    </div>
                </div>
                <Zap className="w-4 h-4 text-yellow-500 opacity-50" />
            </CardContent>
        </Card>
    </div>
  );
}