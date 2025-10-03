import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Edit, Eye, Trash2, Package, Clock, CheckCircle, AlertCircle, Wrench, Truck, Calendar, User } from 'lucide-react';
import { ManufacturingOrder, ManufacturingFilters } from '../types/manufacturing';
import { PersonalFile } from '../types/personalFile';
import { WorkOrder } from '../types/orders';
import MaterialsManagement from './MaterialsManagement';
import ProductReadinessTracking from './ProductReadinessTracking';
import TransferOrderForm from './TransferOrderForm';

interface ManufacturingOrdersPageProps {
  manufacturingOrders: ManufacturingOrder[];
  personalFiles: PersonalFile[];
  workOrders: WorkOrder[];
  materialsCatalog: any[];
  onNewManufacturingOrder: (order: any) => void;
  onUpdateManufacturingOrder: (id: string, updates: Partial<ManufacturingOrder>) => void;
  onDeleteManufacturingOrder: (id: string) => void;
  onNewTransferOrder: (transferOrder: any) => void;
}

const ManufacturingOrdersPage: React.FC<ManufacturingOrdersPageProps> = ({
  manufacturingOrders,
  personalFiles,
  workOrders,
  materialsCatalog,
  onNewManufacturingOrder,
  onUpdateManufacturingOrder,
  onDeleteManufacturingOrder,
  onNewTransferOrder
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('all');
  const [workerFilter, setWorkerFilter] = useState<string>('all');
  const [workshopFilter, setWorkshopFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  const [selectedOrder, setSelectedOrder] = useState<ManufacturingOrder | null>(null);
  const [showMaterials, setShowMaterials] = useState(false);
  const [showReadiness, setShowReadiness] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [editingTransferOrder, setEditingTransferOrder] = useState<any>(null);

  const statusOptions = [
    { value: 'all', label: 'Все статусы' },
    { value: 'В очереди', label: 'В очереди' },
    { value: 'В работе', label: 'В работе' },
    { value: 'Приостановлено', label: 'Приостановлено' },
    { value: 'Готово', label: 'Готово' },
    { value: 'Передано на склад', label: 'Передано на склад' },
    { value: 'Отменено', label: 'Отменено' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'Все приоритеты' },
    { value: 'Низкий', label: 'Низкий' },
    { value: 'Средний', label: 'Средний' },
    { value: 'Высокий', label: 'Высокий' },
    { value: 'Критический', label: 'Критический' }
  ];

  const filteredOrders = useMemo(() => {
    return manufacturingOrders.filter(order => {
      const personalFile = personalFiles.find(pf => pf.id === order.personalFileId);
      const fullName = personalFile ? `${personalFile.lastName} ${personalFile.firstName} ${personalFile.middleName || ''}`.toLowerCase() : '';
      
      const matchesSearch = searchTerm === '' || 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.assignedWorker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fullName.includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesOrderType = orderTypeFilter === 'all' || order.orderType === orderTypeFilter;
      const matchesWorker = workerFilter === 'all' || order.assignedWorker === workerFilter;
      const matchesWorkshop = workshopFilter === 'all' || order.workshop === workshopFilter;
      const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;

      const matchesDateFrom = !dateFrom || order.orderDate >= dateFrom;
      const matchesDateTo = !dateTo || order.orderDate <= dateTo;

      return matchesSearch && matchesStatus && matchesOrderType && matchesWorker && 
             matchesWorkshop && matchesPriority && matchesDateFrom && matchesDateTo;
    });
  }, [manufacturingOrders, personalFiles, searchTerm, statusFilter, orderTypeFilter, workerFilter, workshopFilter, priorityFilter, dateFrom, dateTo]);

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      'В очереди': 'bg-gray-100 text-gray-800',
      'В работе': 'bg-blue-100 text-blue-800',
      'Приостановлено': 'bg-yellow-100 text-yellow-800',
      'Готово': 'bg-green-100 text-green-800',
      'Передано на склад': 'bg-emerald-100 text-emerald-800',
      'Отменено': 'bg-red-100 text-red-800'
    };

    return `px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'}`;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityStyles = {
      'Низкий': 'bg-gray-100 text-gray-800',
      'Средний': 'bg-blue-100 text-blue-800',
      'Высокий': 'bg-orange-100 text-orange-800',
      'Критический': 'bg-red-100 text-red-800'
    };

    return `px-2 py-1 text-xs font-medium rounded-full ${priorityStyles[priority as keyof typeof priorityStyles] || 'bg-gray-100 text-gray-800'}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'В очереди':
        return <Clock className="w-4 h-4" />;
      case 'В работе':
        return <Wrench className="w-4 h-4" />;
      case 'Приостановлено':
        return <AlertCircle className="w-4 h-4" />;
      case 'Готово':
        return <CheckCircle className="w-4 h-4" />;
      case 'Передано на склад':
        return <Truck className="w-4 h-4" />;
      case 'Отменено':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleViewOrder = (order: ManufacturingOrder) => {
    setSelectedOrder(order);
  };

  const handleEditOrder = (order: ManufacturingOrder) => {
    // В будущем можно добавить редактирование заказа
    console.log('Редактирование заказа:', order);
  };

  const handleDeleteOrder = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот заказ на изготовление?')) {
      onDeleteManufacturingOrder(id);
    }
  };

  const handleMaterialsManagement = (order: ManufacturingOrder) => {
    setSelectedOrder(order);
    setShowMaterials(true);
  };

  const handleReadinessTracking = (order: ManufacturingOrder) => {
    setSelectedOrder(order);
    setShowReadiness(true);
  };

  const handleTransferOrder = (order: ManufacturingOrder) => {
    setSelectedOrder(order);
    setShowTransferForm(true);
  };

  const handleUpdateMaterials = (materials: any[]) => {
    if (selectedOrder) {
      onUpdateManufacturingOrder(selectedOrder.id, { materials });
    }
  };

  const handleUpdateReadiness = (readiness: any) => {
    if (selectedOrder) {
      onUpdateManufacturingOrder(selectedOrder.id, { readiness });
    }
  };

  const handleSaveTransferOrder = (transferData: any) => {
    if (selectedOrder) {
      onNewTransferOrder({
        ...transferData,
        manufacturingOrderId: selectedOrder.id
      });
      setShowTransferForm(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setOrderTypeFilter('all');
    setWorkerFilter('all');
    setWorkshopFilter('all');
    setPriorityFilter('all');
    setDateFrom('');
    setDateTo('');
  };

  const getUniqueValues = (key: string) => {
    const values = manufacturingOrders.map(order => order[key as keyof ManufacturingOrder] as string);
    return Array.from(new Set(values)).filter(Boolean);
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Изготовление заказов</h1>
          <p className="text-gray-600">Управление производственными заказами в цехах</p>
        </div>
        <button
          onClick={() => {/* В будущем добавить создание нового заказа */}}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Новый заказ</span>
        </button>
      </div>

      {/* Фильтры */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Поиск
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Номер заказа, изделие, работник..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Статус
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Приоритет
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Дата с
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={clearFilters}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Очистить фильтры</span>
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
                  Заказ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Изделие
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Пациент
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Работник
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Цех
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Приоритет
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const personalFile = personalFiles.find(pf => pf.id === order.personalFileId);
                const fullName = personalFile ? `${personalFile.lastName} ${personalFile.firstName} ${personalFile.middleName || ''}`.trim() : 'Неизвестно';
                
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 font-mono">
                          {order.orderNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.orderDate).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{order.productName}</div>
                      <div className="text-sm text-gray-500">{order.orderType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{fullName}</div>
                      {personalFile && (
                        <div className="text-sm text-gray-500">ПИН: {personalFile.pin}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{order.assignedWorker}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{order.workshop}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(order.status)}
                        <span className={`ml-2 ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getPriorityBadge(order.priority)}>
                        {order.priority}
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
                          onClick={() => handleMaterialsManagement(order)}
                          className="text-green-600 hover:text-green-900"
                          title="Материалы"
                        >
                          <Package className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReadinessTracking(order)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Готовность"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleTransferOrder(order)}
                          className="text-orange-600 hover:text-orange-900"
                          title="Передача на склад"
                        >
                          <Truck className="w-4 h-4" />
                        </button>
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
            <Wrench className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Заказы не найдены</h3>
            <p className="mt-1 text-sm text-gray-500">
              Попробуйте изменить параметры поиска или создать новый заказ.
            </p>
          </div>
        )}
      </div>

      {/* Модальные окна */}
      {selectedOrder && showMaterials && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Управление материалами - {selectedOrder.orderNumber}
              </h2>
              <button
                onClick={() => setShowMaterials(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="p-6">
              <MaterialsManagement
                materials={selectedOrder.materials}
                onAddMaterial={(material) => {
                  const newMaterials = [...selectedOrder.materials, {
                    ...material,
                    id: `mat-${Date.now()}`,
                    totalCost: material.quantityUsed * material.unitPrice
                  }];
                  handleUpdateMaterials(newMaterials);
                }}
                onUpdateMaterial={(id, material) => {
                  const newMaterials = selectedOrder.materials.map(m => 
                    m.id === id ? { ...m, ...material, totalCost: material.quantityUsed * material.unitPrice } : m
                  );
                  handleUpdateMaterials(newMaterials);
                }}
                onDeleteMaterial={(id) => {
                  const newMaterials = selectedOrder.materials.filter(m => m.id !== id);
                  handleUpdateMaterials(newMaterials);
                }}
                materialsCatalog={materialsCatalog}
              />
            </div>
          </div>
        </div>
      )}

      {selectedOrder && showReadiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Отслеживание готовности - {selectedOrder.orderNumber}
              </h2>
              <button
                onClick={() => setShowReadiness(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="p-6">
              <ProductReadinessTracking
                readiness={selectedOrder.readiness}
                onUpdateReadiness={handleUpdateReadiness}
                isEditable={true}
              />
            </div>
          </div>
        </div>
      )}

      {selectedOrder && showTransferForm && (
        <TransferOrderForm
          manufacturingOrder={selectedOrder}
          onSave={handleSaveTransferOrder}
          onCancel={() => setShowTransferForm(false)}
          existingTransferOrder={editingTransferOrder}
        />
      )}
    </div>
  );
};

export default ManufacturingOrdersPage;
