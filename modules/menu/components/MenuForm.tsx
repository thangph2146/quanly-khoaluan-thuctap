/**
 * Menu Form Component
 * Form for creating and editing menus with react-hook-form
 */
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/common/combobox";
import { getMenuOptions } from "@/lib/api/selections.api";
import { useDebounce } from "@/hooks/use-debounce";
import type { Menu, CreateMenuData, UpdateMenuData } from "../types";

// Validation schema
const menuFormSchema = z.object({
  name: z.string().min(1, "Tên menu là bắt buộc").max(100, "Tên menu không được quá 100 ký tự"),
  path: z.string().min(1, "Đường dẫn là bắt buộc").regex(/^\//, "Đường dẫn phải bắt đầu bằng dấu /").max(200, "Đường dẫn không được quá 200 ký tự"),
  icon: z.string().optional(),
  parentId: z.any().optional().nullable(),
  displayOrder: z.coerce.number().min(1, "Thứ tự hiển thị tối thiểu là 1").max(999, "Thứ tự hiển thị tối đa là 999"),
});

type MenuFormData = z.infer<typeof menuFormSchema>;

interface MenuFormProps {
  menu?: Menu | null;
  onSubmit: (data: CreateMenuData | UpdateMenuData) => void;
  onCancel: () => void;
  isLoading: boolean;
  mode: "create" | "edit";
}

export function MenuForm({
  menu,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: MenuFormProps) {
  const commonIcons = ["home", "line-chart", "bar-chart", "shield", "users", "graduation-cap", "calendar", "calendar-days", "building", "user-graduate", "book-open", "briefcase", "building2", "menu"];
  const iconOptions = commonIcons.map(icon => ({ value: icon, label: icon }));

  const [parentMenuSearch, setParentMenuSearch] = useState('');
  const debouncedParentMenuSearch = useDebounce(parentMenuSearch, 300);

  const { data: parentMenus, isLoading: isLoadingParentMenus } = useQuery({
      queryKey: ['menuOptions', debouncedParentMenuSearch],
      queryFn: () => getMenuOptions(debouncedParentMenuSearch)
  });

  const form = useForm<MenuFormData>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: {
      name: "",
      path: "",
      icon: "",
      parentId: null,
      displayOrder: 1,
    },
  });

  useEffect(() => {
    if (menu && mode === "edit") {
      form.reset({
        name: menu.name || "",
        path: menu.path || "",
        icon: menu.icon || "",
        parentId: menu.parentId ?? null,
        displayOrder: menu.displayOrder || 1,
      });
    } else {
      form.reset({
        name: "",
        path: "",
        icon: "",
        parentId: null,
        displayOrder: 1,
      });
    }
  }, [menu, mode, form.reset]);

  const handleFormSubmit = (data: MenuFormData) => {
    if (mode === "edit" && menu && data.parentId === menu.id) {
      form.setError("parentId", {
        type: "manual",
        message: "Không thể chọn chính menu này làm menu cha",
      });
      return;
    }

    const submitData = {
      ...data,
      parentId: data.parentId ? Number(data.parentId) : null,
    };
    onSubmit(submitData);
  };

  const filteredParentMenus = (parentMenus || []).filter(
    (parent) => !(mode === 'edit' && menu && parent.id === menu.id)
  );

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 p-4">
      <div className="space-y-2">
        <Label htmlFor="name">Tên menu *</Label>
        <Input id="name" {...form.register("name")} disabled={isLoading} />
        {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="path">Đường dẫn *</Label>
        <Input id="path" {...form.register("path")} disabled={isLoading} />
        {form.formState.errors.path && <p className="text-sm text-destructive">{form.formState.errors.path.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Menu cha</Label>
          <Controller
            name="parentId"
            control={form.control}
            render={({ field }) => (
              <Combobox
                options={filteredParentMenus.map(p => ({ value: p.id, label: p.name }))}
                value={field.value}
                onChange={field.onChange}
                onInputChange={setParentMenuSearch}
                isLoading={isLoadingParentMenus}
                disabled={isLoading}
                placeholder="Chọn menu cha"
                allowClear
              />
            )}
          />
           {form.formState.errors.parentId && typeof form.formState.errors.parentId.message === 'string' && (
            <p className="text-sm text-destructive">{form.formState.errors.parentId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Icon</Label>
          <Controller
            name="icon"
            control={form.control}
            render={({ field }) => (
              <Combobox
                options={iconOptions}
                value={field.value}
                onChange={field.onChange}
                disabled={isLoading}
                placeholder="Chọn icon"
                allowClear
              />
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="displayOrder">Thứ tự hiển thị *</Label>
        <Input id="displayOrder" type="number" {...form.register("displayOrder")} disabled={isLoading} />
        {form.formState.errors.displayOrder && <p className="text-sm text-destructive">{form.formState.errors.displayOrder.message}</p>}
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Hủy
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Đang xử lý..." : mode === "create" ? "Tạo" : "Cập nhật"}
        </Button>
      </div>
    </form>
  );
}
