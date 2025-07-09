/**
 * Unified Lecturers Container Component
 * Manages lecturers with optional department filtering
 */
"use client";

import React, { useState, useMemo } from "react";
import { LecturerList } from "./LecturerList";
import { LecturerForm } from "./LecturerForm";
import { LecturerDetails } from "./LecturerDetails";
import { useLecturers, useLecturerActions, useDepartments } from "../hooks";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, X, Search } from "lucide-react";
import type {
  Lecturer,
  CreateLecturerData,
  UpdateLecturerData,
} from "../types";

interface UnifiedLecturersContainerProps {
  /** Enable department filtering - show department filter UI */
  showDepartmentFilter?: boolean;
  /** Default department ID to filter by */
  defaultDepartmentId?: string | number;
  /** Enable department info display when a department is selected */
  showDepartmentInfo?: boolean;
}

export function UnifiedLecturersContainer({
  showDepartmentFilter = false,
  defaultDepartmentId,
  showDepartmentInfo = false,
}: UnifiedLecturersContainerProps) {
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer | null>(
    null
  );
  const [sheetMode, setSheetMode] = useState<"create" | "edit">("create");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>(
    defaultDepartmentId ? defaultDepartmentId.toString() : "all"
  );
  const [showFilterUI, setShowFilterUI] = useState(showDepartmentFilter);
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Build search parameters
  const searchParams = useMemo(() => {
    const params: any = {};

    if (
      (showDepartmentFilter || showFilterUI) &&
      selectedDepartmentId &&
      selectedDepartmentId !== "all"
    ) {
      params.departmentId = parseInt(selectedDepartmentId);
    }

    if (debouncedSearchTerm.trim()) {
      params.search = debouncedSearchTerm.trim();
    }

    return Object.keys(params).length > 0 ? params : undefined;
  }, [
    selectedDepartmentId,
    debouncedSearchTerm,
    showDepartmentFilter,
    showFilterUI,
  ]);

  const { lecturers, isLoading, refetch } = useLecturers(searchParams);
  const { departments, isLoading: isLoadingDepartments } = useDepartments();
  const {
    createLecturer,
    updateLecturer,
    deleteLecturer,
    isCreating,
    isUpdating,
    isDeleting,
  } = useLecturerActions(refetch);

  // Since we're now filtering via API, we don't need client-side filtering
  const filteredLecturers = lecturers;

  // Get selected department info
  const selectedDepartment = useMemo(() => {
    if (
      !(showDepartmentFilter || showFilterUI) ||
      !selectedDepartmentId ||
      selectedDepartmentId === "all"
    ) {
      return null;
    }
    return departments.find(
      (dept) => dept.id === parseInt(selectedDepartmentId)
    );
  }, [departments, selectedDepartmentId, showDepartmentFilter, showFilterUI]);

  const handleCreate = () => {
    setSheetMode("create");
    setSelectedLecturer(null);
    setSheetOpen(true);
  };

  const handleEdit = (lecturer: Lecturer) => {
    setSheetMode("edit");
    setSelectedLecturer(lecturer);
    setSheetOpen(true);
  };

  const handleDelete = (lecturer: Lecturer) => {
    setSelectedLecturer(lecturer);
    setDeleteDialogOpen(true);
  };

  const handleView = (lecturer: Lecturer) => {
    setSelectedLecturer(lecturer);
    setDetailsDialogOpen(true);
  };

  const handleFormSubmit = async (
    data: CreateLecturerData | UpdateLecturerData
  ) => {
    try {
      // If creating and a department is selected, set it as default
      if (
        sheetMode === "create" &&
        selectedDepartmentId &&
        selectedDepartmentId !== "all" &&
        !data.departmentId
      ) {
        data.departmentId = parseInt(selectedDepartmentId);
      }

      if (sheetMode === "create") {
        await createLecturer(data as CreateLecturerData);
      } else if (selectedLecturer) {
        await updateLecturer(selectedLecturer.id, data as UpdateLecturerData);
      }
      setSheetOpen(false);
      setSelectedLecturer(null);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedLecturer) {
      const success = await deleteLecturer(selectedLecturer.id);
      if (success) {
        setDeleteDialogOpen(false);
        setSelectedLecturer(null);
      }
    }
  };

  const toggleFilter = () => {
    setShowFilterUI(!showFilterUI);
    if (showFilterUI) {
      setSelectedDepartmentId("all");
    }
  };

  const clearFilter = () => {
    setSelectedDepartmentId("all");
    setSearchTerm("");
  };

  const isFormLoading = isCreating || isUpdating;

  return (
    <div className="space-y-6">
      {/* Department Filter (Conditional) */}
      {(showDepartmentFilter || showFilterUI) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Lọc theo Khoa/Đơn vị
                </CardTitle>
                <CardDescription>
                  {showDepartmentFilter || showFilterUI
                    ? "Chọn khoa/đơn vị để xem danh sách giảng viên thuộc đơn vị đó"
                    : "Hiển thị tất cả giảng viên trong hệ thống"}
                </CardDescription>
              </div>
              {!showDepartmentFilter && (
                <Button variant="outline" size="sm" onClick={toggleFilter}>
                  {showFilterUI ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Ẩn bộ lọc
                    </>
                  ) : (
                    <>
                      <Filter className="h-4 w-4 mr-2" />
                      Hiện bộ lọc
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          {(showDepartmentFilter || showFilterUI) && (
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 space-y-4">
                {/* Search Input */}
                <div className="flex gap-4 items-end mb-0">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="search-input">Tìm kiếm</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search-input"
                        placeholder="Tìm theo tên, email hoặc chuyên môn..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Department Filter */}
                <div className="flex gap-4 items-end">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="department-filter">Khoa/Đơn vị</Label>
                    <Select
                      value={selectedDepartmentId}
                      onValueChange={setSelectedDepartmentId}
                      disabled={isLoadingDepartments}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            isLoadingDepartments
                              ? "Đang tải..."
                              : "Chọn tất cả hoặc một khoa/đơn vị"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả khoa/đơn vị</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id.toString()}>
                            {dept.name} ({dept.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {(selectedDepartmentId !== "all" || searchTerm.trim()) && (
                    <Button variant="outline" size="sm" onClick={clearFilter}>
                      <X className="h-4 w-4 mr-2" />
                      Xóa bộ lọc
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Department Info (Conditional) */}
      {showDepartmentInfo && selectedDepartment && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedDepartment.name}</CardTitle>
            <CardDescription>
              Mã đơn vị: {selectedDepartment.code} • Số lượng giảng viên:{" "}
              {filteredLecturers.length}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Lecturers List */}
      <LecturerList
        lecturers={filteredLecturers}
        isLoading={isLoading}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {/* Create/Edit Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>
              {sheetMode === "create"
                ? "Tạo giảng viên mới"
                : "Chỉnh sửa giảng viên"}
            </SheetTitle>
            <SheetDescription>
              {sheetMode === "create"
                ? `Điền thông tin để tạo một giảng viên mới${
                    selectedDepartment ? ` cho ${selectedDepartment.name}` : ""
                  }`
                : "Cập nhật thông tin cho giảng viên đã chọn"}
            </SheetDescription>
          </SheetHeader>
          <LecturerForm
            lecturer={selectedLecturer}
            onSubmit={handleFormSubmit}
            onCancel={() => setSheetOpen(false)}
            isLoading={isFormLoading}
            mode={sheetMode}
          />
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa giảng viên "{selectedLecturer?.name}"
              không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Lecturer Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết giảng viên</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về giảng viên được chọn
            </DialogDescription>
          </DialogHeader>
          {selectedLecturer && <LecturerDetails lecturer={selectedLecturer} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
