import React, { useState, useMemo } from 'react';
import { 
  CheckCircle, XCircle, RotateCcw, Clock, AlertCircle, Eye, FileText, User, 
  Users, Stethoscope, ClipboardCheck
} from 'lucide-react';
import { Order } from '../types';
import { PersonalFile } from '../types/personalFile';
import { WorkflowAction } from '../types/workflow';
import { Invoice } from '../types/invoices';

interface ChiefDoctorDashboardProps {
  orders: Order[];
  personalFiles: PersonalFile[];
  invoices: Invoice[];
  onWorkflowAction: (orderId: string, action: WorkflowAction, comments?: string) => void;
  onViewOrder: (orderId: string) => void;
  onViewPersonalFile: (personalFileId: string) => void;
}

const ChiefDoctorDashboard: React.FC<ChiefDoctorDashboardProps> = ({
  orders,
  personalFiles,
  invoices,
  onWorkflowAction,
  onViewOrder,
  onViewPersonalFile
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'urgent'>('pending');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'team'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  // Фильтрация заказов, требующих одобрения главного врача
  const pendingOrders = useMemo(() => {
    return orders.filter(order => 
      order.status === 'мед_осмотр' || 
      order.status === 'в_производстве'
    );
  }, [orders]);

  const urgentOrders = useMemo(() => {
    // Для Order типа нет поля priority, используем дату как критерий срочности
    return pendingOrders.filter(order => {
      const orderDate = new Date(order.createdDate);
      const now = new Date();
      const daysDiff = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
      return daysDiff > 7; // Считаем срочными заказы старше 7 дней
    });
  }, [pendingOrders]);

  const filteredOrders = useMemo(() => {
    let filtered = orders;
    
    switch (filter) {
      case 'urgent':
        filtered = urgentOrders;
        break;
      case 'pending':
        filtered = pendingOrders;
        break;
      default:
        filtered = orders;
    }

    // Применяем поиск
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.productType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Применяем фильтр по дате
    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdDate);
        const fromDate = new Date(dateRange.from);
        const toDate = new Date(dateRange.to);
        return orderDate >= fromDate && orderDate <= toDate;
      });
    }

    return filtered;
  }, [filter, pendingOrders, urgentOrders, orders, searchTerm, dateRange]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'мед_осмотр': return 'bg-orange-100 text-orange-800';
      case 'в_производстве': return 'bg-blue-100 text-blue-800';
      case 'готов_к_выдаче': return 'bg-green-100 text-green-800';
      case 'завершен': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (order: Order) => {
    const orderDate = new Date(order.createdDate);
    const now = new Date();
    const daysDiff = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
    
    if (daysDiff > 7) {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    } else if (daysDiff > 3) {
      return <Clock className="w-4 h-4 text-yellow-500" />;
    }
    return null;
  };

  const handleWorkflowAction = (orderId: string, action: WorkflowAction) => {
    if (action === 'reject' || action === 'return_for_revision') {
      setSelectedOrder(orders.find(o => o.id === orderId) || null);
      setShowComments(true);
    } else {
      onWorkflowAction(orderId, action);
    }
  };

  const handleSubmitComments = () => {
    if (selectedOrder && comments.trim()) {
      onWorkflowAction(selectedOrder.id, 'return_for_revision', comments);
      setComments('');
      setSelectedOrder(null);
    }
    setShowComments(false);
  };

  const getPersonalFile = (clientId: string) => {
    return personalFiles.find(pf => pf.id === clientId);
  };

  return (
    <div className="space-y-6">
      {/* Заголовок и статистика */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Панель главного врача</h1>
            <p className="text-gray-600">Управление заказами и медицинской командой</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Всего заказов</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">На рассмотрении</p>
              <p className="text-2xl font-bold text-orange-600">{pendingOrders.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Срочные</p>
              <p className="text-2xl font-bold text-red-600">{urgentOrders.length}</p>
            </div>
          </div>
        </div>

        {/* Вкладки */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'orders'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ClipboardCheck className="w-4 h-4 inline mr-2" />
            Заказы на рассмотрении
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'team'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Медицинская команда
          </button>
        </div>
      </div>

      {/* Контент вкладок */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-lg shadow">
          {/* Фильтры и поиск */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 text-sm rounded-full ${
                    filter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Все ({orders.length})
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-3 py-1 text-sm rounded-full ${
                    filter === 'pending' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  На рассмотрении ({pendingOrders.length})
                </button>
                <button
                  onClick={() => setFilter('urgent')}
                  className={`px-3 py-1 text-sm rounded-full ${
                    filter === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Срочные ({urgentOrders.length})
                </button>
              </div>
              
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Поиск по номеру, клиенту или изделию..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <FileText className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Список заказов */}
          <div className="divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Нет заказов для рассмотрения</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const personalFile = getPersonalFile(order.clientId);
                
                return (
                  <div key={order.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {order.orderNumber}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          {getPriorityIcon(order)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Пациент</p>
                            <p className="font-medium text-gray-900">{order.clientName}</p>
                            {personalFile && (
                              <button
                                onClick={() => onViewPersonalFile(personalFile.id)}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                Личное дело
                              </button>
                            )}
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-600">Изделие</p>
                            <p className="font-medium text-gray-900">{order.productType}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-600">Дата заказа</p>
                            <p className="font-medium text-gray-900">
                              {new Date(order.createdDate).toLocaleDateString('ru-RU')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onViewOrder(order.id)}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Просмотр
                          </button>
                          
                          <button
                            onClick={() => handleWorkflowAction(order.id, 'approve')}
                            className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm text-white bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Одобрить
                          </button>
                          
                          <button
                            onClick={() => handleWorkflowAction(order.id, 'reject')}
                            className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm text-white bg-red-600 hover:bg-red-700"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Отклонить
                          </button>
                          
                          <button
                            onClick={() => handleWorkflowAction(order.id, 'return_for_revision')}
                            className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm text-white bg-orange-600 hover:bg-orange-700"
                          >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            На доработку
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Вкладка Медицинская команда */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          {/* Информация о команде */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Медицинская команда</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Stethoscope className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Врачи-ортопеды</p>
                    <p className="text-xl font-bold text-gray-900">3</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <User className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Медицинские сестры</p>
                    <p className="text-xl font-bold text-gray-900">5</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Всего сотрудников</p>
                    <p className="text-xl font-bold text-gray-900">8</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Список сотрудников */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Сотрудники медицинского отдела</h3>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Stethoscope className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Др. Иванов И.И.</p>
                      <p className="text-sm text-gray-600">Главный врач-ортопед</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Активен
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Stethoscope className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Др. Петрова А.С.</p>
                      <p className="text-sm text-gray-600">Врач-ортопед</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Активен
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Сидорова М.В.</p>
                      <p className="text-sm text-gray-600">Старшая медицинская сестра</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Активен
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно для комментариев */}
      {showComments && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Добавить комментарий</h3>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Введите комментарий к решению..."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowComments(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Отмена
                </button>
                <button
                  onClick={handleSubmitComments}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Отправить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChiefDoctorDashboard;
