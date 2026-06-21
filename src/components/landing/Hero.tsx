import Link from "next/link";
import { Trophy, ShieldCheck, Swords, ChevronRight, Users, Star, AlertTriangle, Lock, Flame } from "lucide-react";

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
    streak: clanData?.warWinStreak || 0,
  };

  // --- LÓGICA DO BADGE DINÂMICO ---
  let badgeConfig = {
    text: "Recrutamento Aberto",
    color: "text-success",
    border: "border-success/30",
    bg: "bg-success/10",
    dotColor: "bg-success",
    icon: Trophy,
  };

  if (stats.members >= 50) {
    badgeConfig = {
      text: "Lista de Espera",
      color: "text-destructive",
      border: "border-destructive/30",
      bg: "bg-destructive/10",
      dotColor: "bg-destructive",
      icon: Lock,
    };
  } else if (stats.members >= 45) {
    badgeConfig = {
      text: "Últimas Vagas",
      color: "text-primary",
      border: "border-primary/30",
      bg: "bg-primary/10",
      dotColor: "bg-primary",
      icon: AlertTriangle,
    };
  }

  // Link do WhatsApp com mensagem personalizada
  const whatsappMessage = `Olá! Vi o site do H4RD G4ME e gostaria de me alistar no clã (Nível ${stats.level}).`;
  const whatsappUrl = `https://wa.me/5535997354797?text=${encodeURIComponent(whatsappMessage)}`;

  const heroStats = [
    { icon: Users, label: "Membros", value: stats.members > 0 ? `${stats.members}/50` : "--" },
    { icon: Trophy, label: "Guerras Vencidas", value: stats.wins > 0 ? stats.wins : "--" },
    { icon: Flame, label: "Sequência", value: stats.streak > 0 ? `${stats.streak}x` : "--" },
    { icon: Star, label: "Nível do Clã", value: stats.level > 0 ? stats.level : "--" },
  ];

  return (
    <section
      id="inicio"
      className="relative min-h-[100svh] flex items-center pt-32 pb-20 overflow-hidden bg-background"
    >
      {/* --- BACKGROUND --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_55%_at_50%_0%,#000_60%,transparent_100%)]" />
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-primary/20 rounded-full blur-[130px] -z-10 opacity-60 mix-blend-screen animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[700px] h-[500px] bg-primary/10 rounded-full blur-[110px] -z-10" />
      {/* Brasão fantasma gigante ao fundo */}
      <Swords className="hidden lg:block absolute right-[6%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] text-primary/[0.04] -z-10 rotate-12" />

      <div className="container mx-auto px-6 text-center relative z-10">
        {/* --- BADGE DINÂMICO --- */}
        <div
          className={`inline-flex group items-center rounded-full border px-4 py-1.5 text-xs sm:text-sm font-bold mb-10 uppercase tracking-[0.2em] transition-all duration-300 cursor-default ${badgeConfig.border} ${badgeConfig.bg} ${badgeConfig.color}`}
        >
          <span className="relative flex h-2 w-2 mr-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${badgeConfig.dotColor}`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${badgeConfig.dotColor}`} />
          </span>
          <badgeConfig.icon className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
          {badgeConfig.text}
        </div>

        {/* --- EMBLEMA DO CLÃ --- */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full animate-pulse" />
            <div className="relative h-24 w-24 md:h-28 md:w-28 rounded-2xl rotate-45 bg-gradient-to-br from-amber-300 to-amber-700 border-4 border-amber-800/60 shadow-[0_8px_24px_-6px_rgba(240,169,43,0.6)] flex items-center justify-center">
              <Swords className="w-11 h-11 md:w-12 md:h-12 text-amber-950 -rotate-45" />
            </div>
          </div>
        </div>

        {/* --- EYEBROW --- */}
        <div className="eyebrow mb-6">
          <Star className="w-3.5 h-3.5" /> Clã Oficial · Clash of Clans
        </div>

        {/* --- TÍTULO --- */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl mb-4 leading-[0.9] tracking-tight">
          <span className="clash-title block">H4RD G4ME</span>
        </h1>
        <p className="text-2xl md:text-4xl font-heading text-white/90 mb-8 tracking-wide drop-shadow-lg">
          Estratégia · União · <span className="text-primary">Guerra Total</span>
        </p>

        {/* --- DESCRIÇÃO --- */}
        <p className="max-w-2xl mx-auto text-base md:text-lg text-muted-foreground mb-12 font-medium leading-relaxed">
          Entre para o <strong className="text-white">H4RD G4ME</strong> — clã{" "}
          {stats.level > 0 ? `Nível ${stats.level}` : "em ascensão"} focado em guerras organizadas,
          liga lendária e evolução constante. Aqui ninguém luta sozinho.
        </p>

        {/* --- BOTÕES --- */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-20">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-clash w-full sm:w-auto text-base group">
            <Swords className="w-5 h-5 mr-2 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            Quero me Alistar
          </a>

          <Link href="/login" className="btn-clash-outline w-full sm:w-auto text-base group">
            <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Área de Membros
            <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* --- STATS (Placas) --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-3xl mx-auto">
          {heroStats.map((s) => (
            <div key={s.label} className="plaque p-4 flex flex-col items-center gap-1 group">
              <s.icon className="w-5 h-5 text-primary mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-2xl md:text-3xl font-black text-white leading-none">{s.value}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
