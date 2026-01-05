import { MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function Welcome() {
  return (
    <section id="sobre" className="py-20 bg-[#12141c] border-y border-white/5 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
            
            <div className="mb-8 flex justify-center">
                <div className="h-16 w-16 bg-[#1a1c26] rounded-2xl border-2 border-[#2f3245] flex items-center justify-center shadow-xl rotate-3">
                    <MessageCircle className="w-8 h-8 text-blue-400" />
                </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-heading text-white mb-8">
                Bem-Vindos ao Clã! 🎉
            </h2>

            <Card className="bg-[#1a1b26] border-2 border-[#2f3245] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
                <CardContent className="p-8 md:p-10 text-slate-300 text-lg leading-relaxed font-medium">
                    <p className="mb-6">
                        É com alegria que recebemos todos vocês neste grupo. Juntos, vamos enfrentar desafios, conquistar vitórias e nos divertir muito.
                    </p>
                    <p className="mb-6">
                        A cooperação e o trabalho em equipe são fundamentais para o sucesso do nosso clã. Compartilhem suas experiências, aprendam uns com os outros e construam amizades duradouras.
                    </p>
                    <p className="text-white font-bold text-xl italic">
                        &quot;Que nossa jornada seja épica! Avante, guerreiros!&quot; 🛡️⚔️
                    </p>
                </CardContent>
            </Card>

        </div>
      </div>
    </section>
  );
}