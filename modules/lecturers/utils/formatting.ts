/**
 * Lecturer Utility Functions
 */
import type { Lecturer } from '../types'

/**
 * Format lecturer full name
 */
export function formatLecturerName(lecturer: Lecturer): string {
  return lecturer.name
}

/**
 * Sort lecturers by name
 */
export function sortLecturersByName(lecturers: Lecturer[], order: 'asc' | 'desc' = 'asc'): Lecturer[] {
  return [...lecturers].sort((a, b) => {
    const nameA = formatLecturerName(a)
    const nameB = formatLecturerName(b)
    const comparison = nameA.localeCompare(nameB)
    return order === 'asc' ? comparison : -comparison
  })
}

/**
 * Filter lecturers by search term
 */
export function filterLecturers(lecturers: Lecturer[], searchTerm: string): Lecturer[] {
  if (!searchTerm) return lecturers
  
  const term = searchTerm.toLowerCase()
  return lecturers.filter(lecturer => 
    lecturer.name.toLowerCase().includes(term) ||
    lecturer.email.toLowerCase().includes(term) ||
    (lecturer.department?.name && lecturer.department.name.toLowerCase().includes(term)) ||
    (lecturer.academicRank && lecturer.academicRank.toLowerCase().includes(term)) ||
    (lecturer.degree && lecturer.degree.toLowerCase().includes(term)) ||
    (lecturer.specialization && lecturer.specialization.toLowerCase().includes(term))
  )
}

/**
 * Get lecturer by ID
 */
export function getLecturerById(lecturers: Lecturer[], id: number): Lecturer | undefined {
  return lecturers.find(lecturer => lecturer.id === id)
}

/**
 * Get lecturer by email
 */
export function getLecturerByEmail(lecturers: Lecturer[], email: string): Lecturer | undefined {
  return lecturers.find(lecturer => lecturer.email.toLowerCase() === email.toLowerCase())
}

/**
 * Get lecturers by department
 */
export function getLecturersByDepartment(lecturers: Lecturer[], departmentId: number): Lecturer[] {
  return lecturers.filter(lecturer => lecturer.departmentId === departmentId)
}

/**
 * Get active lecturers
 */
export function getActiveLecturers(lecturers: Lecturer[]): Lecturer[] {
  return lecturers.filter(lecturer => lecturer.isActive)
} 