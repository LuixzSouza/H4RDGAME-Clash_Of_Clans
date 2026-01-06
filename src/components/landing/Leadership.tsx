import { prisma } from "@/lib/prisma";
import { Shield, Crown, Swords, Star, Zap, User, BarChart3 } from "lucide-react";
import { Role } from "@prisma/client";

// --- CONFIGURAÇÃO DE IMAGENS (Skins Variadas para não ficar repetitivo) ---
const HERO_SKINS = {
  KING: [
    "https://static.wikia.nocookie.net/clashofclans/images/d/de/Barbarian_King_info.png",
    "https://static.wikia.nocookie.net/clashofclans/images/8/86/Gladiator_King_info.png", // Skin Gladiador
    "https://static.wikia.nocookie.net/clashofclans/images/9/9b/P.E.K.K.A_King_info.png" // Skin Pekka
  ],
  QUEEN: [
    "https://static.wikia.nocookie.net/clashofclans/images/4/4e/Archer_Queen_info.png",
    "https://static.wikia.nocookie.net/clashofclans/images/f/f8/Gladiator_Queen_info.png", // Skin Gladiadora
    "https://static.wikia.nocookie.net/clashofclans/images/a/a2/Ice_Queen_info.png" // Skin Gelo
  ],
  WARDEN: [
    "https://static.wikia.nocookie.net/clashofclans/images/2/29/Grand_Warden_info.png",
    "https://static.wikia.nocookie.net/clashofclans/images/0/07/Gladiator_Warden_info.png"
  ],
  CHAMPION: [
    "https://static.wikia.nocookie.net/clashofclans/images/9/9e/Royal_Champion_info.png",
    "https://static.wikia.nocookie.net/clashofclans/images/e/e3/Winter_Champion_info.png"
  ]
};

// Função para pegar uma skin aleatória baseada no cargo/th para dar variedade visual
function getDynamicHeroImage(role: string, thLevel: number, index: number) {
  if (role === 'LIDER') return HERO_SKINS.KING[0]; // Líder sempre padrão ou uma específica

  if (thLevel >= 15) {
    // Retorna uma skin da Rainha baseada no índice do loop (para não repetir sempre a mesma)
    return HERO_SKINS.QUEEN[index % HERO_SKINS.QUEEN.length];
  } else if (thLevel >= 13) {
    return HERO_SKINS.WARDEN[index % HERO_SKINS.WARDEN.length];
  } else {
    return HERO_SKINS.CHAMPION[index % HERO_SKINS.CHAMPION.length];
  }
}

// --- DADOS MOCKADOS (Para quando o BD estiver vazio) ---
const MOCK_DATA = {
  leader: { name: "Luixz", role: "LIDER", thLevel: 16, warStatus: "IN", description: "Comandante Supremo" },
  coLeaders: [
    { id: "1", name: "General War", role: "COLIDER", thLevel: 15, warStatus: "IN" },
    { id: "2", name: "Strategist", role: "COLIDER", thLevel: 15, warStatus: "OUT" },
    { id: "3", name: "Donator Max", role: "COLIDER", thLevel: 14, warStatus: "IN" },
  ],
  stats: { elders: 12, members: 35 }
};

// --- BUSCA DE DADOS (SERVER SIDE) ---
async function getLeadershipData() {
  try {
    const allMembers = await prisma.member.findMany({
      where: { isActive: true },
      orderBy: [{ role: 'asc' }, { thLevel: 'desc' }]
    });

    // SE O BANCO ESTIVER VAZIO, RETORNA MOCK (Para você ver o design funcionando)
    if (allMembers.length === 0) {
      console.log("⚠️ Banco vazio ou sem conexão: Usando Mock Data para Liderança.");
      return MOCK_DATA;
    }

    const leader = allMembers.find(m => m.role === Role.LIDER);
    const coLeaders = allMembers.filter(m => m.role === Role.COLIDER);
    const eldersCount = allMembers.filter(m => m.role === Role.ANCIAO).length;
    const membersCount = allMembers.filter(m => m.role === Role.MEMBRO).length;

    return { leader, coLeaders, stats: { elders: eldersCount, members: membersCount } };
  } catch (error) {
    console.warn("⚠️ Erro ao conectar Prisma (Leadership): Usando Mock Data.");
    return MOCK_DATA;
  }
}

