import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { ProsthesisInvoice, ProsthesisInvoiceComponent } from '../types/invoices';
import { PersonalFile } from '../types/personalFile';
import { Order } from '../types';

interface ProsthesisInvoiceFormProps {
  invoice?: ProsthesisInvoice;
  onSave: (invoice: ProsthesisInvoice) => void;
  onCancel: () => void;
  personalFiles?: PersonalFile[];
  orders?: Order[];
}

const ProsthesisInvoiceForm: React.FC<ProsthesisInvoiceFormProps> = ({
  invoice,
  onSave,
  onCancel,
  personalFiles = [],
  orders = []
}) => {
  const [formData, setFormData] = useState<Partial<ProsthesisInvoice>>({
    type: 'prosthesis',
    status: 'draft',
    priority: 'normal',
    components: [],
    measurements: {},
    needsCast: false,
    qualityCheck: false,
    ...invoice
  });

  const [newComponent, setNewComponent] = useState<Partial<ProsthesisInvoiceComponent>>({
    name: '',
    code: '',
    size: '',
    leftQuantity: 0,
    rightQuantity: 0,
    unitPrice: 0
  });

  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [selectedPersonalFileId, setSelectedPersonalFileId] = useState<string>('');

  useEffect(() => {
    if (formData.components) {
      const totalAmount = formData.components.reduce((sum, comp) => sum + comp.totalPrice, 0);
      setFormData(prev => ({ ...prev, totalAmount, unitPrice: totalAmount }));
    }
  }, [formData.components]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMeasurementChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      measurements: { ...prev.measurements, [field]: value }
    }));
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

  const addComponent = () => {
    if (newComponent.name && newComponent.code && newComponent.unitPrice) {
      const component: ProsthesisInvoiceComponent = {
        id: `comp-${Date.now()}`,
        name: newComponent.name,
        code: newComponent.code,
        size: newComponent.size || '',
        leftQuantity: newComponent.leftQuantity || 0,
        rightQuantity: newComponent.rightQuantity || 0,
        unitPrice: newComponent.unitPrice,
        totalPrice: ((newComponent.leftQuantity || 0) + (newComponent.rightQuantity || 0)) * newComponent.unitPrice
      };

      setFormData(prev => ({
        ...prev,
        components: [...(prev.components || []), component]
      }));

      setNewComponent({
        name: '',
        code: '',
        size: '',
        leftQuantity: 0,
        rightQuantity: 0,
        unitPrice: 0
      });
    }
  };

  const removeComponent = (componentId: string) => {
    setFormData(prev => ({
      ...prev,
      components: prev.components?.filter(comp => comp.id !== componentId) || []
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const invoiceData: ProsthesisInvoice = {
      id: formData.id || `inv-prosthesis-${Date.now()}`,
      type: 'prosthesis',
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
      prosthesisType: formData.prosthesisType || '',
      components: formData.components || [],
      measurements: formData.measurements || {},
      needsCast: formData.needsCast || false,
      manufacturingDate: formData.manufacturingDate,
      qualityCheck: formData.qualityCheck || false,
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
              {invoice ? 'Редактировать накладную на протезы' : 'Создать накладную на протезы'}
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
                    .filter(order => order.productCategory === 'протез' || order.productType.toLowerCase().includes('протез'))
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
                  Тип протеза *
                </label>
                <select
                  value={formData.prosthesisType || ''}
                  onChange={(e) => handleInputChange('prosthesisType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Выберите тип</option>
                  <option value="Протез бедра">Протез бедра</option>
                  <option value="Протез голени">Протез голени</option>
                  <option value="Протез стопы">Протез стопы</option>
                  <option value="Протез кисти">Протез кисти</option>
                  <option value="Протез предплечья">Протез предплечья</option>
                </select>
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

            {/* Измерения */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Измерения</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Рост (см)
                  </label>
                  <input
                    type="number"
                    value={formData.measurements?.height || ''}
                    onChange={(e) => handleMeasurementChange('height', parseInt(e.target.value) || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Вес (кг)
                  </label>
                  <input
                    type="number"
                    value={formData.measurements?.weight || ''}
                    onChange={(e) => handleMeasurementChange('weight', parseInt(e.target.value) || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Уровень активности
                  </label>
                  <select
                    value={formData.measurements?.activityLevel || ''}
                    onChange={(e) => handleMeasurementChange('activityLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Выберите уровень</option>
                    <option value="Низкий">Низкий</option>
                    <option value="Средний">Средний</option>
                    <option value="Высокий">Высокий</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Длина культи (см)
                  </label>
                  <input
                    type="number"
                    value={formData.measurements?.stumpLength || ''}
                    onChange={(e) => handleMeasurementChange('stumpLength', parseInt(e.target.value) || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Форма культи
                  </label>
                  <select
                    value={formData.measurements?.stumpShape || ''}
                    onChange={(e) => handleMeasurementChange('stumpShape', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Выберите форму</option>
                    <option value="Цилиндрическая">Цилиндрическая</option>
                    <option value="Конусная">Конусная</option>
                    <option value="Неправильная">Неправильная</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Подвижность
                  </label>
                  <select
                    value={formData.measurements?.mobility || ''}
                    onChange={(e) => handleMeasurementChange('mobility', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Выберите подвижность</option>
                    <option value="Нормальная">Нормальная</option>
                    <option value="Ограниченная">Ограниченная</option>
                    <option value="Плохая">Плохая</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Компоненты */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Компоненты</h3>
              
              {/* Добавление нового компонента */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Наименование
                  </label>
                  <input
                    type="text"
                    value={newComponent.name || ''}
                    onChange={(e) => setNewComponent(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Код
                  </label>
                  <input
                    type="text"
                    value={newComponent.code || ''}
                    onChange={(e) => setNewComponent(prev => ({ ...prev, code: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Размер
                  </label>
                  <input
                    type="text"
                    value={newComponent.size || ''}
                    onChange={(e) => setNewComponent(prev => ({ ...prev, size: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Левый
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newComponent.leftQuantity || 0}
                    onChange={(e) => setNewComponent(prev => ({ ...prev, leftQuantity: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Правый
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newComponent.rightQuantity || 0}
                    onChange={(e) => setNewComponent(prev => ({ ...prev, rightQuantity: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Цена за ед.
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newComponent.unitPrice || 0}
                    onChange={(e) => setNewComponent(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addComponent}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить
                  </button>
                </div>
              </div>

              {/* Список компонентов */}
              {formData.components && formData.components.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Наименование
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Код
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Размер
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Левый
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Правый
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Цена за ед.
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Общая цена
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.components.map((component) => (
                        <tr key={component.id}>
                          <td className="px-4 py-2 text-sm text-gray-900">{component.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{component.code}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{component.size}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{component.leftQuantity}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{component.rightQuantity}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{component.unitPrice}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{component.totalPrice}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            <button
                              type="button"
                              onClick={() => removeComponent(component.id)}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="qualityCheck"
                  checked={formData.qualityCheck || false}
                  onChange={(e) => handleInputChange('qualityCheck', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="qualityCheck" className="ml-2 block text-sm text-gray-900">
                  Контроль качества пройден
                </label>
              </div>
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

export default ProsthesisInvoiceForm;
