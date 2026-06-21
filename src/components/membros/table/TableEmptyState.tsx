import { Shield } from "lucide-react";

export function TableEmptyState() {
  return (
    <div className="rounded-xl border border-border bg-card p-12 flex flex-col items-center justify-center text-muted-foreground">
      <Shield className="w-12 h-12 mb-4 opacity-20" />
      <p>Nenhum guerreiro encontrado.</p>
    </div>
  );
}