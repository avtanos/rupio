import React from 'react';
import { UserRole, MODULE_PERMISSIONS, ROLE_LABELS } from '../types/roles';
import { CheckCircle, XCircle } from 'lucide-react';

interface PermissionsTableProps {
  currentRole?: UserRole;
}

const PermissionsTable: React.FC<PermissionsTableProps> = ({ currentRole }) => {
  const modules = Object.keys(MODULE_PERMISSIONS) as Array<keyof typeof MODULE_PERMISSIONS>;
  const roles: UserRole[] = ['registration', 'medical', 'workshop', 'warehouse', 'administration'];
  
  const moduleLabels: Record<keyof typeof MODULE_PERMISSIONS, string> = {
    personal_file: 'Личное дело',
    prosthesis_referral: 'Направление на протезирование',
    rehabilitation_referral: 'Направление на реабилитацию ЦР ЛОВЗ',
    prosthesis_orders: 'Заказы на изготовление протеза',
    footwear_orders: 'Заказы на изготовление обуви',
    ottobock_orders: 'Заказы на изготовление Оттобок',
    prosthesis_repair: 'Наряд на ремонт протеза',
    footwear_repair: 'Наряд на ремонт обуви',
    ottobock_repair: 'Наряд на ремонт Оттобок',
    wheelchair_repair: 'Наряд на ремонт коляски',
    prosthesis_invoices: 'Накладные на протезы',
    footwear_invoices: 'Накладные на обувь',
    ottobock_invoices: 'Накладные на Оттобок',
    repair_invoices: 'Накладные на ремонт',
    ready_poi_invoices: 'Накладные на готовые ПОИ',
    reporting: 'Отчетность',
    warehouse_issuance: 'Выдача заказов (склад)'
  };

  const permissionLabels = {
    view: 'Просмотр',
    create: 'Создать',
    edit: 'Редактировать',
    delete: 'Удалить',
    print: 'Печать'
  };

  const getPermissionIcon = (hasPermission: boolean) => {
    return hasPermission ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-400" />
    );
  };

  const getRowClassName = (module: keyof typeof MODULE_PERMISSIONS) => {
    if (!currentRole) return '';
    
    const hasAnyPermission = Object.values(MODULE_PERMISSIONS[module][currentRole]).some(Boolean);
    return hasAnyPermission ? 'bg-blue-50' : '';
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Доступ к функциям и модулям согласно ролей
        </h3>
        {currentRole && (
          <p className="text-sm text-gray-600 mt-1">
            Выделены модули, доступные для роли: <span className="font-medium">{ROLE_LABELS[currentRole]}</span>
          </p>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                №
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Функции и модули
              </th>
              {roles.map(role => (
                <th key={role} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {ROLE_LABELS[role]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {modules.map((module, index) => (
              <tr key={module} className={getRowClassName(module)}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {moduleLabels[module]}
                </td>
                {roles.map(role => {
                  const permissions = MODULE_PERMISSIONS[module][role];
                  const hasAnyPermission = Object.values(permissions).some(Boolean);
                  
                  return (
                    <td key={role} className="px-6 py-4 text-center">
                      {hasAnyPermission ? (
                        <div className="flex flex-col space-y-1">
                          {Object.entries(permissions).map(([permission, hasAccess]) => (
                            <div key={permission} className="flex items-center justify-center space-x-1">
                              {getPermissionIcon(hasAccess)}
                              <span className="text-xs text-gray-600">
                                {permissionLabels[permission as keyof typeof permissionLabels]}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Разрешено</span>
            </div>
            <div className="flex items-center space-x-1">
              <XCircle className="w-4 h-4 text-red-400" />
              <span>Запрещено</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Всего модулей: {modules.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionsTable;
