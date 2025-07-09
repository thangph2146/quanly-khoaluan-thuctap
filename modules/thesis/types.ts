// Thesis status type
export type ThesisStatus =
  | "Draft"
  | "Submitted"
  | "Approved"
  | "Rejected"
  | "IN_PROGRESS"
  | "COMPLETED";

// Lecturer type for thesis
export interface Lecturer {
  id: number;
  name: string;
  email?: string;
  specialization?: string;
  department?: string;
}

// Based on ThesisDto.cs from backend
export interface Thesis {
  id: number;
  title: string;
  description?: string;
  studentId: number;
  studentName?: string;
  studentCode?: string;
  supervisorId: number;
  supervisorName?: string;
  supervisorEmail?: string;
  examinerId?: number;
  examinerName?: string;
  examinerEmail?: string;
  academicYearId: number;
  academicYearName?: string;
  semesterId: number;
  semesterName?: string;
  submissionDate: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
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

// Create and Update types for thesis - aligned with CreateThesisDto
export interface CreateThesisData {
  title: string;
  description?: string;
  studentId: number;
  supervisorId: number;
  examinerId?: number;
  academicYearId: number;
  semesterId: number;
  submissionDate: string;
  status?: string;
}

export interface UpdateThesisData {
  title?: string;
  description?: string;
  studentId?: number;
  supervisorId?: number;
  examinerId?: number;
  academicYearId?: number;
  semesterId?: number;
  submissionDate?: string;
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
  students: Array<{ id: string; name: string; studentId: string }>;
  academicYears: Array<{ id: string; name: string }>;
  semesters: Array<{ id: string; name: string }>;
  lecturers: Array<{ id: string; name: string; email?: string }>;
  onSubmit: (data: CreateThesisData | UpdateThesisData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  mode: "create" | "edit";
}

export interface ThesisDetailsProps {
  thesis: Thesis;
}
