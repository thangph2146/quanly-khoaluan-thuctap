'use client'

import { PageHeader } from '@/components/common'
import { SemestersContainer } from '@/modules/semesters'
import type { FC } from 'react'

const SemestersPage: FC = () => {
	return (
		<div className="container mx-auto py-6 space-y-6 p-4">
			<PageHeader
				title="Quản lý Học kỳ"
				description="Quản lý các học kỳ trong hệ thống"
				breadcrumbs={[
					{ label: 'Trang chủ', href: '/' },
					{ label: 'Học kỳ', href: '/academic/semesters' },
				]}
			>
				<div></div>
			</PageHeader>
			<SemestersContainer />
		</div>
	)
}

export default SemestersPage
