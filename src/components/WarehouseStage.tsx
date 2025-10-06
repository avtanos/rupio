import React, { useState } from 'react';
import { Order } from '../types';
import { Package, CheckCircle, User, Eye, Calendar } from 'lucide-react';

interface WarehouseStageProps {
  orders: Order[];
  onOrderUpdate: (orderId: string, updates: Partial<Order>) => void;
}

const WarehouseStage: React.FC<WarehouseStageProps> = ({
  orders,
  onOrderUpdate
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showIssuanceForm, setShowIssuanceForm] = useState(false);

  const warehouseOrders = orders.filter(order => 
    order.status === 'готов_к_выдаче' || order.status === 'завершен'
  );

  const handleOrderIssuance = (orderId: string) => {
    onOrderUpdate(orderId, {
      status: 'завершен'
    });
    setShowIssuanceForm(false);
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Выдача заказа (Склад готовой продукции)</h2>
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-700">
              {warehouseOrders.length} заказов
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Действия:</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-purple-500" />
              <span>Прием изделий на склад готовой продукции</span>
            </li>
            <li className="flex items-center space-x-2">
              <User className="w-4 h-4 text-green-500" />
              <span>Выдача изделий</span>
            </li>
          </ul>
        </div>

        {/* Таблица готовых к выдаче */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Готовые к выдаче</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    № Заказа
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Клиент
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Тип изделия
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата создания
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата завершения
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {warehouseOrders
                  .filter(order => order.status === 'готов_к_выдаче')
                  .map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">{order.clientName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="w-4 h-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">{order.productType}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {new Date(order.createdDate).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {order.actualCompletionDate ? new Date(order.actualCompletionDate).toLocaleDateString('ru-RU') : 'Не указано'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                          title="Просмотр"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowIssuanceForm(true);
                          }}
                          className="text-purple-600 hover:text-purple-900 flex items-center"
                          title="Выдать клиенту"
                        >
                          <User className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {warehouseOrders.filter(order => order.status === 'готов_к_выдаче').length === 0 && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Нет готовых к выдаче заказов</p>
            </div>
          )}
        </div>

        {/* Таблица выданных заказов */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Выданные заказы</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    № Заказа
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Клиент
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Тип изделия
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата создания
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата выдачи
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {warehouseOrders
                  .filter(order => order.status === 'завершен')
                  .map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">{order.clientName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="w-4 h-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">{order.productType}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {new Date(order.createdDate).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {order.actualCompletionDate ? new Date(order.actualCompletionDate).toLocaleDateString('ru-RU') : 'Не указано'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                          title="Просмотр"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {warehouseOrders.filter(order => order.status === 'завершен').length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Нет выданных заказов</p>
            </div>
          )}
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
              <p className="text-sm font-medium text-gray-700">Дата создания:</p>
              <p className="text-sm text-gray-900">
                {new Date(selectedOrder.createdDate).toLocaleDateString('ru-RU')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Ожидаемое завершение:</p>
              <p className="text-sm text-gray-900">
                {new Date(selectedOrder.expectedCompletionDate).toLocaleDateString('ru-RU')}
              </p>
            </div>
            {selectedOrder.actualCompletionDate && (
              <div>
                <p className="text-sm font-medium text-gray-700">Фактическое завершение:</p>
                <p className="text-sm text-gray-900">
                  {new Date(selectedOrder.actualCompletionDate).toLocaleDateString('ru-RU')}
                </p>
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
            {selectedOrder.status === 'готов_к_выдаче' && (
              <button
                onClick={() => setShowIssuanceForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Выдать клиенту</span>
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

      {showIssuanceForm && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Выдача заказа клиенту</h3>
            <p className="text-gray-600 mb-4">
              Заказ {selectedOrder.orderNumber} выдан клиенту {selectedOrder.clientName}?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowIssuanceForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                onClick={() => handleOrderIssuance(selectedOrder.id)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Подтвердить выдачу
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseStage;
