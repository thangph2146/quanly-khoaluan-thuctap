/**
 * Thesis Utility Functions
 */
import type { Thesis, ThesisStatus } from '../types'
import { THESIS_STATUS_LABELS } from '../constants'

/**
 * Get thesis status label
 */
export function getThesisStatusLabel(status: ThesisStatus): string {
  return THESIS_STATUS_LABELS[status] || status
}

/**
 * Format thesis title
 */
export function formatThesisTitle(title: string, maxLength: number = 50): string {
  if (title.length <= maxLength) return title
  return title.substring(0, maxLength) + '...'
}

/**
 * Sort theses by title
 */
export function sortThesesByTitle(theses: Thesis[], order: 'asc' | 'desc' = 'asc'): Thesis[] {
  return [...theses].sort((a, b) => {
    const comparison = a.title.localeCompare(b.title)
    return order === 'asc' ? comparison : -comparison
  })
}

/**
 * Sort theses by submission date
 */
export function sortThesesByDate(theses: Thesis[], order: 'asc' | 'desc' = 'desc'): Thesis[] {
  return [...theses].sort((a, b) => {
    const dateA = new Date(a.submissionDate)
    const dateB = new Date(b.submissionDate)
    const comparison = dateA.getTime() - dateB.getTime()
    return order === 'asc' ? comparison : -comparison
  })
}

/**
 * Filter theses by search term
 */
export function filterTheses(theses: Thesis[], searchTerm: string): Thesis[] {
  if (!searchTerm) return theses
  
  const term = searchTerm.toLowerCase()
  return theses.filter(thesis => 
    thesis.title.toLowerCase().includes(term) ||
    thesis.student?.fullName?.toLowerCase().includes(term) ||
    thesis.student?.studentCode?.toLowerCase().includes(term)
  )
}

/**
 * Get thesis by ID
 */
export function getThesisById(theses: Thesis[], id: number): Thesis | undefined {
  return theses.find(thesis => thesis.id === id)
}
