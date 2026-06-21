import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protege todas as rotas do painel: sem cookie de sessão -> redireciona ao login.
// A autorização real (cargo) é feita nas server actions via requireAdmin().
// (Convenção "proxy" do Next 16, substitui o antigo "middleware".)
export function proxy(req: NextRequest) {
  const hasSession = Boolean(req.cookies.get("h4rdgame_session")?.value);

  if (!hasSession) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
