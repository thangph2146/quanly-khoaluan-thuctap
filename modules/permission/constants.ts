// Permission module constants
export const PERMISSION_CONSTANTS = {
  ROUTES: {
    LIST: '/permissions',
    CREATE: '/permissions/create',
    EDIT: '/permissions/edit',
    DETAIL: '/permissions/detail',
  },
  API_ENDPOINTS: {
    BASE: '/api/Permissions',
    BY_MODULE: (module: string) => `/api/Permissions/by-module/${module}`,
    MODULES: '/api/Permissions/modules',
  },
  MODULES: {
    PARTNER: 'Partner',
    STUDENT: 'Student', 
    THESIS: 'Thesis',
    INTERNSHIP: 'Internship',
    USER: 'User',
    ROLE: 'Role',
    MENU: 'Menu',
    PERMISSION: 'Permission',
    DEPARTMENT: 'Department',
    ACADEMIC_YEAR: 'AcademicYear',
    SEMESTER: 'Semester',
  },
  PERMISSIONS: {
    VIEW: 'VIEW_PERMISSIONS',
    CREATE: 'CREATE_PERMISSIONS',
    UPDATE: 'UPDATE_PERMISSIONS',
    DELETE: 'DELETE_PERMISSIONS',
  },
  VALIDATION: {
    NAME: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 100,
      PATTERN: /^[A-Z][A-Z0-9_]*[A-Z0-9]$|^[A-Z]$/,
      REQUIRED: true,
    },
    MODULE: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 50,
      REQUIRED: true,
    },
    DESCRIPTION: {
      MAX_LENGTH: 500,
      REQUIRED: false,
    },
  },
  MESSAGES: {
    CREATED: 'Quyền đã được tạo thành công!',
    UPDATED: 'Quyền đã được cập nhật thành công!',
    DELETED: 'Quyền đã được xóa thành công!',
    FETCH_ERROR: 'Không thể tải dữ liệu quyền',
    CREATE_ERROR: 'Không thể tạo quyền',
    UPDATE_ERROR: 'Không thể cập nhật quyền',
    DELETE_ERROR: 'Không thể xóa quyền',
    VALIDATION: {
      NAME_REQUIRED: 'Tên permission là bắt buộc',
      NAME_INVALID: 'Tên permission phải viết hoa và chỉ chứa chữ cái, số và dấu gạch dưới',
      MODULE_REQUIRED: 'Module là bắt buộc',
      NAME_TOO_LONG: 'Tên permission quá dài',
      MODULE_TOO_LONG: 'Tên module quá dài',
      DESCRIPTION_TOO_LONG: 'Mô tả quá dài',
    },
  },
} as const
