import React, { useState } from 'react';
import { ReadyPoiOrder } from '../types/readyPoiOrder';
import { PersonalFile } from '../types/personalFile';
import ReadyPoiOrderForm from './ReadyPoiOrderForm';
import { readyPoiProductTypes, readyPoiDiagnoses, materialUnits, defaultMaterials } from '../data/readyPoiReferences';
import { Plus, Search, Filter, Edit, Eye, Trash2, AlertCircle, Clock, Accessibility, Printer } from 'lucide-react';

interface ReadyPoiOrdersPageProps {
  orders: ReadyPoiOrder[];
  personalFiles: PersonalFile[];
  onNewOrder: (order: ReadyPoiOrder) => void;
  onUpdateOrder: (id: string, updates: Partial<ReadyPoiOrder>) => void;
  onDeleteOrder: (id: string) => void;
  onPrintBlank?: (orderId: string, personalFile: PersonalFile, diagnosis: string) => void;
}

const ReadyPoiOrdersPage: React.FC<ReadyPoiOrdersPageProps> = ({
  orders,
  personalFiles,
  onNewOrder,
  onUpdateOrder,
  onDeleteOrder,
  onPrintBlank
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ReadyPoiOrder | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<ReadyPoiOrder | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'all' || 
      (urgencyFilter === 'urgent' && order.status === 'Срочный') ||
      (urgencyFilter === 'normal' && order.status === 'Обычный');

    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const handleNewOrder = () => {
    setEditingOrder(null);
    setShowOrderForm(true);
  };

  const handleEditOrder = (order: ReadyPoiOrder) => {
    setEditingOrder(order);
    setShowOrderForm(true);
  };

  const handleViewOrder = (order: ReadyPoiOrder) => {
    setSelectedOrder(order);
  };

  const handleSaveOrder = (order: ReadyPoiOrder) => {
    if (editingOrder) {
      onUpdateOrder(order.id, order);
    } else {
      onNewOrder(order);
    }
    setShowOrderForm(false);
    setEditingOrder(null);
  };

  const handleCancelOrderForm = () => {
    setShowOrderForm(false);
    setEditingOrder(null);
  };

  const handleDeleteOrder = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот заказ?')) {
      onDeleteOrder(id);
    }
  };

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

  const getCompletionStatus = (order: ReadyPoiOrder) => {
    if (order.issueDate) return { status: 'Выдан', color: 'text-green-600' };
    if (order.manufacturingDate) return { status: 'Изготовлен', color: 'text-yellow-600' };
    return { status: 'В работе', color: 'text-blue-600' };
  };

  // Если открыта форма заказа
  if (showOrderForm) {
    const personalFile = editingOrder ? 
      personalFiles.find(pf => pf.id === editingOrder.personalFileId) : 
      undefined;

    return (
      <ReadyPoiOrderForm
        order={editingOrder || undefined}
        personalFile={personalFile}
        onSave={handleSaveOrder}
        onCancel={handleCancelOrderForm}
        productTypes={readyPoiProductTypes}
        diagnoses={readyPoiDiagnoses}
        materialUnits={materialUnits}
        defaultMaterials={defaultMaterials}
      />
    );
  }

  // Если открыт просмотр заказа
  if (selectedOrder) {
    const personalFile = personalFiles.find(pf => pf.id === selectedOrder.personalFileId);
    const completionStatus = getCompletionStatus(selectedOrder);

    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Заказ {selectedOrder.orderNumber}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => handleEditOrder(selectedOrder)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Редактировать</span>
            </button>
            <button
              onClick={() => setSelectedOrder(null)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Основная информация */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Информация о заказе</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Номер заказа:</span>
                  <span className="text-sm text-gray-900">{selectedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Дата заказа:</span>
                  <span className="text-sm text-gray-900">
                    {new Date(selectedOrder.orderDate).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Вид изделия:</span>
                  <span className="text-sm text-gray-900">{selectedOrder.productType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Диагноз:</span>
                  <span className="text-sm text-gray-900">{selectedOrder.diagnosis}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Тип заказа:</span>
                  <span className="text-sm text-gray-900">{selectedOrder.orderType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Услуга:</span>
                  <span className="text-sm text-gray-900">{selectedOrder.serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Стоимость:</span>
                  <span className="text-sm text-gray-900">{selectedOrder.orderCost.toFixed(2)} ₽</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Статус и приоритет</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Статус:</span>
                  <span className={getStatusBadge(selectedOrder.status)}>
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-1">{selectedOrder.status}</span>
                  </span>
                </div>
                {selectedOrder.urgencyReason && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Причина срочности:</span>
                    <span className="text-sm text-gray-900">{selectedOrder.urgencyReason}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Состояние:</span>
                  <span className={`text-sm font-medium ${completionStatus.color}`}>
                    {completionStatus.status}
                  </span>
                </div>
                {selectedOrder.manufacturingDate && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Дата изготовления:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(selectedOrder.manufacturingDate).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                )}
                {selectedOrder.issueDate && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Дата выдачи:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(selectedOrder.issueDate).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Информация о клиенте */}
          {personalFile && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Информация о клиенте</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">ФИО</p>
                  <p className="text-sm text-gray-900">
                    {personalFile.lastName} {personalFile.firstName} {personalFile.middleName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Группа инвалидности</p>
                  <p className="text-sm text-gray-900">{personalFile.disabilityGroup}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">ПИН</p>
                  <p className="text-sm text-gray-900">{personalFile.pin}</p>
                </div>
              </div>
            </div>
          )}

          {/* Материалы */}
          {selectedOrder.materials.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Материалы и комплектация</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        №
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        № артикул
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Наименование
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ед.изм
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Кол-во
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Сумма
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedOrder.materials.map((material, index) => (
                      <tr key={material.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {material.articleNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {material.materialName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {material.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {material.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {material.total.toFixed(2)} ₽
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Примерки */}
          {selectedOrder.fittings.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Примерки</h3>
              <div className="space-y-3">
                {selectedOrder.fittings.map((fitting) => (
                  <div key={fitting.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-2">
                      Примерка {fitting.fittingNumber}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Дата вызова</p>
                        <p className="text-sm text-gray-900">
                          {fitting.callDate ? new Date(fitting.callDate).toLocaleDateString('ru-RU') : 'Не указана'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Дата явки</p>
                        <p className="text-sm text-gray-900">
                          {fitting.appointmentDate ? new Date(fitting.appointmentDate).toLocaleDateString('ru-RU') : 'Не указана'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Примечания */}
          {selectedOrder.notes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Примечания</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-900">{selectedOrder.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопки */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Заказы на готовые ПОИ</h1>
        <button
          onClick={handleNewOrder}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Новый заказ</span>
        </button>
      </div>

      {/* Фильтры и поиск */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Поиск</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Поиск по номеру, клиенту, изделию..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Все статусы</option>
              <option value="Срочный">Срочный</option>
              <option value="Обычный">Обычный</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Приоритет</label>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Все</option>
              <option value="urgent">Срочные</option>
              <option value="normal">Обычные</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setUrgencyFilter('all');
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Сбросить</span>
            </button>
          </div>
        </div>
      </div>

      {/* Таблица заказов */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  № заказа
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Клиент
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Изделие
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Диагноз
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Состояние
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const completionStatus = getCompletionStatus(order);
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(order.status)}
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          {order.orderNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.orderDate).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.clientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.productType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.diagnosis}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(order.status)}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${completionStatus.color}`}>
                        {completionStatus.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Просмотр"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditOrder(order)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Редактировать"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {onPrintBlank && (
                          <button
                            onClick={() => {
                              const personalFile = personalFiles.find(pf => pf.id === order.personalFileId);
                              if (personalFile) {
                                onPrintBlank(order.id, personalFile, order.diagnosis);
                              }
                            }}
                            className="text-green-600 hover:text-green-900"
                            title="Печать бланка"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Accessibility className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Заказы не найдены</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || urgencyFilter !== 'all'
                ? 'Попробуйте изменить параметры поиска'
                : 'Создайте первый заказ на готовые ПОИ'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadyPoiOrdersPage;
