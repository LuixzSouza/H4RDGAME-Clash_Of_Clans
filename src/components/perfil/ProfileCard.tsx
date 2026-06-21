import { Copy, Check, Shield, Wallet, Crown, Medal } from "lucide-react";
import { CardContent } from "@/components/ui/card";
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
      case 'LIDER': return "bg-gradient-to-b from-amber-300 to-amber-600 border-primary text-amber-950 shadow-primary/40";
      case 'COLIDER': return "bg-primary/20 border-primary/40 text-primary";
      case 'ANCIAO': return "bg-secondary border-border text-foreground/80";
      default: return "bg-muted border-border text-muted-foreground";
    }
  };

  return (
    <div className="panel-clash overflow-hidden relative group shadow-2xl h-full flex flex-col">
        <div className="absolute top-0 inset-x-0 h-36 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-primary/20 opacity-50"></div>
        
        <CardContent className="pt-12 pb-8 flex flex-col items-center relative z-10 flex-grow">
            <div className="relative group-hover:scale-105 transition-transform duration-500">
                <div className="w-36 h-36 rounded-full border-4 border-border bg-background overflow-hidden shadow-2xl ring-4 ring-primary/20 group-hover:ring-primary/60 transition-all">
                    <Avatar className="w-full h-full">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedSeed}`} />
                        <AvatarFallback className="text-4xl bg-muted">{user?.name?.[0]}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-background text-primary font-bold border border-primary shadow-lg px-3 py-1 text-sm uppercase tracking-widest">
                        TH {user?.thLevel || "?"}
                    </Badge>
                </div>
            </div>

            <div className="mt-8 text-center w-full">
              <h2 className="text-3xl font-bold text-white tracking-tight">{user?.name}</h2>
              <button onClick={onCopyTag} className="mt-1 flex items-center justify-center gap-2 text-muted-foreground font-mono text-sm hover:text-white transition-colors mx-auto">
                {user?.tag}
                {copiedTag ? <Check className="w-3 h-3 text-success"/> : <Copy className="w-3 h-3"/>}
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
                <div className="plaque p-3 text-center">
                    <div className="text-muted-foreground text-[10px] uppercase font-bold mb-1 flex items-center justify-center gap-1">
                        <Shield className="w-3 h-3" /> Status Guerra
                    </div>
                    <span className={`text-lg font-black ${user?.warStatus === 'IN' ? "text-success drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]" : "text-destructive"}`}>
                        {user?.warStatus === 'IN' ? 'ATIVO' : 'FORA'}
                    </span>
                </div>
                <div className="plaque p-3 text-center">
                    <div className="text-muted-foreground text-[10px] uppercase font-bold mb-1 flex items-center justify-center gap-1">
                        <Wallet className="w-3 h-3" /> Tickets
                    </div>
                    <span className="text-lg font-black text-primary drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]">
                        {user?.tickets || 0}
                    </span>
                </div>
            </div>
        </CardContent>
    </div>
  );
}