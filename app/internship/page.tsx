'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
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
import { getColumns } from './columns'
import { internshipsData, students, partners, academicYears, semesters } from '@/modules/internship/data'
import { Internship } from '@/modules/internship/types'


// Form Component
const InternshipForm = ({
	internship,
	onSave,
	onCancel,
}: {
	internship?: Internship | null
	onSave: (data: Partial<Internship>) => void
	onCancel: () => void
}) => {
	const [formData, setFormData] = useState({
		studentId: internship?.studentId?.toString() || '',
		partnerId: internship?.partnerId?.toString() || '',
		academicYearId: internship?.academicYearId?.toString() || '',
		semesterId: internship?.semesterId?.toString() || '',
		reportUrl: internship?.reportUrl || '',
		grade: internship?.grade?.toString() || '',
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
			partnerId: parseInt(formData.partnerId),
			academicYearId: parseInt(formData.academicYearId),
			semesterId: parseInt(formData.semesterId),
			grade: formData.grade ? parseFloat(formData.grade) : null,
			reportUrl: formData.reportUrl || null,
		}
		onSave(saveData)
	}

	return (
		<div className="space-y-4 py-4">
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
						{students.map((student) => (
							<SelectItem key={student.id} value={student.id.toString()}>
								{student.studentCode} - {student.fullName}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="space-y-2">
				<Label htmlFor="partnerId">Doanh nghiệp</Label>
				<Select
					value={formData.partnerId.toString()}
					onValueChange={(value) => handleSelectChange('partnerId', value)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Chọn doanh nghiệp" />
					</SelectTrigger>
					<SelectContent>
						{partners.map((partner) => (
							<SelectItem key={partner.id} value={partner.id.toString()}>
								{partner.name}
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
							{academicYears.map((year) => (
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
							{semesters.map((semester) => (
								<SelectItem key={semester.id} value={semester.id.toString()}>
									{semester.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="grade">Điểm số</Label>
					<Input
						id="grade"
						name="grade"
						type="number"
						min="0"
						max="10"
						step="0.1"
						value={formData.grade}
						onChange={handleChange}
						placeholder="Nhập điểm (0-10)"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="reportUrl">URL báo cáo</Label>
					<Input
						id="reportUrl"
						name="reportUrl"
						type="url"
						value={formData.reportUrl}
						onChange={handleChange}
						placeholder="Nhập URL báo cáo thực tập"
					/>
				</div>
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
export default function InternshipPage() {
	const [internships, setInternships] = useState<Internship[]>(internshipsData)
	const [isSheetOpen, setSheetOpen] = useState(false)
	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null)
    const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create')

	const handleCreate = (data: Partial<Internship>) => {
		const newInternship: Internship = {
			id: Math.max(...internships.map(i => i.id), 0) + 1,
			...data,
            student: students.find(s => s.id === data.studentId)!,
            partner: partners.find(p => p.id === data.partnerId)!,
            academicYear: academicYears.find(y => y.id === data.academicYearId)!,
            semester: semesters.find(s => s.id === data.semesterId)!,
		} as Internship
		setInternships(prev => [...prev, newInternship])
		setSheetOpen(false)
		setDeleteDialogOpen(false)
		setSelectedInternship(null)
	}

	const handleUpdate = (data: Partial<Internship>) => {
		if (!selectedInternship) return
		setInternships(prev =>
			prev.map(i => {
                if (i.id === selectedInternship.id) {
                    return { 
                        ...i, 
                        ...data,
                        student: students.find(s => s.id === data.studentId)!,
                        partner: partners.find(p => p.id === data.partnerId)!,
                        academicYear: academicYears.find(y => y.id === data.academicYearId)!,
                        semester: semesters.find(s => s.id === data.semesterId)!,
                    }
                }
                return i
            })
		)
		setSheetOpen(false)
		setSelectedInternship(null)
	}

	const handleDelete = () => {
		if (!selectedInternship) return
		setInternships(prev => prev.filter(i => i.id !== selectedInternship.id))
		setDeleteDialogOpen(false)
		setSelectedInternship(null)
	}

	const openSheet = (mode: 'create' | 'edit', internship?: Internship) => {
        setSheetMode(mode)
        setSelectedInternship(internship || null)
        setSheetOpen(true)
    }

	const openDeleteDialog = (internship: Internship) => {
		setSelectedInternship(internship)
		setDeleteDialogOpen(true)
	}

	const columns = getColumns({
		onEdit: (internship) => openSheet('edit', internship),
		onDelete: openDeleteDialog,
		onView: (internship) => console.log('View', internship), // Placeholder for now
	})

	const breadcrumbs = [
		{ label: 'Hệ thống Quản lý', href: '/dashboard' },
		{ label: 'Thực tập' },
	]

	return (
		<>
			<PageHeader
				title="Quản lý Thực tập"
				description="Quản lý danh sách sinh viên thực tập tại các doanh nghiệp."
				breadcrumbs={breadcrumbs}
				actions={
                    <Button onClick={() => openSheet('create')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm đợt thực tập
                    </Button>
				}
			>
				<DataTable
					columns={columns}
					data={internships}
					searchableColumn="studentFullName"
					searchPlaceholder="Tìm kiếm theo tên sinh viên..."
				/>
			</PageHeader>
            
			{/* Create/Edit Sheet */}
			<Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
				<SheetContent className="sm:max-w-xl">
					<SheetHeader>
						<SheetTitle>{sheetMode === 'create' ? 'Thêm mới' : 'Chỉnh sửa thông tin'}</SheetTitle>
						<SheetDescription>
                            {sheetMode === 'create' ? 'Điền thông tin để thêm một đợt thực tập mới.' : 'Cập nhật thông tin cho đợt thực tập đã chọn.'}
                        </SheetDescription>
					</SheetHeader>
					<InternshipForm
                        internship={sheetMode === 'edit' ? selectedInternship : null} 
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
							Hành động này không thể được hoàn tác. Dữ liệu thực tập của sinh viên &quot;{selectedInternship?.student.fullName}&quot; tại &quot;{selectedInternship?.partner.name}&quot; sẽ bị xóa vĩnh viễn.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setSelectedInternship(null)}>Hủy</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
} 