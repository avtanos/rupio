export type UserRole = 'registration' | 'medical' | 'workshop' | 'warehouse' | 'administration';

export type PermissionType = 'view' | 'create' | 'edit' | 'delete' | 'print';

export interface ModulePermissions {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  print: boolean;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  department: string;
  permissions: string[];
}

// Детальные разрешения для каждого модуля
export const MODULE_PERMISSIONS = {
  // 1. Личное дело
  personal_file: {
    registration: { view: true, create: true, edit: true, delete: true, print: true },
    medical: { view: true, create: false, edit: true, delete: false, print: true },
    workshop: { view: false, create: false, edit: false, delete: false, print: false },
    warehouse: { view: false, create: false, edit: false, delete: false, print: false },
    administration: { view: true, create: true, edit: true, delete: true, print: true }
  },
  // 2. Направление на протезирование
  prosthesis_referral: {
    registration: { view: false, create: false, edit: false, delete: false, print: false },
    medical: { view: true, create: true, edit: true, delete: true, print: true },
    workshop: { view: false, create: false, edit: false, delete: false, print: false },
    warehouse: { view: false, create: false, edit: false, delete: false, print: false },
    administration: { view: true, create: true, edit: true, delete: true, print: true }
  },
  // 3. Направление на реабилитацию ЦР ЛОВЗ
  rehabilitation_referral: {
    registration: { view: false, create: false, edit: false, delete: false, print: false },
    medical: { view: true, create: true, edit: true, delete: true, print: true },
    workshop: { view: false, create: false, edit: false, delete: false, print: false },
    warehouse: { view: false, create: false, edit: false, delete: false, print: false },
    administration: { view: true, create: true, edit: true, delete: true, print: true }
  },
  // 4. Заказы на изготовление протеза
  prosthesis_orders: {
    registration: { view: false, create: false, edit: false, delete: false, print: false },
    medical: { view: true, create: true, edit: true, delete: true, print: true },
    workshop: { view: true, create: false, edit: true, delete: false, print: true },
    warehouse: { view: false, create: false, edit: false, delete: false, print: false },
    administration: { view: true, create: true, edit: true, delete: true, print: true }
  },
  // 5. Заказы на изготовление обуви
  footwear_orders: {
    registration: { view: false, create: false, edit: false, delete: false, print: false },
    medical: { view: true, create: true, edit: true, delete: true, print: true },
    workshop: { view: true, create: false, edit: true, delete: false, print: true },
    warehouse: { view: false, create: false, edit: false, delete: false, print: false },
    administration: { view: true, create: true, edit: true, delete: true, print: true }
  },
  // 6. Заказы на изготовление Оттобок
  ottobock_orders: {
    registration: { view: false, create: false, edit: false, delete: false, print: false },
    medical: { view: true, create: true, edit: true, delete: true, print: true },
    workshop: { view: true, create: false, edit: true, delete: false, print: true },
    warehouse: { view: false, create: false, edit: false, delete: false, print: false },
    administration: { view: true, create: true, edit: true, delete: true, print: true }
  },
  // 7. Наряд на ремонт протеза
  prosthesis_repair: {
    registration: { view: false, create: false, edit: false, delete: false, print: false },
    medical: { view: false, create: false, edit: false, delete: false, print: false },
    workshop: { view: true, create: true, edit: true, delete: true, print: true },
    warehouse: { view: false, create: false, edit: false, delete: false, print: false },
    administration: { view: true, create: true, edit: true, delete: true, print: true }
  },
  // 8. Наряд на ремонт обуви
  footwear_repair: {
    registration: { view: false, create: false, edit: false, delete: false, print: false },
    medical: { view: false, create: false, edit: false, delete: false, print: false },
    workshop: { view: true, create: true, edit: true, delete: true, print: true },
    warehouse: { view: false, create: false, edit: false, delete: false, print: false },
    administration: { view: true, create: true, edit: true, delete: true, print: true }
  },
  // 9. Наряд на ремонт Оттобок
  ottobock_repair: {
    registration: { view: false, create: false, edit: false, delete: false, print: false },
    medical: { view: false, create: false, edit: false, delete: false, print: false },
    workshop: { view: true, create: true, edit: true, delete: true, print: true },
    warehouse: { view: false, create: false, edit: false, delete: false, print: false },
    administration: { view: true, create: true, edit: true, delete: true, print: true }
  },
  // 10. Наряд на ремонт коляски
  wheelchair_repair: {
    registration: { view: false, create: false, edit: false, delete: false, print: false },
    medical: { view: false, create: false, edit: false, delete: false, print: false },
    workshop: { view: true, create: true, edit: true, delete: true, print: true },
    warehouse: { view: false, create: false, edit: false, delete: false, print: false },
    administration: { view: true, create: true, edit: true, delete: true, print: true }
  },
  // 11. Накладные на протезы
  prosthesis_invoices: {
    registration: { view: false, create: false, edit: false, delete: false, print: false },
    medical: { view: true, create: false, edit: false, delete: false, print: true },
    workshop: { view: true, create: true, edit: true, delete: true, print: true },
    warehouse: { view: true, create: false, edit: false, delete: false, print: true },
    administration: { view: true, create: true, edit: true, delete: true, print: true }
  },
  // 12. Накладные на обувь
  footwear_invoices: {
    registration: { view: false, create: false, edit: false, delete: false, print: false },
    medical: { view: true, create: false, edit: false, delete: false, print: true },
    workshop: { view: true, create: true, edit: true, delete: true, print: true },
    warehouse: { view: true, create: false, edit: false, delete: false, print: true },
    administration: { view: true, create: true, edit: true, delete: true, print: true }
  },
  // 13. Накладные на Оттобок
  ottobock_invoices: {
    registration: { view: false, create: false, edit: false, delete: false, print: false },
    medical: { view: true, create: false, edit: false, delete: false, print: true },
    workshop: { view: true, create: true, edit: true, delete: true, print: true },
    warehouse: { view: true, create: false, edit: false, delete: false, print: true },
    administration: { view: true, create: true, edit: true, delete: true, print: true }
  },
  // 14. Накладные на ремонт
  repair_invoices: {
    registration: { view: false, create: false, edit: false, delete: false, print: false },
    medical: { view: true, create: false, edit: false, delete: false, print: true },
    workshop: { view: true, create: true, edit: true, delete: true, print: true },
    warehouse: { view: true, create: false, edit: false, delete: false, print: true },
    administration: { view: true, create: true, edit: true, delete: true, print: true }
  },
  // 15. Накладные на готовые ПОИ
  ready_poi_invoices: {
    registration: { view: false, create: false, edit: false, delete: false, print: false },
    medical: { view: true, create: false, edit: false, delete: false, print: true },
    workshop: { view: true, create: true, edit: true, delete: true, print: true },
    warehouse: { view: true, create: false, edit: false, delete: false, print: true },
    administration: { view: true, create: true, edit: true, delete: true, print: true }
  },
  // 16. Отчетность
  reporting: {
    registration: { view: true, create: true, edit: true, delete: true, print: true },
    medical: { view: true, create: true, edit: true, delete: true, print: true },
    workshop: { view: true, create: true, edit: true, delete: true, print: true },
    warehouse: { view: true, create: true, edit: true, delete: true, print: true },
    administration: { view: true, create: true, edit: true, delete: true, print: true }
  },
  // 17. Выдача заказов (склад)
  warehouse_issuance: {
    registration: { view: false, create: false, edit: false, delete: false, print: false },
    medical: { view: false, create: false, edit: false, delete: false, print: false },
    workshop: { view: false, create: false, edit: false, delete: false, print: false },
    warehouse: { view: true, create: true, edit: true, delete: true, print: true },
    administration: { view: true, create: true, edit: true, delete: true, print: true }
  }
};

