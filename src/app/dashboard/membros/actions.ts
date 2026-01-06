"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { Role, WarPreference, Prisma } from "@prisma/client";
import { fetchClanData } from "@/lib/coc"; 
import { createLog } from "@/app/actions"; 

// --- UTILS LOCAIS (CORRIGIDO E MAIS ROBUSTO) ---
// Agora aceita "LIDER", "Líder", "lider", etc.
function mapRole(role: string): Role {
  if (!role) return Role.MEMBRO;
  
  const normalized = role.toUpperCase().trim();

  // Verifica variações comuns
  if (['LIDER', 'LÍDER', 'LEADER'].includes(normalized)) return Role.LIDER;
  if (['COLIDER', 'COLÍDER', 'COLEADER', 'CO-LEADER'].includes(normalized)) return Role.COLIDER;
  if (['ANCIAO', 'ANCIÃO', 'ELDER', 'ADMIN'].includes(normalized)) return Role.ANCIAO;
  
  return Role.MEMBRO;
}

function mapCocRoleToEnum(cocRole: string): Role {
  if (!cocRole) return Role.MEMBRO;
  
  const normalized = cocRole.toLowerCase().trim();
  
  switch (normalized) {
    case "leader": return Role.LIDER;
    case "coleader": return Role.COLIDER;
    case "admin": return Role.ANCIAO; // No Clash API, "admin" = Ancião
    case "member": return Role.MEMBRO;
    default: return Role.MEMBRO;
  }
}

// --- LEITURA ---
export async function getMembers() {
  try {
    return await prisma.member.findMany({
      orderBy: [
        { role: 'asc' }, // LIDER vem primeiro no enum por padrão se definido assim, senão ordene por peso customizado
        { name: 'asc' }
      ]
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

    // Se a senha vier vazia, define uma padrão
    const passwordToHash = rawPassword || "h4rdgame2025";
    const hashedPassword = await bcrypt.hash(passwordToHash, 10);
    
    // Mapeamento robusto
    const roleEnum = mapRole(roleString);

    const newMember = await prisma.member.create({
      data: {
        name, 
        tag: tag.toUpperCase(), 
        role: roleEnum, 
        password: hashedPassword,
        phone: phone || null,
        warStatus: WarPreference.IN, 
        thLevel: 1, // Padrão, depois atualiza com API
        lastSeen: new Date()
      },
    });

    await createLog("RECRUTAMENTO", `Novo guerreiro recrutado: ${name} como ${roleEnum}`, newMember.id);
    revalidatePath("/dashboard/membros");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar membro:", error);
    return { success: false, error: "Erro ao criar membro" };
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
  
  // Aqui estava o erro provável: mapRole retornava MEMBRO se a string não fosse exata
  const roleEnum = mapRole(roleString);

  console.log(`[UPDATE] Atualizando ${name}. Cargo recebido: ${roleString} -> Convertido: ${roleEnum}`);

  try {
    const currentMember = await prisma.member.findUnique({ where: { id } });

    if (!currentMember) return { success: false, message: "Membro não encontrado" };

    // PROTEÇÃO DE ADMIN SUPREMO
    let finalRole = roleEnum;
    if (currentMember.tag === '#ADMIN' || currentMember.tag === '#2G0') { 
        console.log("[PROTECT] Tentativa de alterar Admin Supremo bloqueada. Mantendo LIDER.");
        finalRole = Role.LIDER;
    }

    await prisma.member.update({
      where: { id },
      data: { 
          name, 
          role: finalRole, 
          thLevel: isNaN(thLevel) ? currentMember.thLevel : thLevel, 
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
    if (!member) return;

    // Proteção extra: Não deletar o Admin principal via sistema
    if (member.tag === '#ADMIN') {
        console.warn("Tentativa de deletar ADMIN bloqueada.");
        return;
    }

    await prisma.member.delete({ where: { id } });
    await createLog("EXPULSAO", `${member.name} foi removido do clã.`);
    
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

// --- SINCRONIZAÇÃO COM API ---
export async function syncWithGame() {
  try {
    const clanData = await fetchClanData();
    if (!clanData || !clanData.memberList) throw new Error("Dados inválidos da API.");

    const activeTags = new Set<string>();
    const defaultPasswordHash = await bcrypt.hash("h4rdgame2025", 10);

    for (const member of clanData.memberList) {
      activeTags.add(member.tag);
      
      const hasLeague = member.league && member.league.id && member.league.name !== "Unranked";
      const hasActivity = 
          member.attackWins > 0 ||          
          member.versusBattleWins > 0 ||    
          member.donations > 0 ||           
          member.donationsReceived > 0;     

      const isActiveInGame = hasLeague || hasActivity;

      // Importante: mapCocRoleToEnum garante que o cargo venha certo da API
      const newRole = mapCocRoleToEnum(member.role);

      const updateData: Prisma.MemberUpdateInput = {
        name: member.name,
        role: newRole,
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
          role: newRole,
          thLevel: member.townHallLevel,
          password: defaultPasswordHash,
          warStatus: WarPreference.IN, 
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
    // Não lança erro para não quebrar a UI inteira, apenas loga
    return { success: false, error: "Falha na API Supercell" };
  }
}