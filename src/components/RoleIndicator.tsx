import React from 'react';
import { UserRole, ROLE_LABELS } from '../types/roles';
import { Users, Stethoscope, Wrench, Package, BarChart3 } from 'lucide-react';

interface RoleIndicatorProps {
  role: UserRole;
  onRoleChange: () => void;
  compact?: boolean;
}

const RoleIndicator: React.FC<RoleIndicatorProps> = ({ role, onRoleChange, compact = false }) => {
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'registration': return Users;
      case 'medical': return Stethoscope;
      case 'workshop': return Wrench;
      case 'warehouse': return Package;
      case 'administration': return BarChart3;
      default: return Users;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'registration': return 'bg-blue-100 text-blue-800';
      case 'medical': return 'bg-green-100 text-green-800';
      case 'workshop': return 'bg-orange-100 text-orange-800';
      case 'warehouse': return 'bg-purple-100 text-purple-800';
      case 'administration': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const Icon = getRoleIcon(role);

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{ROLE_LABELS[role]}</span>
        <button
          onClick={onRoleChange}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          сменить
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getRoleColor(role)}`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{ROLE_LABELS[role]}</span>
      </div>
      <button
        onClick={onRoleChange}
        className="text-sm text-blue-600 hover:text-blue-800 underline"
      >
        Сменить роль
      </button>
    </div>
  );
};

export default RoleIndicator;
