/**
 * Settings API
 * API functions for system settings management
 */
import apiClient from '../../../lib/api/client'
import type { SystemSetting, SystemSettingFilters, SystemSettingMutationData, PaginatedSystemSettings } from '../types'

/**
 * Get all system settings (paginated)
 */
export const getSystemSettings = async (filters: SystemSettingFilters = {}): Promise<PaginatedSystemSettings> => {
  try {
    const response = await apiClient.get('/system-settings', { params: filters })
    return response.data
  } catch (error) {
    console.error('Error fetching system settings:', error)
    throw error
  }
}

/**
 * Get single system setting by key
 */
export const getSystemSettingByKey = async (key: string): Promise<SystemSetting> => {
  try {
    const response = await apiClient.get(`/system-settings/${key}`)
    return response.data
  } catch (error) {
    console.error('Error fetching system setting:', error)
    throw error
  }
}

/**
 * Create new system setting
 */
export const createSystemSetting = async (data: SystemSettingMutationData): Promise<SystemSetting> => {
  try {
    const response = await apiClient.post('/system-settings', data)
    return response.data
  } catch (error) {
    console.error('Error creating system setting:', error)
    throw error
  }
}

/**
 * Update system setting
 */
export const updateSystemSetting = async (key: string, data: SystemSettingMutationData): Promise<void> => {
  try {
    await apiClient.put(`/system-settings/${key}`, data)
  } catch (error) {
    console.error('Error updating system setting:', error)
    throw error
  }
}

/**
 * Delete system setting
 */
export const deleteSystemSetting = async (key: string): Promise<void> => {
  try {
    await apiClient.delete(`/system-settings/${key}`)
  } catch (error) {
    console.error('Error deleting system setting:', error)
    throw error
  }
} 