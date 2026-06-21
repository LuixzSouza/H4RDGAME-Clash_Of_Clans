"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin, requireAuth } from "@/lib/auth";

export async function getStrategies() {
  try {
    await requireAuth();
    return await prisma.strategy.findMany({ orderBy: { thLevel: 'desc' } });
  } catch (error) {
    return [];
  }
}

export async function createStrategy(formData: FormData) {
  try {
    await requireAdmin();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const thLevel = parseInt(formData.get("thLevel") as string);
    const difficulty = formData.get("difficulty") as string;
    const videoUrl = formData.get("videoUrl") as string;
    const army = formData.get("army") as string;

    await prisma.strategy.create({
      data: { title, description, thLevel, difficulty, videoUrl, army }
    });

    revalidatePath("/dashboard/laboratorio");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function deleteStrategy(id: string) {
  try {
    await requireAdmin();
    await prisma.strategy.delete({ where: { id } });
    revalidatePath("/dashboard/laboratorio");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}