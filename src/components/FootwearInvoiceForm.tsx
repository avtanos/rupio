import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { FootwearInvoice, FootwearTechnicalOperation, FootwearFitting } from '../types/invoices';
import { PersonalFile } from '../types/personalFile';
import { Order } from '../types';

interface FootwearInvoiceFormProps {
  invoice?: FootwearInvoice;
  onSave: (invoice: FootwearInvoice) => void;
  onCancel: () => void;
  personalFiles?: PersonalFile[];
  orders?: Order[];
}

const FootwearInvoiceForm: React.FC<FootwearInvoiceFormProps> = ({
  invoice,
  onSave,
  onCancel,
  personalFiles = [],
  orders = []
}) => {
  const [formData, setFormData] = useState<Partial<FootwearInvoice>>({
    type: 'footwear',
    status: 'draft',
    priority: 'normal',
    technicalOperations: [],
    fittings: [],
    needsCast: false,
    ...invoice
  });

  const [newOperation, setNewOperation] = useState<Partial<FootwearTechnicalOperation>>({
    operationName: '',
    executorName: '',
    executionDate: '',
    qualityCheck: false
  });

  const [newFitting, setNewFitting] = useState<Partial<FootwearFitting>>({
    fittingNumber: 1,
    callDate: '',
    appointmentDate: ''
  });

  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [selectedPersonalFileId, setSelectedPersonalFileId] = useState<string>('');

  useEffect(() => {
    // Рассчитываем общую стоимость на основе базовой цены
    if (formData.unitPrice && formData.quantity) {
      const totalAmount = formData.unitPrice * formData.quantity;
      setFormData(prev => ({ ...prev, totalAmount }));
    }
  }, [formData.unitPrice, formData.quantity]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrderId(orderId);
    const selectedOrder = orders.find(order => order.id === orderId);
    if (selectedOrder) {
      setFormData(prev => ({
        ...prev,
        orderNumber: selectedOrder.orderNumber,
        clientName: selectedOrder.clientName,
        personalFileId: selectedOrder.clientId
      }));
      setSelectedPersonalFileId(selectedOrder.clientId);
    }
  };

  const handlePersonalFileSelect = (personalFileId: string) => {
    setSelectedPersonalFileId(personalFileId);
    const selectedPersonalFile = personalFiles.find(pf => pf.id === personalFileId);
    if (selectedPersonalFile) {
      const fullName = `${selectedPersonalFile.lastName} ${selectedPersonalFile.firstName} ${selectedPersonalFile.middleName || ''}`.trim();
      setFormData(prev => ({
        ...prev,
        clientName: fullName,
        personalFileId: personalFileId
      }));
    }
  };

  const addTechnicalOperation = () => {
    if (newOperation.operationName && newOperation.executorName && newOperation.executionDate) {
      const operation: FootwearTechnicalOperation = {
        id: `op-${Date.now()}`,
        operationName: newOperation.operationName,
        executorName: newOperation.executorName,
        executionDate: newOperation.executionDate,
        qualityCheck: newOperation.qualityCheck || false
      };

      setFormData(prev => ({
        ...prev,
        technicalOperations: [...(prev.technicalOperations || []), operation]
      }));

      setNewOperation({
        operationName: '',
        executorName: '',
        executionDate: '',
        qualityCheck: false
      });
    }
  };

  const removeTechnicalOperation = (operationId: string) => {
    setFormData(prev => ({
      ...prev,
      technicalOperations: prev.technicalOperations?.filter(op => op.id !== operationId) || []
    }));
  };

  const addFitting = () => {
    if (newFitting.callDate && newFitting.appointmentDate) {
      const fitting: FootwearFitting = {
        id: `fit-${Date.now()}`,
        fittingNumber: newFitting.fittingNumber || 1,
        callDate: newFitting.callDate,
        appointmentDate: newFitting.appointmentDate
      };

      setFormData(prev => ({
        ...prev,
        fittings: [...(prev.fittings || []), fitting]
      }));

      setNewFitting({
        fittingNumber: 1,
        callDate: '',
        appointmentDate: ''
      });
    }
  };

  const removeFitting = (fittingId: string) => {
    setFormData(prev => ({
      ...prev,
      fittings: prev.fittings?.filter(fit => fit.id !== fittingId) || []
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const invoiceData: FootwearInvoice = {
      id: formData.id || `inv-footwear-${Date.now()}`,
      type: 'footwear',
      invoiceNumber: formData.invoiceNumber || '',
      invoiceDate: formData.invoiceDate || new Date().toISOString().split('T')[0],
      orderNumber: formData.orderNumber || '',
      personalFileId: formData.personalFileId || '',
      clientName: formData.clientName || '',
      productName: formData.productName || '',
      quantity: formData.quantity || 1,
      unitPrice: formData.unitPrice || 0,
      totalAmount: formData.totalAmount || 0,
      status: formData.status || 'draft',
      priority: formData.priority || 'normal',
      model: formData.model || '',
      color: formData.color || '',
      material: formData.material || '',
      heelHeight: formData.heelHeight || 0,
      heelMaterial: formData.heelMaterial || '',
      size: formData.size || '',
      technicalOperations: formData.technicalOperations || [],
      fittings: formData.fittings || [],
      needsCast: formData.needsCast || false,
      leftLegShortening: formData.leftLegShortening,
      rightLegShortening: formData.rightLegShortening,
      notes: formData.notes,
      createdBy: formData.createdBy || 'Текущий пользователь',
      approvedBy: formData.approvedBy,
      sentDate: formData.sentDate,
      receivedDate: formData.receivedDate,
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(invoiceData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {invoice ? 'Редактировать накладную на обувь' : 'Создать накладную на обувь'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Основная информация */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Номер накладной *
                </label>
                <input
                  type="text"
                  value={formData.invoiceNumber || ''}
                  onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дата накладной *
                </label>
                <input
                  type="date"
                  value={formData.invoiceDate || ''}
                  onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Номер заказа *
                </label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => handleOrderSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Выберите заказ</option>
                  {orders
                    .filter(order => order.productCategory === 'обувь' || order.productType.toLowerCase().includes('обувь'))
                    .map(order => (
                    <option key={order.id} value={order.id}>
                      {order.orderNumber} - {order.clientName} ({order.productType})
                    </option>
                  ))}
                </select>
                {formData.orderNumber && (
                  <div className="mt-1 text-sm text-gray-600">
                    Выбран: {formData.orderNumber}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID личного дела *
                </label>
                <input
                  type="text"
                  value={formData.personalFileId || ''}
                  onChange={(e) => handleInputChange('personalFileId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Пациент *
                </label>
                <select
                  value={selectedPersonalFileId}
                  onChange={(e) => handlePersonalFileSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                >
                  <option value="">Выберите из личных дел</option>
                  {personalFiles.map(personalFile => {
                    const fullName = `${personalFile.lastName} ${personalFile.firstName} ${personalFile.middleName || ''}`.trim();
                    return (
                      <option key={personalFile.id} value={personalFile.id}>
                        {fullName} (ПИН: {personalFile.pin})
                      </option>
                    );
                  })}
                </select>
                <div className="text-sm text-gray-500 mb-2">или введите ФИО вручную:</div>
                <input
                  type="text"
                  value={formData.clientName || ''}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  placeholder="ФИО клиента"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Наименование изделия *
                </label>
                <input
                  type="text"
                  value={formData.productName || ''}
                  onChange={(e) => handleInputChange('productName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Модель *
                </label>
                <select
                  value={formData.model || ''}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Выберите модель</option>
                  <option value="Ортопедические туфли">Ортопедические туфли</option>
                  <option value="Ортопедические ботинки">Ортопедические ботинки</option>
                  <option value="Ортопедические сапоги">Ортопедические сапоги</option>
                  <option value="Ортопедические кроссовки">Ортопедические кроссовки</option>
                  <option value="Ортопедические сандалии">Ортопедические сандалии</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Цвет *
                </label>
                <select
                  value={formData.color || ''}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Выберите цвет</option>
                  <option value="Черный">Черный</option>
                  <option value="Коричневый">Коричневый</option>
                  <option value="Темно-синий">Темно-синий</option>
                  <option value="Серый">Серый</option>
                  <option value="Бежевый">Бежевый</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Материал *
                </label>
                <select
                  value={formData.material || ''}
                  onChange={(e) => handleInputChange('material', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Выберите материал</option>
                  <option value="Натуральная кожа">Натуральная кожа</option>
                  <option value="Искусственная кожа">Искусственная кожа</option>
                  <option value="Текстиль">Текстиль</option>
                  <option value="Комбинированный">Комбинированный</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Размер *
                </label>
                <select
                  value={formData.size || ''}
                  onChange={(e) => handleInputChange('size', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Выберите размер</option>
                  {Array.from({ length: 20 }, (_, i) => i + 35).map(size => (
                    <option key={size} value={size.toString()}>{size}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Высота каблука (см)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={formData.heelHeight || ''}
                  onChange={(e) => handleInputChange('heelHeight', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Материал каблука
                </label>
                <select
                  value={formData.heelMaterial || ''}
                  onChange={(e) => handleInputChange('heelMaterial', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Выберите материал</option>
                  <option value="Резина">Резина</option>
                  <option value="Пластик">Пластик</option>
                  <option value="Дерево">Дерево</option>
                  <option value="Металл">Металл</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Количество *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity || 1}
                  onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Цена за единицу *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.unitPrice || ''}
                  onChange={(e) => handleInputChange('unitPrice', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Приоритет
                </label>
                <select
                  value={formData.priority || 'normal'}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Низкий</option>
                  <option value="normal">Обычный</option>
                  <option value="high">Высокий</option>
                  <option value="urgent">Срочный</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Статус
                </label>
                <select
                  value={formData.status || 'draft'}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Черновик</option>
                  <option value="approved">Утверждено</option>
                  <option value="sent">Отправлено</option>
                  <option value="received">Получено</option>
                  <option value="completed">Завершено</option>
                  <option value="cancelled">Отменено</option>
                </select>
              </div>
            </div>

            {/* Укорочение ног */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Укорочение ног</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Укорочение левой ноги (см)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.leftLegShortening || ''}
                    onChange={(e) => handleInputChange('leftLegShortening', parseFloat(e.target.value) || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Укорочение правой ноги (см)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.rightLegShortening || ''}
                    onChange={(e) => handleInputChange('rightLegShortening', parseFloat(e.target.value) || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Технологические операции */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Технологические операции</h3>
              
              {/* Добавление новой операции */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Наименование операции
                  </label>
                  <input
                    type="text"
                    value={newOperation.operationName || ''}
                    onChange={(e) => setNewOperation(prev => ({ ...prev, operationName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Исполнитель
                  </label>
                  <input
                    type="text"
                    value={newOperation.executorName || ''}
                    onChange={(e) => setNewOperation(prev => ({ ...prev, executorName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Дата выполнения
                  </label>
                  <input
                    type="date"
                    value={newOperation.executionDate || ''}
                    onChange={(e) => setNewOperation(prev => ({ ...prev, executionDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="qualityCheckNew"
                    checked={newOperation.qualityCheck || false}
                    onChange={(e) => setNewOperation(prev => ({ ...prev, qualityCheck: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="qualityCheckNew" className="ml-2 block text-sm text-gray-900">
                    Контроль качества
                  </label>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addTechnicalOperation}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить
                  </button>
                </div>
              </div>

              {/* Список операций */}
              {formData.technicalOperations && formData.technicalOperations.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Наименование операции
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Исполнитель
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Дата выполнения
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Контроль качества
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.technicalOperations.map((operation) => (
                        <tr key={operation.id}>
                          <td className="px-4 py-2 text-sm text-gray-900">{operation.operationName}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{operation.executorName}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{operation.executionDate}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {operation.qualityCheck ? '✓' : '✗'}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            <button
                              type="button"
                              onClick={() => removeTechnicalOperation(operation.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Примерки */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Примерки</h3>
              
              {/* Добавление новой примерки */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Номер примерки
                  </label>
                  <select
                    value={newFitting.fittingNumber || 1}
                    onChange={(e) => setNewFitting(prev => ({ ...prev, fittingNumber: parseInt(e.target.value) as 1 | 2 | 3 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Дата вызова
                  </label>
                  <input
                    type="date"
                    value={newFitting.callDate || ''}
                    onChange={(e) => setNewFitting(prev => ({ ...prev, callDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Дата примерки
                  </label>
                  <input
                    type="date"
                    value={newFitting.appointmentDate || ''}
                    onChange={(e) => setNewFitting(prev => ({ ...prev, appointmentDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addFitting}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить
                  </button>
                </div>
              </div>

              {/* Список примерок */}
              {formData.fittings && formData.fittings.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Номер примерки
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Дата вызова
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Дата примерки
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.fittings.map((fitting) => (
                        <tr key={fitting.id}>
                          <td className="px-4 py-2 text-sm text-gray-900">{fitting.fittingNumber}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{fitting.callDate}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{fitting.appointmentDate}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            <button
                              type="button"
                              onClick={() => removeFitting(fitting.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Дополнительные параметры */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="needsCast"
                checked={formData.needsCast || false}
                onChange={(e) => handleInputChange('needsCast', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="needsCast" className="ml-2 block text-sm text-gray-900">
                Требуется слепок
              </label>
            </div>

            {/* Примечания */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Примечания
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Общая сумма */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-lg font-semibold text-blue-900">
                Общая сумма: {formData.totalAmount || 0} сом
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Save className="w-4 h-4 mr-2" />
                Сохранить
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FootwearInvoiceForm;
