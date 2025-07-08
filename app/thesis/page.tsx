'use client'

import React from 'react'
import { PageHeader } from '@/components/common'
import { ThesesContainer } from '@/modules/thesis/components/ThesesContainer'

export default function ThesisPage() {
	return (
		<div className="container mx-auto py-6 space-y-6 p-4">
			{/* Page Header */}
			<PageHeader
				title="Quản lý Khóa luận"
				description="Quản lý các khóa luận tốt nghiệp trong hệ thống"
				breadcrumbs={[
					{ label: 'Trang chủ', href: '/' },
					{ label: 'Khóa luận', href: '/thesis' },
				]}
			>
				<div></div>
			</PageHeader>

			{/* Thesis Management Container */}
			<ThesesContainer />
		</div>
	)
}
