/**
 * Settings Hooks
 */
import { useState, useEffect, useCallback } from 'react'
import { SettingsService } from '../services/settings.service'
import type { SystemSetting, SystemSettingFilters } from '../types'

export function useSettings(filters: SystemSettingFilters) {
  const [settings, setSettings] = useState<SystemSetting[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async (currentFilters: SystemSettingFilters) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await SettingsService.getAll(currentFilters)
      setSettings(response.data)
      setTotal(response.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách cài đặt')
      setSettings([])
      setTotal(0)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings(filters)
  }, [fetchSettings, filters.page, filters.limit, filters.search])

  return {
    settings,
    setSettings,
    total,
    isLoading,
    error,
    refetch: () => fetchSettings(filters),
  }
}

export function useSetting(key: string) {
  const [setting, setSetting] = useState<SystemSetting | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSetting = useCallback(async (settingKey: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await SettingsService.getByKey(settingKey)
      setSetting(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải cài đặt')
      setSetting(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (key) {
      fetchSetting(key)
    }
  }, [fetchSetting, key])

  return {
    setting,
    setSetting,
    isLoading,
    error,
    refetch: () => fetchSetting(key),
  }
}

export function useSettingActions(onSuccess?: () => void) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateSetting = useCallback(async (key: string, value: string) => {
    try {
      setIsUpdating(true)
      setError(null)
      await SettingsService.updateSettingValue(key, value)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi cập nhật cài đặt')
      throw err
    } finally {
      setIsUpdating(false)
    }
  }, [onSuccess])

  return {
    updateSetting,
    isUpdating,
    error,
  }
} 