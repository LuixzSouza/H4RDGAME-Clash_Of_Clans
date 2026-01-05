"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Users, Swords, Wallet, Wrench, LogOut, 
  Castle, FlaskConical, CalendarDays, Menu, Loader2, 
  Bell, Search, Settings, User, ChevronsUpDown, ChevronRight, Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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

  return (
    <div className="flex flex-col h-full bg-[#15161e] text-white">
        
        {/* Header da Sidebar */}
        <div className="h-16 flex items-center px-6 border-b border-[#2f3245] bg-[#0b0d14]/50">
          <div className="flex items-center gap-3 w-full">
            <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 p-2 rounded-xl shadow-lg border border-yellow-500/30">
                <Swords className="w-5 h-5 text-white" />
            </div>
            <div>
                <h1 className="font-black text-lg tracking-wider text-white leading-none">H4RD <span className="text-yellow-500">G4ME</span></h1>
            </div>
          </div>
        </div>

        {/* Links de Navegação */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-[#2f3245] space-y-8">
          {navGroups.map((group, idx) => (
            <div key={idx}>
              <h3 className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                {group.title}
                <div className="h-[1px] flex-1 bg-[#2f3245]"></div>
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden",
                        isActive
                          ? "bg-gradient-to-r from-yellow-500/10 to-transparent text-yellow-500" 
                          : "text-slate-400 hover:bg-[#1e202b] hover:text-slate-200"
                      )}
                    >
                      <div className="flex items-center gap-3 relative z-10">
                        <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-yellow-500" : "text-slate-500 group-hover:text-slate-300")} />
                        {item.label}
                      </div>
                      
                      {/* Indicadores */}
                      <div className="flex items-center gap-2">
                          {item.alert && (
                              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                          )}
                          {isActive && (
                            <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
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
        <div className="p-4 border-t border-[#2f3245] bg-[#0b0d14]/30">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-[#1e202b] transition-colors outline-none group">
                        <Avatar className="h-9 w-9 border border-[#2f3245] group-hover:border-yellow-500/50 transition-colors">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.avatarSeed || user?.name}`} />
                            <AvatarFallback className="bg-slate-800 text-slate-400">{user?.name?.substring(0,2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{user?.name || "Carregando..."}</p>
                            <p className="text-[10px] text-slate-500 truncate font-mono">{user ? formatRole(user.role) : "..."}</p>
                        </div>
                        <ChevronsUpDown className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60 bg-[#1e202b] border-[#2f3245] text-slate-200 mb-2 ml-2" align="end" side="top">
                    <DropdownMenuLabel className="text-xs text-slate-500 uppercase tracking-wider">Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[#2f3245]" />
                    <DropdownMenuItem className="cursor-pointer focus:bg-[#2f3245] focus:text-white" asChild>
                        <Link href="/dashboard/perfil" className="flex items-center gap-2">
                            <User className="w-4 h-4" /> Perfil
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer focus:bg-[#2f3245] focus:text-white">
                        <Settings className="w-4 h-4 mr-2" /> Configurações
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#2f3245]" />
                    <DropdownMenuItem className="cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-900/20" onClick={() => logout()}>
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
        <header className="hidden md:flex h-16 border-b border-[#2f3245] bg-[#0b0d14]/80 backdrop-blur-md items-center justify-between px-8 z-20 sticky top-0">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <Home className="w-4 h-4" />
                {pathSegments.map((segment, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 opacity-50" />
                        <span className={cn(
                            "capitalize font-medium",
                            index === pathSegments.length - 1 ? "text-white" : "text-slate-500"
                        )}>
                            {segment}
                        </span>
                    </div>
                ))}
            </div>

            {/* Ações do Topo */}
            <div className="flex items-center gap-4">
                <div className="relative hidden lg:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input 
                        placeholder="Buscar comando..." 
                        className="h-9 w-64 bg-[#15161e] border-[#2f3245] pl-9 text-sm focus-visible:ring-yellow-500"
                    />
                </div>
                <div className="h-6 w-[1px] bg-[#2f3245]"></div>
                <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-[#0b0d14]"></span>
                </button>
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
    <div className="flex h-screen bg-[#0b0d14] overflow-hidden font-sans selection:bg-yellow-500/30">
      
      {/* 1. SIDEBAR DESKTOP (Fixa) */}
      <aside className="hidden md:flex w-72 flex-col border-r border-[#2f3245] shadow-2xl z-30">
        <SidebarContent user={user} />
      </aside>

      {/* 2. ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        
        {/* Background Global Fixo */}
        <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-[#0b0d14] to-[#0b0d14]"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
        </div>

        {/* HEADER DESKTOP */}
        <Topbar />

        {/* HEADER MOBILE (Sticky) */}
        <header className="md:hidden sticky top-0 h-16 border-b border-[#2f3245] flex items-center justify-between px-4 z-40 bg-[#0b0d14]/80 backdrop-blur-md">
           <div className="flex items-center gap-3">
               <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                 <SheetTrigger asChild>
                   <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-slate-800 -ml-2">
                     <Menu className="w-6 h-6" />
                   </Button>
                 </SheetTrigger>
                 <SheetContent side="left" className="p-0 w-72 border-r border-[#2f3245] bg-[#15161e] text-white">
                    <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                    <SidebarContent user={user} onClose={() => setIsMobileOpen(false)} />
                 </SheetContent>
               </Sheet>
               <span className="font-black text-lg tracking-wider text-white">H4RD <span className="text-yellow-500">G4ME</span></span>
           </div>

           {/* Link para Perfil no Mobile */}
           <Link href="/dashboard/perfil">
             <Avatar className="h-8 w-8 border border-yellow-500/50 shadow-sm cursor-pointer hover:scale-105 transition-transform">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.avatarSeed || user?.name}`} />
                <AvatarFallback className="bg-slate-800 text-xs text-white">
                    {user?.name?.substring(0,1)}
                </AvatarFallback>
             </Avatar>
           </Link>
        </header>

        {/* CONTEÚDO SCROLLÁVEL */}
        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#2f3245] scrollbar-track-transparent z-10">
          <div className="max-w-7xl mx-auto w-full p-4 md:p-8 pb-24">
              {children}
          </div>
        </main>

      </div>
    </div>
  );
}