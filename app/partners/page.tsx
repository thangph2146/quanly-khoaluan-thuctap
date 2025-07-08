'use client'

import React from 'react'
import { PageHeader } from '@/components/common'
import { PartnersContainer } from '@/modules/partners/components'

export default function PartnersPage() {
	return (
		<div className="container mx-auto py-6 space-y-6 p-4">
			{/* Page Header */}
			<PageHeader
				title="Quản lý Đối tác"
				description="Quản lý các đối tác trong hệ thống"
				breadcrumbs={[
					{ label: 'Trang chủ', href: '/' },
					{ label: 'Đối tác', href: '/partners' },
				]}
			>
				<div></div>
			</PageHeader>

			{/* Partner Container */}
			<PartnersContainer />
		</div>
	)
}
