import React, { useState, useEffect } from 'react';
import { WorkOrder, OrderSearchParams, OrderType, OrderStatus } from '../types/orders';
import { Search, X, Plus, Eye, Edit, Calendar, User, Package } from 'lucide-react';

interface OrdersTableProps {
  orders: WorkOrder[];
  onNewOrder: () => void;
  onViewOrder: (order: WorkOrder) => void;
  onEditOrder: (order: WorkOrder) => void;
  personalFileId?: string; // Если указан, показываем только заказы для этого личного дела
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onNewOrder,
  onViewOrder,
  onEditOrder,
  personalFileId
}) => {
  const [searchParams, setSearchParams] = useState<OrderSearchParams>({
    orderDate: '',
    clientName: '',
    productName: '',
    orderType: undefined,
    status: undefined,
    disabilityGroup: ''
  });
  const [filteredOrders, setFilteredOrders] = useState<WorkOrder[]>(orders);

  useEffect(() => {
    let filtered = orders;
    
    // Фильтр по личному делу, если указан
    if (personalFileId) {
      filtered = filtered.filter(order => order.personalFileId === personalFileId);
    }
    
    // Применяем фильтры поиска
    if (searchParams.orderDate) {
      filtered = filtered.filter(order => order.orderDate.includes(searchParams.orderDate!));
    }
    if (searchParams.clientName) {
      filtered = filtered.filter(order => 
        order.clientName.toLowerCase().includes(searchParams.clientName!.toLowerCase())
      );
    }
    if (searchParams.productName) {
      filtered = filtered.filter(order => 
        order.productName.toLowerCase().includes(searchParams.productName!.toLowerCase())
      );
    }
    if (searchParams.orderType) {
      filtered = filtered.filter(order => order.orderType === searchParams.orderType);
    }
    if (searchParams.status) {
      filtered = filtered.filter(order => order.status === searchParams.status);
    }
    if (searchParams.disabilityGroup) {
      filtered = filtered.filter(order => order.disabilityGroup === searchParams.disabilityGroup);
    }
    
    setFilteredOrders(filtered);
  }, [orders, searchParams, personalFileId]);

  const handleSearch = () => {
    // Поиск уже выполняется в useEffect
  };

  const handleClearSearch = () => {
    setSearchParams({
      orderDate: '',
      clientName: '',
      productName: '',
      orderType: undefined,
      status: undefined,
      disabilityGroup: ''
    });
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'создан':
        return 'bg-blue-100 text-blue-800';
      case 'в_производстве':
        return 'bg-yellow-100 text-yellow-800';
      case 'готов':
        return 'bg-green-100 text-green-800';
      case 'выдан':
        return 'bg-gray-100 text-gray-800';
      case 'отменен':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderTypeColor = (orderType: OrderType) => {
    switch (orderType) {
      case 'Заказ на изготовление протеза':
        return 'bg-purple-100 text-purple-800';
      case 'Заказ на изготовление обуви':
        return 'bg-orange-100 text-orange-800';
      case 'Заказ на изготовление Оттобок':
        return 'bg-cyan-100 text-cyan-800';
      case 'Наряд на ремонт':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Панель поиска */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {personalFileId ? 'Заказы и наряды клиента' : 'Заказы и наряды'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Дата заказа
            </label>
            <input
              type="date"
              value={searchParams.orderDate || ''}
              onChange={(e) => setSearchParams({...searchParams, orderDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ФИО ЛОВЗ
            </label>
            <input
              type="text"
              value={searchParams.clientName || ''}
              onChange={(e) => setSearchParams({...searchParams, clientName: e.target.value})}
              placeholder="Введите ФИО"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Наименование ПОИ
            </label>
            <input
              type="text"
              value={searchParams.productName || ''}
              onChange={(e) => setSearchParams({...searchParams, productName: e.target.value})}
              placeholder="Введите наименование изделия"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Тип заказа/наряда
            </label>
            <select
              value={searchParams.orderType || ''}
              onChange={(e) => setSearchParams({...searchParams, orderType: e.target.value as OrderType || undefined})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Все типы</option>
              <option value="Заказ на изготовление протеза">Заказ на изготовление протеза</option>
              <option value="Заказ на изготовление обуви">Заказ на изготовление обуви</option>
              <option value="Заказ на изготовление Оттобок">Заказ на изготовление Оттобок</option>
              <option value="Наряд на ремонт">Наряд на ремонт</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Статус
            </label>
            <select
              value={searchParams.status || ''}
              onChange={(e) => setSearchParams({...searchParams, status: e.target.value as OrderStatus || undefined})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Все статусы</option>
              <option value="создан">Создан</option>
              <option value="в_производстве">В производстве</option>
              <option value="готов">Готов</option>
              <option value="выдан">Выдан</option>
              <option value="отменен">Отменен</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Группа инвалидности
            </label>
            <select
              value={searchParams.disabilityGroup || ''}
              onChange={(e) => setSearchParams({...searchParams, disabilityGroup: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Все группы</option>
              <option value="1 группа">1 группа</option>
              <option value="2 группа">2 группа</option>
              <option value="3 группа">3 группа</option>
            </select>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleSearch}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Поиск</span>
          </button>
          <button
            onClick={handleClearSearch}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Очистить</span>
          </button>
          <button
            onClick={onNewOrder}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ml-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Новый заказ/наряд</span>
          </button>
        </div>
      </div>

      {/* Таблица заказов */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  № наряда/заказа
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата заказа
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ФИО ЛОВЗ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Группа инв-ти
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Категория
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Наименование ПОИ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата изгот-я
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата выдачи
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус движения
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Действия</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.orderDate).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <div className="text-sm font-medium text-gray-900">
                        {order.clientName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.disabilityGroup}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.disabilityCategory}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.productName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.orderType}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.manufacturingDate ? new Date(order.manufacturingDate).toLocaleDateString('ru-RU') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.issueDate ? new Date(order.issueDate).toLocaleDateString('ru-RU') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.movementStatus}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onViewOrder(order)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Просмотреть"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onEditOrder(order)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Редактировать"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Заказы не найдены</h3>
            <p className="mt-1 text-sm text-gray-500">
              Попробуйте изменить параметры поиска или создать новый заказ.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersTable;
