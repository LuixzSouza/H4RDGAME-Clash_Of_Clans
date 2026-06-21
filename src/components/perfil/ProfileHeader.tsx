import { User } from "lucide-react";

export function ProfileHeader() {
  return (
    <div className="flex flex-col space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md flex items-center gap-3">
            <User className="w-8 h-8 text-primary" />
            Altar do Herói
        </h1>
        <p className="text-muted-foreground font-medium">
          Personalize sua identidade e proteja seu quartel.
        </p>
    </div>
  );
}