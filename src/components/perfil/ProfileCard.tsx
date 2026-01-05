import { Copy, Check, Shield, Wallet, Crown, Medal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Interface para UserData
interface UserData {
  id: string;
  name: string;
  tag: string;
  role: string;
  tickets: number;
  warStatus: string;
  thLevel: number;
  avatarSeed: string | null;
}

interface ProfileCardProps {
  user: UserData | null;
  selectedSeed: string;
  copiedTag: boolean;
  onCopyTag: () => void;
}

export function ProfileCard({ user, selectedSeed, copiedTag, onCopyTag }: ProfileCardProps) {
  
  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'LIDER': return "bg-gradient-to-r from-red-600 to-red-500 border-red-400 text-white shadow-red-900/50";
      case 'COLIDER': return "bg-gradient-to-r from-orange-600 to-orange-500 border-orange-400 text-white shadow-orange-900/50";
      case 'ANCIAO': return "bg-gradient-to-r from-blue-600 to-blue-500 border-blue-400 text-white shadow-blue-900/50";
      default: return "bg-slate-700 border-slate-600 text-slate-300";
    }
  };

  return (
    <Card className="bg-[#1e202b] border-[#2f3245] overflow-hidden relative group shadow-2xl h-full flex flex-col">
        <div className="absolute top-0 inset-x-0 h-36 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-blue-900/20 opacity-50"></div>
        
        <CardContent className="pt-12 pb-8 flex flex-col items-center relative z-10 flex-grow">
            <div className="relative group-hover:scale-105 transition-transform duration-500">
                <div className="w-36 h-36 rounded-full border-4 border-[#1e202b] bg-[#15161e] overflow-hidden shadow-2xl ring-4 ring-yellow-500/20 group-hover:ring-yellow-500/60 transition-all">
                    <Avatar className="w-full h-full">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedSeed}`} />
                        <AvatarFallback className="text-4xl bg-slate-800">{user?.name?.[0]}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-black text-yellow-500 font-bold border border-yellow-600 shadow-lg px-3 py-1 text-sm uppercase tracking-widest">
                        TH {user?.thLevel || "?"}
                    </Badge>
                </div>
            </div>

            <div className="mt-8 text-center w-full">
              <h2 className="text-3xl font-bold text-white tracking-tight">{user?.name}</h2>
              <button onClick={onCopyTag} className="mt-1 flex items-center justify-center gap-2 text-slate-500 font-mono text-sm hover:text-white transition-colors mx-auto">
                {user?.tag}
                {copiedTag ? <Check className="w-3 h-3 text-green-500"/> : <Copy className="w-3 h-3"/>}
              </button>
              <div className="mt-4 flex justify-center">
                <Badge className={`px-4 py-1 text-xs shadow-lg border ${getRoleBadgeStyle(user?.role || 'MEMBRO')}`}>
                    {user?.role === 'LIDER' && <Crown className="w-3 h-3 mr-2"/>}
                    {user?.role === 'COLIDER' && <Medal className="w-3 h-3 mr-2"/>}
                    {user?.role}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mt-auto pt-8">
                <div className="bg-[#15161e] p-3 rounded-xl border border-[#2f3245] text-center">
                    <div className="text-slate-500 text-[10px] uppercase font-bold mb-1 flex items-center justify-center gap-1">
                        <Shield className="w-3 h-3" /> Status Guerra
                    </div>
                    <span className={`text-lg font-black ${user?.warStatus === 'IN' ? "text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]" : "text-red-400"}`}>
                        {user?.warStatus === 'IN' ? 'ATIVO' : 'FORA'}
                    </span>
                </div>
                <div className="bg-[#15161e] p-3 rounded-xl border border-[#2f3245] text-center">
                    <div className="text-slate-500 text-[10px] uppercase font-bold mb-1 flex items-center justify-center gap-1">
                        <Wallet className="w-3 h-3" /> Tickets
                    </div>
                    <span className="text-lg font-black text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]">
                        {user?.tickets || 0}
                    </span>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}