import "server-only";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "h4rdgame_session";
const ADMIN_ROLES = ["LIDER", "COLIDER"] as const;

export type SessionUser = {
  id: string;
  name: string;
  role: string;
  tag: string;
  isActive: boolean;
};

/**
 * Retorna o usuário logado (a partir do cookie de sessão) ou null.
 * Use em leituras opcionais. Para proteger mutações, prefira requireAuth/requireAdmin.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const id = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!id) return null;

  try {
    const user = await prisma.member.findUnique({
      where: { id },
      select: { id: true, name: true, role: true, tag: true, isActive: true },
    });
    return user;
  } catch {
    return null;
  }
}

/** Garante que há um usuário ativo logado. Lança erro caso contrário. */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user || !user.isActive) {
    throw new Error("NAO_AUTENTICADO");
  }
  return user;
}

/** Garante que o usuário logado é LÍDER ou COLÍDER. Lança erro caso contrário. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireAuth();
  if (!ADMIN_ROLES.includes(user.role as (typeof ADMIN_ROLES)[number])) {
    throw new Error("NAO_AUTORIZADO");
  }
  return user;
}
