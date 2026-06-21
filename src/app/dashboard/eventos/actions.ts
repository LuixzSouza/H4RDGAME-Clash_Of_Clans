"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createLog } from "@/app/actions";
import { requireAdmin, requireAuth } from "@/lib/auth";

export async function getEvents() {
  try {
    await requireAuth();
    return await prisma.event.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return [];
  }
}

export async function createEvent(formData: FormData) {
  try {
    await requireAdmin();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const type = formData.get("type") as string;
    const dateDisplay = new Date().toLocaleDateString('pt-BR');

    await prisma.event.create({
      data: { title, description, type, date: dateDisplay }
    });

    await createLog("SISTEMA", `Novo evento criado: ${title}`);
    revalidatePath("/dashboard/eventos");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    return { success: false };
  }
}

export async function deleteEvent(id: string) {
  try {
    await requireAdmin();
    await prisma.event.delete({ where: { id } });
    revalidatePath("/dashboard/eventos");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar evento:", error);
    return { success: false };
  }
}