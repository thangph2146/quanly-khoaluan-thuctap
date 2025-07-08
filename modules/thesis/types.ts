import { AcademicYear } from "@/modules/academic-years/types";
import { Semester } from "@/modules/semesters/types";
import { Student } from "@/modules/students/types";

// Thesis status type
export type ThesisStatus =
  | "COMPLETED"
  | "IN_PROGRESS"
  | "PENDING_DEFENSE"
  | "APPROVED"
  | "OVERDUE"
  | "CANCELLED";

// Based on Thesis.cs - simplified to match backend exactly
export interface Thesis {
  id: number;
  title: string;
  studentId: number;
  student: Student;
  academicYearId: number;
  academicYear: AcademicYear;
  semesterId: number;
  semester: Semester;
  submissionDate: string;
  status?: ThesisStatus; // Optional since not always returned from API
  supervisorId?: number; // Optional supervisor
  supervisor?: {
    id: number;
    fullName: string;
    email?: string;
  };
}

// Additional types for thesis defense
export interface CouncilMember {
  id: string;
  name: string;
  title: string;
  role: "CHAIR" | "MEMBER" | "SECRETARY";
  department: string;
}

export interface DefenseRoom {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
}

export interface DefenseSchedule {
  id: string;
  thesis: {
    id: string;
    title: string;
    student: {
      id: string;
      name: string;
      studentCode: string;
    };
  };
  room: DefenseRoom;
  dateTime: string;
  duration: number;
  councilMembers: CouncilMember[];
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
}

// Create and Update types for thesis
export interface CreateThesisData {
  title: string;
  description?: string;
  studentId: number;
  supervisor: string;
  academicYearId: number;
  semesterId: number;
  status?: string;
  submissionDate: string;
}

export interface UpdateThesisData {
  title?: string;
  description?: string;
  studentId?: number;
  supervisor?: string;
  academicYearId?: number;
  semesterId?: number;
  status?: string;
}

// CRUD types for thesis operations
export interface CreateThesisData {
  title: string;
  studentId: number;
  academicYearId: number;
  semesterId: number;
  supervisorId?: number;
}

export interface UpdateThesisData {
  title?: string;
  studentId?: number;
  academicYearId?: number;
  semesterId?: number;
  supervisorId?: number;
  status?: string;
}

// Props for thesis components
export interface ThesisListProps {
  theses: Thesis[];
  isLoading: boolean;
  onCreate: () => void;
  onEdit: (thesis: Thesis) => void;
  onDelete: (thesis: Thesis) => void;
  onView?: (thesis: Thesis) => void;
}

export interface ThesisFormProps {
  thesis?: Thesis | null;
  students: Student[];
  academicYears: AcademicYear[];
  semesters: Semester[];
  onSubmit: (data: CreateThesisData | UpdateThesisData) => void;
  onCancel: () => void;
  isLoading: boolean;
  mode: "create" | "edit";
}

export interface ThesisDetailsProps {
  thesis: Thesis;
}
