'use client'

import { AcademicYearsContainer } from '@/modules/academic-years/components'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AcademicYearsPage() {
	return (
		<div className="container mx-auto p-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl font-bold">Quản lý năm học</CardTitle>
				</CardHeader>
				<CardContent>
					<AcademicYearsContainer />
				</CardContent>
			</Card>
		</div>
	)
}
