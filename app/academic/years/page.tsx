'use client'

import { PageHeader } from '@/components/common'
import { AcademicYearsContainer } from '@/modules/academic-years'
import type { FC } from 'react'

const AcademicYearsPage: FC = () => {
	return (
		<div className="container mx-auto py-6 space-y-6 p-4">
			<PageHeader
				title="Quản lý Năm học"
				description="Quản lý các năm học trong hệ thống"
				breadcrumbs={[
					{ label: 'Trang chủ', href: '/' },
					{ label: 'Năm học', href: '/academic/years' },
				]}
			>
				<div></div>
			</PageHeader>
			<AcademicYearsContainer />
		</div>
	)
}

export default AcademicYearsPage
