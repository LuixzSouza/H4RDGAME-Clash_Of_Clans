import Link from "next/link";
import { Swords, Instagram, Youtube, MessageCircle, Heart, ShieldCheck } from "lucide-react";

const SOCIALS = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: MessageCircle, href: "https://wa.me/5535997354797", label: "WhatsApp" },
];

const NAV = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre o Clã", href: "#sobre" },
  { label: "Liderança", href: "#lideranca" },
  { label: "Regras de Guerra", href: "#regras" },
  { label: "Área de Membros", href: "/login" },
];

const EXTERNAL = [
  { label: "Site Oficial Supercell", href: "https://clashofclans.com/pt/" },
  { label: "Clash of Stats", href: "https://www.clashofstats.com/" },
  { label: "Wiki do Clash", href: "https://clashofclans.fandom.com/" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t-2 border-primary/20 relative overflow-hidden pt-16 pb-8">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px gold-rule" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Marca */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-11 w-11 rounded-xl rotate-45 bg-gradient-to-br from-amber-300 to-amber-700 border-2 border-amber-800/60 flex items-center justify-center shadow-[0_4px_14px_-2px_rgba(240,169,43,0.5)]">
                <Swords className="w-5 h-5 text-amber-950 -rotate-45" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white font-heading">H4RD G4ME</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Mais que um clã, uma família focada em evolução e estratégia. Domine as guerras, suba de
              liga e faça parte da nossa história no Clash of Clans.
            </p>
            <div className="flex gap-4 pt-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full bg-card border border-primary/20 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/60 hover:bg-primary/10 transition-all duration-300"
                >
                  <s.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navegação */}
          <div>
            <h4 className="text-white font-bold mb-6 flex items-center gap-2 uppercase tracking-wider text-sm">
              <ShieldCheck className="w-4 h-4 text-primary" /> Navegação
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {NAV.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-primary hover:translate-x-1 transition-all inline-block">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Úteis */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Links Úteis</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {EXTERNAL.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-muted-foreground text-sm font-medium">
              &copy; {currentYear} <span className="text-white font-bold">H4RD G4ME</span>. Todos os direitos reservados.
            </p>
            <p className="text-muted-foreground/70 text-[10px] mt-2 max-w-lg leading-tight">
              Este conteúdo não é afiliado, endossado, patrocinado ou aprovado pela Supercell, e a
              Supercell não é responsável por ele. Consulte a Política de Conteúdo de Fãs da Supercell.
            </p>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Desenvolvido com</span>
            <Heart className="w-3 h-3 text-destructive fill-destructive animate-pulse" />
            <span>por</span>
            <a href="https://luixzsouza.com.br" target="_blank" rel="noreferrer" className="text-primary hover:text-primary/80 font-bold transition-colors">
              Luixz
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
