/**
 * Settings Service
 */
import { 
  getSystemSettings, 
  getSystemSettingByKey, 
  createSystemSetting, 
  updateSystemSetting, 
  deleteSystemSetting
} from '../api/settings.api'
import type { 
  SystemSetting, 
  SystemSettingFilters, 
  SystemSettingMutationData, 
  PaginatedSystemSettings 
} from '../types'

export class SettingsService {
  static async getAll(filters: SystemSettingFilters): Promise<PaginatedSystemSettings> {
    return getSystemSettings(filters)
  }

  static async getByKey(key: string): Promise<SystemSetting> {
    return getSystemSettingByKey(key)
  }

  static async create(data: SystemSettingMutationData): Promise<SystemSetting> {
    return createSystemSetting(data)
  }

  static async update(key: string, data: SystemSettingMutationData): Promise<void> {
    return updateSystemSetting(key, data)
  }

  static async delete(key: string): Promise<void> {
    return deleteSystemSetting(key)
  }

  // Helper method để update setting đơn giản
  static async updateSettingValue(key: string, value: string): Promise<void> {
    const current = await this.getByKey(key)
    return this.update(key, {
      settingKey: current.settingKey,
      settingValue: value,
      description: current.description
    })
  }
} 