import React, { useState } from 'react';
import { Order } from '../types';
import { Wrench, CheckCircle, FileText, Truck, Package } from 'lucide-react';

interface WorkshopStageProps {
  orders: Order[];
  onOrderUpdate: (orderId: string, updates: Partial<Order>) => void;
}

const WorkshopStage: React.FC<WorkshopStageProps> = ({
  orders,
  onOrderUpdate
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCompletionForm, setShowCompletionForm] = useState(false);

  const workshopOrders = orders.filter(order => 
    order.status === 'в_производстве' || order.status === 'готов_к_выдаче'
  );

  const handleOrderCompletion = (orderId: string) => {
    onOrderUpdate(orderId, {
      status: 'готов_к_выдаче',
      actualCompletionDate: new Date().toISOString().split('T')[0]
    });
    setShowCompletionForm(false);
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Выполнение заказа (Цеха)</h2>
          <div className="flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">
              {workshopOrders.length} заказов
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Действия:</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center space-x-2">
              <Wrench className="w-4 h-4 text-orange-500" />
              <span>Изготовление</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Примерка</span>
            </li>
            <li className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <span>Составление накладной, печать</span>
            </li>
            <li className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-purple-500" />
              <span>Отправка на склад готовой продукции</span>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Заказы в производстве</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {workshopOrders
                .filter(order => order.status === 'в_производстве')
                .map((order) => (
                <div
                  key={order.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{order.orderNumber}</p>
                      <p className="text-xs text-gray-600">{order.clientName}</p>
                      <p className="text-xs text-gray-500">{order.productType}</p>
                      <p className="text-xs text-blue-600">{order.workshop}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Готовые к выдаче</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {workshopOrders
                .filter(order => order.status === 'готов_к_выдаче')
                .map((order) => (
                <div
                  key={order.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{order.orderNumber}</p>
                      <p className="text-xs text-gray-600">{order.clientName}</p>
                      <p className="text-xs text-gray-500">{order.productType}</p>
                      <p className="text-xs text-green-600">
                        Готов: {order.actualCompletionDate ? new Date(order.actualCompletionDate).toLocaleDateString('ru-RU') : 'Не указано'}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Детали заказа {selectedOrder.orderNumber}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Клиент:</p>
              <p className="text-sm text-gray-900">{selectedOrder.clientName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Тип изделия:</p>
              <p className="text-sm text-gray-900">{selectedOrder.productType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Цех:</p>
              <p className="text-sm text-gray-900">{selectedOrder.workshop || 'Не назначен'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Ожидаемое завершение:</p>
              <p className="text-sm text-gray-900">
                {new Date(selectedOrder.expectedCompletionDate).toLocaleDateString('ru-RU')}
              </p>
            </div>
            {selectedOrder.measurements && Object.keys(selectedOrder.measurements).length > 0 && (
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-700">Мерки:</p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {Object.entries(selectedOrder.measurements).map(([key, value]) => (
                    <div key={key} className="text-xs text-gray-600">
                      {key}: {value}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selectedOrder.notes && (
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-700">Примечания:</p>
                <p className="text-sm text-gray-900">{selectedOrder.notes}</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex space-x-2">
            {selectedOrder.status === 'в_производстве' && (
              <button
                onClick={() => setShowCompletionForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Завершить производство</span>
              </button>
            )}
            <button
              onClick={() => setSelectedOrder(null)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {showCompletionForm && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Завершение производства</h3>
            <p className="text-gray-600 mb-4">
              Заказ {selectedOrder.orderNumber} готов к отправке на склад готовой продукции?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCompletionForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                onClick={() => handleOrderCompletion(selectedOrder.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkshopStage;
