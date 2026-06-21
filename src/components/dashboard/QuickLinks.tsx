import Link from "next/link";
import { Swords, Wallet, Users, CalendarDays, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface QuickLinksProps {
  isAdmin: boolean;
}

type QuickLink = {
  href: string;
  icon: LucideIcon;
  title: string;
  admin: string;
  member: string;
};

const LINKS: QuickLink[] = [
  { href: "/dashboard/guerra", icon: Swords, title: "Sala de Guerra", admin: "Gerenciar lista de presença", member: "Verificar escalação" },
  { href: "/dashboard/financeiro", icon: Wallet, title: "Cofre do Clã", admin: "Baixa de pagamentos", member: "Comprar cotas da Skin" },
  { href: "/dashboard/membros", icon: Users, title: "Efetivo", admin: "Gerenciar guerreiros", member: "Ver o clã" },
  { href: "/dashboard/eventos", icon: CalendarDays, title: "Eventos", admin: "Criar avisos e datas", member: "Calendário do clã" },
];

export function QuickLinks({ isAdmin }: QuickLinksProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} className="group block">
          <div className="panel-clash p-5 h-full flex items-center justify-between hover:-translate-y-1 hover:border-primary/50 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <l.icon className="text-primary w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg group-hover:text-primary transition-colors leading-tight">
                  {l.title}
                </h3>
                <p className="text-muted-foreground text-xs mt-1">{isAdmin ? l.admin : l.member}</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
          </div>
        </Link>
      ))}
    </div>
  );
}
