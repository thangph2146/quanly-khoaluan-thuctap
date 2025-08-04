import httpsAPI from './client'

export interface AuditLog {
  id: number
  userId: string
  userName?: string
  userEmail?: string
  moduleName: string
  action: string
  resource?: string
  permissionGranted: boolean
  deniedReason?: string
  ipAddress?: string
  requestPath?: string
  httpMethod?: string
  timestamp: string
  severity: 'Info' | 'Warning' | 'Error' | 'Critical'
}

export interface AuditFilters {
  page?: number
  limit?: number
  userId?: string
  moduleName?: string
  action?: string
  granted?: boolean
  severity?: string
  fromDate?: string
  toDate?: string
}

export interface AuditResponse {
  data: AuditLog[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface AuditStats {
  totalRequests: number
  grantedRequests: number
  deniedRequests: number
  topModules: Array<{ module: string; count: number }>
  topActions: Array<{ action: string; count: number }>
  severityBreakdown: Array<{ severity: string; count: number }>
  recentActivity: Array<{
    timestamp: string
    userId: string
    userName?: string
    moduleName: string
    action: string
    permissionGranted: boolean
    severity: string
  }>
}

class AuditAPI {
  /**
   * Get audit logs with filtering
   */
  async getAuditLogs(filters: AuditFilters = {}): Promise<AuditResponse> {
    const response = await httpsAPI.get('/audit/logs', { params: filters })
    return response.data
  }

  /**
   * Get audit statistics
   */
  async getAuditStats(fromDate?: string, toDate?: string): Promise<AuditStats> {
    const params: any = {}
    if (fromDate) params.fromDate = fromDate
    if (toDate) params.toDate = toDate
    
    const response = await httpsAPI.get('/audit/stats', { params })
    return response.data
  }

  /**
   * Get current user's audit logs
   */
  async getMyAuditLogs(filters: Omit<AuditFilters, 'userId'> = {}): Promise<AuditResponse> {
    const response = await httpsAPI.get('/audit/my-logs', { params: filters })
    return response.data
  }

  /**
   * Clean up old audit logs (Admin only)
   */
  async cleanupOldLogs(retentionDays: number = 90): Promise<{ message: string }> {
    const response = await httpsAPI.post('/audit/cleanup', null, {
      params: { retentionDays }
    })
    return response.data
  }

  /**
   * Get available filters
   */
  async getAuditFilters(): Promise<{
    modules: string[]
    actions: string[]
    severities: string[]
  }> {
    const response = await httpsAPI.get('/audit/filters')
    return response.data
  }

  /**
   * Get SSE stream statistics
   */
  async getStreamStats(): Promise<{
    activeConnections: number
    connectionsByUser: Record<string, number>
    timestamp: string
  }> {
    const response = await httpsAPI.get('/permissions/stream/stats')
    return response.data
  }

  /**
   * Export audit logs to CSV
   */
  async exportAuditLogs(filters: AuditFilters = {}): Promise<Blob> {
    const response = await httpsAPI.get('/audit/export', { 
      params: filters,
      responseType: 'blob'
    })
    return response.data
  }
}

export const auditAPI = new AuditAPI()
export default auditAPI 