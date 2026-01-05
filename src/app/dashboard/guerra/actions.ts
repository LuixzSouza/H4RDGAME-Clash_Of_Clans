"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Iniciar nova guerra
export async function startWar(formData: FormData) {
  const opponent = formData.get("opponent") as string;
  const size = parseInt(formData.get("size") as string);
  const isLeague = formData.get("isLeague") === "on";
  
  await prisma.war.updateMany({
    where: { isActive: true },
    data: { isActive: false }
  });

  await prisma.war.create({
    data: {
      opponentName: opponent,
      size: size,
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      isActive: true,
      isLeague: isLeague
    }
  });
  
  revalidatePath("/dashboard/guerra");
  return { success: true };
}

export async function getActiveWar() {
  return await prisma.war.findFirst({
    where: { isActive: true },
    include: {
      attacks: {
        include: { member: { select: { name: true, tag: true, thLevel: true } } }
      }
    }
  });
}

export async function registerAttack(formData: FormData) {
  const warId = formData.get("warId") as string;
  const memberId = formData.get("memberId") as string;
  const attackNumber = parseInt(formData.get("attackNumber") as string);
  const stars = parseInt(formData.get("stars") as string);
  const destruction = parseInt(formData.get("destruction") as string);
  const target = formData.get("target") as string;
  const notes = formData.get("notes") as string;

  await prisma.attack.create({
    data: { warId, memberId, attackNumber, stars, destruction, target, notes }
  });

  revalidatePath("/dashboard/guerra");
  return { success: true };
}

export async function endWar(formData: FormData) {
  const warId = formData.get("warId") as string;
  const result = formData.get("result") as string;
  const score = formData.get("score") as string;

  try {
    await prisma.war.update({
      where: { id: warId },
      data: { isActive: false, result, score, endDate: new Date() }
    });
    revalidatePath("/dashboard/guerra");
    return { success: true };
  } catch (error) {
    console.error("Erro ao finalizar guerra:", error);
    return { success: false };
  }
}

export async function getWarHistory() {
  try {
    return await prisma.war.findMany({
      where: { isActive: false },
      orderBy: { endDate: 'desc' },
      take: 20,
      include: {
        attacks: { select: { stars: true, destruction: true } }
      }
    });
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    return [];
  }
}