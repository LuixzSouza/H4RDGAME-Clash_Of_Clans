"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, Swords, Wallet, Wrench, LogOut,
  Castle, FlaskConical, CalendarDays, Menu,
  Globe, Settings, User, ChevronsUpDown, ChevronRight, Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { logout, getCurrentUser } from "@/app/actions";

// --- TIPAGEM ---
type UserData = {
  name: string;
  role: string;
  tag: string;
  avatarSeed?: string | null;
};

// --- DADOS DE NAVEGAÇÃO ---
const navGroups = [
  {
    title: "Comando Central",
    items: [
      { href: "/dashboard", label: "Visão Geral", icon: LayoutDashboard },
      { href: "/dashboard/membros", label: "Membros", icon: Users },
      { href: "/dashboard/guerra", label: "Guerra", icon: Swords, alert: true }, // Exemplo de alerta
      { href: "/dashboard/financeiro", label: "Tesouraria", icon: Wallet },
    ]
  },
  {
    title: "Estratégia",
    items: [
      { href: "/dashboard/fortaleza", label: "Fortaleza", icon: Castle }, 
      { href: "/dashboard/laboratorio", label: "Laboratório", icon: FlaskConical }, 
    ]
  },
  {
    title: "Clã",
    items: [
      { href: "/dashboard/eventos", label: "Eventos", icon: CalendarDays }, 
      { href: "/dashboard/ferramentas", label: "Ferramentas", icon: Wrench },
    ]
  }
];

