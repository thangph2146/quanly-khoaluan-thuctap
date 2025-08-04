'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { 
  Save, 
  Shield, 
  Eye, 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle,
  RefreshCw 
} from 'lucide-react'
import { useRoles } from '@/modules/roles/hooks/use-roles'
import { useRoleMatrixPermissions } from '../hooks/use-role-matrix-permissions'

export function PermissionMatrix() {
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null)
  
  // Fetch roles for combobox
  const { roles, isLoading: rolesLoading } = useRoles({ page: 1, limit: 100, search: '' })
  
  // Matrix permissions hook
  const {
    matrix,
    isLoading: matrixLoading,
    isSaving,
    error,
    updateModulePermission,
    saveMatrix,
    resetModulePermissions,
    setAllModulePermissions,
    hasChanges,
    refetch
  } = useRoleMatrixPermissions(selectedRoleId)

  const handleRoleChange = (value: string) => {
    const roleId = parseInt(value)
    setSelectedRoleId(roleId)
  }

  const handlePermissionChange = (
    moduleName: string,
    permissionType: 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete',
    checked: boolean | string
  ) => {
    updateModulePermission(moduleName, permissionType, checked === true)
  }

  const handleSave = async () => {
    try {
      await saveMatrix()
    } catch (error) {
      // Error handled in hook
      console.error('Save failed:', error)
    }
  }

  const getPermissionStats = () => {
    if (!matrix) return { total: 0, granted: 0 }
    
    const total = matrix.modules.length * 4 // 4 permissions per module
    const granted = matrix.modules.reduce((acc, module) => {
      return acc + 
        (module.canCreate ? 1 : 0) +
        (module.canRead ? 1 : 0) +
        (module.canUpdate ? 1 : 0) +
        (module.canDelete ? 1 : 0)
    }, 0)
    
    return { total, granted }
  }

  const stats = getPermissionStats()

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Ma trận phân quyền</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý phân quyền theo ma trận: chọn vai trò và tick vào các quyền tương ứng
        </p>
      </div>

      {/* Role Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Chọn vai trò
          </CardTitle>
          <CardDescription>
            Chọn vai trò để xem và chỉnh sửa phân quyền
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="role-select" className="min-w-fit">Vai trò:</Label>
              <Select 
                value={selectedRoleId?.toString() || ''} 
                onValueChange={handleRoleChange}
                disabled={rolesLoading}
              >
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="-- Chọn vai trò --" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name}
                      {role.description && (
                        <span className="text-sm text-muted-foreground ml-2">
                          ({role.description})
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedRoleId && (
                <Button variant="outline" size="sm" onClick={refetch} disabled={matrixLoading}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tải lại
                </Button>
              )}
            </div>

            {/* Stats */}
            {matrix && (
              <div className="flex gap-4">
                <Badge variant="outline">
                  Vai trò: {matrix.roleName}
                </Badge>
                <Badge variant="secondary">
                  Đã cấp: {stats.granted}/{stats.total} quyền
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {(rolesLoading || matrixLoading) && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[300px]" />
              <Skeleton className="h-4 w-[250px]" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Permission Matrix Table */}
      {matrix && !matrixLoading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Ma trận phân quyền - {matrix.roleName}
            </CardTitle>
            <CardDescription>
              Tick vào các ô để cấp quyền tương ứng cho vai trò này
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Module</TableHead>
                    <TableHead className="text-center w-[100px]">
                      <div className="flex items-center justify-center gap-1">
                        <Eye className="h-4 w-4" />
                        Xem
                      </div>
                    </TableHead>
                    <TableHead className="text-center w-[100px]">
                      <div className="flex items-center justify-center gap-1">
                        <Plus className="h-4 w-4" />
                        Tạo
                      </div>
                    </TableHead>
                    <TableHead className="text-center w-[100px]">
                      <div className="flex items-center justify-center gap-1">
                        <Edit className="h-4 w-4" />
                        Sửa
                      </div>
                    </TableHead>
                    <TableHead className="text-center w-[100px]">
                      <div className="flex items-center justify-center gap-1">
                        <Trash2 className="h-4 w-4" />
                        Xóa
                      </div>
                    </TableHead>
                    <TableHead className="text-center w-[120px]">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matrix.modules.map((module) => (
                    <TableRow key={module.moduleName}>
                      <TableCell className="font-medium">
                        {module.moduleName}
                      </TableCell>
                      
                      {/* Read Permission */}
                      <TableCell className="text-center">
                        <Checkbox
                          checked={module.canRead}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(module.moduleName, 'canRead', checked)
                          }
                        />
                      </TableCell>
                      
                      {/* Create Permission */}
                      <TableCell className="text-center">
                        <Checkbox
                          checked={module.canCreate}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(module.moduleName, 'canCreate', checked)
                          }
                        />
                      </TableCell>
                      
                      {/* Update Permission */}
                      <TableCell className="text-center">
                        <Checkbox
                          checked={module.canUpdate}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(module.moduleName, 'canUpdate', checked)
                          }
                        />
                      </TableCell>
                      
                      {/* Delete Permission */}
                      <TableCell className="text-center">
                        <Checkbox
                          checked={module.canDelete}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(module.moduleName, 'canDelete', checked)
                          }
                        />
                      </TableCell>
                      
                      {/* Actions */}
                      <TableCell className="text-center">
                        <div className="flex gap-1 justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAllModulePermissions(module.moduleName, true)}
                            title="Cấp tất cả quyền"
                          >
                            Tất cả
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => resetModulePermissions(module.moduleName)}
                            title="Xóa tất cả quyền"
                          >
                            Xóa
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-6">
              <Button 
                onClick={handleSave} 
                disabled={!hasChanges || isSaving}
                className="min-w-[120px]"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Đang lưu...' : 'Lưu phân quyền'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!selectedRoleId && !rolesLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Chọn một vai trò để xem và chỉnh sửa phân quyền</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 