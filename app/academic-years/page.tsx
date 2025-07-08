'use client'

import React from 'react'
import { PageHeader } from '@/components/common'
import { AcademicYearsContainer } from '@/modules/academic-years'

export default function AcademicYearsPage() {
	return (
		<div className="container mx-auto py-6 space-y-6 p-4">
			{/* Page Header */}
			<PageHeader
				title="Quản lý Năm học"
				description="Quản lý các năm học trong hệ thống"
				breadcrumbs={[
					{ label: 'Trang chủ', href: '/' },
					{ label: 'Năm học', href: '/academic-years' },
				]}
			>
				<div></div>
			</PageHeader>

			{/* Academic Years Container */}
			<AcademicYearsContainer />
		</div>
	)
}
