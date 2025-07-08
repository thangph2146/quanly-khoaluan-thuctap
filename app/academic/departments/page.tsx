'use client'

import { DepartmentsContainer } from '@/modules/departments/components'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DepartmentsPage() {
	return (
		<div className="container mx-auto p-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl font-bold">Quản lý đơn vị</CardTitle>
				</CardHeader>
				<CardContent>
					<DepartmentsContainer />
				</CardContent>
			</Card>
		</div>
	)
}
