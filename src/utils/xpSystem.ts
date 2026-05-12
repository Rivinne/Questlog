// src/utils/xpSystem.ts
import type { Priority } from '../types';

// --- CONFIGURATION DU JEU ---
const BASE_XP = 15;
const FROG_BONUS = 20; // Tu peux changer ça à 50 si tu veux être plus généreux !

const MULTIPLIERS: Record<Priority, number> = {
  LOW: 1,
  MEDIUM: 1.2,
  HIGH: 1.5,
  CRITICAL: 2.0,
};

/**
 * Calcule l'XP d'une tâche selon sa priorité et si c'est une "Frog"
 */
export const calculateTaskXP = (priority: Priority, isFrog: boolean): number => {
  let xp = BASE_XP * MULTIPLIERS[priority];

  if (isFrog) {
    xp += FROG_BONUS;
  }

  // On arrondit pour éviter les virgules (ex: 22.5 XP -> 23 XP)
  return Math.round(xp);
};