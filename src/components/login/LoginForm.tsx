"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Swords, ShieldAlert, Lock, UserPlus, LogIn, AlertCircle, Loader2,
  Eye, EyeOff, ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  isVisible: boolean;
  isRegisterMode: boolean;
  setIsRegisterMode: (val: boolean) => void;
  onSubmit: (formData: FormData) => void;
  loading: boolean;
  error: string;
}

const FORGOT_URL =
  "https://wa.me/5535997354797?text=" +
  encodeURIComponent("Olá, líder! Esqueci minha senha do painel H4RD G4ME e preciso redefinir. Minha tag é: #");

const JOIN_URL =
  "https://wa.me/5535997354797?text=" +
  encodeURIComponent("Olá! Quero me alistar no clã H4RD G4ME. Minha tag no Clash é: #");

export function LoginForm({ isVisible, isRegisterMode, onSubmit, loading, error }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className={`w-full max-w-md p-4 transition-all duration-1000 z-40 ${
        isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-10"
      }`}
    >
      {/* Voltar ao site */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar à base
      </Link>

      <div className="panel-clash backdrop-blur-md p-8 shadow-[0_0_60px_rgba(0,0,0,0.6)]">
        {/* Emblema */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-5 relative w-20 h-20">
            <div className={`absolute inset-0 blur-xl rounded-full ${isRegisterMode ? "bg-success/30" : "bg-primary/30"}`} />
            <div
              className={`relative h-20 w-20 rounded-2xl rotate-45 flex items-center justify-center border-4 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.6)] ${
                isRegisterMode
                  ? "bg-gradient-to-br from-lime-400 to-green-700 border-green-900/50"
                  : "bg-gradient-to-br from-amber-300 to-amber-700 border-amber-800/60"
              }`}
            >
              {isRegisterMode ? (
                <UserPlus className="w-9 h-9 text-white -rotate-45" />
              ) : (
                <Swords className="w-9 h-9 text-amber-950 -rotate-45" />
              )}
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl clash-title">
            {isRegisterMode ? "Alistamento" : "Acesso ao Quartel"}
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            {isRegisterMode ? "Junte-se às fileiras do clã." : "Identifique-se, guerreiro."}
          </p>
        </div>

        <div className="gold-rule mb-6" />

        <form action={onSubmit} className="space-y-5">
          {/* Campo Tag */}
          <div className="space-y-2">
            <Label htmlFor="tag" className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-3 h-3 text-primary" /> Tag do Jogador
            </Label>
            <div className="relative group">
              <span className="absolute left-3 top-3 text-muted-foreground group-focus-within:text-primary transition-colors font-bold text-lg">
                #
              </span>
              <Input
                id="tag"
                name="tag"
                placeholder="ADMIN"
                className="pl-8 h-12 bg-background border-border text-white placeholder:text-muted-foreground/60 focus-visible:ring-primary/50 focus-visible:border-primary/50 rounded-xl font-mono uppercase tracking-widest text-lg"
                required
                autoFocus
              />
            </div>
          </div>

          {/* Campo Senha */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-3 h-3 text-primary" /> Senha
              </Label>
              {!isRegisterMode && (
                <a
                  href={FORGOT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-primary/80 hover:text-primary cursor-pointer transition-colors"
                >
                  Esqueceu a senha?
                </a>
              )}
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-11 h-12 bg-background border-border text-white focus-visible:ring-primary/50 focus-visible:border-primary/50 rounded-xl"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="bg-destructive/15 border border-destructive/40 rounded-lg p-3 flex items-center gap-3 text-destructive text-sm font-medium animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          {/* Botão épico */}
          <button type="submit" disabled={loading} className={`${isRegisterMode ? "btn-clash-green" : "btn-clash"} w-full text-base disabled:opacity-70 disabled:cursor-not-allowed`}>
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> {isRegisterMode ? "Alistando..." : "Abrindo portões..."}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {isRegisterMode ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                {isRegisterMode ? "Confirmar Alistamento" : "Abrir Portões"}
              </span>
            )}
          </button>
        </form>

        {/* Solicitar acesso (recrutamento via WhatsApp) */}
        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-xs">
            Ainda não é membro?
            <a
              href={JOIN_URL}
              target="_blank"
              rel="noreferrer"
              className="ml-2 text-primary font-bold hover:underline transition-colors"
            >
              Solicitar Acesso
            </a>
          </p>
        </div>
      </div>

      {/* Rodapé */}
      <div className="text-center space-y-1 animate-in fade-in duration-1000 delay-500 mt-8">
        <div className="flex justify-center gap-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">H4RD G4ME System v2.0</p>
      </div>
    </div>
  );
}
