import { Users, Swords, Wallet, Trophy, Loader2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsGridProps {
  stats: {
    totalMembers: number;
    warParticipants: number;
    totalTreasury: number;
    paidMembers: number;
  };
  loading: boolean;
}

export function StatsGrid({ stats, loading }: StatsGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Membros */}
        <Card className="bg-[#1e202b] border-[#2f3245] shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
             <Users className="w-24 h-24 text-blue-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-xs font-bold text-blue-400 uppercase tracking-widest">Efetivo Total</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-black text-white flex items-baseline gap-1">
                {loading ? <Loader2 className="animate-spin h-6 w-6"/> : stats.totalMembers}
                <span className="text-slate-600 text-sm font-bold">/50</span>
            </div>
            <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wide flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-transparent"></div>
        </Card>

        {/* Guerra */}
        <Card className="bg-[#1e202b] border-[#2f3245] shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
             <Swords className="w-24 h-24 text-red-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-xs font-bold text-red-400 uppercase tracking-widest">Status de Guerra</CardTitle>
            <Swords className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-black text-white tracking-tight">
                {loading ? <Loader2 className="animate-spin h-6 w-6"/> : stats.warParticipants}
            </div>
            <p className="text-[10px] text-red-400/80 font-bold mt-1 uppercase tracking-wide">Combatentes Confirmados</p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-transparent"></div>
        </Card>

        {/* Tesouraria */}
        <Card className="bg-[#1e202b] border-[#2f3245] shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
             <Wallet className="w-24 h-24 text-green-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-xs font-bold text-green-400 uppercase tracking-widest">Cofre do Clã</CardTitle>
            <Wallet className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-black text-green-400">
                {loading ? <Loader2 className="animate-spin h-6 w-6"/> : `R$ ${stats.totalTreasury.toFixed(2)}`}
            </div>
            <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wide flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-500"/> {stats.paidMembers} Apoiadores
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-600 to-transparent"></div>
        </Card>

        {/* Liga */}
        <Card className="bg-[#1e202b] border-[#2f3245] shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
             <Trophy className="w-24 h-24 text-yellow-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-xs font-bold text-yellow-500 uppercase tracking-widest">Liga CWL</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-black text-yellow-400">Ouro I</div>
            <p className="text-[10px] text-yellow-600/80 font-bold mt-1 uppercase tracking-wide">Próxima Temporada</p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-600 to-transparent"></div>
        </Card>
      </div>
  );
}