'use client'

import { PageHeader } from '@/components/common'
import { DepartmentsContainer } from '@/modules/departments'
import { LecturerList } from '@/modules/lecturers'
import type { FC } from 'react'

const DepartmentsPage: FC = () => {
	const departmentId = 1 // TODO: lấy id động từ state/router
	return (
		<div className="container mx-auto py-6 space-y-6 p-4">
			<PageHeader
				title="Quản lý Đơn vị"
				description="Quản lý các đơn vị trong hệ thống"
				breadcrumbs={[
					{ label: 'Trang chủ', href: '/' },
					{ label: 'Đơn vị', href: '/academic/departments' },
				]}
			>
				<DepartmentsContainer />

			</PageHeader>
		</div>
	)
}

export default DepartmentsPage
