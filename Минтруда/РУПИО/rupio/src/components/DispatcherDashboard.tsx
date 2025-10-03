import React, { useState, useMemo } from 'react';
import { Package, Clock, CheckCircle, AlertCircle, Users, Calendar, ArrowRight } from 'lucide-react';
import { WorkOrder } from '../types/orders';
import { PersonalFile } from '../types/personalFile';
import { DepartmentAssignment } from '../types/workflow';

interface DispatcherDashboardProps {
  orders: WorkOrder[];
  personalFiles: PersonalFile[];
  assignments: DepartmentAssignment[];
  onAssignToDepartment: (orderId: string, department: string, priority: string, estimatedDate: string) => void;
  onViewOrder: (orderId: string) => void;
  onViewPersonalFile: (personalFileId: string) => void;
}

const DispatcherDashboard: React.FC<DispatcherDashboardProps> = ({
  orders,
  personalFiles,
  assignments,
  onAssignToDepartment,
  onViewOrder,
  onViewPersonalFile
}) => {
  const [filter, setFilter] = useState<'all' | 'unassigned' | 'assigned'>('unassigned');
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [assignmentData, setAssignmentData] = useState({
    department: '',
    priority: 'medium',
    estimatedDate: ''
  });

  // Заказы, ожидающие назначения диспетчером
  const unassignedOrders = useMemo(() => {
    return orders.filter(order => 
      order.workflowStatus === 'dispatcher_assignment' || 
      order.status === 'dispatcher_assignment'
    );
  }, [orders]);

  // Заказы, уже назначенные в отделы
  const assignedOrders = useMemo(() => {
    const assignedOrderIds = assignments.map(a => a.orderId);
    return orders.filter(order => assignedOrderIds.includes(order.id));
  }, [orders, assignments]);

  const filteredOrders = useMemo(() => {
    switch (filter) {
      case 'unassigned':
        return unassignedOrders;
      case 'assigned':
        return assignedOrders;
      default:
        return orders;
    }
  }, [filter, unassignedOrders, assignedOrders, orders]);

  const getDepartmentLabel = (department: string) => {
    const labels: Record<string, string> = {
      'prosthetics': 'Протезирование',
      'footwear': 'Обувь',
      'ottobock': 'Оттобок',
      'repair': 'Ремонт',
      'ready_poi': 'Готовые ПОИ'
    };
    return labels[department] || department;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'high': return <Clock className="w-4 h-4 text-orange-500" />;
      default: return null;
    }
  };

  const getPersonalFile = (personalFileId: string) => {
    return personalFiles.find(pf => pf.id === personalFileId);
  };

  const getAssignment = (orderId: string) => {
    return assignments.find(a => a.orderId === orderId);
  };

  const handleAssignOrder = (order: WorkOrder) => {
    setSelectedOrder(order);
    setAssignmentData({
      department: '',
      priority: 'medium',
      estimatedDate: ''
    });
    setShowAssignmentForm(true);
  };

  const handleConfirmAssignment = () => {
    if (selectedOrder && assignmentData.department && assignmentData.estimatedDate) {
      onAssignToDepartment(
        selectedOrder.id,
        assignmentData.department,
        assignmentData.priority,
        assignmentData.estimatedDate
      );
      setShowAssignmentForm(false);
      setSelectedOrder(null);
    }
  };

  const departments = [
    { value: 'prosthetics', label: 'Протезирование' },
    { value: 'footwear', label: 'Обувь' },
    { value: 'ottobock', label: 'Оттобок' },
    { value: 'repair', label: 'Ремонт' },
    { value: 'ready_poi', label: 'Готовые ПОИ' }
  ];

  const priorities = [
    { value: 'low', label: 'Низкий' },
    { value: 'medium', label: 'Средний' },
    { value: 'high', label: 'Высокий' },
    { value: 'urgent', label: 'Срочный' }
  ];

  return (
    <div className="space-y-6">
      {/* Заголовок и статистика */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Панель диспетчера заказов</h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Ожидают назначения: <span className="font-semibold text-orange-600">{unassignedOrders.length}</span>
            </div>
            <div className="text-sm text-gray-600">
              Назначены: <span className="font-semibold text-green-600">{assignedOrders.length}</span>
            </div>
          </div>
        </div>

        {/* Фильтры */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('unassigned')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'unassigned'
                ? 'bg-orange-100 text-orange-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ожидают назначения ({unassignedOrders.length})
          </button>
          <button
            onClick={() => setFilter('assigned')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'assigned'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Назначены ({assignedOrders.length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Все заказы ({orders.length})
          </button>
        </div>
      </div>

      {/* Список заказов */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {filter === 'unassigned' ? 'Заказы на назначение' : 
             filter === 'assigned' ? 'Назначенные заказы' : 'Все заказы'}
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredOrders.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Нет заказов для отображения</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const personalFile = getPersonalFile(order.personalFileId);
              const assignment = getAssignment(order.id);
              const priority = order.priority || 'medium';
              
              return (
                <div key={order.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {order.orderNumber}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(priority)}`}>
                          {priorities.find(p => p.value === priority)?.label || priority}
                        </span>
                        {getPriorityIcon(priority)}
                        {assignment && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {getDepartmentLabel(assignment.department)}
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Пациент</p>
                          <p className="font-medium text-gray-900">{order.clientName}</p>
                          {personalFile && (
                            <button
                              onClick={() => onViewPersonalFile(personalFile.id)}
                              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              <Users className="w-3 h-3" />
                              Личное дело
                            </button>
                          )}
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">Изделие</p>
                          <p className="font-medium text-gray-900">{order.productName}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">Дата заказа</p>
                          <p className="font-medium text-gray-900">
                            {new Date(order.orderDate).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                      </div>

                      {assignment && (
                        <div className="bg-gray-50 p-3 rounded-lg mb-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Назначен в отдел</p>
                              <p className="font-medium text-gray-900">
                                {getDepartmentLabel(assignment.department)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Приоритет</p>
                              <p className="font-medium text-gray-900">
                                {priorities.find(p => p.value === assignment.priority)?.label}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Планируемая дата</p>
                              <p className="font-medium text-gray-900">
                                {new Date(assignment.estimatedCompletionDate).toLocaleDateString('ru-RU')}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewOrder(order.id)}
                          className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                        >
                          <Package className="w-4 h-4" />
                          Просмотр заказа
                        </button>
                      </div>
                    </div>

                    {/* Действия */}
                    <div className="flex flex-col gap-2 ml-4">
                      {!assignment ? (
                        <button
                          onClick={() => handleAssignOrder(order)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                        >
                          <ArrowRight className="w-4 h-4" />
                          Назначить отдел
                        </button>
                      ) : (
                        <div className="text-sm text-gray-600 text-center">
                          <CheckCircle className="w-6 h-6 mx-auto mb-1 text-green-500" />
                          Назначен
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Модальное окно назначения */}
      {showAssignmentForm && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Назначение заказа {selectedOrder.orderNumber}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Отдел
                </label>
                <select
                  value={assignmentData.department}
                  onChange={(e) => setAssignmentData(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Выберите отдел</option>
                  {departments.map(dept => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Приоритет
                </label>
                <select
                  value={assignmentData.priority}
                  onChange={(e) => setAssignmentData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Планируемая дата завершения
                </label>
                <input
                  type="date"
                  value={assignmentData.estimatedDate}
                  onChange={(e) => setAssignmentData(prev => ({ ...prev, estimatedDate: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleConfirmAssignment}
                disabled={!assignmentData.department || !assignmentData.estimatedDate}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Назначить
              </button>
              <button
                onClick={() => {
                  setShowAssignmentForm(false);
                  setSelectedOrder(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DispatcherDashboard;
