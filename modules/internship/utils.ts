'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import {
	CheckCircle,
	Clock,
	AlertCircle,
	XCircle,
	Star,
} from 'lucide-react'

export const getStatusBadge = (status: string) => {
	switch (status) {
		case 'APPROVED':
			return (
				<Badge variant="outline" className="text-blue-600 border-blue-600">
					Đã phê duyệt
				</Badge>
			)
		case 'IN_PROGRESS':
			return (
				<Badge
					variant="outline"
					className="text-green-600 border-green-600"
				>
					Đang thực tập
				</Badge>
			)
		case 'PENDING_EVALUATION':
			return (
				<Badge
					variant="outline"
					className="text-yellow-600 border-yellow-600"
				>
					Chờ đánh giá
				</Badge>
			)
		case 'COMPLETED':
			return (
				<Badge
					variant="outline"
					className="text-emerald-600 border-emerald-600"
				>
					Hoàn thành
				</Badge>
			)
		case 'CANCELLED':
			return (
				<Badge variant="outline" className="text-red-600 border-red-600">
					Đã hủy
				</Badge>
			)
		default:
			return <Badge variant="outline">Không xác định</Badge>
	}
}

export const getStatusIcon = (status: string) => {
	switch (status) {
		case 'APPROVED':
			return <CheckCircle className="h-4 w-4 text-blue-600" />
		case 'IN_PROGRESS':
			return <Clock className="h-4 w-4 text-green-600" />
		case 'PENDING_EVALUATION':
			return <AlertCircle className="h-4 w-4 text-yellow-600" />
		case 'COMPLETED':
			return <CheckCircle className="h-4 w-4 text-emerald-600" />
		case 'CANCELLED':
			return <XCircle className="h-4 w-4 text-red-600" />
		default:
			return <Clock className="h-4 w-4 text-gray-600" />
	}
}

export const renderStars = (rating: number): React.ReactNode => {
	return Array.from({ length: 5 }, (_, i) => (
		<Star
			key={i}
			className={`h-4 w-4 ${
				i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
			}`}
		/>
	))
}