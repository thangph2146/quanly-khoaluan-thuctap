import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Permission } from '../types'
import { getPermissionDisplayName, getPermissionStats, getModuleColor } from '../utils/formatting'

interface PermissionDetailsProps {
	permission: Permission
}

export function PermissionDetails({ permission }: PermissionDetailsProps) {
	const displayName = getPermissionDisplayName(permission.name)
	const stats = getPermissionStats(permission)
	const moduleColor = getModuleColor(permission.module)

	return (
		<div className="space-y-6 p-4">
			{/* Basic Information */}
			<div className="space-y-4">
				<div>
					<h3 className="text-lg font-semibold">{displayName}</h3>
					<p className="text-sm text-gray-500 font-mono">{permission.name}</p>
				</div>
				
				{permission.description && (
					<div>
						<p className="text-sm text-gray-600">{permission.description}</p>
					</div>
				)}
				
				<div className="flex items-center space-x-4">
					<Badge className={moduleColor}>
						{permission.module}
					</Badge>
					<Badge variant="outline" className="text-xs">
						ID: {stats.id}
					</Badge>
					<Badge variant="secondary" className="text-xs">
						{stats.roleCount} vai trò
					</Badge>
				</div>
			</div>

			<Separator />

			{/* Roles that have this permission */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Vai trò được gán</CardTitle>
				</CardHeader>
				<CardContent>
					{permission.rolePermissions && permission.rolePermissions.length > 0 ? (
						<div className="space-y-2">
							{permission.rolePermissions.map((rp) => (
								<div key={rp.roleId} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
									<div>
										<p className="font-medium text-sm">{rp.role?.name || `Role ${rp.roleId}`}</p>
										{rp.role?.description && (
											<p className="text-xs text-gray-500">{rp.role.description}</p>
										)}
									</div>
									<Badge variant="outline" className="text-xs">
										ID: {rp.roleId}
									</Badge>
								</div>
							))}
						</div>
					) : (
						<p className="text-sm text-gray-500">Chưa có vai trò nào được gán permission này.</p>
					)}
				</CardContent>
			</Card>

			{/* Permission Information */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Thông tin chi tiết</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div>
							<span className="font-medium text-gray-500">ID:</span>
							<span className="ml-2">{permission.id}</span>
						</div>
						<div>
							<span className="font-medium text-gray-500">Tên:</span>
							<span className="ml-2 font-mono">{permission.name}</span>
						</div>
						<div>
							<span className="font-medium text-gray-500">Module:</span>
							<span className="ml-2">{permission.module}</span>
						</div>
						<div>
							<span className="font-medium text-gray-500">Vai trò:</span>
							<span className="ml-2">{stats.roleCount}</span>
						</div>
					</div>
					
					{permission.description && (
						<div className="mt-4 pt-4 border-t">
							<span className="font-medium text-gray-500">Mô tả:</span>
							<p className="mt-1 text-sm">{permission.description}</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
