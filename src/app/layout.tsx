import type { Metadata } from "next";
import { Titan_One, Nunito } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

// Fonte para Títulos (Parecida com a do Logo do Clash)
const fontHeading = Titan_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
});

// Fonte para Textos (Arredondada e legível)
const fontBody = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "H4RD G4ME · Clash Manager",
    template: "%s · H4RD G4ME",
  },
  description:
    "Painel oficial do clã H4RD G4ME de Clash of Clans: guerras organizadas, tesouraria, biblioteca de layouts, estratégias e gestão de membros.",
  applicationName: "H4RD G4ME",
  keywords: ["Clash of Clans", "clã", "H4RD G4ME", "guerra", "CWL", "layouts", "estratégias"],
  authors: [{ name: "Luixz", url: "https://luixzsouza.com.br" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "H4RD G4ME",
    title: "H4RD G4ME · Clash Manager",
    description:
      "Estratégia, união e guerra total. O painel oficial do clã H4RD G4ME de Clash of Clans.",
  },
  twitter: {
    card: "summary_large_image",
    title: "H4RD G4ME · Clash Manager",
    description:
      "Estratégia, união e guerra total. O painel oficial do clã H4RD G4ME de Clash of Clans.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${fontHeading.variable} ${fontBody.variable} antialiased font-body bg-background text-foreground`}
      >
        {children}
        <Toaster richColors position="top-center" theme="dark" toastOptions={{ style: { fontFamily: "var(--font-body)" } }} />
      </body>
    </html>
  );
}