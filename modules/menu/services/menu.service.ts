import { 
  getMenus, 
  getAllMenusFlat, 
  getMenuById, 
  createMenu, 
  updateMenu, 
  deleteMenu
} from '@/modules/menu/api/menus.api'
import type { Menu, CreateMenuData, UpdateMenuData, MenuTreeItem } from '../types'

/**
 * Menu Service
 * Business logic layer for menu operations
 */
export class MenuService {
  /**
   * Get all menus (hierarchical structure)
   */
  static async getAll(): Promise<Menu[]> {
    return await getMenus()
  }

  /**
   * Get all menus in flat structure
   */
  static async getAllFlat(): Promise<Menu[]> {
    return await getAllMenusFlat()
  }

  /**
   * Get menu by ID
   */
  static async getById(id: number): Promise<Menu> {
    return await getMenuById(id)
  }

  /**
   * Create new menu
   */
  static async create(data: CreateMenuData): Promise<Menu> {
    return await createMenu(data)
  }

  /**
   * Update menu
   */
  static async update(id: number, data: UpdateMenuData): Promise<Menu> {
    return await updateMenu(id, data)
  }

  /**
   * Delete menu
   */
  static async remove(id: number): Promise<void> {
    return await deleteMenu(id)
  }

  /**
   * Build menu tree structure from flat menus
   */
  static buildMenuTree(menus: Menu[]): MenuTreeItem[] {
    const menuMap = new Map<number, MenuTreeItem>()
    const rootMenus: MenuTreeItem[] = []

    // Convert all menus to MenuTreeItem and create a map
    menus.forEach(menu => {
      const menuItem: MenuTreeItem = {
        ...menu,
        children: [],
        level: 0
      }
      menuMap.set(menu.id, menuItem)
    })

    // Build the tree structure
    menus.forEach(menu => {
      const menuItem = menuMap.get(menu.id)!
      
      if (menu.parentId && menuMap.has(menu.parentId)) {
        const parent = menuMap.get(menu.parentId)!
        parent.children = parent.children || []
        parent.children.push(menuItem)
        menuItem.level = (parent.level || 0) + 1
      } else {
        rootMenus.push(menuItem)
      }
    })

    return rootMenus
  }

  /**
   * Get menu tree structure
   */
  static async getMenuTree(): Promise<MenuTreeItem[]> {
    const menus = await this.getAllFlat()
    return this.buildMenuTree(menus)
  }
}

// Export types
export type { CreateMenuData, UpdateMenuData, MenuTreeItem }
