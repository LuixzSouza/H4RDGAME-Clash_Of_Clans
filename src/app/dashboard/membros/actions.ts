"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { Role, WarPreference, Prisma } from "@prisma/client";
import { fetchClanData } from "@/lib/coc"; 
import { createLog } from "@/app/actions"; 

// --- UTILS LOCAIS ---
function mapRole(role: string): Role {
  switch (role) {
    case "Líder": return Role.LIDER;
    case "Colíder": return Role.COLIDER;
    case "Ancião": return Role.ANCIAO;
    default: return Role.MEMBRO;
  }
}

function mapCocRoleToEnum(cocRole: string): Role {
  switch (cocRole) {
    case "leader": return Role.LIDER;
    case "coLeader": return Role.COLIDER;
    case "admin": return Role.ANCIAO;
    case "member": return Role.MEMBRO;
    default: return Role.MEMBRO;
  }
}

// --- LEITURA ---
export async function getMembers() {
  try {
    return await prisma.member.findMany({
      orderBy: [{ role: 'asc' }, { name: 'asc' }]
    });
  } catch (error) {
    console.error("Erro ao buscar membros:", error);
    return [];
  }
}

// --- CRIAÇÃO (RECRUTAMENTO) ---
export async function createMember(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const tag = formData.get("tag") as string;
    const roleString = formData.get("role") as string;
    const rawPassword = formData.get("password") as string;
    const phone = formData.get("phone") as string;

    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    const roleEnum = mapRole(roleString);

    const newMember = await prisma.member.create({
      data: {
        name, 
        tag: tag.toUpperCase(), 
        role: roleEnum, 
        password: hashedPassword,
        phone: phone || null,
        warStatus: WarPreference.IN, 
        // tickets: 0, <--- REMOVIDO AQUI
        thLevel: 1,
        lastSeen: new Date() // Novo membro = Online agora
      },
    });

    await createLog("RECRUTAMENTO", `Novo guerreiro recrutado: ${name}`, newMember.id);
    revalidatePath("/dashboard/membros");
  } catch (error) {
    console.error("Erro ao criar membro:", error);
  }
}

// --- EDIÇÃO (DADOS + CARGO) ---
export async function updateMember(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const roleString = formData.get("role") as string;
  const thLevel = parseInt(formData.get("thLevel") as string);
  const warStatusRaw = formData.get("warStatus") as string;
  const phone = formData.get("phone") as string; 

  const warStatus = warStatusRaw === "IN" ? WarPreference.IN : WarPreference.OUT;
  const roleEnum = mapRole(roleString);

  try {
    // 1. Busca o membro atual para verificações de segurança
    const currentMember = await prisma.member.findUnique({ where: { id } });

    if (!currentMember) return { success: false, message: "Membro não encontrado" };

    // 2. PROTEÇÃO DE ADMIN SUPREMO (Evita perder acesso)
    let finalRole = roleEnum;
    
    if (currentMember.tag === '#ADMIN') { 
        finalRole = Role.LIDER;
    }

    await prisma.member.update({
      where: { id },
      data: { 
          name, 
          role: finalRole, 
          thLevel, 
          warStatus,
          phone: phone || null 
      }
    });
    
    revalidatePath("/dashboard/membros");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    return { success: false };
  }
}

// --- EXCLUSÃO ---
export async function deleteMember(id: string) {
  try {
    const member = await prisma.member.findUnique({ where: { id } });
    if (member) {
      await prisma.member.delete({ where: { id } });
      await createLog("EXPULSAO", `${member.name} foi removido do clã.`);
    }
    revalidatePath("/dashboard/membros");
  } catch (error) {
    console.error("Erro ao excluir membro:", error);
  }
}

// --- TOGGLE RÁPIDO DE GUERRA ---
export async function toggleWarStatus(id: string) {
  try {
    const member = await prisma.member.findUnique({ where: { id } });
    if (!member) return;

    const newStatus = member.warStatus === WarPreference.IN ? WarPreference.OUT : WarPreference.IN;

    await prisma.member.update({
      where: { id },
      data: { warStatus: newStatus },
    });

    if (newStatus === WarPreference.OUT) {
      await createLog("GUERRA", `${member.name} colocou escudo vermelho (OUT).`, member.id);
    }

    revalidatePath("/dashboard/guerra");
    revalidatePath("/dashboard/membros");
  } catch (error) {
    console.error("Erro ao mudar status de guerra:", error);
  }
}

// --- MANUAL: MARCAR COMO VISTO ---
export async function markAsSeen(id: string) {
    try {
        await prisma.member.update({
            where: { id },
            data: { lastSeen: new Date() }
        });
        revalidatePath("/dashboard/membros");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

// --- SINCRONIZAÇÃO COM API (INTELIGENTE) ---
export async function syncWithGame() {
  try {
    const clanData = await fetchClanData();
    if (!clanData || !clanData.memberList) throw new Error("Dados inválidos da API.");

    const activeTags = new Set<string>();
    const defaultPasswordHash = await bcrypt.hash("h4rdgame2025", 10);

    for (const member of clanData.memberList) {
      activeTags.add(member.tag);
      
      // --- DETECÇÃO DE ATIVIDADE ---
      const hasLeague = member.league && member.league.id && member.league.name !== "Unranked";
      const hasActivity = 
          member.attackWins > 0 ||          
          member.versusBattleWins > 0 ||    
          member.donations > 0 ||           
          member.donationsReceived > 0;     

      const isActiveInGame = hasLeague || hasActivity;

      const updateData: Prisma.MemberUpdateInput = {
        name: member.name,
        role: mapCocRoleToEnum(member.role),
        thLevel: member.townHallLevel,
        isActive: true,
      };

      if (isActiveInGame) {
        updateData.lastSeen = new Date();
      }

      await prisma.member.upsert({
        where: { tag: member.tag },
        update: updateData,
        create: {
          name: member.name, 
          tag: member.tag,
          role: mapCocRoleToEnum(member.role),
          thLevel: member.townHallLevel,
          password: defaultPasswordHash,
          warStatus: WarPreference.IN, 
          // tickets: 0, <--- REMOVIDO AQUI TAMBÉM
          isActive: true,
          lastSeen: new Date()
        }
      });
    }

    // Desativa quem saiu do clã
    await prisma.member.updateMany({
      where: { tag: { notIn: Array.from(activeTags) }, isActive: true },
      data: { isActive: false }
    });

    await createLog("SISTEMA", "Sincronização realizada com sucesso.");
    revalidatePath("/dashboard/membros");
    return { success: true };

  } catch (error) {
    console.error("ERRO CRÍTICO NA API:", error);
    throw new Error("Falha ao conectar com a Supercell API.");
  }
}