"use client";

import { 
  Type, Sword, Castle, AlertTriangle, Trophy, Calendar, MessageSquare, 
  Clock, User, MapPin, MousePointerClick, RefreshCw, Hash, Edit3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// --- TIPAGEM ---

export interface MessageFormData {
  hora: string;
  data: string;
  evento: string;
  mapa: string;
  responsavel: string;
  requisitos: string;
  extra: string;
}

export interface TemplateItem {
  label: string;
  text: string;
}

export type TemplateCategory = 'guerra' | 'capital' | 'geral' | 'jogos' | 'doacao' | 'recrutamento';
export type TemplatesMap = Record<TemplateCategory, TemplateItem[]>;

// Configuração das Abas (Centralizada para facilitar manutenção)
const TABS_CONFIG = [
  { id: 'guerra', icon: Sword, label: 'Guerra', color: 'text-destructive', bg: 'bg-destructive/10 border-destructive/20' },
  { id: 'capital', icon: Castle, label: 'Capital', color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
  { id: 'geral', icon: AlertTriangle, label: 'Avisos', color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
  { id: 'jogos', icon: Trophy, label: 'Jogos', color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
  { id: 'doacao', icon: Calendar, label: 'Doar', color: 'text-success', bg: 'bg-success/10 border-success/20' },
  { id: 'recrutamento', icon: MessageSquare, label: 'Recrute', color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
] as const;

interface MessageConfiguratorProps {
  activeTab: string;
  setActiveTab: (val: string) => void;
  selectedTemplateIndex: string;
  setSelectedTemplateIndex: (val: string) => void;
  formData: MessageFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onManualUpdate: (field: keyof MessageFormData, value: string) => void; 
  templates: TemplatesMap;
}

export function MessageConfigurator({
  activeTab, setActiveTab, selectedTemplateIndex, setSelectedTemplateIndex, 
  formData, handleInputChange, onManualUpdate, templates
}: MessageConfiguratorProps) {
  
  // Estilos reutilizáveis
  const inputWrapperClass = "relative group";
  const inputClass = "bg-background border-border text-white placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary rounded-lg h-11 transition-all hover:border-border pl-10 pr-16";
  const iconClass = "absolute left-3 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors";
  const labelClass = "text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-1.5";
  const actionButtonClass = "absolute right-1.5 top-1.5 h-8 px-3 text-[10px] font-bold bg-card hover:bg-accent text-muted-foreground hover:text-white rounded border border-border transition-all flex items-center gap-1.5";

  // --- HELPERS ---
  const setNow = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    onManualUpdate('hora', timeString);
  };

  const setToday = () => {
    const today = new Date().toLocaleDateString('pt-BR');
    onManualUpdate('data', today);
  };

  // Encontra a configuração da aba ativa para estilização dinâmica
  const currentTabConfig = TABS_CONFIG.find(t => t.id === activeTab) || TABS_CONFIG[0];
  const ActiveIcon = currentTabConfig.icon;

  return (
    <Card className="card-clash overflow-hidden bg-card border-border shadow-2xl flex flex-col h-full ring-1 ring-white/5">
      
      {/* Cabeçalho Dinâmico */}
      <CardHeader className="bg-background border-b border-border pb-4 shrink-0">
        <div className="flex justify-between items-center">
            <div>
                <CardTitle className="text-white flex items-center gap-2.5 text-lg">
                    <div className={`p-2 rounded-lg ${currentTabConfig.bg}`}>
                        <ActiveIcon className={`w-5 h-5 ${currentTabConfig.color}`} />
                    </div>
                    Configurar {currentTabConfig.label}
                </CardTitle>
                <CardDescription className="text-muted-foreground text-xs mt-1 ml-1">
                    Personalize os parâmetros do comando.
                </CardDescription>
            </div>
            
            <Badge variant="outline" className={`hidden sm:flex border-opacity-30 bg-opacity-5 capitalize ${currentTabConfig.color.replace('text-', 'border-')}`}>
                {activeTab}
            </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 flex-1 overflow-y-auto custom-scrollbar">
        <Tabs defaultValue="guerra" value={activeTab} onValueChange={(val) => {
            setActiveTab(val);
            setSelectedTemplateIndex("0");
        }}>
          
          {/* Navegação de Abas (Grid Compacto) */}
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 mb-6 h-auto bg-background border border-border p-1.5 rounded-xl gap-1.5">
            {TABS_CONFIG.map((tab) => (
                <TabsTrigger 
                    key={tab.id}
                    value={tab.id} 
                    className="group flex flex-col items-center justify-center gap-1 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent data-[state=active]:bg-accent data-[state=active]:text-white transition-all border border-transparent data-[state=active]:border-border/50"
                >
                    <tab.icon className={`w-4 h-4 group-data-[state=active]:${tab.color}`}/> 
                    <span className="text-[9px] font-bold uppercase tracking-wide">{tab.label}</span>
                </TabsTrigger>
            ))}
          </TabsList>

          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            {/* 1. Seleção do Modelo */}
            <div className="space-y-2">
              <Label className={labelClass}><Type className="w-3 h-3 text-primary"/> Modelo Base</Label>
              <Select value={selectedTemplateIndex} onValueChange={setSelectedTemplateIndex}>
                <SelectTrigger className="bg-background border-border text-white h-12 focus:ring-primary">
                  <SelectValue placeholder="Selecione um modelo" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-white">
                  {templates[activeTab as TemplateCategory]?.map((t, idx) => (
                    <SelectItem key={idx} value={idx.toString()} className="focus:bg-accent cursor-pointer">
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-accent" />

            {/* 2. Dados Globais (Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              <div className="space-y-1">
                <Label htmlFor="hora" className={labelClass}>Horário</Label>
                <div className={inputWrapperClass}>
                    <Clock className={iconClass} />
                    <Input id="hora" name="hora" value={formData.hora} onChange={handleInputChange} className={inputClass} placeholder="00:00" />
                    <button onClick={setNow} type="button" className={actionButtonClass}>
                        <RefreshCw className="w-3 h-3"/> Agora
                    </button>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="data" className={labelClass}>Data</Label>
                <div className={inputWrapperClass}>
                    <Calendar className={iconClass} />
                    <Input id="data" name="data" value={formData.data} onChange={handleInputChange} className={inputClass} placeholder="DD/MM" />
                    <button onClick={setToday} type="button" className={actionButtonClass}>
                        <MousePointerClick className="w-3 h-3"/> Hoje
                    </button>
                </div>
              </div>
            </div>

            {/* 3. Dados Específicos (Card Destacado) */}
            <div className={`bg-gradient-to-br from-background to-background p-5 rounded-xl border border-border space-y-5 shadow-lg relative overflow-hidden group`}>
                {/* Efeito de brilho baseado na cor da aba */}
                <div className={`absolute top-0 left-0 w-1 h-full ${currentTabConfig.bg.split(' ')[0].replace('/10', '')} opacity-80`}></div>
                
                <div className="flex items-center gap-2 mb-1">
                    <Edit3 className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">Parâmetros Específicos</span>
                </div>

                {activeTab === 'guerra' && (
                    <div className="space-y-1">
                        <Label htmlFor="mapa" className={labelClass}>Tipo de Mapa / Estratégia</Label>
                        <div className={inputWrapperClass}>
                            <MapPin className={iconClass} />
                            <Input id="mapa" name="mapa" value={formData.mapa} onChange={handleInputChange} className={inputClass} placeholder="Ex: Terra, Híbrido, Spam" />
                        </div>
                    </div>
                )}

                {activeTab === 'doacao' && (
                    <div className="space-y-1">
                        <Label htmlFor="requisitos" className={labelClass}>Requisitos de Tropa</Label>
                        <div className={inputWrapperClass}>
                            <Hash className={iconClass} />
                            <Input id="requisitos" name="requisitos" value={formData.requisitos} onChange={handleInputChange} className={inputClass} placeholder="Ex: Apenas tropas aéreas max" />
                        </div>
                    </div>
                )}
                
                {activeTab === 'geral' && (
                    <div className="space-y-1">
                        <Label htmlFor="evento" className={labelClass}>Título do Evento</Label>
                        <div className={inputWrapperClass}>
                            <AlertTriangle className={iconClass} />
                            <Input id="evento" name="evento" value={formData.evento} onChange={handleInputChange} className={inputClass} placeholder="Ex: Manutenção, Regras Novas" />
                        </div>
                    </div>
                )}

                {activeTab === 'recrutamento' && (
                    <div className="space-y-1">
                        <Label htmlFor="extra" className={labelClass}>Nível de Centro de Vila</Label>
                        <div className={inputWrapperClass}>
                            <Trophy className={iconClass} />
                            <Input id="extra" name="extra" value={formData.extra} onChange={handleInputChange} className={inputClass} placeholder="Ex: TH13+" />
                        </div>
                    </div>
                )}

                {/* Assinatura */}
                <div className="space-y-1 pt-2">
                    <Label htmlFor="responsavel" className={labelClass}>Autor do Comando</Label>
                    <div className={inputWrapperClass}>
                        <User className={iconClass} />
                        <Input id="responsavel" name="responsavel" value={formData.responsavel} onChange={handleInputChange} className={inputClass} placeholder="Seu Nick" />
                    </div>
                </div>
            </div>

          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}