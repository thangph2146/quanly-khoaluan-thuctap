import httpsAPI from '@/lib/api/client'

// Types for Matrix Permission System
export interface RoleModulePermissionDto {
  id: number
  roleId: number
  moduleName: string
  canCreate: boolean
  canRead: boolean
  canUpdate: boolean
  canDelete: boolean
}

export interface ModulePermissionDto {
  moduleName: string
  canCreate: boolean
  canRead: boolean
  canUpdate: boolean
  canDelete: boolean
}

export interface RolePermissionMatrixDto {
  roleId: number
  roleName: string
  modules: ModulePermissionDto[]
}

export interface UpdateRolePermissionMatrixDto {
  roleId: number
  modules: ModulePermissionDto[]
}

export interface CreateRoleModulePermissionDto {
  roleId: number
  moduleName: string
  canCreate: boolean
  canRead: boolean
  canUpdate: boolean
  canDelete: boolean
}

// API Service Class
export class RoleModulePermissionService {
  
  /**
   * Lấy matrix permissions của một role
   */
  static async getRolePermissionMatrix(roleId: number): Promise<RolePermissionMatrixDto> {
    const response = await httpsAPI.get(`/role-module-permissions/matrix/${roleId}`)
    return response.data
  }

  /**
   * Cập nhật toàn bộ matrix permissions của một role
   */
  static async updateRolePermissionMatrix(
    roleId: number, 
    data: UpdateRolePermissionMatrixDto
  ): Promise<void> {
    await httpsAPI.put(`/role-module-permissions/matrix/${roleId}`, data)
  }

  /**
   * Lấy danh sách tất cả modules có trong hệ thống
   */
  static async getAvailableModules(): Promise<string[]> {
    const response = await httpsAPI.get('/role-module-permissions/modules')
    return response.data
  }

  /**
   * Lấy permissions của một role (dạng danh sách)
   */
  static async getRoleModulePermissions(roleId: number): Promise<RoleModulePermissionDto[]> {
    const response = await httpsAPI.get(`/role-module-permissions/${roleId}`)
    return response.data
  }

  /**
   * Tạo permission mới cho một module
   */
  static async createRoleModulePermission(data: CreateRoleModulePermissionDto): Promise<RoleModulePermissionDto> {
    const response = await httpsAPI.post('/role-module-permissions', data)
    return response.data
  }

  /**
   * Xóa permission
   */
  static async deleteRoleModulePermission(id: number): Promise<void> {
    await httpsAPI.delete(`/role-module-permissions/${id}`)
  }
}

// Export default
export default RoleModulePermissionService 