import React from 'react';
import { UserRole, ROLE_LABELS } from '../types/roles';
import { Users, Stethoscope, Wrench, Package, BarChart3 } from 'lucide-react';

interface RoleSelectorProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ currentRole, onRoleChange }) => {
  const roles = [
    { id: 'registration' as UserRole, icon: Users, color: 'blue' },
    { id: 'medical' as UserRole, icon: Stethoscope, color: 'green' },
    { id: 'workshop' as UserRole, icon: Wrench, color: 'orange' },
    { id: 'warehouse' as UserRole, icon: Package, color: 'purple' },
    { id: 'administration' as UserRole, icon: BarChart3, color: 'red' }
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    const baseClasses = 'border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md';
    const activeClasses = isActive ? 'ring-2 ring-offset-2' : '';
    
    switch (color) {
      case 'blue':
        return `${baseClasses} ${activeClasses} ${isActive ? 'border-blue-500 ring-blue-500 bg-blue-50' : 'border-blue-200 hover:border-blue-300'}`;
      case 'green':
        return `${baseClasses} ${activeClasses} ${isActive ? 'border-green-500 ring-green-500 bg-green-50' : 'border-green-200 hover:border-green-300'}`;
      case 'orange':
        return `${baseClasses} ${activeClasses} ${isActive ? 'border-orange-500 ring-orange-500 bg-orange-50' : 'border-orange-200 hover:border-orange-300'}`;
      case 'purple':
        return `${baseClasses} ${activeClasses} ${isActive ? 'border-purple-500 ring-purple-500 bg-purple-50' : 'border-purple-200 hover:border-purple-300'}`;
      case 'red':
        return `${baseClasses} ${activeClasses} ${isActive ? 'border-red-500 ring-red-500 bg-red-50' : 'border-red-200 hover:border-red-300'}`;
      default:
        return `${baseClasses} ${activeClasses} ${isActive ? 'border-gray-500 ring-gray-500 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`;
    }
  };

  const getIconColor = (color: string, isActive: boolean) => {
    if (isActive) {
      switch (color) {
        case 'blue': return 'text-blue-600';
        case 'green': return 'text-green-600';
        case 'orange': return 'text-orange-600';
        case 'purple': return 'text-purple-600';
        case 'red': return 'text-red-600';
        default: return 'text-gray-600';
      }
    }
    return 'text-gray-400';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Выберите роль пользователя</h2>
      <p className="text-gray-600 mb-6">Выберите роль для доступа к соответствующим разделам системы</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => {
          const Icon = role.icon;
          const isActive = currentRole === role.id;
          
          return (
            <div
              key={role.id}
              onClick={() => onRoleChange(role.id)}
              className={getColorClasses(role.color, isActive)}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-8 h-8 ${getIconColor(role.color, isActive)}`} />
                <div>
                  <h3 className={`font-medium ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                    {ROLE_LABELS[role.id]}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {role.id === 'registration' && 'Управление личными делами и заказами'}
                    {role.id === 'medical' && 'Медицинский осмотр и диагностика'}
                    {role.id === 'workshop' && 'Производство ортопедических изделий'}
                    {role.id === 'warehouse' && 'Склад и выдача готовой продукции'}
                    {role.id === 'administration' && 'Полный доступ ко всем разделам'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Текущая роль: {ROLE_LABELS[currentRole]}</h4>
        <p className="text-sm text-gray-600">
          {currentRole === 'registration' && 'Доступ к управлению личными делами, созданию заказов и картотеке'}
          {currentRole === 'medical' && 'Доступ к медицинскому осмотру, постановке диагнозов и работе с заказами'}
          {currentRole === 'workshop' && 'Доступ к производственным процессам и управлению заказами в цехах'}
          {currentRole === 'warehouse' && 'Доступ к складским операциям, выдаче продукции и накладным'}
          {currentRole === 'administration' && 'Полный доступ ко всем разделам системы и отчетности'}
        </p>
      </div>
    </div>
  );
};

export default RoleSelector;
