export type MemberRole = "LIDER" | "COLIDER" | "ANCIAO" | "MEMBRO";

export interface Member {
  id: string;
  name: string;
  tag: string;
  role: string;
  thLevel: number;
  warStatus: 'IN' | 'OUT';
  lastSeen?: string | Date | null;
  avatarSeed?: string | null;
  tickets: number;
  
  // ADICIONE ESTES DOIS:
  phone?: string | null;      // O novo campo de telefone
  isInWhatsapp?: boolean;     // Se já existia, mantenha
}

export type FilterMode = 'all' | 'war' | 'debt' | 'inactive';
export type ViewMode = 'table' | 'grid';
export type SortOption = 'role' | 'th_desc' | 'th_asc' | 'name' | 'active';