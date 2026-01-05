import { Shield } from "lucide-react";

export function TableEmptyState() {
  return (
    <div className="rounded-xl border border-[#2f3245] bg-[#1e202b] p-12 flex flex-col items-center justify-center text-slate-500">
      <Shield className="w-12 h-12 mb-4 opacity-20" />
      <p>Nenhum guerreiro encontrado.</p>
    </div>
  );
}