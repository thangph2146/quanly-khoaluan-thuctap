'use client'

import { PageHeader } from '@/components/common'
import { StudentsContainer } from '@/modules/students'
import type { FC } from 'react'

const StudentsPage: FC = () => {
	return (
		<div className="container mx-auto py-6 space-y-6 p-4">
			<PageHeader
				title="Quản lý Sinh viên"
				description="Quản lý các sinh viên trong hệ thống"
				breadcrumbs={[
					{ label: 'Trang chủ', href: '/' },
					{ label: 'Sinh viên', href: '/academic/students' },
				]}
			>
				<div></div>
			</PageHeader>
			<StudentsContainer />
		</div>
	)
}

export default StudentsPage
