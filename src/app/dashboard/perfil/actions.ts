"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { createLog } from "@/app/actions";

export async function changePassword(formData: FormData) {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  
  const cookieStore = await cookies();
  const userId = cookieStore.get("h4rdgame_session")?.value;

  if (!userId) return { success: false, message: "Sessão inválida." };

  try {
    const member = await prisma.member.findUnique({ where: { id: userId } });
    if (!member) return { success: false, message: "Usuário não encontrado." };

    const passwordMatch = await bcrypt.compare(currentPassword, member.password);
    if (!passwordMatch) {
      return { success: false, message: "A senha atual está incorreta." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.member.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    await createLog("SEGURANCA", `${member.name} alterou sua senha de acesso.`, member.id);
    
    return { success: true, message: "Senha alterada com sucesso!" };

  } catch (error) {
    console.error(error);
    return { success: false, message: "Erro ao atualizar senha." };
  }
}

export async function updateAvatar(formData: FormData) {
  const seed = formData.get("seed") as string;
  const cookieStore = await cookies();
  const userId = cookieStore.get("h4rdgame_session")?.value;

  if (!userId) return { success: false };

  try {
    await prisma.member.update({
      where: { id: userId },
      data: { avatarSeed: seed }
    });
    
    revalidatePath("/dashboard", "layout"); 
    return { success: true };
  } catch (error) {
    console.error("ERRO AO SALVAR AVATAR:", error); 
    return { success: false };
  }
}