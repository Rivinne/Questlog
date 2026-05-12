// src/types/index.ts

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Task {
  id: string;
  title: string;
  description?: string; // Optionnel (notes)
  
  // État
  isCompleted: boolean;
  createdAt: string; // On utilisera des ISO strings pour la date

  // Planification (optionnel)
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  projectTitle?: string;
  googleEventId?: string; // Lien vers l'événement Google Calendar associé
  lastSyncedAt?: string; // ISO string pour suivre la synchro

  // Gamification & Règles
  priority: Priority;
  isFrog: boolean; // Si true => Bonus massive
  
  // La valeur calculée (stockée pour éviter de recalculer à chaque affichage)
  xpValue: number;
}
