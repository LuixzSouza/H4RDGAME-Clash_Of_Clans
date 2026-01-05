"use client";

import { useState, useEffect } from "react";
import { Swords, Lock, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Actions
import { getCurrentUser } from "@/app/actions";
import { changePassword, updateAvatar } from "@/app/dashboard/perfil/actions";

// Componentes
import { ProfileHeader } from "@/components/perfil/ProfileHeader";
import { ProfileCard } from "@/components/perfil/ProfileCard";
import { VisualTab } from "@/components/perfil/VisualTab";
import { SecurityTab } from "@/components/perfil/SecurityTab";

// Tipagem
interface UserData {
  id: string;
  name: string;
  tag: string;
  role: string;
  tickets: number;
  warStatus: string;
  thLevel: number;
  avatarSeed: string | null;
}

// Helper
const generateRandomSeeds = (count: number) => {
  const seeds = [];
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < count; i++) {
    let result = "";
    for (let j = 0; j < 8; j++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    seeds.push(result);
  }
  return seeds;
};

export default function PerfilPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedTag, setCopiedTag] = useState(false);
  
  // Estado Senha
  const [passData, setPassData] = useState({ current: "", new: "", confirm: "" });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: "" });
  const [savingPass, setSavingPass] = useState(false);

  // Estado Avatar
  const [selectedSeed, setSelectedSeed] = useState("");
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [avatarGrid, setAvatarGrid] = useState<string[]>([]); 

  useEffect(() => {
    async function load() {
      const userData = await getCurrentUser();
      
      if (userData) {
        setUser(userData as UserData);
        setSelectedSeed(userData.avatarSeed || userData.name || "User");
      }
      
      const initialSeeds = ["King", "Queen", "Wizard", "Pekka", ...generateRandomSeeds(11)];
      setAvatarGrid(initialSeeds);
      
      setLoading(false);
    }
    load();
  }, []);

  // --- AÇÕES ---

  const copyTag = () => {
    if (user?.tag) {
      navigator.clipboard.writeText(user.tag);
      setCopiedTag(true);
      setTimeout(() => setCopiedTag(false), 2000);
    }
  };

  const handleShuffleAvatars = () => {
    const newSeeds = generateRandomSeeds(15);
    setAvatarGrid(newSeeds);
  };

  const handlePassChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, msg: "" });

    if (passData.new !== passData.confirm) {
        setStatus({ type: 'error', msg: "As senhas não conferem." });
        return;
    }
    if (passData.new.length < 6) {
        setStatus({ type: 'error', msg: "A senha deve ter no mínimo 6 caracteres." });
        return;
    }

    setSavingPass(true);
    const formData = new FormData();
    formData.append("currentPassword", passData.current);
    formData.append("newPassword", passData.new);

    const result = await changePassword(formData);
    
    if (result.success) {
      setStatus({ type: 'success', msg: "Senha atualizada com segurança!" });
      setPassData({ current: "", new: "", confirm: "" });
    } else {
      setStatus({ type: 'error', msg: result.message || "Erro ao trocar senha." });
    }
    setSavingPass(false);
  };

  const handleSaveAvatar = async () => {
    setSavingAvatar(true);
    const formData = new FormData();
    formData.append("seed", selectedSeed);
    
    await updateAvatar(formData);
    
    if (user) {
      setUser({ ...user, avatarSeed: selectedSeed });
    }
    
    setTimeout(() => {
        setSavingAvatar(false);
        window.location.reload(); 
    }, 800);
  };

  if (loading) return <div className="flex h-[50vh] items-center justify-center text-slate-500 gap-2"><Loader2 className="animate-spin"/> Carregando perfil...</div>;

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-6xl mx-auto">
      
      {/* 1. Header */}
      <ProfileHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. Esquerda: Card de Perfil */}
        <div className="lg:col-span-1">
            <ProfileCard 
                user={user} 
                selectedSeed={selectedSeed} 
                copiedTag={copiedTag} 
                onCopyTag={copyTag}
            />
        </div>

        {/* 3. Direita: Personalização e Segurança */}
        <div className="lg:col-span-2">
            <Tabs defaultValue="visual" className="w-full">
                <TabsList className="bg-[#1e202b] border border-[#2f3245] w-full justify-start p-1 h-auto rounded-xl">
                    <TabsTrigger value="visual" className="gap-2 py-3 px-6 rounded-lg data-[state=active]:bg-[#2f3245] data-[state=active]:text-white data-[state=active]:shadow-none text-slate-400">
                        <Swords className="w-4 h-4" /> Aparência
                    </TabsTrigger>
                    <TabsTrigger value="security" className="gap-2 py-3 px-6 rounded-lg data-[state=active]:bg-[#2f3245] data-[state=active]:text-white data-[state=active]:shadow-none text-slate-400">
                        <Lock className="w-4 h-4" /> Segurança
                    </TabsTrigger>
                </TabsList>

                {/* Aba Visual */}
                <TabsContent value="visual" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-2">
                    <VisualTab 
                        selectedSeed={selectedSeed}
                        setSelectedSeed={setSelectedSeed}
                        avatarGrid={avatarGrid}
                        onShuffle={handleShuffleAvatars}
                        onSave={handleSaveAvatar}
                        saving={savingAvatar}
                        currentSeed={user?.avatarSeed}
                    />
                </TabsContent>

                {/* Aba Segurança */}
                <TabsContent value="security" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-2">
                    <SecurityTab 
                        passData={passData}
                        setPassData={setPassData}
                        status={status}
                        saving={savingPass}
                        onSubmit={handlePassChange}
                    />
                </TabsContent>
            </Tabs>
        </div>
      </div>
    </div>
  );
}