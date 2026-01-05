"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { Role, WarPreference } from "@prisma/client";

// --- UTILITÁRIO DE LOG ---
export async function createLog(action: string, details: string, memberId?: string) {
  try {
    await prisma.auditLog.create({
      data: { 
        action, 
        details, // Assumindo que você ajustou o schema para 'details' ou 'description'
        memberId 
      }
    });
  } catch (error) {
    console.error("Falha ao criar log:", error);
  }
}

export async function getRecentLogs() {
  try {
    const logs = await prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { 
        member: { 
          select: { name: true } 
        } 
      }
    });

    return logs.map((log) => ({
      id: log.id,
      action: log.action,
      details: log.details, 
      createdAt: log.createdAt,
      member: log.member,
      memberId: log.memberId
    }));

  } catch (error) {
    console.error("Erro ao buscar logs:", error);
    return [];
  }
}

// --- AUTENTICAÇÃO ---

export async function login(formData: FormData) {
  let tag = formData.get("tag") as string;
  const password = formData.get("password") as string;

  try {
    // 1. Normalização da TAG
    tag = tag.trim().toUpperCase();
    if (!tag.startsWith("#")) {
      tag = "#" + tag;
    }

    // 2. Busca o membro
    const member = await prisma.member.findUnique({
      where: { tag }
    });

    if (!member) {
      return { success: false, message: `Guerreiro não encontrado com a tag ${tag}.` };
    }

    if (!member.isActive) {
        return { success: false, message: "Esta conta foi desativada." };
    }

    // 3. Verifica senha
    const passwordMatch = await bcrypt.compare(password, member.password);

    if (!passwordMatch) {
      return { success: false, message: "Senha incorreta." };
    }

    // 4. Cria a sessão
    const cookieStore = await cookies();
    cookieStore.set("h4rdgame_session", member.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: "/",
    });

    // 5. Atualiza "Visto por último" pois o usuário logou
    await prisma.member.update({
        where: { id: member.id },
        data: { lastSeen: new Date() }
    });

  } catch (error) {
    console.error("Erro no login:", error);
    return { success: false, message: "Erro interno no servidor." };
  }

  // 6. Redirecionamento
  redirect("/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("h4rdgame_session");
  redirect("/");
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("h4rdgame_session")?.value;

  if (!sessionId) return null;

  try {
    const member = await prisma.member.findUnique({
      where: { id: sessionId },
      select: { 
        id: true, 
        name: true, 
        role: true, 
        tag: true, 
        // tickets: true, <--- REMOVIDO (Não existe mais)
        warStatus: true, 
        thLevel: true, 
        avatarSeed: true 
      }
    });
    return member;
  } catch (error) {
    return null;
  }
}

// --- CONFIGURAÇÃO INICIAL (SEED DE EMERGÊNCIA VIA DASHBOARD) ---

export async function seedDatabase() {
  try {
    const count = await prisma.member.count();
    if (count > 0) return; // Se já tem gente, não faz nada

    const passwordHash = await bcrypt.hash("123456", 10);

    const dummyMembers = [
      { name: "Hashire", tag: "#P0283", role: Role.COLIDER },
      { name: "Luixz", tag: "#Q9921", role: Role.LIDER },
      { name: "SpartaBR", tag: "#B3344", role: Role.COLIDER },
      { name: "MestreLendario", tag: "#L9988", role: Role.ANCIAO },
      { name: "Novato123", tag: "#C5566", role: Role.MEMBRO },
    ];

    // Configuração Global (Se ainda usar)
    await prisma.config.upsert({
      where: { id: "global_config" },
      update: {},
      create: {
        id: "global_config",
        ticketPrice: 2.00,
        skinGoal: 44.90
      }
    });

    // Cria Membros
    for (const m of dummyMembers) {
      await prisma.member.create({
        data: {
          name: m.name,
          tag: m.tag,
          role: m.role,
          password: passwordHash,
          warStatus: WarPreference.IN,
          // tickets: m.tickets, <--- REMOVIDO
          // lastPayment: ... <--- REMOVIDO
          thLevel: 12,
          lastSeen: new Date()
        }
      });
    }
    
    await createLog("SISTEMA", "Banco de dados populado com dados de teste via Painel.", undefined);
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Erro no seed:", error);
  }
}