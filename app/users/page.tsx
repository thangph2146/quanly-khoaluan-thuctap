'use client'

import React from 'react'
import { PageHeader } from '@/components/common'
import { UsersContainer } from '@/modules/users/components'

export default function UsersPage() {
	return (
		<div className="container mx-auto py-6 space-y-6 p-4">
			{/* Page Header */}
			<PageHeader
				title="Quản lý Người dùng"
				description="Thêm, sửa, xóa và quản lý tài khoản người dùng trong hệ thống"
				breadcrumbs={[
					{ label: 'Trang chủ', href: '/' },
					{ label: 'Người dùng', href: '/users' },
				]}
			>
				<div></div>
			</PageHeader>

			{/* Users Container */}
			<UsersContainer />
		</div>
	)
}
