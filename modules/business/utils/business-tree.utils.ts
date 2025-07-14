/**
 * Business Tree Utilities
 * Contains helper functions for working with business tree data.
 */
import type { Business } from '../types';

export function flattenBusinesses(businesses: Business[]): Business[] {
  if (!Array.isArray(businesses)) {
    console.warn("flattenBusinesses received a non-array input:", businesses);
    return [];
  }
  // Không còn childBusinesses, chỉ trả về mảng ban đầu
  return businesses;
}

export function removeBusinessFromTree(businesses: Business[], id: number): Business[] {
  // Không còn childBusinesses, chỉ filter theo id
  return businesses.filter(business => business.id !== id);
}
