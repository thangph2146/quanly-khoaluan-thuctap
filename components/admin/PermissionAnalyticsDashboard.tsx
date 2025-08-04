'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  Shield, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Activity,
  Download,
  RefreshCw,
  Eye
} from 'lucide-react'
import { auditAPI, type AuditStats, type AuditLog } from '@/lib/api/audit.api'
import { usePermissions } from '@/contexts/PermissionContext'
import { ProtectedContent } from '@/components/common/ProtectedContent'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: React.ComponentType<any>
  trend?: 'up' | 'down' | 'neutral'
  color?: 'default' | 'green' | 'red' | 'yellow'
}

function StatsCard({ title, value, description, icon: Icon, trend, color = 'default' }: StatsCardProps) {
  const colorClasses = {
    default: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50', 
    red: 'text-red-600 bg-red-50',
    yellow: 'text-yellow-600 bg-yellow-50'
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-md ${colorClasses[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

export function PermissionAnalyticsDashboard() {
  const [stats, setStats] = useState<AuditStats | null>(null)
  const [recentLogs, setRecentLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d')
  const { isLoading: permissionsLoading } = usePermissions()

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const fromDate = new Date()
      switch (dateRange) {
        case '24h':
          fromDate.setDate(fromDate.getDate() - 1)
          break
        case '7d':
          fromDate.setDate(fromDate.getDate() - 7)
          break
        case '30d':
          fromDate.setDate(fromDate.getDate() - 30)
          break
        case '90d':
          fromDate.setDate(fromDate.getDate() - 90)
          break
      }

      const [statsData, logsData] = await Promise.all([
        auditAPI.getAuditStats(fromDate.toISOString()),
        auditAPI.getAuditLogs({ limit: 20 })
      ])

      setStats(statsData)
      setRecentLogs(logsData.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!permissionsLoading) {
      fetchStats()
    }
  }, [dateRange, permissionsLoading])

  const exportData = async () => {
    try {
      const blob = await auditAPI.exportAuditLogs()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <ProtectedContent 
      module="Dashboard" 
      action="read"
      showPermissionDenied={true}
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Permission Analytics</h1>
            <p className="text-gray-600">Giám sát và phân tích hoạt động phân quyền</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => fetchStats()} disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {stats && (
          <>
            {/* Date Range Selector */}
            <div className="flex gap-2">
              {(['24h', '7d', '30d', '90d'] as const).map((range) => (
                <Button
                  key={range}
                  variant={dateRange === range ? 'default' : 'outline'}
                  onClick={() => setDateRange(range)}
                  size="sm"
                >
                  {range === '24h' ? '24 giờ' : range === '7d' ? '7 ngày' : 
                   range === '30d' ? '30 ngày' : '90 ngày'}
                </Button>
              ))}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Tổng Requests"
                value={stats.totalRequests.toLocaleString()}
                description={`Trong ${dateRange === '24h' ? '24 giờ' : dateRange} qua`}
                icon={Activity}
              />
              <StatsCard
                title="Requests Được Chấp Nhận"
                value={stats.grantedRequests.toLocaleString()}
                description={`${((stats.grantedRequests / stats.totalRequests) * 100).toFixed(1)}% tổng requests`}
                icon={CheckCircle}
                color="green"
              />
              <StatsCard
                title="Requests Bị Từ Chối"
                value={stats.deniedRequests.toLocaleString()}
                description={`${((stats.deniedRequests / stats.totalRequests) * 100).toFixed(1)}% tổng requests`}
                icon={XCircle}
                color="red"
              />
              <StatsCard
                title="Modules Hoạt Động"
                value={stats.topModules.length}
                description="Modules có hoạt động gần đây"
                icon={Shield}
              />
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                <TabsTrigger value="modules">Modules</TabsTrigger>
                <TabsTrigger value="security">Bảo mật</TabsTrigger>
                <TabsTrigger value="recent">Hoạt động gần đây</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Top Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Actions Phổ Biến</CardTitle>
                      <CardDescription>Các hành động được thực hiện nhiều nhất</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {stats.topActions.slice(0, 5).map((action, index) => (
                          <div key={action.action} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{index + 1}</Badge>
                              <span className="font-medium">{action.action}</span>
                            </div>
                            <span className="text-sm text-gray-500">{action.count}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Security Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Phân Loại Mức Độ</CardTitle>
                      <CardDescription>Phân bố theo mức độ nghiêm trọng</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {stats.severityBreakdown.map((item) => {
                          const severityColors = {
                            'Info': 'bg-blue-100 text-blue-800',
                            'Warning': 'bg-yellow-100 text-yellow-800',
                            'Error': 'bg-red-100 text-red-800',
                            'Critical': 'bg-red-200 text-red-900'
                          }
                          
                          return (
                            <div key={item.severity} className="flex justify-between items-center">
                              <Badge 
                                className={severityColors[item.severity as keyof typeof severityColors]}
                                variant="secondary"
                              >
                                {item.severity}
                              </Badge>
                              <span className="text-sm font-medium">{item.count}</span>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="modules" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Modules Được Truy Cập Nhiều Nhất</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats.topModules.slice(0, 10).map((module, index) => (
                        <div key={module.module} className="flex justify-between items-center p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">{index + 1}</Badge>
                            <span className="font-medium">{module.module}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{module.count} requests</div>
                            <div className="text-sm text-gray-500">
                              {((module.count / stats.totalRequests) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Cảnh Báo Bảo Mật</CardTitle>
                      <CardDescription>Các hoạt động đáng ngờ cần chú ý</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {stats.deniedRequests > 0 ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-yellow-600">
                            <AlertTriangle className="h-4 w-4" />
                            <span>{stats.deniedRequests} requests bị từ chối</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Kiểm tra log chi tiết để xác định nguyên nhân
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span>Không có cảnh báo bảo mật</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="recent" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Hoạt Động Gần Đây</CardTitle>
                    <CardDescription>20 hoạt động permission mới nhất</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentLogs.map((log) => (
                        <div key={log.id} className="flex justify-between items-center p-3 border rounded">
                          <div className="flex items-center gap-3">
                            {log.permissionGranted ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <div>
                              <div className="font-medium">
                                {log.userName || log.userId} → {log.action} on {log.moduleName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {log.requestPath} • {new Date(log.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <Badge variant={log.permissionGranted ? 'default' : 'destructive'}>
                            {log.permissionGranted ? 'Granted' : 'Denied'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </ProtectedContent>
  )
} 