// --- COMPONENTE: SIDEBAR ---
const SidebarContent = ({ user, onClose }: { user: UserData | null, onClose?: () => void }) => {
  const pathname = usePathname();

  const formatRole = (role: string) => {
    const map: Record<string, string> = { "LIDER": "Líder", "COLIDER": "Colíder", "ANCIAO": "Ancião", "MEMBRO": "Membro" };
    return map[role] || role;
  };

  // Rota ativa: exata para "/dashboard", prefixo para as subseções
  const isItemActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="relative flex flex-col h-full bg-gradient-to-b from-sidebar to-background text-white">
        {/* Fio dourado no topo */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        {/* Header da Sidebar (Marca) */}
        <Link href="/dashboard" onClick={onClose} className="h-16 flex items-center gap-3 px-5 border-b border-sidebar-border shrink-0 group">
            <div className="h-9 w-9 rounded-lg rotate-45 bg-gradient-to-br from-amber-300 to-amber-700 border-2 border-amber-800/60 flex items-center justify-center shadow-[0_4px_14px_-2px_rgba(240,169,43,0.5)] group-hover:shadow-[0_4px_20px_-2px_rgba(240,169,43,0.75)] transition-all">
                <Swords className="w-4 h-4 text-amber-950 -rotate-45" />
            </div>
            <div className="leading-none">
                <h1 className="font-black text-lg tracking-wider text-white">H4RD <span className="text-primary">G4ME</span></h1>
                <span className="text-[9px] font-bold text-primary/80 tracking-[0.25em] uppercase">Clash Clan</span>
            </div>
        </Link>

        {/* Links de Navegação */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-border space-y-7">
          {navGroups.map((group, idx) => (
            <div key={idx}>
              <h3 className="px-3 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mb-2 flex items-center gap-2">
                {group.title}
                <div className="gold-rule flex-1 opacity-40"></div>
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = isItemActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "relative flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group",
                        isActive
                          ? "bg-gradient-to-r from-primary/20 to-primary/[0.02] text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      {/* Barra ativa dourada */}
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-primary shadow-[0_0_10px_rgba(240,169,43,0.7)]" />
                      )}

                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "flex items-center justify-center h-7 w-7 rounded-lg transition-colors",
                          isActive ? "bg-primary/15 text-primary" : "text-muted-foreground/70 group-hover:text-foreground group-hover:bg-accent"
                        )}>
                          <Icon className="w-4 h-4" />
                        </span>
                        {item.label}
                      </div>

                      {/* Indicadores */}
                      <div className="flex items-center gap-2">
                          {item.alert && (
                              <span className="h-2 w-2 rounded-full bg-destructive animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                          )}
                          {isActive && (
                            <ChevronRight className="w-3.5 h-3.5 text-primary/70" />
                          )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer do Usuário (Dropdown) */}
        <div className="p-3 border-t border-sidebar-border shrink-0">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 w-full p-2 rounded-xl border border-transparent hover:border-primary/30 hover:bg-accent transition-all outline-none group">
                        <div className="relative shrink-0">
                            <Avatar className="h-9 w-9 border border-sidebar-border group-hover:border-primary/50 transition-colors">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.avatarSeed || user?.name}`} />
                                <AvatarFallback className="bg-muted text-muted-foreground">{user?.name?.substring(0,2)}</AvatarFallback>
                            </Avatar>
                            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-sidebar" />
                        </div>
                        <div className="flex-1 text-left overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{user?.name || "Carregando..."}</p>
                            <p className="text-[10px] text-primary truncate font-bold uppercase tracking-wider">{user ? formatRole(user.role) : "..."}</p>
                        </div>
                        <ChevronsUpDown className="w-4 h-4 text-muted-foreground/60 group-hover:text-muted-foreground" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60 bg-popover border-border text-popover-foreground mb-2 ml-2" align="end" side="top">
                    <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-sidebar-border" />
                    <DropdownMenuItem className="cursor-pointer focus:bg-accent focus:text-white" asChild>
                        <Link href="/dashboard/perfil" className="flex items-center gap-2">
                            <User className="w-4 h-4" /> Perfil
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer focus:bg-accent focus:text-white" asChild>
                        <Link href="/dashboard/perfil" className="flex items-center gap-2">
                            <Settings className="w-4 h-4" /> Configurações
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-sidebar-border" />
                    <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/20" onClick={() => logout()}>
                        <LogOut className="w-4 h-4 mr-2" /> Sair do Sistema
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
  );
};

// --- COMPONENTE: TOPBAR (Desktop) ---
const Topbar = () => {
    const pathname = usePathname();
    // Lógica simples para breadcrumb
    const pathSegments = pathname.split('/').filter(Boolean);
    
    return (
        <header className="hidden md:flex h-16 border-b border-sidebar-border bg-background/80 backdrop-blur-md items-center justify-between px-8 z-20 sticky top-0">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Home className="w-4 h-4" />
                {pathSegments.map((segment, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 opacity-50" />
                        <span className={cn(
                            "capitalize font-medium",
                            index === pathSegments.length - 1 ? "text-foreground" : "text-muted-foreground"
                        )}>
                            {segment}
                        </span>
                    </div>
                ))}
            </div>

            {/* Ações do Topo */}
            <div className="flex items-center gap-3">
                <Link
                    href="/"
                    className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                    <Globe className="w-4 h-4" /> Ver site
                </Link>
            </div>
        </header>
    );
};

// --- LAYOUT PRINCIPAL ---
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    async function loadUser() {
      const userData = await getCurrentUser();
      setUser(userData);
    }
    loadUser();
  }, []);

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans selection:bg-primary/30">
      
      {/* 1. SIDEBAR DESKTOP (Fixa) */}
      <aside className="hidden md:flex w-72 flex-col border-r border-sidebar-border shadow-2xl z-30">
        <SidebarContent user={user} />
      </aside>

      {/* 2. ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        
        {/* Background Global Fixo */}
        <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/[0.07] via-background to-background"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-[0.04] mix-blend-overlay"></div>
        </div>

        {/* HEADER DESKTOP */}
        <Topbar />

        {/* HEADER MOBILE (Sticky) */}
        <header className="md:hidden sticky top-0 h-16 border-b border-sidebar-border flex items-center justify-between px-4 z-40 bg-background/80 backdrop-blur-md">
           <div className="flex items-center gap-3">
               <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                 <SheetTrigger asChild>
                   <Button variant="ghost" size="icon" className="text-foreground hover:text-foreground hover:bg-accent -ml-2">
                     <Menu className="w-6 h-6" />
                   </Button>
                 </SheetTrigger>
                 <SheetContent side="left" className="p-0 w-72 border-r border-sidebar-border bg-sidebar text-white">
                    <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                    <SidebarContent user={user} onClose={() => setIsMobileOpen(false)} />
                 </SheetContent>
               </Sheet>
               <span className="font-black text-lg tracking-wider text-white">H4RD <span className="text-primary">G4ME</span></span>
           </div>

           {/* Link para Perfil no Mobile */}
           <Link href="/dashboard/perfil">
             <Avatar className="h-8 w-8 border border-primary/50 shadow-sm cursor-pointer hover:scale-105 transition-transform">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.avatarSeed || user?.name}`} />
                <AvatarFallback className="bg-muted text-xs text-foreground">
                    {user?.name?.substring(0,1)}
                </AvatarFallback>
             </Avatar>
           </Link>
        </header>

        {/* CONTEÚDO SCROLLÁVEL */}
        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent z-10">
          <div className="max-w-7xl mx-auto w-full p-4 md:p-8 pb-24">
              {children}
          </div>
        </main>

      </div>
    </div>
  );
}