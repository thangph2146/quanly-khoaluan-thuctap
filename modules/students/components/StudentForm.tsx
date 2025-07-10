/**
 * Student Form Component
 */
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/common";
import type { StudentFormProps, StudentMutationData } from "../types";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"

const studentFormSchema = z.object({
  fullName: z.string().min(1, "Họ và tên không được để trống."),
  studentCode: z.string().min(1, "Mã sinh viên không được để trống."),
  email: z.string().email("Email không hợp lệ."),
  phoneNumber: z.string().min(10, "Số điện thoại phải có ít nhất 10 chữ số.").regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa số."),
  dateOfBirth: z.string().min(1, "Ngày sinh không được để trống."),
});

export const StudentForm = React.memo(function StudentForm({
  student,
  onSubmit,
  onCancel,
  isLoading,
  mode,
  isOpen,
  title,
}: StudentFormProps) {
  const form = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      fullName: "",
      studentCode: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
        if (student && mode === 'edit') {
            form.reset({
              fullName: student.fullName || '',
              studentCode: student.studentCode || '',
              email: student.email || '',
              phoneNumber: student.phoneNumber || '',
              dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '',
            });
          } else {
            form.reset({
                fullName: "",
                studentCode: "",
                email: "",
                phoneNumber: "",
                dateOfBirth: "",
            });
          }
    }
  }, [student, mode, isOpen, form.reset]);

  function handleFormSubmit(data: z.infer<typeof studentFormSchema>) {
    onSubmit(data as StudentMutationData);
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onCancel()}
      title={title}
      className="sm:max-w-lg"
    >
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="space-y-4 p-2"
            >
                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Họ và tên *</FormLabel>
                        <FormControl>
                            <Input placeholder="Nhập họ và tên" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="studentCode"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Mã sinh viên *</FormLabel>
                        <FormControl>
                            <Input placeholder="Ví dụ: 20240001" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Ngày sinh *</FormLabel>
                        <FormControl>
                            <Input type="date" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="email@example.com" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Số điện thoại *</FormLabel>
                        <FormControl>
                            <Input placeholder="Nhập số điện thoại" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Buttons */}
                <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Hủy
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading
                    ? "Đang xử lý..."
                    : mode === "create"
                    ? "Tạo mới"
                    : "Cập nhật"}
                </Button>
                </div>
            </form>
      </Form>
    </Modal>
  );
});
