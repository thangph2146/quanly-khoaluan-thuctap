import { Skeleton } from '@/components/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'

export function TableSkeleton({
	columns,
	rows = 5,
}: {
	columns: number
	rows?: number
}) {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						{[...Array(columns)].map((_, i) => (
							<TableHead key={i}>
								<Skeleton className="h-5 w-24" />
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{[...Array(rows)].map((_, i) => (
						<TableRow key={i}>
							{[...Array(columns)].map((_, j) => (
								<TableCell key={j}>
									<Skeleton className="h-5 w-full" />
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
} 