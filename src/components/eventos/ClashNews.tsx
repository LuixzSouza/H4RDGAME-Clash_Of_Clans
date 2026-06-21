import { Newspaper, Youtube, MessageCircle, ExternalLink, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const NEWS = [
  {
    id: 1,
    title: "Atualização de Balanceamento",
    category: "Update",
    date: "Há 2 horas",
    image: "https://placehold.co/600x300/1a1b26/FFF?text=Balance+Changes",
    preview: "Nerfs no Dragão Elétrico e buff nas Valquírias. Confira o patch note completo."
  },
  {
    id: 2,
    title: "Sneak Peek: Nova Tropa!",
    category: "Leak",
    date: "Ontem",
    image: "https://placehold.co/600x300/2f3245/FFF?text=Nova+Tropa",
    preview: "Rumores indicam uma tropa aérea focada em defesas. Será o fim das Infernos?"
  }
];

export function ClashNews() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
       
       {/* Seção de Notícias (Carrossel / Lista) */}
       <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
             <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-primary"/> Clash News
             </h3>
             <Button variant="link" className="text-primary text-xs h-auto p-0">Ver tudo</Button>
          </div>
          
          <div className="grid gap-4">
             {NEWS.map(n => (
                 <div key={n.id} className="group relative panel-clash overflow-hidden hover:border-primary/50 transition-all cursor-pointer flex flex-col sm:flex-row">
                    <div className="sm:w-48 h-32 bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${n.image})` }}>
                        <div className="w-full h-full bg-black/20 group-hover:bg-transparent transition-all"/>
                    </div>
                    <div className="p-4 flex flex-col justify-center flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <Badge variant="secondary" className="bg-primary/30 text-primary border-primary text-[10px] h-5">{n.category}</Badge>
                            <span className="text-[10px] text-muted-foreground">{n.date}</span>
                        </div>
                        <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors leading-tight">{n.title}</h4>
                        <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{n.preview}</p>
                    </div>
                    <div className="hidden sm:flex items-center pr-4 text-muted-foreground group-hover:text-white transition-colors">
                        <ChevronRight />
                    </div>
                 </div>
             ))}
          </div>
       </div>

       {/* Links Rápidos e Comunidade */}
       <div className="space-y-4">
           <h3 className="text-lg font-bold text-white flex items-center gap-2 px-1">
              Links Rápidos
           </h3>
           <div className="grid gap-3">
              <a href="https://www.clashofclans-layouts.com/" target="_blank" className="flex items-center gap-4 panel-clash p-4 hover:bg-accent hover:border-primary/50 transition-all group">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                      <ExternalLink className="w-5 h-5" />
                  </div>
                  <div>
                      <p className="text-sm font-bold text-white">Layouts Meta</p>
                      <p className="text-xs text-muted-foreground">Copie bases de guerra</p>
                  </div>
              </a>

              <a href="#" className="flex items-center gap-4 panel-clash p-4 hover:bg-accent hover:border-destructive/50 transition-all group">
                  <div className="bg-destructive/10 p-2 rounded-lg text-destructive group-hover:bg-destructive group-hover:text-white transition-colors">
                      <Youtube className="w-5 h-5" />
                  </div>
                  <div>
                      <p className="text-sm font-bold text-white">Tutoriais</p>
                      <p className="text-xs text-muted-foreground">Aprenda estratégias</p>
                  </div>
              </a>

              <a href="#" className="flex items-center gap-4 panel-clash p-4 hover:bg-accent hover:border-primary/50 transition-all group">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                      <p className="text-sm font-bold text-white">Discord Oficial</p>
                      <p className="text-xs text-muted-foreground">Chat de voz e avisos</p>
                  </div>
              </a>
           </div>
       </div>
    </div>
  );
}