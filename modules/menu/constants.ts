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
  DASHBOARD: '/',
  USERS: '/users',
  PERMISSIONS: '/permissions',
  ROLES: '/roles',
  MENUS: '/menus',
  ACADEMIC_YEARS: '/academic-years',
  DEPARTMENTS: '/departments',
  THESIS: '/thesis',
  INTERNSHIP: '/internship',
  PARTNERS: '/partners',
} as const

export const MENU_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const

export const MENU_STATUS_LABELS = {
  ACTIVE: 'Hoạt động',
  INACTIVE: 'Không hoạt động',
} as const