export async function Leadership() {
  const data = await getLeadershipData();
  
  // Fallback de segurança extremo
  const leader = data?.leader || MOCK_DATA.leader;
  const coLeaders = data?.coLeaders || MOCK_DATA.coLeaders;
  const stats = data?.stats || MOCK_DATA.stats;

  return (
    <section className="py-24 bg-[#0b0d14] relative overflow-hidden border-t border-white/5">
      
      {/* Background Decorativo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Cabeçalho */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold uppercase tracking-wider mb-4">
             <Crown className="w-4 h-4" /> Hierarquia
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Comando de Guerra
          </h2>
        </div>

        {/* --- LÍDER SUPREMO --- */}
        <div className="relative max-w-4xl mx-auto mb-20">
            {/* Efeito de brilho atrás do líder */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-orange-600/20 blur-3xl rounded-full -z-10" />
            
            <div className="bg-gradient-to-b from-[#1a1c26] to-[#12141c] border border-orange-500/30 rounded-3xl p-8 md:p-12 relative shadow-2xl overflow-hidden group hover:border-orange-500/50 transition-all duration-500">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50" />
                
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    <div className="relative shrink-0">
                         <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-orange-500/30 p-1 bg-orange-500/10 shadow-[0_0_40px_rgba(234,88,12,0.3)] group-hover:shadow-[0_0_60px_rgba(234,88,12,0.5)] transition-all duration-500">
                            <img 
                                src={getDynamicHeroImage('LIDER', leader.thLevel, 0)} 
                                alt={leader.name} 
                                className="w-full h-full object-cover rounded-full scale-105 group-hover:scale-110 transition-transform duration-500 object-top"
                            />
                         </div>
                         <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#0b0d14] border border-orange-500 text-orange-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg whitespace-nowrap">
                             Líder Supremo
                         </div>
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <h3 className="text-4xl font-black text-white mb-2 tracking-tight group-hover:text-orange-400 transition-colors">{leader.name}</h3>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
                            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-slate-300 text-sm font-medium">
                                <Star className="w-4 h-4 text-yellow-500" /> TH {leader.thLevel}
                            </span>
                            <span className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-lg text-green-400 text-sm font-medium">
                                <Swords className="w-4 h-4" /> War Active
                            </span>
                        </div>
                        <p className="text-slate-400 text-lg leading-relaxed italic border-l-2 border-orange-500/30 pl-4 md:pl-0 md:border-l-0">
                           &quot;A vitória não é um acidente, é o resultado de estratégia e união. Bem-vindo à elite.&quot;
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* --- GENERALS (Co-Líderes) --- */}
        {coLeaders.length > 0 && (
          <div className="max-w-6xl mx-auto">
             <h3 className="text-xl text-slate-400 font-bold mb-8 flex items-center gap-3">
                <div className="h-px w-8 bg-blue-500"></div>
                GENERAIS DE GUERRA
                <div className="h-px flex-1 bg-white/10"></div>
             </h3>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coLeaders.map((member, idx) => (
                   <div key={idx} className="group relative bg-[#151720] border border-white/5 hover:border-blue-500/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10">
                      <div className="flex items-start gap-4">
                         <div className="w-16 h-16 rounded-xl bg-[#0b0d14] border border-white/10 overflow-hidden shrink-0 group-hover:border-blue-500/50 transition-colors">
                            <img 
                                src={getDynamicHeroImage('COLIDER', member.thLevel, idx)} 
                                alt={member.name} 
                                className="w-full h-full object-cover object-top scale-110"
                            />
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <h4 className="text-lg font-bold text-white truncate group-hover:text-blue-400 transition-colors">{member.name}</h4>
                                <Zap className="w-4 h-4 text-yellow-500 shrink-0" />
                            </div>
                            <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-2">Co-Líder</p>
                            <div className="flex items-center gap-2">
                                <span className="bg-white/5 text-[10px] text-slate-400 px-1.5 py-0.5 rounded border border-white/5">TH {member.thLevel}</span>
                                {member.warStatus === 'IN' || member.warStatus === 'in' ? (
                                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" title="Guerra ON"></span>
                                ) : (
                                    <span className="w-2 h-2 rounded-full bg-red-500" title="Guerra OFF"></span>
                                )}
                            </div>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* --- STATS BAR (Rodapé da Seção) --- */}
        <div className="mt-16 border-t border-white/5 pt-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#12141c] p-4 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase">Membros</p>
                        <p className="text-2xl font-black text-white">{1 + coLeaders.length + stats.elders + stats.members}<span className="text-slate-600 text-sm">/50</span></p>
                    </div>
                    <User className="w-8 h-8 text-slate-700" />
                </div>
                
                <div className="bg-[#12141c] p-4 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase">Anciãos</p>
                        <p className="text-2xl font-black text-white">{stats.elders}</p>
                    </div>
                    <Shield className="w-8 h-8 text-slate-700" />
                </div>

                <div className="bg-[#12141c] p-4 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase">Co-Líderes</p>
                        <p className="text-2xl font-black text-white">{coLeaders.length}</p>
                    </div>
                    <Zap className="w-8 h-8 text-slate-700" />
                </div>

                <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 p-4 rounded-xl border border-blue-500/20 flex items-center justify-between">
                    <div>
                        <p className="text-blue-400 text-xs font-bold uppercase">Status</p>
                        <p className="text-lg font-black text-white">Recrutando</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-blue-500" />
                </div>
            </div>
        </div>

      </div>
    </section>
  );
}