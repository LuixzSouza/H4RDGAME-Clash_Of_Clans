"use client";

import { useState } from "react";
import { 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Save, 
  Eye, 
  EyeOff, 
  ShieldCheck,
  LogOut,
  XCircle,
  Check
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress"; // Certifique-se de ter este componente ou use a div customizada abaixo
import { Switch } from "@/components/ui/switch"; // Opcional, se tiver shadcn/ui switch

// --- TIPAGEM CORRIGIDA ---
export interface PasswordData {
  current: string;
  new: string;
  confirm: string;
}

interface SecurityTabProps {
  passData: PasswordData;
  // Usamos React.Dispatch para o setState do pai ou uma função que aceita o tipo correto
  setPassData: (data: PasswordData) => void | React.Dispatch<React.SetStateAction<PasswordData>>; 
  status: { type: 'success' | 'error' | null; msg: string };
  saving: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function SecurityTab({ passData, setPassData, status, saving, onSubmit }: SecurityTabProps) {
  // Estados locais para controle de visualização
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [logoutOthers, setLogoutOthers] = useState(false);

  // --- LÓGICA DE FORÇA DA SENHA ---
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length >= 6) score += 20;
    if (pass.length >= 10) score += 20;
    if (/[A-Z]/.test(pass)) score += 20;
    if (/[0-9]/.test(pass)) score += 20;
    if (/[^A-Za-z0-9]/.test(pass)) score += 20;
    return score;
  };

  const strength = calculateStrength(passData.new);

  const getStrengthColor = (score: number) => {
    if (score <= 20) return "bg-red-500";
    if (score <= 40) return "bg-orange-500";
    if (score <= 60) return "bg-yellow-500";
    if (score <= 80) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthLabel = (score: number) => {
    if (score === 0) return "";
    if (score <= 20) return "Muito Fraca";
    if (score <= 40) return "Fraca";
    if (score <= 60) return "Média";
    if (score <= 80) return "Forte";
    return "Impenetrável";
  };

  // Helper para atualizar estado
  const handleChange = (field: keyof PasswordData, value: string) => {
    // Se o setPassData vier de um useState hook, ele pode precisar de um objeto novo
    setPassData({ ...passData, [field]: value });
  };

  return (
    <Card className="bg-[#1e202b] border-[#2f3245] shadow-xl relative overflow-hidden">
        {/* Efeito de fundo sutil */}
        <div className="absolute top-0 right-0 p-20 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />

        <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-blue-500"/> Blindagem da Conta
            </CardTitle>
            <CardDescription className="text-slate-400">
                Gerencie suas credenciais de acesso e monitore a segurança da sua vila.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
                
                {/* Senha Atual */}
                <div className="space-y-2">
                    <Label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Senha Atual</Label>
                    <div className="relative">
                        <Input 
                            type={showCurrent ? "text" : "password"} 
                            className="bg-[#15161e] border-[#2f3245] text-white focus-visible:ring-blue-500 h-12 pr-10"
                            placeholder="Digite sua senha atual..."
                            value={passData.current}
                            onChange={e => handleChange('current', e.target.value)}
                            required
                        />
                        <button 
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute right-3 top-3 text-slate-500 hover:text-white transition-colors"
                        >
                            {showCurrent ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Nova Senha */}
                    <div className="space-y-2">
                        <Label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Nova Senha</Label>
                        <div className="relative">
                            <Input 
                                type={showNew ? "text" : "password"} 
                                className="bg-[#15161e] border-[#2f3245] text-white focus-visible:ring-blue-500 h-12 pr-10"
                                placeholder="Mínimo 6 caracteres"
                                value={passData.new}
                                onChange={e => handleChange('new', e.target.value)}
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-3 text-slate-500 hover:text-white transition-colors"
                            >
                                {showNew ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                            </button>
                        </div>
                        
                        {/* Barra de Força */}
                        {passData.new.length > 0 && (
                            <div className="space-y-1 animate-in fade-in slide-in-from-top-1">
                                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
                                    <span>Segurança</span>
                                    <span className={getStrengthColor(strength).replace('bg-', 'text-')}>{getStrengthLabel(strength)}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-500 ease-out ${getStrengthColor(strength)}`} 
                                        style={{ width: `${strength}%` }}
                                    />
                                </div>
                                {/* Checklist Rápido */}
                                <div className="flex gap-2 mt-1">
                                    <span className={`text-[10px] flex items-center ${passData.new.length >= 6 ? 'text-green-500' : 'text-slate-600'}`}>
                                        {passData.new.length >= 6 ? <CheckCircle2 className="w-3 h-3 mr-1"/> : <div className="w-3 h-3 mr-1 border border-slate-600 rounded-full"/>} 6+ Caracteres
                                    </span>
                                    <span className={`text-[10px] flex items-center ${/[0-9]/.test(passData.new) ? 'text-green-500' : 'text-slate-600'}`}>
                                        {/[0-9]/.test(passData.new) ? <CheckCircle2 className="w-3 h-3 mr-1"/> : <div className="w-3 h-3 mr-1 border border-slate-600 rounded-full"/>} Números
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Confirmar Senha */}
                    <div className="space-y-2">
                        <Label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Confirmar</Label>
                        <div className="relative">
                            <Input 
                                type={showNew ? "text" : "password"} 
                                className={`bg-[#15161e] border-[#2f3245] text-white focus-visible:ring-blue-500 h-12 pr-10 ${
                                    passData.confirm && passData.new !== passData.confirm ? 'border-red-500/50 focus-visible:ring-red-500' : ''
                                }`}
                                placeholder="Repita a nova senha"
                                value={passData.confirm}
                                onChange={e => handleChange('confirm', e.target.value)}
                                required
                            />
                            {/* Feedback de Match */}
                            <div className="absolute right-3 top-3">
                                {passData.confirm.length > 0 && (
                                    passData.new === passData.confirm 
                                        ? <CheckCircle2 className="w-5 h-5 text-green-500 animate-in zoom-in" />
                                        : <XCircle className="w-5 h-5 text-red-500 animate-in zoom-in" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Opção Extra de Segurança */}
                <div className="flex items-center space-x-2 border border-[#2f3245] p-3 rounded-lg bg-[#15161e]/50">
                    <div 
                        className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${logoutOthers ? 'bg-blue-600 border-blue-600' : 'border-slate-500'}`}
                        onClick={() => setLogoutOthers(!logoutOthers)}
                    >
                        {logoutOthers && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1 cursor-pointer" onClick={() => setLogoutOthers(!logoutOthers)}>
                        <p className="text-sm font-medium text-white flex items-center gap-2">
                            <LogOut className="w-3 h-3 text-slate-400"/> Desconectar outros dispositivos
                        </p>
                        <p className="text-xs text-slate-500">Recomendado se você suspeita de acesso não autorizado.</p>
                    </div>
                </div>

                {/* Status Message */}
                {status.msg && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium animate-in fade-in-20 ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {status.type === 'success' ? <ShieldCheck className="w-5 h-5 flex-shrink-0"/> : <AlertCircle className="w-5 h-5 flex-shrink-0"/>}
                        {status.msg}
                    </div>
                )}

                <div className="pt-2 flex justify-end">
                    <Button 
                        type="submit" 
                        disabled={saving || (passData.new !== passData.confirm) || passData.new.length < 6} 
                        className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold gap-2 px-8 h-12 shadow-lg shadow-blue-900/20 transition-all hover:translate-y-[-1px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
                        Atualizar Credenciais
                    </Button>
                </div>
            </form>
        </CardContent>
    </Card>
  );
}