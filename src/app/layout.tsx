import type { Metadata } from "next";
import { Titan_One, Nunito } from "next/font/google";
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
  title: "H4RD G4ME - Clash Manager",
  description: "Painel de Gerenciamento do Clã H4RD G4ME",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${fontHeading.variable} ${fontBody.variable} antialiased font-body bg-slate-950 text-white`}
      >
        {children}
      </body>
    </html>
  );
}