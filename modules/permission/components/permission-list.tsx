/**
 * Permission List Component
 * Main component for displaying permissions list
 */
import React, { useState } from 'react'
import { Plus, Search, Filter, Grid3X3, Table } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { PermissionTable } from './permission-table'
import { PermissionModuleView } from './permission-module-view'
import { usePermissionFilters } from '../hooks/use-permissions'
import type { Permission } from '../types'

interface PermissionListProps {
	permissions: Permission[]
	modules: string[]
	isLoading?: boolean
	onEdit: (permission: Permission) => void
	onDelete: (permission: Permission) => void
	onView: (permission: Permission) => void
	onCreate: () => void
}

export const PermissionList: React.FC<PermissionListProps> = ({
	permissions,
	modules,
	isLoading = false,
	onEdit,
	onDelete,
	onView,
	onCreate,
}) => {
	const [viewMode, setViewMode] = useState<'table' | 'module'>('table')
	
	const {
		searchTerm,
		selectedModule,
		sortBy,
		sortOrder,
		filteredPermissions,
		setSearchTerm,
		setSelectedModule,
		setSortBy,
		setSortOrder,
		resetFilters,
	} = usePermissionFilters(permissions)

	const handleSortChange = (field: string) => {
		if (sortBy === field) {
			setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
		} else {
			setSortBy(field as 'name' | 'module')
			setSortOrder('asc')
		}
	}

	return (
		<div className="w-full flex flex-col gap-4 p-4">
			{/* Header */}
			<div className="flex justify-end items-center">
				<Button onClick={onCreate} className="flex items-center gap-2">
					<Plus className="h-4 w-4" />
					Thêm Permission
				</Button>
			</div>

			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Filter className="h-4 w-4" />
						Bộ lọc
					</CardTitle>
					<CardDescription>
						Tìm kiếm và lọc permissions theo điều kiện
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						{/* Search */}
						<div className="space-y-2">
							<Label htmlFor="search">Tìm kiếm</Label>
							<div className="relative">
								<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
								<Input
									id="search"
									placeholder="Tìm theo tên hoặc module..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10"
								/>
							</div>
						</div>

						{/* Module Filter */}
						<div className="space-y-2">
							<Label>Module</Label>
							<Select value={selectedModule} onValueChange={setSelectedModule}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Tất cả modules" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Tất cả modules</SelectItem>
									{modules.map((module) => (
										<SelectItem key={module} value={module}>
											{module}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Sort By */}
						<div className="space-y-2">
							<Label>Sắp xếp theo</Label>
							<Select value={sortBy} onValueChange={(value) => setSortBy(value as 'name' | 'module')}>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="name">Tên</SelectItem>
									<SelectItem value="module">Module</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Sort Order */}
						<div className="space-y-2">
							<Label>Thứ tự</Label>
							<Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="asc">Tăng dần</SelectItem>
									<SelectItem value="desc">Giảm dần</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Filter Summary */}
					<div className="flex items-center justify-between mt-4 pt-4 border-t">
						<div className="flex items-center gap-2">
							<span className="text-sm text-muted-foreground">
								Hiển thị {filteredPermissions.length} / {permissions.length} permissions
							</span>
							{(searchTerm || (selectedModule && selectedModule !== 'all')) && (
								<Button
									variant="outline"
									size="sm"
									onClick={resetFilters}
									className="h-8"
								>
									Xóa bộ lọc
								</Button>
							)}
						</div>

						{/* View Mode Toggle */}
						<div className="flex items-center gap-2">
							<span className="text-sm text-muted-foreground">Chế độ xem:</span>
							<div className="flex border rounded-md">
								<Button
									variant={viewMode === 'table' ? 'default' : 'ghost'}
									size="sm"
									onClick={() => setViewMode('table')}
									className="rounded-r-none"
								>
									<Table className="h-4 w-4" />
								</Button>
								<Button
									variant={viewMode === 'module' ? 'default' : 'ghost'}
									size="sm"
									onClick={() => setViewMode('module')}
									className="rounded-l-none"
								>
									<Grid3X3 className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Content */}
			<div className="space-y-4">
				{isLoading ? (
					<div className="flex justify-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
					</div>
				) : filteredPermissions.length === 0 ? (
					<Card>
						<CardContent className="flex flex-col items-center justify-center py-8">
							<div className="text-muted-foreground text-center">
								<p className="text-lg font-medium">Không có permission nào</p>
								<p className="text-sm mt-2">
									{searchTerm || (selectedModule && selectedModule !== 'all')
										? 'Thử điều chỉnh bộ lọc hoặc tạo permission mới'
										: 'Tạo permission đầu tiên để bắt đầu'
									}
								</p>
							</div>
							<Button onClick={onCreate} className="mt-4">
								<Plus className="h-4 w-4 mr-2" />
								Tạo Permission
							</Button>
						</CardContent>
					</Card>
				) : (
					<>
						{viewMode === 'table' ? (
							<PermissionTable
								permissions={filteredPermissions}
								onEdit={onEdit}
								onDelete={onDelete}
								onView={onView}
								sortBy={sortBy}
								sortOrder={sortOrder}
								onSort={handleSortChange}
							/>
						) : (
							<PermissionModuleView
								permissions={filteredPermissions}
								onEdit={onEdit}
								onDelete={onDelete}
								onView={onView}
							/>
						)}
					</>
				)}
			</div>
		</div>
	)
}
