import Link from "next/link";
import { Swords, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface QuickLinksProps {
  isAdmin: boolean;
}

export function QuickLinks({ isAdmin }: QuickLinksProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/dashboard/guerra" className="group block">
            <Card className="bg-[#1a1b26] border-2 border-[#2f3245] hover:border-red-500 transition-all cursor-pointer h-full shadow-lg hover:shadow-red-900/20">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-white font-bold text-lg group-hover:text-red-400 transition-colors">Sala de Guerra</h3>
                        <p className="text-slate-500 text-xs mt-1">
                            {isAdmin ? "Gerenciar lista de presença" : "Verificar escalação"}
                        </p>
                    </div>
                    <div className="h-12 w-12 bg-[#2b1616] rounded-full flex items-center justify-center border border-[#4a2020] group-hover:scale-110 transition-transform shadow-lg">
                        <Swords className="text-red-500 w-6 h-6" />
                    </div>
                </CardContent>
            </Card>
        </Link>

        <Link href="/dashboard/financeiro" className="group block">
            <Card className="bg-[#1a1b26] border-2 border-[#2f3245] hover:border-green-500 transition-all cursor-pointer h-full shadow-lg hover:shadow-green-900/20">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-white font-bold text-lg group-hover:text-green-400 transition-colors">Cofre do Clã</h3>
                        <p className="text-slate-500 text-xs mt-1">
                            {isAdmin ? "Baixa de pagamentos" : "Comprar cotas da Skin"}
                        </p>
                    </div>
                    <div className="h-12 w-12 bg-[#1e2420] rounded-full flex items-center justify-center border border-[#253825] group-hover:scale-110 transition-transform shadow-lg">
                        <Wallet className="text-green-500 w-6 h-6" />
                    </div>
                </CardContent>
            </Card>
        </Link>
    </div>
  );
}