// Упрощенные разрешения для обратной совместимости
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  registration: [
    'view_personal_files', 'create_personal_files', 'edit_personal_files', 'delete_personal_files', 'print_personal_files',
    'view_reports', 'create_reports', 'edit_reports', 'delete_reports', 'print_reports'
  ],
  medical: [
    'view_personal_files', 'edit_personal_files', 'print_personal_files',
    'view_prosthesis_referrals', 'create_prosthesis_referrals', 'edit_prosthesis_referrals', 'delete_prosthesis_referrals', 'print_prosthesis_referrals',
    'view_rehabilitation_referrals', 'create_rehabilitation_referrals', 'edit_rehabilitation_referrals', 'delete_rehabilitation_referrals', 'print_rehabilitation_referrals',
    'view_prosthesis_orders', 'create_prosthesis_orders', 'edit_prosthesis_orders', 'delete_prosthesis_orders', 'print_prosthesis_orders',
    'view_footwear_orders', 'create_footwear_orders', 'edit_footwear_orders', 'delete_footwear_orders', 'print_footwear_orders',
    'view_ottobock_orders', 'create_ottobock_orders', 'edit_ottobock_orders', 'delete_ottobock_orders', 'print_ottobock_orders',
    'view_reports', 'create_reports', 'edit_reports', 'delete_reports', 'print_reports'
  ],
  workshop: [
    'view_prosthesis_orders', 'edit_prosthesis_orders', 'print_prosthesis_orders',
    'view_footwear_orders', 'edit_footwear_orders', 'print_footwear_orders',
    'view_ottobock_orders', 'edit_ottobock_orders', 'print_ottobock_orders',
    'view_prosthesis_repair', 'create_prosthesis_repair', 'edit_prosthesis_repair', 'delete_prosthesis_repair', 'print_prosthesis_repair',
    'view_footwear_repair', 'create_footwear_repair', 'edit_footwear_repair', 'delete_footwear_repair', 'print_footwear_repair',
    'view_ottobock_repair', 'create_ottobock_repair', 'edit_ottobock_repair', 'delete_ottobock_repair', 'print_ottobock_repair',
    'view_wheelchair_repair', 'create_wheelchair_repair', 'edit_wheelchair_repair', 'delete_wheelchair_repair', 'print_wheelchair_repair',
    'view_prosthesis_invoices', 'create_prosthesis_invoices', 'edit_prosthesis_invoices', 'delete_prosthesis_invoices', 'print_prosthesis_invoices',
    'view_footwear_invoices', 'create_footwear_invoices', 'edit_footwear_invoices', 'delete_footwear_invoices', 'print_footwear_invoices',
    'view_ottobock_invoices', 'create_ottobock_invoices', 'edit_ottobock_invoices', 'delete_ottobock_invoices', 'print_ottobock_invoices',
    'view_reports', 'create_reports', 'edit_reports', 'delete_reports', 'print_reports',
    'manage_manufacturing_orders', 'manage_materials', 'track_readiness', 'create_transfer_orders'
  ],
  warehouse: [
    'view_warehouse_issuance', 'create_warehouse_issuance', 'edit_warehouse_issuance', 'delete_warehouse_issuance', 'print_warehouse_issuance',
    'view_reports', 'create_reports', 'edit_reports', 'delete_reports', 'print_reports'
  ],
  administration: [
    'view_all', 'create_all', 'edit_all', 'delete_all', 'print_all',
    'manage_users', 'manage_system'
  ]
};

