'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { PageHeader } from '@/components/common'
import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { DataTable } from '@/components/common/data-table'
import { columns } from './columns'
import { thesisData, mockStudents, mockAcademicYears, mockSemesters } from '@/modules/thesis/data'
import { Thesis } from '@/modules/thesis/types'


// Form Component
const ThesisForm = ({
	thesis,
	onSave,
	onCancel,
}: {
	thesis?: Thesis | null
	onSave: (data: Partial<Thesis>) => void
	onCancel: () => void
}) => {
	const [formData, setFormData] = useState({
		title: thesis?.title || '',
		studentId: thesis?.studentId?.toString() || '',
		academicYearId: thesis?.academicYearId?.toString() || '',
		semesterId: thesis?.semesterId?.toString() || '',
		submissionDate: thesis?.submissionDate || '',
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSelectChange = (name: string, value: string) => {
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleFormSave = () => {
		// Convert string IDs to numbers
		const saveData = {
			...formData,
			studentId: parseInt(formData.studentId),
			academicYearId: parseInt(formData.academicYearId),
			semesterId: parseInt(formData.semesterId),
		}
		onSave(saveData)
	}

	return (
		<div className="space-y-4 py-4">
			<div className="space-y-2">
				<Label htmlFor="title">Tên đề tài</Label>
				<Input
					id="title"
					name="title"
					value={formData.title}
					onChange={handleChange}
					placeholder="Nhập tên đề tài khóa luận"
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="studentId">Sinh viên</Label>
				<Select
					value={formData.studentId.toString()}
					onValueChange={(value) => handleSelectChange('studentId', value)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Chọn sinh viên" />
					</SelectTrigger>
					<SelectContent>
						{mockStudents.map((student) => (
							<SelectItem key={student.id} value={student.id.toString()}>
								{student.studentCode} - {student.fullName}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="academicYearId">Niên khóa</Label>
					<Select
						value={formData.academicYearId.toString()}
						onValueChange={(value) => handleSelectChange('academicYearId', value)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Chọn niên khóa" />
						</SelectTrigger>
						<SelectContent>
							{mockAcademicYears.map((year) => (
								<SelectItem key={year.id} value={year.id.toString()}>
									{year.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="semesterId">Học kỳ</Label>
					<Select
						value={formData.semesterId.toString()}
						onValueChange={(value) => handleSelectChange('semesterId', value)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Chọn học kỳ" />
						</SelectTrigger>
						<SelectContent>
							{mockSemesters.map((semester) => (
								<SelectItem key={semester.id} value={semester.id.toString()}>
									{semester.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="submissionDate">Hạn nộp</Label>
				<Input
					id="submissionDate"
					name="submissionDate"
					type="date"
					value={formData.submissionDate}
					onChange={handleChange}
				/>
			</div>

			<SheetFooter className="pt-4">
				<Button variant="outline" onClick={onCancel}>
					Hủy
				</Button>
				<Button onClick={handleFormSave}>Lưu thay đổi</Button>
			</SheetFooter>
		</div>
	)
}


// Main Page Component
export default function ThesisPage() {
	const [theses, setTheses] = useState<Thesis[]>(thesisData)
	const [isSheetOpen, setSheetOpen] = useState(false)
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null)
    const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create')

	const handleCreate = (data: Partial<Thesis>) => {
		const newThesis: Thesis = {
			id: Math.max(...theses.map(t => t.id), 0) + 1,
			...data,
            student: mockStudents.find(s => s.id === data.studentId)!,
            academicYear: mockAcademicYears.find(y => y.id === data.academicYearId)!,
            semester: mockSemesters.find(s => s.id === data.semesterId)!,
		} as Thesis
		setTheses(prev => [...prev, newThesis])
		setSheetOpen(false)
	}

	const handleUpdate = (data: Partial<Thesis>) => {
		if (!selectedThesis) return
		setTheses(prev =>
			prev.map(t => {
                if (t.id === selectedThesis.id) {
                    return { 
                        ...t, 
                        ...data,
                        student: mockStudents.find(s => s.id === data.studentId)!,
                        academicYear: mockAcademicYears.find(y => y.id === data.academicYearId)!,
                        semester: mockSemesters.find(s => s.id === data.semesterId)!,
                    }
                }
                return t
            })
		)
		setSheetOpen(false)
		setSelectedThesis(null)
	}

	const handleDelete = () => {
		if (!selectedThesis) return
		setTheses(prev => prev.filter(t => t.id !== selectedThesis.id))
		setDeleteDialogOpen(false)
		setSelectedThesis(null)
	}

	const openSheet = (mode: 'create' | 'edit', thesis?: Thesis) => {
        setSheetMode(mode)
        setSelectedThesis(thesis || null)
        setSheetOpen(true)
    }

	const openDeleteDialog = (thesis: Thesis) => {
		setSelectedThesis(thesis)
		setDeleteDialogOpen(true)
	}

	const dynamicColumns = columns.map(col => {
		if (col.id === 'actions') {
			return {
				...col,
				cell: ({ row }: { row: { original: Thesis } }) => {
					const thesis = row.original
					return (
						<div className="flex space-x-2">
                            <Button variant="outline" size="icon" onClick={() => alert('View details for ' + thesis.title)}>
								<Eye className="h-4 w-4" />
							</Button>
							<Button variant="outline" size="icon" onClick={() => openSheet('edit', thesis)}>
								<Edit className="h-4 w-4" />
							</Button>
							<Button variant="destructive" size="icon" onClick={() => openDeleteDialog(thesis)}>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					)
				},
			}
		}
		return col
	})

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Khóa luận' },
	]

	return (
		<>
			<PageHeader
				title="Quản lý Khóa luận"
				description="Quản lý danh sách các đề tài khóa luận của sinh viên."
				breadcrumbs={breadcrumbs}
				actions={
                    <Button onClick={() => openSheet('create')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm đề tài
                    </Button>
				}
			>
				<DataTable
					columns={dynamicColumns}
					data={theses}
					searchableColumn="title"
					searchPlaceholder="Tìm theo tên đề tài, sinh viên..."
				/>
			</PageHeader>
            
			{/* Create/Edit Sheet */}
			<Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
				<SheetContent className="sm:max-w-xl">
					<SheetHeader>
						<SheetTitle>{sheetMode === 'create' ? 'Thêm đề tài mới' : 'Chỉnh sửa đề tài'}</SheetTitle>
						<SheetDescription>
                            {sheetMode === 'create' ? 'Điền thông tin để thêm một đề tài mới.' : 'Cập nhật thông tin cho đề tài đã chọn.'}
                        </SheetDescription>
					</SheetHeader>
					<ThesisForm 
                        thesis={sheetMode === 'edit' ? selectedThesis : null} 
                        onSave={sheetMode === 'create' ? handleCreate : handleUpdate} 
                        onCancel={() => setSheetOpen(false)}
                    />
				</SheetContent>
			</Sheet>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
						<AlertDialogDescription>
							Hành động này không thể được hoàn tác. Đề tài &quot;{selectedThesis?.title}&quot; sẽ bị xóa vĩnh viễn.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setSelectedThesis(null)}>Hủy</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
} 