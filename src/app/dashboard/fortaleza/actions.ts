"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getLayouts() {
  try {
    return await prisma.layout.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (error) {
    return [];
  }
}

export async function createLayout(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const thLevel = parseInt(formData.get("thLevel") as string);
    const type = formData.get("type") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const link = formData.get("link") as string;

    await prisma.layout.create({
      data: { name, description, thLevel, type, imageUrl, link }
    });

    revalidatePath("/dashboard/fortaleza");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function deleteLayout(id: string) {
  try {
    await prisma.layout.delete({ where: { id } });
    revalidatePath("/dashboard/fortaleza");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}