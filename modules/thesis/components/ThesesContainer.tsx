/**
 * Thesis Container Component
 * Manages state and actions for thesis
 */
"use client";

import React, { useState, useMemo, useCallback } from "react";
import { ThesisList } from "./ThesisList";
import { ThesisForm } from "./ThesisForm";
import { ThesisDetails } from "./ThesisDetails";
import { useTheses, useThesisActions } from "../hooks";
import { useStudents } from "@/modules/students/hooks";
import { useAcademicYears } from "@/modules/academic-years/hooks";
import { useSemesters } from "@/modules/semesters/hooks";
import { useLecturers } from "@/modules/lecturers/hooks";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Thesis } from "../types";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { CreateThesisData, UpdateThesisData } from "@/lib/api/theses.api";
import { Student } from "@/modules/students/types";
import { logger } from "@/lib/utils/logger";
import { useDebounce } from "@/hooks/use-debounce";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/common/page-header";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";

export function ThesesContainer() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [thesisToDelete, setThesisToDelete] = useState<Thesis | null>(null);
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const [thesisToView, setThesisToView] = useState<Thesis | null>(null);

  // Pagination/filter state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Build params for API
  const params = useMemo(() => {
    const p: any = { page, limit };
    if (debouncedSearch.trim()) p.search = debouncedSearch.trim();
    return p;
  }, [page, limit, debouncedSearch]);

  const { theses, total, isLoading, error, refetch } = useTheses(params);

  const {
    createThesis,
    updateThesis,
    deleteThesis,
    isCreating,
    isUpdating,
    isDeleting,
  } = useThesisActions(refetch);

  // Data for forms
  const { students } = useStudents();
  const { academicYears } = useAcademicYears();
  const { semesters } = useSemesters();
  const lecturerParams = useMemo(() => ({ isActive: true }), []);
  const { lecturers } = useLecturers(lecturerParams);

  // Handler functions
  const handleCreate = useCallback(() => setIsCreateDialogOpen(true), []);
  const handleEdit = useCallback((thesis: Thesis) => {
    setSelectedThesis(thesis);
    setIsEditDialogOpen(true);
  }, []);
  const handleDelete = useCallback((thesis: Thesis) => {
    setThesisToDelete(thesis);
    setIsDeleteDialogOpen(true);
  }, []);
  const handleView = useCallback((thesis: Thesis) => {
    setThesisToView(thesis);
    setIsDetailsSheetOpen(true);
  }, []);
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setPage(1);
  }, []);

  const handleCreateSubmit = async (
    data: CreateThesisData | UpdateThesisData
  ) => {
    try {
      if (
        "title" in data &&
        typeof data.title === "string" &&
        "studentId" in data &&
        "academicYearId" in data &&
        "semesterId" in data &&
        "submissionDate" in data &&
        "supervisorId" in data
      ) {
        await createThesis(data as CreateThesisData);
        setIsCreateDialogOpen(false);
      } else {
        logger.error("Invalid data for createThesis", data);
      }
    } catch (error) {
      logger.error("Error creating thesis", error);
    }
  };

  const handleEditSubmit = async (
    data: CreateThesisData | UpdateThesisData
  ) => {
    if (!selectedThesis) return;

    try {
      if (
        "title" in data ||
        "studentId" in data ||
        "academicYearId" in data ||
        "semesterId" in data ||
        "submissionDate" in data ||
        "supervisorId" in data
      ) {
        await updateThesis(selectedThesis.id, data as UpdateThesisData);
        setIsEditDialogOpen(false);
        setSelectedThesis(null);
      } else {
        logger.error("Invalid data for updateThesis", data);
      }
    } catch (error) {
      logger.error("Error updating thesis", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!thesisToDelete) return;

    const success = await deleteThesis(thesisToDelete.id);
    if (success) {
      setIsDeleteDialogOpen(false);
      setThesisToDelete(null);
    }
  };

  // Transform data for form
  const formStudents =
    students?.map((student: Student) => ({
      id: student.id?.toString() || "",
      name: student.fullName || "",
      studentId: student.studentCode || "",
    })) || [];

  const formAcademicYears =
    academicYears?.map((year) => ({
      id: year.id?.toString() || "",
      name: year.name || "",
    })) || [];

  const formSemesters =
    semesters?.map((semester) => ({
      id: semester.id?.toString() || "",
      name: semester.name || "",
    })) || [];

  const totalPages = Math.ceil((total || 0) / (limit || 10));

  const filterBar = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="search">Tìm kiếm</Label>
        <Input
          placeholder="Tìm kiếm khóa luận..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
      </div>
    </div>
  );

  return (
    <PageHeader
      title="Quản lý Khóa luận"
      description="Quản lý các khóa luận tốt nghiệp trong hệ thống"
      breadcrumbs={[
        { label: "Trang chủ", href: "/" },
        { label: "Khóa luận", href: "/thesis" },
      ]}
      actions={
        <Button onClick={handleCreate} disabled={isCreating}>
          + Thêm khóa luận
        </Button>
      }
    >
      {/* filterBar is now injected into ThesisList, not rendered here */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <ThesisList
        theses={theses}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        filterBar={filterBar}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        limit={limit}
        onLimitChange={setLimit}
      />

      {/* Create/Edit Sheet */}
      <Sheet
        open={isCreateDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          setIsCreateDialogOpen(false);
          setIsEditDialogOpen(false);
          if (!open) setSelectedThesis(null);
        }}
      >
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>
              {isCreateDialogOpen ? "Tạo khóa luận mới" : "Chỉnh sửa khóa luận"}
            </SheetTitle>
          </SheetHeader>
          <ThesisForm
            thesis={isEditDialogOpen ? selectedThesis : undefined}
            students={formStudents}
            academicYears={formAcademicYears}
            semesters={formSemesters}
            lecturers={
              lecturers?.map((l) => ({
                id: l.id.toString(),
                name: l.name,
                email: l.email,
              })) || []
            }
            onSubmit={
              isCreateDialogOpen ? handleCreateSubmit : handleEditSubmit
            }
            onCancel={() => {
              setIsCreateDialogOpen(false);
              setIsEditDialogOpen(false);
              setSelectedThesis(null);
            }}
            isLoading={isCreateDialogOpen ? isCreating : isUpdating}
            mode={isCreateDialogOpen ? "create" : "edit"}
          />
        </SheetContent>
      </Sheet>

      {/* Details Sheet */}
      <Sheet open={isDetailsSheetOpen} onOpenChange={setIsDetailsSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Chi tiết khóa luận</SheetTitle>
          </SheetHeader>
          {thesisToView && (
            <div className="space-y-4">
              <ThesisDetails thesis={thesisToView} />
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDetailsSheetOpen(false);
                    handleEdit(thesisToView);
                  }}
                >
                  Chỉnh sửa
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsDetailsSheetOpen(false);
                    handleDelete(thesisToView);
                  }}
                >
                  Xóa
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa khóa luận &quot;{thesisToDelete?.title}
              &quot;? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setThesisToDelete(null);
              }}
            >
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageHeader>
  );
}
