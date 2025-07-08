'use client'

import React from 'react'
import { PageHeader } from '@/components/common'
import { InternshipsContainer } from '@/modules/internship/components'

export default function InternshipPage() {
	return (
		<div className="container mx-auto py-6 space-y-6 p-4">
			{/* Page Header */}
			<PageHeader
				title="Quản lý Thực tập"
				description="Quản lý các đợt thực tập sinh viên trong hệ thống"
				breadcrumbs={[
					{ label: 'Trang chủ', href: '/' },
					{ label: 'Thực tập', href: '/internship' },
				]}
			>
				<div></div>
			</PageHeader>

			{/* Internship Container */}
			<InternshipsContainer />
		</div>
	)
}
