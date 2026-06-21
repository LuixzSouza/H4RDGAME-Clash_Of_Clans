import { Activity, Loader2, Coins, Swords, UserPlus } from "lucide-react";
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
    switch (action) {
      case "PAGAMENTO": return { icon: Coins, color: "text-success", bg: "bg-success/10 border-success/25" };
      case "GUERRA": return { icon: Swords, color: "text-destructive", bg: "bg-destructive/10 border-destructive/25" };
      case "RECRUTAMENTO": return { icon: UserPlus, color: "text-primary", bg: "bg-primary/10 border-primary/25" };
      default: return { icon: Activity, color: "text-primary", bg: "bg-primary/10 border-primary/25" };
    }
  };

  return (
    <div className="panel-clash h-full flex flex-col overflow-hidden">
      <div className="px-5 py-4 border-b border-border bg-secondary/40 flex items-center justify-between">
        <h3 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2 tracking-widest">
          <Activity className="w-4 h-4 text-primary" /> Registro de Operações
        </h3>
        <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
      </div>

      <div className="flex-1 relative">
        <ScrollArea className="h-[420px]">
          <div className="p-4 relative">
            {/* Linha do tempo dourada */}
            {!loading && logs.length > 0 && (
              <div className="absolute left-[27px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-primary/40 via-border to-transparent" />
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-xs">Carregando dados...</span>
              </div>
            ) : logs.length > 0 ? (
              logs.map((log) => {
                const config = getLogConfig(log.action);
                const Icon = config.icon;
                return (
                  <div key={log.id} className="relative flex gap-4 mb-6 last:mb-0 group">
                    <div className={`relative z-10 w-8 h-8 rounded-full border bg-card flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${config.bg}`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm text-foreground/90 leading-snug">
                        <span className="font-bold text-white">{log.member?.name || "Sistema"}</span>{" "}
                        {log.details.replace(log.member?.name || "", "")}
                      </p>
                      <span className="text-[10px] text-muted-foreground font-mono mt-1 block">{timeAgo(log.createdAt)}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-muted-foreground text-xs">Sem registros recentes.</div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
