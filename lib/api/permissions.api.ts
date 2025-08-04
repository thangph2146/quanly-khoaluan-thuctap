import httpsAPI from './client'
import type { UserPermissions, ModuleDefinition, ModulesByCategory } from '@/types/permissions'

class PermissionsAPI {
  private sseConnection: EventSource | null = null
  private permissionChangeListeners: Set<(permissions: UserPermissions) => void> = new Set()

  /**
   * Get current user's permissions for all modules
   */
  async getCurrentUserPermissions(): Promise<UserPermissions> {
    const response = await httpsAPI.get('/users/me/permissions')
    return response.data
  }

  /**
   * Get all available modules
   */
  async getModules(category?: string): Promise<ModuleDefinition[]> {
    const params = category ? { category } : {}
    const response = await httpsAPI.get('/modules', { params })
    return response.data
  }

  /**
   * Get modules grouped by category
   */
  async getModulesByCategory(): Promise<ModulesByCategory> {
    const response = await httpsAPI.get('/modules/by-category')
    return response.data
  }

  /**
   * Get module names only
   */
  async getModuleNames(): Promise<string[]> {
    const response = await httpsAPI.get('/modules/names')
    return response.data
  }

  /**
   * Get detailed information about a specific module
   */
  async getModule(moduleName: string): Promise<ModuleDefinition> {
    const response = await httpsAPI.get(`/modules/${moduleName}`)
    return response.data
  }

  /**
   * Get menu paths for a specific module
   */
  async getModuleMenuPaths(moduleName: string): Promise<string[]> {
    const response = await httpsAPI.get(`/modules/${moduleName}/menu-paths`)
    return response.data
  }

  /**
   * Refresh user permissions cache on backend
   */
  async refreshPermissionsCache(): Promise<void> {
    await httpsAPI.post('/cache/clear/me')
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<any> {
    const response = await httpsAPI.get('/cache/stats')
    return response.data
  }

  /**
   * Subscribe to real-time permission updates
   */
  subscribeToPermissionUpdates(accessToken: string): void {
    if (this.sseConnection) {
      this.sseConnection.close()
    }

    // Create SSE connection with auth header
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5100/api'
    const sseUrl = `${baseUrl}/permissions/stream?access_token=${encodeURIComponent(accessToken)}`
    
    this.sseConnection = new EventSource(sseUrl)

    this.sseConnection.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        
        switch (data.type) {
          case 'permission_updated':
            // Notify all listeners about permission change
            this.notifyPermissionChange(data.permissions)
            break
          
          case 'role_updated':
            // Role changed, refresh all permissions
            this.notifyRoleChange(data.userId)
            break
            
          case 'keepalive':
            // Just keep connection alive
            break
            
          default:
            // Unknown SSE message type
        }
      } catch (error) {
        // Error parsing SSE message
      }
    }

    this.sseConnection.onerror = (error) => {
      // Retry connection after 5 seconds
      setTimeout(() => {
        if (this.sseConnection?.readyState === EventSource.CLOSED) {
          this.subscribeToPermissionUpdates(accessToken)
        }
      }, 5000)
    }

    this.sseConnection.onopen = () => {
      // Connected to permission updates stream
    }
  }

  /**
   * Unsubscribe from permission updates
   */
  unsubscribeFromPermissionUpdates(): void {
    if (this.sseConnection) {
      this.sseConnection.close()
      this.sseConnection = null
    }
  }

  /**
   * Subscribe to permission changes
   */
  onPermissionChange(callback: (permissions: UserPermissions) => void): () => void {
    this.permissionChangeListeners.add(callback)
    
    // Return unsubscribe function
    return () => {
      this.permissionChangeListeners.delete(callback)
    }
  }

  /**
   * Notify listeners about permission changes
   */
  private notifyPermissionChange(permissions: UserPermissions): void {
    this.permissionChangeListeners.forEach(callback => {
      try {
        callback(permissions)
      } catch (error) {
        // Error in permission change callback
      }
    })
  }

  /**
   * Notify listeners about role changes (need to refetch permissions)
   */
  private notifyRoleChange(userId: string): void {
    // For role changes, we need to refetch permissions completely
    // This will be handled by the permission context
  }

  /**
   * Check if real-time updates are supported
   */
  isRealTimeSupported(): boolean {
    return typeof EventSource !== 'undefined'
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): 'connecting' | 'open' | 'closed' | 'error' {
    if (!this.sseConnection) return 'closed'
    
    switch (this.sseConnection.readyState) {
      case EventSource.CONNECTING:
        return 'connecting'
      case EventSource.OPEN:
        return 'open'
      case EventSource.CLOSED:
        return 'closed'
      default:
        return 'error'
    }
  }
}

export const permissionsAPI = new PermissionsAPI()
export default permissionsAPI 