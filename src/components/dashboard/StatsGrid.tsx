import { Users, Swords, Wallet, Trophy, Loader2, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatsGridProps {
  stats: {
    totalMembers: number;
    warParticipants: number;
    totalTreasury: number;
    paidMembers: number;
  };
  loading: boolean;
}

function StatCard({
  icon: Icon,
  label,
  value,
  footer,
  loading,
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  footer: React.ReactNode;
  loading: boolean;
}) {
  return (
    <div className="panel-clash p-5 group hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Marca d'água */}
      <Icon className="absolute -top-3 -right-3 w-24 h-24 text-primary/[0.06] group-hover:text-primary/[0.1] transition-colors" />

      <div className="relative z-10 flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold text-primary uppercase tracking-widest">{label}</span>
        <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>

      <div className="relative z-10 text-3xl font-black text-white leading-none min-h-[36px] flex items-center">
        {loading ? <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" /> : value}
      </div>

      <div className="relative z-10 mt-2 text-[10px] text-muted-foreground font-bold uppercase tracking-wide">
        {footer}
      </div>

      {/* Barra dourada inferior */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent" />
    </div>
  );
}

export function StatsGrid({ stats, loading }: StatsGridProps) {
  return (
    <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={Users}
        label="Efetivo Total"
        loading={loading}
        value={
          <span className="flex items-baseline gap-1">
            {stats.totalMembers}
            <span className="text-muted-foreground/60 text-sm font-bold">/50</span>
          </span>
        }
        footer={
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" /> Online
          </span>
        }
      />

      <StatCard
        icon={Swords}
        label="Status de Guerra"
        loading={loading}
        value={stats.warParticipants}
        footer="Combatentes Confirmados"
      />

      <StatCard
        icon={Wallet}
        label="Cofre do Clã"
        loading={loading}
        value={`R$ ${stats.totalTreasury.toFixed(2)}`}
        footer={
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-success" /> {stats.paidMembers} Apoiadores
          </span>
        }
      />

      <StatCard
        icon={Trophy}
        label="Liga CWL"
        loading={loading}
        value={<span className="text-primary">Ouro I</span>}
        footer="Próxima Temporada"
      />
    </div>
  );
}
