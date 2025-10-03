import React from 'react';
import { UserRole, PermissionType, hasPermission } from '../types/roles';

interface PermissionGuardProps {
  userRole: UserRole;
  module: string;
  permission: PermissionType;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  userRole,
  module,
  permission,
  children,
  fallback = null
}) => {
  // Проверяем права доступа
  const hasAccess = hasPermission(userRole, module as any, permission);
  
  if (!hasAccess) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

export default PermissionGuard;
