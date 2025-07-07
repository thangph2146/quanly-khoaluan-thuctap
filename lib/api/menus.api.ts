import httpsAPI from './client'
import type { Menu, CreateMenuData, UpdateMenuData } from '@/modules/menu/types'

/**
 * Fetches all menus from the API.
 * Returns root menus with their children loaded.
 * @returns A promise that resolves to an array of menus.
 */
export const getMenus = async (): Promise<Menu[]> => {
	try {
		const response = await httpsAPI.get('/Menus')
		return response.data
	} catch (error: unknown) {
		console.error('Error fetching menus:', error)
		const message = error instanceof Error ? error.message : 'Không thể tải danh sách menu'
		throw new Error(message)
	}
}

/**
 * Fetches all menus in flat structure (including child menus).
 * @returns A promise that resolves to an array of all menus.
 */
export const getAllMenusFlat = async (): Promise<Menu[]> => {
	try {
		// For now, we'll use the same endpoint and flatten the data on frontend
		// TODO: Add /Menus/all endpoint to backend if needed
		const response = await httpsAPI.get('/Menus')
		const hierarchicalMenus = response.data
		
		// Flatten the hierarchical structure
		const flattenMenus = (menus: Menu[]): Menu[] => {
			let result: Menu[] = []
			menus.forEach(menu => {
				result.push(menu)
				if (menu.childMenus && menu.childMenus.length > 0) {
					result = result.concat(flattenMenus(menu.childMenus))
				}
			})
			return result
		}
		
		return flattenMenus(hierarchicalMenus)
	} catch (error: unknown) {
		console.error('Error fetching all menus:', error)
		const message = error instanceof Error ? error.message : 'Không thể tải danh sách menu'
		throw new Error(message)
	}
}

/**
 * Fetches a single menu by ID.
 * @param id The ID of the menu to fetch.
 * @returns A promise that resolves to the menu object.
 */
export const getMenuById = async (id: number): Promise<Menu> => {
	try {
		const response = await httpsAPI.get(`/Menus/${id}`)
		return response.data
	} catch (error: unknown) {
		console.error('Error fetching menu:', error)
		const message = error instanceof Error ? error.message : 'Không thể tải thông tin menu'
		throw new Error(message)
	}
}

/**
 * Creates a new menu.
 * @param data The data for the new menu.
 * @returns A promise that resolves to the newly created menu object.
 */
export const createMenu = async (data: CreateMenuData): Promise<Menu> => {
	try {
		const response = await httpsAPI.post('/Menus', data)
		return response.data
	} catch (error: unknown) {
		console.error('Error creating menu:', error)
		const message = error instanceof Error ? error.message : 'Không thể tạo menu mới'
		throw new Error(message)
	}
}

/**
 * Updates an existing menu.
 * @param id The ID of the menu to update.
 * @param data The data to update the menu with.
 * @returns A promise that resolves to the updated menu object.
 */
export const updateMenu = async (id: number, data: UpdateMenuData): Promise<Menu> => {
	try {
		const response = await httpsAPI.put(`/Menus/${id}`, data)
		return response.data
	} catch (error: unknown) {
		console.error('Error updating menu:', error)
		const message = error instanceof Error ? error.message : 'Không thể cập nhật menu'
		throw new Error(message)
	}
}

/**
 * Deletes a menu by ID.
 * @param id The ID of the menu to delete.
 * @returns A promise that resolves when the menu is deleted.
 */
export const deleteMenu = async (id: number): Promise<void> => {
	try {
		await httpsAPI.delete(`/Menus/${id}`)
	} catch (error: unknown) {
		console.error('Error deleting menu:', error)
		const message = error instanceof Error ? error.message : 'Không thể xóa menu'
		throw new Error(message)
	}
}

export const MenusApi = {
	getAll: getMenus,
	getAllFlat: getAllMenusFlat,
	getById: getMenuById,
	create: createMenu,
	update: updateMenu,
	delete: deleteMenu,
}
