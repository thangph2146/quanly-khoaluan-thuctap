'use client'

import { SemestersContainer } from '@/modules/semesters/components'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SemestersPage() {
	return (
		<div className="container mx-auto p-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl font-bold">Quản lý học kỳ</CardTitle>
				</CardHeader>
				<CardContent>
					<SemestersContainer />
				</CardContent>
			</Card>
		</div>
	)
}
