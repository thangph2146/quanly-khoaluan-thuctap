export interface OverviewStats {
	totalStudents: number
	totalTheses: number
	totalInternships: number
	totalSupervisors: number
	completedTheses: number
	completedInternships: number
	avgThesisGrade: number
	avgInternshipGrade: number
	pendingApprovals: number
	activeProjects: number
}

export interface MonthlyData {
	month: string
	theses: number
	internships: number
	completed: number
}

export interface DepartmentStats {
	name: string
	theses: number
	internships: number
	students: number
	color: string
}

export interface SupervisorPerformance {
	name: string
	theses: number
	avgGrade: number
	completionRate: number
	department: string
}

export interface CompanyStats {
	name: string
	students: number
	avgRating: number
	positions: number
	completionRate: number
}

export type ActivityType = 
    | 'THESIS_APPROVED'
    | 'INTERNSHIP_COMPLETED'
    | 'DEFENSE_SCHEDULED'
    | 'NEW_PARTNER'
    | 'GRADE_SUBMITTED'
    | 'OTHER'

export interface RecentActivity {
	type: ActivityType
	message: string
	time: string
	user: string
} 