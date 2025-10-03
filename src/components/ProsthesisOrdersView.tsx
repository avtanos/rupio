import React from 'react';
import { ProsthesisOrder } from '../types/prosthesisOrder';
import { Eye, Package, Calendar, AlertCircle, Clock, CheckCircle } from 'lucide-react';

interface ProsthesisOrdersViewProps {
  orders: ProsthesisOrder[];
  onViewOrder: (order: ProsthesisOrder) => void;
}

const ProsthesisOrdersView: React.FC<ProsthesisOrdersViewProps> = ({
  orders,
  onViewOrder
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Срочный':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'Обычный':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'Срочный':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'Обычный':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getCompletionStatus = (order: ProsthesisOrder) => {
    if (order.issueDate) return { status: 'Выдан', color: 'text-green-600', icon: <CheckCircle className="w-4 h-4" /> };
    if (order.manufacturingDate) return { status: 'Изготовлен', color: 'text-yellow-600', icon: <Package className="w-4 h-4" /> };
    return { status: 'В работе', color: 'text-blue-600', icon: <Clock className="w-4 h-4" /> };
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Заказы на изготовление протеза ({orders.length})
      </h3>
      
      {orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => {
            const completionStatus = getCompletionStatus(order);
            return (
              <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className="font-medium text-gray-900">
                      {order.orderNumber}
                    </span>
                    <span className={getStatusBadge(order.status)}>
                      {order.status}
                    </span>
                  </div>
                  <button
                    onClick={() => onViewOrder(order)}
                    className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Просмотр</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Дата заказа</p>
                    <p className="text-sm text-gray-900">
                      {new Date(order.orderDate).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Тип изделия</p>
                    <p className="text-sm text-gray-900">{order.prosthesisType}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Диагноз</p>
                    <p className="text-sm text-gray-900">{order.diagnosis.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Состояние</p>
                    <div className="flex items-center space-x-1">
                      {completionStatus.icon}
                      <span className={`text-sm font-medium ${completionStatus.color}`}>
                        {completionStatus.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                {order.manufacturingDate && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Дата изготовления</p>
                        <p className="text-sm text-gray-900">
                          {new Date(order.manufacturingDate).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      {order.issueDate && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Дата выдачи</p>
                          <p className="text-sm text-gray-900">
                            {new Date(order.issueDate).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {order.urgencyReason && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-700">Причина срочности</p>
                    <p className="text-sm text-gray-900">{order.urgencyReason}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Заказы не найдены</h3>
          <p className="mt-1 text-sm text-gray-500">
            Заказы на изготовление протеза для этого клиента пока не созданы.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProsthesisOrdersView;
