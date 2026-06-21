import { prisma } from "@/lib/prisma";
import { Shield, Crown, Swords, Star, Zap, Users } from "lucide-react";
import { Role } from "@prisma/client";

// --- CONFIGURAÇÃO DE IMAGENS (Skins Variadas para não ficar repetitivo) ---
const HERO_SKINS = {
  KING: [
    "https://static.wikia.nocookie.net/clashofclans/images/d/de/Barbarian_King_info.png",
    "https://static.wikia.nocookie.net/clashofclans/images/8/86/Gladiator_King_info.png",
    "https://static.wikia.nocookie.net/clashofclans/images/9/9b/P.E.K.K.A_King_info.png",
  ],
  QUEEN: [
    "https://static.wikia.nocookie.net/clashofclans/images/4/4e/Archer_Queen_info.png",
    "https://static.wikia.nocookie.net/clashofclans/images/f/f8/Gladiator_Queen_info.png",
    "https://static.wikia.nocookie.net/clashofclans/images/a/a2/Ice_Queen_info.png",
  ],
  WARDEN: [
    "https://static.wikia.nocookie.net/clashofclans/images/2/29/Grand_Warden_info.png",
    "https://static.wikia.nocookie.net/clashofclans/images/0/07/Gladiator_Warden_info.png",
  ],
  CHAMPION: [
    "https://static.wikia.nocookie.net/clashofclans/images/9/9e/Royal_Champion_info.png",
    "https://static.wikia.nocookie.net/clashofclans/images/e/e3/Winter_Champion_info.png",
  ],
};

function getDynamicHeroImage(role: string, thLevel: number, index: number) {
  if (role === "LIDER") return HERO_SKINS.KING[0];
  if (thLevel >= 15) return HERO_SKINS.QUEEN[index % HERO_SKINS.QUEEN.length];
  if (thLevel >= 13) return HERO_SKINS.WARDEN[index % HERO_SKINS.WARDEN.length];
  return HERO_SKINS.CHAMPION[index % HERO_SKINS.CHAMPION.length];
}

// --- DADOS MOCKADOS (Para quando o BD estiver vazio) ---
const MOCK_DATA = {
  leader: { name: "Luixz", role: "LIDER", thLevel: 16, warStatus: "IN", description: "Comandante Supremo" },
  coLeaders: [
    { id: "1", name: "General War", role: "COLIDER", thLevel: 15, warStatus: "IN" },
    { id: "2", name: "Strategist", role: "COLIDER", thLevel: 15, warStatus: "OUT" },
    { id: "3", name: "Donator Max", role: "COLIDER", thLevel: 14, warStatus: "IN" },
  ],
  stats: { elders: 12, members: 35 },
};

// --- BUSCA DE DADOS (SERVER SIDE) ---
async function getLeadershipData() {
  try {
    const allMembers = await prisma.member.findMany({
      where: { isActive: true },
      orderBy: [{ role: "asc" }, { thLevel: "desc" }],
    });

    if (allMembers.length === 0) {
      console.log("⚠️ Banco vazio ou sem conexão: Usando Mock Data para Liderança.");
      return MOCK_DATA;
    }

    const leader = allMembers.find((m) => m.role === Role.LIDER);
    const coLeaders = allMembers.filter((m) => m.role === Role.COLIDER);
    const eldersCount = allMembers.filter((m) => m.role === Role.ANCIAO).length;
    const membersCount = allMembers.filter((m) => m.role === Role.MEMBRO).length;

    return { leader, coLeaders, stats: { elders: eldersCount, members: membersCount } };
  } catch (error) {
    console.warn("⚠️ Erro ao conectar Prisma (Leadership): Usando Mock Data.");
    return MOCK_DATA;
  }
}

