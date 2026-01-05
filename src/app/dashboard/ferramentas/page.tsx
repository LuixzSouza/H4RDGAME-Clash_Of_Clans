"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getCurrentUser } from "@/app/actions";

// Componentes
import { ToolHeader } from "@/components/ferramentas/ToolHeader";
import { AccessDenied } from "@/components/ferramentas/AccessDenied";
import { MessageConfigurator, MessageFormData, TemplatesMap, TemplateCategory } from "@/components/ferramentas/MessageConfigurator";
import { MessagePreview } from "@/components/ferramentas/MessagePreview";

// --- DADOS DE TEMPLATE ---
// (Estes dados alimentam o configurador e geram o texto final)
const TEMPLATES: TemplatesMap = {
  guerra: [
    { label: "Guerra Começando (Curta)", text: "⚔️⚠️ *GUERRA INICIADA!* \nEntrem no mapa e planejem seus ataques. \n⏰ Início: [HORA]\n🎯 Alvo: Espelho" },
    { label: "Última Chamada (1h)", text: "⏰⚔️ *ÚLTIMA CHAMADA PARA A GUERRA!* \nFalta 1h para o fim. Quem ainda não atacou, CORRE! \n🚫 Não ataquem sem heróis." },
    { label: "Escalação / Regras", text: "⚔️📋 *GUERRA DE HOJE: [DATA]* \n🗺️ Mapa: [MAPA/TIPO] \n\n⚠️ *REGRAS:* \n1. Ataque seu espelho nas primeiras 12h. \n2. Segundo ataque liberado após meio-dia. \n3. Garanta 2 estrelas ou peça ajuda. \n\nDúvidas? Chame [RESPONSÁVEL]." },
    { label: "Vitória", text: "🎉⚔️ *VITÓRIA!* \nParabéns guerreiros! Mais uma para a conta do H4RD G4ME. \n🔥 Destaque para [RESPONSÁVEL] pelos 100%!" },
  ],
  capital: [
    { label: "Início Raid Weekend", text: "🏰🎯 *RAID WEEKEND COMEÇOU!* \nA Capital do Clã está aberta. Façam seus 6 ataques para farmar medalhas! \n💰 Ouro da Capital é prioridade em: [MAPA/TIPO]." },
    { label: "Lembrete Capital", text: "⏳🏰 *LEMBRETE CAPITAL* \nNão deixem ataques sobrando! As medalhas ajudam a evoluir sua vila e comprar poções." },
  ],
  geral: [
    { label: "Aviso Geral (Simples)", text: "🔔 *AVISO GERAL* \n[EVENTO] \n\n📅 Data: [DATA] \n⏰ Hora: [HORA] \n\nFiquem atentos!" },
    { label: "Aviso Importante (Staff)", text: "❗ *COMUNICADO DA LIDERANÇA* ❗ \n\n[EVENTO] \n\nÉ obrigatório que todos [REQUISITOS]. \nQuem não puder, avise com antecedência. \n\nAtt, [RESPONSÁVEL]." },
  ],
  jogos: [
    { label: "Início Clan Games", text: "🎯🏅 *JOGOS DO CLÃ!* \nBora farmar pontos! Meta mínima: 1000 pontos por membro. \nQuem fizer 4000 ganha destaque!" },
    { label: "Reta Final Jogos", text: "⏳🎯 *RETA FINAL JOGOS DO CLÃ* \nFaltam poucas horas! Quem ainda não completou a meta, agiliza pra garantir as recompensas máximas." },
  ],
  doacao: [
    { label: "Pedido Urgente Guerra", text: "🤝📣 *DOAÇÕES DE GUERRA* \nCastelos de guerra estão abertos! \nPrecisamos de: [REQUISITOS]. \nQuem estiver online, fortalece!" },
  ],
  recrutamento: [
    { label: "Anúncio Externo", text: "📢👥 *O H4RD G4ME ESTÁ RECRUTANDO!* \n\n🛡️ Clã Nível 15+ \n⚔️ Guerra Non-Stop \n🏰 Capital Maximiza \n\n👉 Requisitos: TH[XX]+, Ativo e Focado. \n📩 Interessados chamar PV." },
  ],
};

export default function FerramentasPage() {
  // --- ESTADOS ---
  const [hasAccess, setHasAccess] = useState(false); 
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<TemplateCategory>("guerra");
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState("0");
  const [copied, setCopied] = useState(false);

  // Estado do Formulário
  const [formData, setFormData] = useState<MessageFormData>({
    hora: "19:00",
    data: new Date().toLocaleDateString('pt-BR'),
    evento: "Reunião Geral",
    mapa: "Terra",
    responsavel: "Liderança",
    requisitos: "Super Dragões",
    extra: "12",
  });

  // --- EFEITOS (Load & Auth) ---
  useEffect(() => {
    async function init() {
      try {
        const user = await getCurrentUser();
        
        if (user) {
          // Preenche o responsável automaticamente
          setFormData(prev => ({ ...prev, responsavel: user.name }));
          
          // Verifica permissão (Liderança + Ancião + Admin Supremo)
          const allowedRoles = ['LIDER', 'COLIDER', 'ANCIAO'];
          if (allowedRoles.includes(user.role) || user.tag === '#ADMIN') {
            setHasAccess(true);
          }
        }
      } catch (error) {
        console.error("Erro ao verificar permissão:", error);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // --- HANDLERS ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleManualUpdate = (field: keyof MessageFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- LÓGICA DE GERAÇÃO DE TEXTO ---
  const currentTemplateCategory = TEMPLATES[activeTab];
  // Garante que o template existe, senão pega o primeiro como fallback
  const currentTemplate = currentTemplateCategory[parseInt(selectedTemplateIndex)] || currentTemplateCategory[0];
  
  const generatedText = currentTemplate.text
      .replace("[HORA]", formData.hora)
      .replace("[DATA]", formData.data)
      .replace("[EVENTO]", formData.evento)
      .replace("[MAPA/TIPO]", formData.mapa)
      .replace("[RESPONSÁVEL]", formData.responsavel)
      .replace("[REQUISITOS]", formData.requisitos)
      .replace("[XX]", formData.extra);

  // --- RENDERIZAÇÃO ---

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
            <p className="text-sm font-medium text-slate-500 animate-pulse tracking-widest uppercase">
                Verificando credenciais...
            </p>
        </div>
    );
  }

  if (!hasAccess) {
    return <AccessDenied />;
  }

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto pb-20 animate-in fade-in zoom-in duration-300">
      
      {/* 1. Cabeçalho da Ferramenta */}
      <ToolHeader />

      {/* 2. Área de Trabalho (Configurador + Preview) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        
        {/* Esquerda: Configurador */}
        <div className="xl:sticky xl:top-6">
            <MessageConfigurator 
                activeTab={activeTab}
                setActiveTab={(val) => setActiveTab(val as TemplateCategory)}
                selectedTemplateIndex={selectedTemplateIndex}
                setSelectedTemplateIndex={setSelectedTemplateIndex}
                formData={formData}
                handleInputChange={handleInputChange}
                onManualUpdate={handleManualUpdate}
                templates={TEMPLATES}
            />
        </div>

        {/* Direita: Preview e Ação */}
        <div>
            <MessagePreview 
                generatedText={generatedText}
                onCopy={copyToClipboard}
                copied={copied}
            />
        </div>
      </div>
    </div>
  );
}