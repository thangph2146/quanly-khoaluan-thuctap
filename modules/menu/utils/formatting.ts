/**
 * Menu Utility Functions
 */
import type { Menu, MenuTreeItem } from '../types'

/**
 * Sort menus by display order
 */
export function sortMenusByOrder(menus: Menu[], order: 'asc' | 'desc' = 'asc'): Menu[] {
  return [...menus].sort((a, b) => {
    const comparison = a.displayOrder - b.displayOrder
    return order === 'asc' ? comparison : -comparison
  })
}

/**
 * Sort menus by name
 */
export function sortMenusByName(menus: Menu[], order: 'asc' | 'desc' = 'asc'): Menu[] {
  return [...menus].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name)
    return order === 'asc' ? comparison : -comparison
  })
}

/**
 * Filter menus by search term
 */
export function filterMenus(menus: Menu[], searchTerm: string): Menu[] {
  if (!searchTerm) return menus
  
  const term = searchTerm.toLowerCase()
  return menus.filter(menu => 
    menu.name.toLowerCase().includes(term) ||
    menu.path.toLowerCase().includes(term) ||
    (menu.icon && menu.icon.toLowerCase().includes(term))
  )
}

/**
 * Get menu by ID
 */
export function getMenuById(menus: Menu[], id: number): Menu | undefined {
  return menus.find(menu => menu.id === id)
}

/**
 * Get menu by path
 */
export function getMenuByPath(menus: Menu[], path: string): Menu | undefined {
  return menus.find(menu => menu.path === path)
}

/**
 * Get root menus (menus without parent)
 */
export function getRootMenus(menus: Menu[]): Menu[] {
  return menus.filter(menu => !menu.parentId)
}

/**
 * Get child menus of a parent
 */
export function getChildMenus(menus: Menu[], parentId: number): Menu[] {
  return menus.filter(menu => menu.parentId === parentId)
}

/**
 * Build menu breadcrumbs
 */
export function getMenuBreadcrumbs(menus: Menu[], menuId: number): Menu[] {
  const breadcrumbs: Menu[] = []
  let currentMenu = getMenuById(menus, menuId)
  
  while (currentMenu) {
    breadcrumbs.unshift(currentMenu)
    if (currentMenu.parentId) {
      currentMenu = getMenuById(menus, currentMenu.parentId)
    } else {
      break
    }
  }
  
  return breadcrumbs
}

/**
 * Flatten menu tree structure
 */
export function flattenMenuTree(menuTree: MenuTreeItem[]): Menu[] {
  const result: Menu[] = []
  
  const flatten = (items: MenuTreeItem[]) => {
    items.forEach(item => {
      result.push(item)
      if (item.children && item.children.length > 0) {
        flatten(item.children)
      }
    })
  }
  
  flatten(menuTree)
  return result
}

/**
 * Get menu depth level
 */
export function getMenuDepth(menus: Menu[], menuId: number): number {
  let depth = 0
  let currentMenu = getMenuById(menus, menuId)
  
  while (currentMenu && currentMenu.parentId) {
    depth++
    currentMenu = getMenuById(menus, currentMenu.parentId)
  }
  
  return depth
}

/**
 * Check if menu has children
 */
export function hasChildMenus(menus: Menu[], menuId: number): boolean {
  return menus.some(menu => menu.parentId === menuId)
}

/**
 * Get maximum display order in a level
 */
export function getMaxDisplayOrder(menus: Menu[], parentId?: number): number {
  const levelMenus = parentId 
    ? menus.filter(menu => menu.parentId === parentId)
    : menus.filter(menu => !menu.parentId)
  
  if (levelMenus.length === 0) return 0
  
  return Math.max(...levelMenus.map(menu => menu.displayOrder))
}
