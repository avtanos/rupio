import React from 'react';
import { ProcessStage as ProcessStageType, Order } from '../types';
import { CheckCircle, Clock, AlertCircle, Users, FileText } from 'lucide-react';

interface ProcessStageProps {
  stage: ProcessStageType;
  onOrderClick: (order: Order) => void;
}

const ProcessStage: React.FC<ProcessStageProps> = ({ stage, onOrderClick }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'in_progress':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className={`border-2 rounded-lg p-6 ${getStatusColor(stage.status)}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon(stage.status)}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{stage.name}</h3>
            <p className="text-sm text-gray-600">{stage.department}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {stage.orders.length} заказов
          </span>
        </div>
      </div>

      <p className="text-gray-700 mb-4">{stage.description}</p>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Действия:</h4>
        <ul className="space-y-1">
          {stage.actions.map((action, index) => (
            <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
              <FileText className="w-3 h-3" />
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>

      {stage.orders.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Активные заказы:</h4>
          <div className="space-y-2">
            {stage.orders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="p-3 bg-white rounded border cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => onOrderClick(order)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {order.orderNumber}
                    </p>
                    <p className="text-xs text-gray-600">{order.clientName}</p>
                    <p className="text-xs text-gray-500">{order.productType}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {stage.orders.length > 3 && (
              <p className="text-xs text-gray-500 text-center">
                и еще {stage.orders.length - 3} заказов...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessStage;
