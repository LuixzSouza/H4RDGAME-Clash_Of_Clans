"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createLog } from "@/app/actions";
import { requireAdmin, requireAuth } from "@/lib/auth";

// --- CRUD DE EVENTOS ---

// 1. CRIAR
export async function createFinanceEvent(formData: FormData) {
  await requireAdmin();
  const title = formData.get("title") as string;
  const ticketPrice = parseFloat(formData.get("ticketPrice") as string);
  const goalAmount = parseFloat(formData.get("goalAmount") as string) || 0;

  try {
    const event = await prisma.financeEvent.create({
      data: { title, ticketPrice, goalAmount }
    });
    
    // Passamos undefined ao invés de null para o memberId opcional
    await createLog("FINANCEIRO", `Novo evento criado: ${title}`, undefined); 
    revalidatePath("/dashboard/financeiro");
    return { success: true, event };
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    return { success: false };
  }
}

// 2. LER (LISTAR)
export async function getFinanceEvents() {
  try {
    await requireAuth();
    const events = await prisma.financeEvent.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        participations: {
            include: {
              member: {
                select: {
                  id: true, name: true, tag: true, avatarSeed: true, phone: true,
                  lastSeen: true, role: true, thLevel: true, warStatus: true,
                  strikes: true, isActive: true, createdAt: true, updatedAt: true,
                },
              },
            },
            orderBy: { updatedAt: 'desc' }
        }
      }
    });
    return events;
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return [];
  }
}

// 3. ATUALIZAR (EDITAR DADOS)
export async function updateFinanceEvent(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const ticketPrice = parseFloat(formData.get("ticketPrice") as string);
  const goalAmount = parseFloat(formData.get("goalAmount") as string) || 0;

  try {
    await prisma.financeEvent.update({
      where: { id },
      data: { title, ticketPrice, goalAmount }
    });

    await createLog("FINANCEIRO", `Evento atualizado: ${title}`, undefined);
    revalidatePath("/dashboard/financeiro");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    return { success: false };
  }
}

// 4. DELETAR (EXCLUIR)
export async function deleteFinanceEvent(id: string) {
  try {
    await requireAdmin();
    const event = await prisma.financeEvent.findUnique({ where: { id } });
    if (!event) return { success: false, message: "Evento não encontrado" };

    await prisma.financeEvent.delete({ where: { id } });

    await createLog("FINANCEIRO", `Evento excluído: ${event.title}`, undefined);
    revalidatePath("/dashboard/financeiro");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar evento:", error);
    return { success: false };
  }
}

// 5. ALTERAR STATUS (ARQUIVAR/REABRIR)
export async function toggleEventStatus(id: string) {
    try {
        await requireAdmin();
        const event = await prisma.financeEvent.findUnique({ where: { id } });
        if (!event) return;
        
        const newStatus = event.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
        await prisma.financeEvent.update({
            where: { id },
            data: { status: newStatus }
        });

        const actionText = newStatus === 'CLOSED' ? "arquivado" : "reaberto";
        await createLog("FINANCEIRO", `Evento ${event.title} foi ${actionText}.`, undefined);
        
        revalidatePath("/dashboard/financeiro");
    } catch (error) {
        console.error("Erro ao alternar status:", error);
    }
}

// --- GESTÃO DE PARTICIPAÇÃO (COTAS) ---

export async function addParticipation(eventId: string, memberId: string) {
  try {
    await requireAdmin();
    // 1. Busca evento para saber preço
    const event = await prisma.financeEvent.findUnique({ where: { id: eventId } });
    if (!event) return;

    // 2. Verifica se membro já participa
    const participation = await prisma.eventParticipation.findUnique({
      where: { eventId_memberId: { eventId, memberId } }
    });

    if (participation) {
      // Já existe -> +1 Cota
      await prisma.eventParticipation.update({
        where: { id: participation.id },
        data: { tickets: { increment: 1 } }
      });
    } else {
      // Não existe -> Cria com 1 Cota
      await prisma.eventParticipation.create({
        data: { eventId, memberId, tickets: 1 }
      });
    }

    // 3. Registra no Histórico Geral (Para auditoria financeira)
    await prisma.paymentHistory.create({
        data: {
            memberId,
            amount: event.ticketPrice,
            tickets: 1,
            financeEventId: eventId
        }
    });

    // 4. Log
    const member = await prisma.member.findUnique({ where: { id: memberId } });
    await createLog("PAGAMENTO", `${member?.name} comprou +1 cota em ${event.title}`, memberId);

    revalidatePath("/dashboard/financeiro");
  } catch (error) {
    console.error("Erro ao adicionar participação:", error);
  }
}

export async function removeParticipation(eventId: string, memberId: string) {
  try {
    await requireAdmin();
    const participation = await prisma.eventParticipation.findUnique({
      where: { eventId_memberId: { eventId, memberId } },
      include: { member: true, event: true }
    });

    if (!participation) return;

    if (participation.tickets > 1) {
      // Decrementa
      await prisma.eventParticipation.update({
        where: { id: participation.id },
        data: { tickets: { decrement: 1 } }
      });
      await createLog("CORRECAO", `${participation.member.name} teve 1 cota removida de ${participation.event.title}`, memberId);
    } else {
      // Remove da lista se zerar
      await prisma.eventParticipation.delete({
        where: { id: participation.id }
      });
      await createLog("CORRECAO", `${participation.member.name} foi removido de ${participation.event.title}`, memberId);
    }
    revalidatePath("/dashboard/financeiro");
  } catch (error) {
    console.error("Erro ao remover participação:", error);
  }
}