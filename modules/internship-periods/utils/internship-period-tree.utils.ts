/**
 * Internship Period Tree Utilities
 * (Nếu không cần tree, chỉ cần flatten array)
 */
import type { InternshipPeriod } from '../types';

/**
 * Flattens a list of internship periods (hiện tại chỉ trả về array gốc, để đồng bộ với departments)
 */
export function flattenInternshipPeriods(periods: InternshipPeriod[]): InternshipPeriod[] {
  if (!Array.isArray(periods)) {
    console.warn("flattenInternshipPeriods received a non-array input:", periods);
    return [];
  }
  // Nếu sau này có tree, có thể mở rộng logic ở đây
  return periods;
}

/**
 * Remove một internship period khỏi mảng (nếu cần)
 */
export function removeInternshipPeriodFromList(periods: InternshipPeriod[], id: number): InternshipPeriod[] {
  return periods.filter(period => period.id !== id);
} 