export async function Leadership() {
  const data = await getLeadershipData();

  const leader = data?.leader || MOCK_DATA.leader;
  const coLeaders = data?.coLeaders || MOCK_DATA.coLeaders;
  const stats = data?.stats || MOCK_DATA.stats;

  const totalMembers = 1 + coLeaders.length + stats.elders + stats.members;

  const statCards = [
    { icon: Users, label: "Membros", value: `${totalMembers}/50` },
    { icon: Shield, label: "Anciãos", value: stats.elders },
    { icon: Zap, label: "Co-Líderes", value: coLeaders.length },
    { icon: Crown, label: "Status", value: "Recrutando", gold: true },
  ];

  return (
    <section id="lideranca" className="py-24 bg-background relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Cabeçalho */}
        <div className="text-center mb-16">
          <div className="eyebrow mb-5">
            <Crown className="w-3.5 h-3.5" /> Hierarquia
          </div>
          <h2 className="text-4xl md:text-6xl clash-title">Comando de Guerra</h2>
          <div className="gold-rule max-w-xs mx-auto mt-6" />
        </div>

        {/* --- LÍDER SUPREMO --- */}
        <div className="relative max-w-4xl mx-auto mb-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/15 blur-3xl rounded-full -z-10" />

          <div className="panel-clash p-8 md:p-12 group hover:border-primary/50 transition-all duration-500">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="relative shrink-0">
                {/* Coroa flutuante */}
                <Crown className="absolute -top-7 left-1/2 -translate-x-1/2 w-9 h-9 text-primary drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] animate-pulse" />
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-primary/40 p-1 bg-gradient-to-b from-primary/20 to-transparent shadow-[0_0_50px_rgba(240,169,43,0.35)] group-hover:shadow-[0_0_70px_rgba(240,169,43,0.55)] transition-all duration-500">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getDynamicHeroImage("LIDER", leader.thLevel, 0)}
                    alt={leader.name}
                    className="w-full h-full object-cover rounded-full scale-105 group-hover:scale-110 transition-transform duration-500 object-top"
                  />
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-b from-amber-300 to-amber-600 text-amber-950 text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-lg whitespace-nowrap border border-amber-800/50">
                  Líder Supremo
                </div>
              </div>

              <div className="text-center md:text-left flex-1">
                <h3 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight group-hover:text-primary transition-colors">
                  {leader.name}
                </h3>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
                  <span className="flex items-center gap-1.5 plaque px-3 py-1.5 text-muted-foreground text-sm font-medium">
                    <Star className="w-4 h-4 text-primary" /> TH {leader.thLevel}
                  </span>
                  <span className="flex items-center gap-1.5 bg-success/10 border border-success/25 px-3 py-1.5 rounded-lg text-success text-sm font-medium">
                    <Swords className="w-4 h-4" /> Em Guerra
                  </span>
                </div>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed italic border-l-2 border-primary/40 pl-4">
                  &quot;A vitória não é acidente — é o resultado de estratégia e união. Bem-vindo à elite.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- GENERAIS (Co-Líderes) --- */}
        {coLeaders.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <h3 className="text-lg text-muted-foreground font-bold mb-8 flex items-center gap-3 uppercase tracking-widest">
              <Swords className="w-5 h-5 text-primary" />
              Generais de Guerra
              <div className="gold-rule flex-1" />
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coLeaders.map((member, idx) => (
                <div
                  key={idx}
                  className="group panel-clash p-6 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-background border border-primary/20 overflow-hidden shrink-0 group-hover:border-primary/50 transition-colors">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getDynamicHeroImage("COLIDER", member.thLevel, idx)}
                        alt={member.name}
                        className="w-full h-full object-cover object-top scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-bold text-white truncate group-hover:text-primary transition-colors">
                          {member.name}
                        </h4>
                        <Zap className="w-4 h-4 text-primary shrink-0" />
                      </div>
                      <p className="text-xs text-primary font-bold uppercase tracking-wider mb-2">Co-Líder</p>
                      <div className="flex items-center gap-2">
                        <span className="bg-secondary text-[10px] text-muted-foreground px-1.5 py-0.5 rounded border border-border">
                          TH {member.thLevel}
                        </span>
                        {member.warStatus === "IN" || member.warStatus === "in" ? (
                          <span className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.8)]" title="Guerra ON" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-destructive" title="Guerra OFF" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- STATS BAR --- */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div
              key={s.label}
              className={`p-4 rounded-xl flex items-center justify-between ${
                s.gold ? "bg-primary/10 border border-primary/30" : "plaque"
              }`}
            >
              <div>
                <p className={`text-xs font-bold uppercase ${s.gold ? "text-primary" : "text-muted-foreground"}`}>
                  {s.label}
                </p>
                <p className="text-2xl font-black text-white leading-tight">{s.value}</p>
              </div>
              <s.icon className={`w-8 h-8 ${s.gold ? "text-primary" : "text-muted-foreground"}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