export const ROLE_LABELS: Record<UserRole, string> = {
  registration: 'Регистратура',
  medical: 'Медотдел',
  workshop: 'Цеха',
  warehouse: 'Склад готовой продукции',
  administration: 'Администрация'
};

export const ROLE_NAVIGATION: Record<UserRole, string[]> = {
  registration: ['process', 'registration', 'reports', 'settings'],
  medical: ['process', 'medical', 'rehabilitation-directions', 'prosthesis-orders', 'footwear-orders', 'ottobock-orders', 'orthosis-orders', 'repair-orders', 'ready-poi-orders', 'reports', 'settings'],
  workshop: ['process', 'workshop', 'manufacturing-orders', 'prosthesis-orders', 'footwear-orders', 'ottobock-orders', 'orthosis-orders', 'repair-orders', 'ready-poi-orders', 'prosthesis-invoices', 'footwear-invoices', 'ottobock-invoices', 'orthosis-invoices', 'repair-invoices', 'ready-poi-invoices', 'reports', 'settings'],
  warehouse: ['process', 'warehouse', 'warehouse-issuance', 'reports', 'settings'],
  administration: ['process', 'registration', 'medical', 'workshop', 'warehouse', 'reports', 'prosthesis-orders', 'footwear-orders', 'ottobock-orders', 'orthosis-orders', 'repair-orders', 'ready-poi-orders', 'prosthesis-invoices', 'footwear-invoices', 'ottobock-invoices', 'orthosis-invoices', 'repair-invoices', 'ready-poi-invoices', 'rehabilitation-directions', 'manufacturing-orders', 'warehouse-issuance', 'settings']
};

// Утилиты для проверки прав доступа
export const hasPermission = (
  userRole: UserRole, 
  module: keyof typeof MODULE_PERMISSIONS, 
  permission: PermissionType
): boolean => {
  return MODULE_PERMISSIONS[module][userRole][permission];
};

export const canView = (userRole: UserRole, module: keyof typeof MODULE_PERMISSIONS): boolean => {
  return hasPermission(userRole, module, 'view');
};

export const canCreate = (userRole: UserRole, module: keyof typeof MODULE_PERMISSIONS): boolean => {
  return hasPermission(userRole, module, 'create');
};

export const canEdit = (userRole: UserRole, module: keyof typeof MODULE_PERMISSIONS): boolean => {
  return hasPermission(userRole, module, 'edit');
};

export const canDelete = (userRole: UserRole, module: keyof typeof MODULE_PERMISSIONS): boolean => {
  return hasPermission(userRole, module, 'delete');
};

export const canPrint = (userRole: UserRole, module: keyof typeof MODULE_PERMISSIONS): boolean => {
  return hasPermission(userRole, module, 'print');
};

// Получение всех разрешений для модуля
export const getModulePermissions = (
  userRole: UserRole, 
  module: keyof typeof MODULE_PERMISSIONS
): ModulePermissions => {
  return MODULE_PERMISSIONS[module][userRole];
};
