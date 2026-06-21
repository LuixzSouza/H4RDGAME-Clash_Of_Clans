import { Shield, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WarStatusBadgeProps {
  status: string;
}

export function WarStatusBadge({ status }: WarStatusBadgeProps) {
  if (status === 'IN') {
    return (
      <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20 gap-1.5 px-2">
        <Shield className="w-3 h-3 fill-current"/> <span className="text-[10px] font-bold">IN</span>
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="border-destructive/20 text-destructive gap-1.5 opacity-50 bg-transparent">
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
        ? 'text-success bg-success/5'
        : isInactive ? 'text-destructive bg-destructive/5' : 'text-muted-foreground'
    }`}>
      <div className={`w-1.5 h-1.5 rounded-full ${daysOff === 0 ? 'bg-success animate-pulse' : isInactive ? 'bg-destructive' : 'bg-muted-foreground'}`} />
      {daysOff === 0 ? "Online" : `${daysOff}d off`}
    </div>
  );
}