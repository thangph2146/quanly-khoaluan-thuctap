'use client'

import { StudentsContainer } from '@/modules/students/components'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function StudentsPage() {
	return (
		<div className="container mx-auto p-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl font-bold">Quản lý sinh viên</CardTitle>
				</CardHeader>
				<CardContent>
					<StudentsContainer />
				</CardContent>
			</Card>
		</div>
	)
}
