'use client'

import React from 'react'
import { PageHeader } from '@/components/common'
import { RolesContainer } from '@/modules/roles/components'

export default function RolesPage() {
	return (
		<div className="container mx-auto py-6 space-y-6 p-4">
			{/* Page Header */}
			<PageHeader
				title="Quản lý Vai trò"
				description="Thêm, sửa, xóa và quản lý vai trò trong hệ thống"
				breadcrumbs={[
					{ label: 'Trang chủ', href: '/' },
					{ label: 'Vai trò', href: '/roles' },
				]}
			>
				<div></div>
			</PageHeader>

			{/* Roles Container */}
			<RolesContainer />
		</div>
	)
}
