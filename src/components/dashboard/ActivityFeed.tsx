import { Activity, Loader2, Coins, Swords, UserPlus, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type Log = {
  id: string;
  action: string;
  details: string;
  createdAt: Date;
  member: { name: string } | null;
};

interface ActivityFeedProps {
  logs: Log[];
  loading: boolean;
}

export function ActivityFeed({ logs, loading }: ActivityFeedProps) {
  
  const timeAgo = (dateInput: Date) => {
    const seconds = Math.floor((new Date().getTime() - dateInput.getTime()) / 1000);
    const interval = seconds / 3600;
    if (interval > 24) return Math.floor(interval / 24) + "d atrás";
    if (interval > 1) return Math.floor(interval) + "h atrás";
    if (seconds < 60) return "Agora";
    return Math.floor(seconds / 60) + "m atrás";
  };

  const getLogConfig = (action: string) => {
    switch(action) {
        case "PAGAMENTO": return { icon: Coins, color: "text-green-400", bg: "bg-green-500/10" };
        case "GUERRA": return { icon: Swords, color: "text-red-400", bg: "bg-red-500/10" };
        case "RECRUTAMENTO": return { icon: UserPlus, color: "text-blue-400", bg: "bg-blue-500/10" };
        default: return { icon: Activity, color: "text-yellow-400", bg: "bg-yellow-500/10" };
    }
  };

  return (
    <Card className="h-full bg-[#1e202b] border-[#2f3245] flex flex-col shadow-lg overflow-hidden">
        <CardHeader className="bg-[#15161e] border-b border-[#2f3245] py-4">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 tracking-widest">
                <Activity className="w-4 h-4 text-yellow-500" /> Registro de Operações
            </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 relative">
            <ScrollArea className="h-[400px]">
                <div className="p-4 relative">
                    {/* Linha do tempo vertical */}
                    <div className="absolute left-[27px] top-6 bottom-6 w-[2px] bg-[#2f3245]"></div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-500 gap-2">
                            <Loader2 className="w-5 h-5 animate-spin"/>
                            <span className="text-xs">Carregando dados...</span>
                        </div>
                    ) : logs.length > 0 ? logs.map((log) => {
                        const config = getLogConfig(log.action);
                        const Icon = config.icon;
                        
                        return (
                            <div key={log.id} className="relative flex gap-4 mb-6 last:mb-0 group">
                                <div className={`relative z-10 w-8 h-8 rounded-full border border-[#2f3245] bg-[#1e202b] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${config.bg}`}>
                                    <Icon className={`w-4 h-4 ${config.color}`} />
                                </div>
                                <div className="flex-1 pt-1">
                                    <p className="text-sm text-slate-200 leading-snug">
                                        <span className="font-bold text-white">{log.member?.name || "Sistema"}</span> {log.details.replace(log.member?.name || "", "")}
                                    </p>
                                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                                        {timeAgo(log.createdAt)}
                                    </span>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="text-center py-10 text-slate-500 text-xs">
                            Sem registros recentes.
                        </div>
                    )}
                </div>
            </ScrollArea>
        </CardContent>
    </Card>
  );
}