"use client";

import { Swords, ShieldAlert, Lock, UserPlus, LogIn, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface LoginFormProps {
  isVisible: boolean;
  isRegisterMode: boolean;
  setIsRegisterMode: (val: boolean) => void;
  onSubmit: (formData: FormData) => void;
  loading: boolean;
  error: string;
}

export function LoginForm({ isVisible, isRegisterMode, setIsRegisterMode, onSubmit, loading, error }: LoginFormProps) {
  return (
    <div className={`w-full max-w-md p-4 transition-all duration-1000 z-40 ${
      isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10'
    }`}>
      
      <Card className="card-clash bg-[#1e202b]/95 backdrop-blur-md border-[#2f3245] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <CardHeader className="text-center pb-2 relative">
          
          {/* Ícone Animado */}
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#2f3245] to-[#1a1b26] rounded-2xl border-2 border-yellow-600/30 flex items-center justify-center shadow-inner mb-4 group cursor-pointer hover:border-yellow-500 transition-colors">
            {isRegisterMode ? (
                <UserPlus className="w-10 h-10 text-green-500 group-hover:scale-110 transition-transform"/>
            ) : (
                <Swords className="w-10 h-10 text-red-500 group-hover:rotate-12 transition-transform duration-500" />
            )}
          </div>

          <CardTitle className="text-3xl font-heading text-white tracking-wide">
            {isRegisterMode ? "Alistamento" : "Acesso ao Quartel"}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {isRegisterMode 
                ? "Junte-se às fileiras do clã." 
                : "Identifique-se, guerreiro."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={onSubmit} className="space-y-5">
            
            {/* Campo Tag */}
            <div className="space-y-2">
              <Label htmlFor="tag" className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-3 h-3 text-yellow-500" /> Tag do Jogador
              </Label>
              <div className="relative group">
                <div className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-yellow-500 transition-colors">
                  <span className="font-bold text-lg">#</span>
                </div>
                <Input 
                  id="tag" 
                  name="tag"
                  placeholder="P028..."
                  className="pl-8 h-12 bg-[#0c0d14] border-[#2f3245] text-white placeholder:text-slate-700 focus-visible:ring-yellow-500/50 rounded-xl font-mono uppercase tracking-widest text-lg"
                  required
                  autoFocus
                />
              </div>
            </div>
            
            {/* Campo Senha */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-3 h-3 text-yellow-500" /> Senha
                </Label>
                {!isRegisterMode && (
                    <span className="text-[10px] text-yellow-600/80 hover:text-yellow-500 cursor-pointer transition-colors">
                    Esqueceu a senha?
                    </span>
                )}
              </div>
              <div className="relative group">
                <div className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-yellow-500 transition-colors">
                  <Lock className="w-5 h-5"/>
                </div>
                <Input 
                  id="password"
                  name="password"
                  type="password" 
                  placeholder="••••••••"
                  className="pl-10 h-12 bg-[#0c0d14] border-[#2f3245] text-white focus-visible:ring-yellow-500/50 rounded-xl"
                  required 
                />
              </div>
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <div className="bg-red-950/30 border border-red-500/30 rounded-lg p-3 flex items-center gap-3 text-red-400 text-sm font-medium animate-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading} 
              className={`w-full h-14 text-lg font-bold shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]
                ${isRegisterMode 
                    ? "bg-green-700 hover:bg-green-600 text-white border-b-4 border-green-900" 
                    : "bg-yellow-600 hover:bg-yellow-500 text-black border-b-4 border-yellow-800"
                }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin"/> {isRegisterMode ? "Alistando..." : "Entrando..."}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {isRegisterMode ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                  {isRegisterMode ? "Confirmar Alistamento" : "Abrir Portões"}
                </span>
              )}
            </Button>
          </form>

          {/* Toggle Login/Registro */}
          <div className="mt-6 text-center">
              <p className="text-slate-500 text-xs">
                  {isRegisterMode ? "Já tem uma conta?" : "Ainda não é membro?"}
                  <button 
                    onClick={() => setIsRegisterMode(!isRegisterMode)}
                    className="ml-2 text-yellow-500 font-bold hover:underline hover:text-yellow-400 transition-colors"
                  >
                      {isRegisterMode ? "Fazer Login" : "Solicitar Acesso"}
                  </button>
              </p>
          </div>

        </CardContent>
      </Card>

      {/* Rodapé */}
      <div className="text-center space-y-1 animate-in fade-in duration-1000 delay-500 mt-8">
          <div className="flex justify-center gap-1">
              {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-slate-800 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
              ))}
          </div>
          <p className="text-[10px] text-slate-600 uppercase tracking-widest">
          H4RD G4ME System v2.0
          </p>
      </div>

    </div>
  );
}