/**
 * Menu Constants
 */

export const MENU_ICONS = {
  DASHBOARD: 'LayoutDashboard',
  USERS: 'Users',
  SETTINGS: 'Settings',
  REPORTS: 'FileText',
  PERMISSIONS: 'Shield',
  ROLES: 'UserCheck',
  MENUS: 'Menu',
  ACADEMIC: 'GraduationCap',
  THESIS: 'BookOpen',
  INTERNSHIP: 'Briefcase',
  PARTNERS: 'Building',
} as const

export const MENU_PATHS = {
  DASHBOARD: '/admin',
  USERS: '/admin/users',
  PERMISSIONS: '/admin/permissions',
  ROLES: '/admin/roles',
  MENUS: '/admin/menus',
  ACADEMIC_YEARS: '/admin/academic-years',
  DEPARTMENTS: '/admin/departments',
  THESIS: '/admin/thesis',
  INTERNSHIP: '/admin/internship',
  PARTNERS: '/admin/partners',
} as const

export const MENU_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const

export const MENU_STATUS_LABELS = {
  ACTIVE: 'Hoạt động',
  INACTIVE: 'Không hoạt động',
} as const
