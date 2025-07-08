/**
 * Menu Form Component
 * Form for creating and editing menus with react-hook-form
 */
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DynamicIcon } from "@/lib/utils/icons";
import { logger } from "@/lib/utils/logger";
import type { Menu, CreateMenuData, UpdateMenuData } from "../types";

// Validation schema
const menuFormSchema = z.object({
  name: z
    .string()
    .min(1, "Tên menu là bắt buộc")
    .max(100, "Tên menu không được quá 100 ký tự"),
  path: z
    .string()
    .min(1, "Đường dẫn là bắt buộc")
    .regex(/^\//, "Đường dẫn phải bắt đầu bằng dấu /")
    .max(200, "Đường dẫn không được quá 200 ký tự"),
  icon: z.string().optional(),
  parentId: z.string().optional(),
  displayOrder: z
    .number()
    .min(1, "Thứ tự hiển thị tối thiểu là 1")
    .max(999, "Thứ tự hiển thị tối đa là 999"),
});

type MenuFormData = z.infer<typeof menuFormSchema>;

interface MenuFormProps {
  menu?: Menu | null;
  parentMenus?: Menu[];
  onSubmit: (data: CreateMenuData | UpdateMenuData) => void;
  onCancel: () => void;
  isLoading: boolean;
  mode: "create" | "edit";
}

export function MenuForm({
  menu,
  parentMenus = [],
  onSubmit,
  onCancel,
  isLoading,
  mode,
}: MenuFormProps) {
  // Common icons used in the API response - extracted from actual data
  const commonIcons = [
    "home",
    "line-chart", 
    "bar-chart",
    "shield",
    "users",
    "graduation-cap",
    "calendar",
    "calendar-days",
    "building",
    "user-graduate",
    "book-open",
    "briefcase",
    "building2",
    "menu",
  ];

  const form = useForm<MenuFormData>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: {
      name: "",
      path: "",
      icon: "",
      parentId: "",
      displayOrder: 1,
    },
  });

  // Update form when menu data changes
  useEffect(() => {
    logger.lifecycle("MenuForm", "useEffect triggered", { menu: menu?.id, mode });
    
    if (menu && mode === "edit") {
      logger.debug("Setting form data for edit mode", {
        menu,
        parentId: menu.parentId,
        parentIdString: menu.parentId ? menu.parentId.toString() : "",
      });

      const formData = {
        name: menu.name || "",
        path: menu.path || "",
        icon: menu.icon || "",
        parentId: menu.parentId ? menu.parentId.toString() : "",
        displayOrder: menu.displayOrder || 1,
      };

      logger.debug("Form data to be set", formData);
      form.reset(formData);

      // Fallback: manually set values if reset doesn't work
      setTimeout(() => {
        const currentValues = form.getValues();
        logger.debug("Form values after reset", currentValues);

        // If parentId is still empty but should have a value, set it manually
        if (menu.parentId && !currentValues.parentId) {
          logger.debug("Manually setting parentId", menu.parentId.toString());
          form.setValue("parentId", menu.parentId.toString());
        }

        // If icon is still empty but should have a value, set it manually
        if (menu.icon && !currentValues.icon) {
          logger.debug("Manually setting icon", menu.icon);
          form.setValue("icon", menu.icon);
        }
      }, 100);
    } else if (mode === "create") {
      logger.debug("Resetting form for create mode");
      form.reset({
        name: "",
        path: "",
        icon: "",
        parentId: "",
        displayOrder: 1,
      });
    }
  }, [menu, mode, form]);

  const handleFormSubmit = (data: MenuFormData) => {
    logger.formDebug("MenuForm", "Form submission", data);

    // Additional validation for edit mode
    if (
      mode === "edit" &&
      menu &&
      data.parentId &&
      parseInt(data.parentId) === menu.id
    ) {
      form.setError("parentId", {
        type: "manual",
        message: "Không thể chọn chính menu này làm menu cha",
      });
      return;
    }

    const submitData = {
      ...data,
      parentId: data.parentId ? parseInt(data.parentId) : null,
    };

    onSubmit(submitData);
  };

  // Filter parent menus to exclude current menu and its children when editing
  const getFilteredParentMenus = () => {
    if (mode === "edit" && menu) {
      // Get all child menu IDs recursively
      const getChildMenuIds = (menuItem: Menu): number[] => {
        let ids = [menuItem.id];
        if (menuItem.childMenus && menuItem.childMenus.length > 0) {
          menuItem.childMenus.forEach((child) => {
            ids = ids.concat(getChildMenuIds(child));
          });
        }
        return ids;
      };

      const excludeIds = getChildMenuIds(menu);
      const filtered = parentMenus.filter(
        (parentMenu) => !excludeIds.includes(parentMenu.id)
      );

      logger.debug("Parent menu filtering", {
        mode,
        currentMenuId: menu.id,
        excludeIds,
        allParentMenus: parentMenus.map((m) => ({ 
          id: m.id, 
          name: m.name, 
          path: m.path,
          icon: m.icon 
        })),
        filteredParentMenus: filtered.map((m) => ({ 
          id: m.id, 
          name: m.name, 
          path: m.path,
          icon: m.icon 
        })),
      });

      return filtered;
    }

    logger.debug("No filtering (create mode)", {
      mode,
      parentMenus: parentMenus.map((m) => ({ 
        id: m.id, 
        name: m.name, 
        path: m.path,
        icon: m.icon 
      })),
    });
    return parentMenus;
  };

  const filteredParentMenus = getFilteredParentMenus();

  // Debug info
  const currentFormValues = form.watch();
  logger.groupStart("🐛 MenuForm Debug Info");
  logger.debug("Component state", {
    mode,
    menu: menu ? {
      id: menu.id,
      name: menu.name,
      path: menu.path,
      icon: menu.icon,
      parentId: menu.parentId,
      displayOrder: menu.displayOrder
    } : null,
    formValues: currentFormValues,
    parentMenusCount: filteredParentMenus.length,
    firstFewParentMenus: filteredParentMenus.slice(0, 3).map((m) => ({
      id: m.id,
      name: m.name,
      path: m.path,
      icon: m.icon
    }))
  });
  logger.groupEnd();

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="max-h-[85vh] px-1">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6 p-4"
          >
            {/* Menu Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên menu *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên menu" {...field} />
                  </FormControl>
                  <FormDescription>
                    Tên hiển thị của menu trong hệ thống
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Path */}
            <FormField
              control={form.control}
              name="path"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đường dẫn *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Đường dẫn (vd: /dashboard, /users, /academic)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Đường dẫn URL của menu. Phải bắt đầu bằng dấu /
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Icon Selection */}
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value === "none" ? "" : value)
                    }
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn icon hoặc để trống" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded border border-dashed border-muted-foreground"></div>
                          <span>Không có icon</span>
                        </div>
                      </SelectItem>
                      {commonIcons.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          <div className="flex items-center gap-2">
                            <DynamicIcon name={icon} size={16} className="text-muted-foreground" />
                            <span>{icon}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {field.value && (
                    <div className="mt-2 p-2 bg-muted rounded-sm">
                      <div className="flex items-center gap-2 text-sm">
                        <span>Icon được chọn:</span>
                        <DynamicIcon name={field.value} size={16} className="text-foreground" />
                        <span className="font-mono">{field.value}</span>
                      </div>
                    </div>
                  )}
                  <FormDescription>
                    Hoặc nhập tên icon tùy chỉnh vào ô dưới đây
                  </FormDescription>
                  <FormControl>
                    <Input
                      placeholder="Tên icon tùy chỉnh (vd: custom-icon)"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  {field.value && !commonIcons.includes(field.value) && (
                    <div className="mt-2 p-2 bg-muted rounded-sm">
                      <div className="flex items-center gap-2 text-sm">
                        <span>Icon tùy chỉnh:</span>
                        <DynamicIcon name={field.value} size={16} className="text-foreground" />
                        <span className="font-mono">{field.value}</span>
                      </div>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Parent Menu */}
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menu cha</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      logger.debug("Parent menu changed", value);
                      field.onChange(value === "none" ? "" : value);
                    }}
                    value={field.value || undefined}
                    key={`parent-select-${menu?.id}-${field.value}`} // Force re-render when value changes
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn menu cha (để trống nếu là menu gốc)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">
                        Không có menu cha (Menu gốc)
                      </SelectItem>
                      {filteredParentMenus.map((parentMenu) => (
                        <SelectItem
                          key={parentMenu.id}
                          value={parentMenu.id.toString()}
                        >
                          <div className="flex items-center gap-2">
                            <span>#{parentMenu.id}</span>
                            {parentMenu.icon && (
                              <DynamicIcon name={parentMenu.icon} size={14} className="text-muted-foreground" />
                            )}
                            <span>{parentMenu.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({parentMenu.path})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {mode === "edit" && menu ? (
                      <>
                        <span>Menu hiện tại: #{menu.id} - {menu.name}</span>
                        <br />
                        <span className="text-xs">
                          Parent ID từ data: {menu.parentId || "null"}
                        </span>
                        <br />
                        <span className="text-xs">
                          Form parentId value: {field.value || "empty"}
                        </span>
                        <br />
                        <span className="text-xs">
                          Không thể chọn chính menu này hoặc menu con của nó làm
                          menu cha.
                        </span>
                      </>
                    ) : (
                      "Chọn menu cha cho menu này. Để trống nếu đây là menu gốc."
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Display Order */}
            <FormField
              control={form.control}
              name="displayOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thứ tự hiển thị *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="999"
                      placeholder="Thứ tự hiển thị (1-999)"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 1)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Số thứ tự càng nhỏ sẽ hiển thị càng trước trong menu (1-999)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Debug info in development */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-4 p-3 bg-muted rounded text-xs space-y-2">
                <div>
                  <strong>Mode:</strong> {mode}
                </div>
                <div>
                  <strong>Current Menu ID:</strong> {menu?.id || "N/A"}
                </div>
                <div>
                  <strong>Current Menu Parent ID:</strong>{" "}
                  {menu?.parentId || "N/A"}
                </div>
                <div>
                  <strong>Form Values:</strong>{" "}
                  {JSON.stringify(form.watch(), null, 2)}
                </div>
                <div>
                  <strong>Form Errors:</strong>{" "}
                  {JSON.stringify(form.formState.errors, null, 2)}
                </div>
                <div>
                  <strong>Available Parent Menus:</strong>{" "}
                  {JSON.stringify(
                    filteredParentMenus.map((m) => ({
                      id: m.id,
                      name: m.name,
                      path: m.path,
                      icon: m.icon,
                    })),
                    null,
                    2
                  )}
                </div>
                <div>
                  <strong>All Parent Menus (unfiltered):</strong>{" "}
                  {JSON.stringify(
                    parentMenus.map((m) => ({
                      id: m.id,
                      name: m.name,
                      path: m.path,
                      icon: m.icon,
                    })),
                    null,
                    2
                  )}
                </div>
              </div>
            )}
          </form>

          {/* Form Actions - Fixed at bottom */}
          <div className="flex justify-end space-x-2 p-4 border-t bg-background">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isLoading || form.formState.isSubmitting}
              onClick={form.handleSubmit(handleFormSubmit)}
            >
              {isLoading || form.formState.isSubmitting
                ? "Đang xử lý..."
                : mode === "create"
                ? "Tạo mới"
                : "Cập nhật"}
            </Button>
          </div>
        </Form>
      </ScrollArea>
    </div>
  );
}
