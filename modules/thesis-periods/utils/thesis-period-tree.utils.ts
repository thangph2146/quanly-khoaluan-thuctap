/**
 * Thesis Period Tree Utilities
 * (Nếu không cần tree, chỉ cần flatten array)
 */
import type { ThesisPeriod } from '../types';

/**
 * Flattens a list of thesis periods (hiện tại chỉ trả về array gốc, để đồng bộ với departments)
 */
export function flattenThesisPeriods(periods: ThesisPeriod[]): ThesisPeriod[] {
  if (!Array.isArray(periods)) {
    console.warn("flattenThesisPeriods received a non-array input:", periods);
    return [];
  }
  // Nếu sau này có tree, có thể mở rộng logic ở đây
  return periods;
}

/**
 * Remove một thesis period khỏi mảng (nếu cần)
 */
export function removeThesisPeriodFromList(periods: ThesisPeriod[], id: number): ThesisPeriod[] {
  return periods.filter(period => period.id !== id);
} 