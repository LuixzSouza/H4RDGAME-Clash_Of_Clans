import { Shield, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WarStatusBadgeProps {
  status: string;
}

export function WarStatusBadge({ status }: WarStatusBadgeProps) {
  if (status === 'IN') {
    return (
      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20 gap-1.5 px-2">
        <Shield className="w-3 h-3 fill-current"/> <span className="text-[10px] font-bold">IN</span>
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="border-red-500/20 text-red-500 gap-1.5 opacity-50 bg-transparent">
      <ShieldAlert className="w-3 h-3"/> <span className="text-[10px] font-bold">OUT</span>
    </Badge>
  );
}

interface ActivityBadgeProps {
  daysOff: number;
}

export function ActivityBadge({ daysOff }: ActivityBadgeProps) {
  const isInactive = daysOff >= 5;
  
  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${
      daysOff === 0 
        ? 'text-emerald-400 bg-emerald-500/5' 
        : isInactive ? 'text-red-400 bg-red-500/5' : 'text-slate-400'
    }`}>
      <div className={`w-1.5 h-1.5 rounded-full ${daysOff === 0 ? 'bg-emerald-500 animate-pulse' : isInactive ? 'bg-red-500' : 'bg-slate-500'}`} />
      {daysOff === 0 ? "Online" : `${daysOff}d off`}
    </div>
  );
}