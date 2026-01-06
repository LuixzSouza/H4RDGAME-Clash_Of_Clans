import Link from "next/link";
import { Trophy, ShieldCheck, Swords, ChevronRight, Users, Star, AlertTriangle, Lock } from "lucide-react";

// --- DADOS DE RESERVA (Fallback) ---
// Usados apenas se a API do Clash bloquear seu IP ou cair
const MOCK_CLAN_DATA: ClanData = {
  members: 0, 
  warWins: 0,
  clanLevel: 0,
  warWinStreak: 0,
};

interface ClanData {
  members: number;
  warWins: number;
  clanLevel: number;
  warWinStreak: number;
  badgeUrls?: {
    medium: string;
  };
}

async function getClanData(): Promise<ClanData> {
  const clanTag = process.env.NEXT_PUBLIC_CLAN_TAG;
  const apiToken = process.env.COC_API_TOKEN;

  // Se não tiver configuração, retorna mock
  if (!clanTag || !apiToken) {
    console.warn("⚠️ Sem credenciais no .env");
    return MOCK_CLAN_DATA;
  }

  const formattedTag = clanTag.replace("#", "%23");

  try {
    // 1. TENTA BUSCAR DADOS REAIS
    const res = await fetch(`https://api.clashofclans.com/v1/clans/${formattedTag}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        Accept: "application/json",
      },
      next: { revalidate: 60 }, // Atualiza a cada 60 segundos
    });

    // 2. SE A API BLOQUEAR (Erro de IP ou Token), USA O MOCK
    if (!res.ok) {
      console.warn(`⚠️ API Clash Bloqueou (Status: ${res.status}). Usando dados de fallback.`);
      // Se quiser ver o erro detalhado no terminal, descomente a linha abaixo:
      // console.log(await res.text()); 
      return MOCK_CLAN_DATA;
    }
    
    // 3. SUCESSO! RETORNA DADOS REAIS
    return await res.json();

  } catch (error) {
    console.error("❌ Erro de conexão:", error);
    return MOCK_CLAN_DATA;
  }
}

export async function Hero() {
  const clanData = await getClanData();

  // Garante que os números nunca sejam undefined/null
  const stats = {
    members: clanData?.members || 0,
    wins: clanData?.warWins || 0,
    level: clanData?.clanLevel || 0,
    streak: clanData?.warWinStreak || 0
  };

  // --- LÓGICA DO BADGE DINÂMICO ---
  // Define o estado padrão (Recrutamento Aberto)
  let badgeConfig = {
    text: "Recrutamento Aberto",
    color: "text-green-400",
    border: "border-green-500/30",
    bg: "bg-green-500/10",
    shadow: "shadow-[0_0_20px_rgba(74,222,128,0.1)] hover:shadow-[0_0_25px_rgba(74,222,128,0.3)]",
    dotColor: "bg-green-500",
    pingColor: "bg-green-400",
    icon: Trophy
  };

  // Se o clã estiver cheio (50 membros)
  if (stats.members >= 50) {
    badgeConfig = {
      text: "Lista de Espera",
      color: "text-red-500",
      border: "border-red-500/30",
      bg: "bg-red-500/10",
      shadow: "shadow-[0_0_20px_rgba(239,68,68,0.1)] hover:shadow-[0_0_25px_rgba(239,68,68,0.3)]",
      dotColor: "bg-red-500",
      pingColor: "bg-red-400",
      icon: Lock
    };
  } 
  // Se estiver quase cheio (45 a 49 membros)
  else if (stats.members >= 45) {
    badgeConfig = {
      text: "Últimas Vagas",
      color: "text-yellow-500",
      border: "border-yellow-500/30",
      bg: "bg-yellow-500/10",
      shadow: "shadow-[0_0_20px_rgba(234,179,8,0.1)] hover:shadow-[0_0_25px_rgba(234,179,8,0.3)]",
      dotColor: "bg-yellow-500",
      pingColor: "bg-yellow-400",
      icon: AlertTriangle
    };
  }

  // Link do WhatsApp com mensagem personalizada
  const whatsappMessage = `Olá! Vi o site do H4RD G4ME e gostaria de me alistar no clã (Nível ${stats.level}).`;
  const whatsappUrl = `https://wa.me/5535997354797?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section id="inicio" className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden bg-[#0b0d14]">
      
      {/* --- BACKGROUND --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10 opacity-50 mix-blend-screen animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-orange-600/10 rounded-full blur-[100px] -z-10" />

      {/* Orbes Decorativos */}
      <div className="hidden lg:block absolute top-1/4 left-10 w-24 h-24 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full blur-xl animate-bounce duration-[3000ms]" />
      <div className="hidden lg:block absolute bottom-1/4 right-10 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse duration-[4000ms]" />

      <div className="container mx-auto px-6 text-center relative z-10">
        
        {/* --- BADGE DINÂMICO --- */}
        <div className={`inline-flex group items-center rounded-full border px-4 py-1.5 text-sm font-bold mb-8 uppercase tracking-widest transition-all duration-300 cursor-default ${badgeConfig.border} ${badgeConfig.bg} ${badgeConfig.color} ${badgeConfig.shadow}`}>
          <span className="relative flex h-2 w-2 mr-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${badgeConfig.pingColor}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${badgeConfig.dotColor}`}></span>
          </span>
          <badgeConfig.icon className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" /> 
          {badgeConfig.text}
        </div>
        
        {/* --- TÍTULO --- */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 drop-shadow-2xl leading-tight tracking-tight">
          Estratégia, União e <br />
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 animate-gradient-x">
              Guerra Total
            </span>
            <div className="absolute inset-0 bg-orange-500/20 blur-2xl -z-10" />
          </span>
        </h1>
        
        {/* --- DESCRIÇÃO --- */}
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-12 font-medium leading-relaxed">
          Entre para o <strong className="text-white relative inline-block after:content-[''] after:absolute after:w-full after:scale-x-100 after:h-[2px] after:bottom-0 after:left-0 after:bg-orange-500 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100">H4RD G4ME</strong>. 
          Clã Nível {stats.level > 0 ? stats.level : '...'} focado em guerras organizadas, liga lendária e evolução constante.
        </p>
        
        {/* --- BOTÕES --- */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          
          {/* Botão WhatsApp */}
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-full sm:w-auto overflow-hidden rounded-xl bg-orange-600 px-8 py-4 text-white font-bold text-lg shadow-[0_0_40px_-10px_rgba(234,88,12,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(234,88,12,0.6)] cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-100 transition-opacity group-hover:opacity-90" />
            <div className="relative flex items-center justify-center gap-2">
              <Swords className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              <span>Quero me Alistar</span>
            </div>
            <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent z-20" />
          </a>

          {/* Botão Área de Membros */}
          <Link href="/login" className="group w-full sm:w-auto relative px-8 py-4 rounded-xl border border-white/10 bg-white/5 text-white font-semibold text-lg backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20 flex items-center justify-center gap-3">
            <ShieldCheck className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform"/> 
            <span>Área de Membros</span>
            <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* --- STATUS --- */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 border-t border-white/5 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-backwards">
          
          <div className="flex flex-col items-center group cursor-default">
            <div className="flex items-center gap-2 mb-1">
              <Users className={`w-5 h-5 group-hover:scale-110 transition-transform ${stats.members >= 50 ? 'text-red-500' : 'text-blue-500'}`}/>
              <span className="text-3xl font-bold text-white">
                {stats.members > 0 ? `${stats.members}/50` : '--'}
              </span>
            </div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Membros</span>
          </div>

          <div className="flex flex-col items-center group cursor-default">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform"/>
              <span className="text-3xl font-bold text-white">
                {stats.wins > 0 ? stats.wins : '--'}
              </span>
            </div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Guerras Vencidas</span>
          </div>

          <div className="flex flex-col items-center group cursor-default">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform"/>
              <span className="text-3xl font-bold text-white">
                {stats.level > 0 ? `LVL ${stats.level}` : '--'}
              </span>
            </div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Nível do Clã</span>
          </div>

        </div>

      </div>
    </section>
  );
}