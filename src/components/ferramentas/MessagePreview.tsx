import { MessageSquare, Check, Copy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MessagePreviewProps {
  generatedText: string;
  onCopy: () => void;
  copied: boolean;
}

export function MessagePreview({ generatedText, onCopy, copied }: MessagePreviewProps) {
  return (
    <Card className="card-clash flex flex-col h-full bg-[#1e202b] border-[#2f3245]">
      <CardHeader className="bg-[#1a1b26] border-b border-[#2f3245] pb-4">
        <CardTitle className="flex items-center gap-2 text-white">
          <MessageSquare className="w-5 h-5 text-green-500" />
          Pré-visualização
        </CardTitle>
        <CardDescription className="text-slate-500">
          Simulação de como ficará no WhatsApp.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow p-6 bg-[#0c1216] relative min-h-[300px]">
         {/* Fundo simulando WhatsApp Dark */}
        <div className="absolute inset-0 bg-[#0b141a] opacity-50 z-0"></div>
        
        <div className="relative z-10 flex flex-col items-start w-full">
            {/* Balão de Mensagem */}
            <div className="bg-[#202c33] p-4 rounded-lg rounded-tl-none shadow-md text-[#e9edef] text-[15px] leading-relaxed max-w-[90%] border border-[#2f3245]/50">
                <p className="whitespace-pre-wrap font-sans">{generatedText}</p>
                <div className="flex justify-end items-center gap-1 mt-2 opacity-60">
                    <span className="text-[11px] text-[#8696a0]">Agora</span>
                    <Check className="w-4 h-4 text-[#53bdeb]" />
                </div>
            </div>
        </div>
      </CardContent>

      <CardFooter className="bg-[#1a1b26] border-t border-[#2f3245] p-4">
        <Button 
          className="btn-clash-green w-full h-14 text-lg gap-2 shadow-xl hover:scale-[1.02] transition-transform" 
          onClick={onCopy}
        >
          {copied ? (
            <>
              <Check className="w-6 h-6" /> Texto Copiado!
            </>
          ) : (
            <>
              <Copy className="w-6 h-6" /> Copiar para WhatsApp
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}