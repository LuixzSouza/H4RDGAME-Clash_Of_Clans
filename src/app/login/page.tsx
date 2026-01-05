"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { login } from "@/app/actions"; // Se tiver register, importe aqui também

// Componentes
import { LoginBackground } from "@/components/login/LoginBackground";
import { GateAnimation } from "@/components/login/GateAnimation";
import { TorchGroup } from "@/components/login/TorchGroup";
import { LoginForm } from "@/components/login/LoginForm";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [gateAnimation, setGateAnimation] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [torches, setTorches] = useState<boolean[]>(new Array(6).fill(false));
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Inicializar animação
  useEffect(() => {
    const timer = setTimeout(() => {
      setGateAnimation(true);
      
      const torchInterval = setInterval(() => {
        setTorches(prev => {
          const newTorches = [...prev];
          const firstUnlit = newTorches.findIndex(torch => !torch);
          if (firstUnlit !== -1) {
            newTorches[firstUnlit] = true;
          } else {
            clearInterval(torchInterval);
          }
          return newTorches;
        });
      }, 250);
      
      setTimeout(() => setShowForm(true), 1200);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (formData: FormData) => {
    setLoading(true);
    setError("");

    try {
      // Como o código original usava apenas 'login' no import, mantive assim.
      // Se você criou a função 'register' no actions.ts, a lógica seria:
      // if (isRegisterMode) await register(formData) else await login(formData)
      
      const result = await login(formData);
      if (result?.success === false) {
        setError(result.message);
        setLoading(false);
      }
    } catch (err) {
      setError("Erro de conexão. O servidor caiu no ataque.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0b0d14]">
      
      {/* 1. Background e Texturas */}
      <LoginBackground />

      {/* 2. Controles Superiores */}
      <div className="absolute top-6 right-6 z-50 flex gap-2">
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-slate-500 hover:text-yellow-500 hover:bg-yellow-500/10 transition-colors"
        >
            {soundEnabled ? <Volume2 className="w-5 h-5"/> : <VolumeX className="w-5 h-5"/>}
        </Button>
      </div>

      {/* 3. Tochas Animadas */}
      <TorchGroup torches={torches} />

      {/* 4. Animação do Portão */}
      <GateAnimation isOpen={gateAnimation} />

      {/* 5. Formulário de Login */}
      <LoginForm 
        isVisible={showForm}
        isRegisterMode={isRegisterMode}
        setIsRegisterMode={setIsRegisterMode}
        onSubmit={handleLogin}
        loading={loading}
        error={error}
      />

    </div>
  );
}