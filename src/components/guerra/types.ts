// --- ENUMS & UNION TYPES (Valores Fixos) ---
export type WarResult = "win" | "loss" | "draw" | null;
export type WarParticipation = "IN" | "OUT";
export type ClanRole = "LIDER" | "COLIDER" | "ANCIAO" | "MEMBRO";

// --- ATAQUE ---
export type AttackData = {
  id: string;
  memberId: string;
  warId: string;
  attackNumber: number; // 1 ou 2
  target: string;       // Ex: "12" ou "#TAG"
  stars: number;        // 0 a 3
  destruction: number;  // 0 a 100
  notes?: string | null;
  createdAt?: Date;
};

// --- MEMBRO ---
export type Member = {
  id: string;
  name: string;
  tag: string;
  role: ClanRole;       // Adicionado para usar nos Badges
  thLevel: number;
  warStatus: WarParticipation; // "IN" ou "OUT"
  avatarSeed?: string | null;  // Adicionado para o Avatar
  lastSeen?: Date | string | null; // Adicionado para cálculo de inatividade
};

// --- GUERRA ATIVA ---
export type WarData = {
  id: string;
  opponentName: string;
  size: number;
  isActive: boolean;
  isLeague: boolean;
  startDate: Date | string; // Adicionado
  endDate: Date | string;   // Adicionado (Isso corrige o erro TS2339)
  attacks: AttackData[]; 
};

// --- HISTÓRICO DE GUERRA ---
export type WarHistoryEntry = {
  id: string;
  opponentName: string;
  size: number;
  result: WarResult;    // Agora o VS Code vai te sugerir "win", "loss"...
  score: string | null;
  endDate: Date;
  isLeague: boolean;
  // No histórico, às vezes trazemos o objeto completo ou apenas um resumo
  attacks: { 
    stars: number; 
    destruction: number; 
    memberId?: string; // Opcional, caso queira saber quem atacou no histórico
  }[];
};