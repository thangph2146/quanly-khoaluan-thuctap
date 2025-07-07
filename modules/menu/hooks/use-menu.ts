/**
 * Menu Hooks
 * Custom hooks for menu management
 */
import { useState, useEffect } from 'react'
import type { Menu, MenuTreeItem } from '../types'
import type { CreateMenuData, UpdateMenuData } from '../services'
import { MenuService } from '../services'

/**
 * Hook for managing menus data
 */
export function useMenus() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMenus = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await MenuService.getAll()
      setMenus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMenus()
  }, [])

  const refetch = () => {
    fetchMenus()
  }

  return {
    menus,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook for managing flat menus data
 */
export function useMenusFlat() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMenus = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await MenuService.getAllFlat()
      setMenus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMenus()
  }, [])

  const refetch = () => {
    fetchMenus()
  }

  return {
    menus,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook for managing menu tree data
 */
export function useMenuTree() {
  const [menuTree, setMenuTree] = useState<MenuTreeItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMenuTree = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await MenuService.getMenuTree()
      setMenuTree(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMenuTree()
  }, [])

  const refetch = () => {
    fetchMenuTree()
  }

  return {
    menuTree,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook for managing single menu operations
 */
export function useMenu(id?: number) {
  const [menu, setMenu] = useState<Menu | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMenu = async (menuId: number) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await MenuService.getById(menuId)
      setMenu(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchMenu(id)
    }
  }, [id])

  const refetch = () => {
    if (id) {
      fetchMenu(id)
    }
  }

  return {
    menu,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook for managing menu actions (create, update, delete)
 */
export function useMenuActions(onSuccess?: () => void) {
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const createMenu = async (data: CreateMenuData) => {
    try {
      setIsCreating(true)
      await MenuService.create(data)
      onSuccess?.()
    } catch (error) {
      console.error('Error creating menu:', error)
      throw error
    } finally {
      setIsCreating(false)
    }
  }

  const updateMenu = async (id: number, data: UpdateMenuData) => {
    try {
      setIsUpdating(true)
      await MenuService.update(id, data)
      onSuccess?.()
    } catch (error) {
      console.error('Error updating menu:', error)
      throw error
    } finally {
      setIsUpdating(false)
    }
  }

  const deleteMenu = async (id: number) => {
    try {
      setIsDeleting(true)
      await MenuService.remove(id)
      onSuccess?.()
      return true
    } catch (error) {
      console.error('Error deleting menu:', error)
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    createMenu,
    updateMenu,
    deleteMenu,
    isCreating,
    isUpdating,
    isDeleting,
  }
}
