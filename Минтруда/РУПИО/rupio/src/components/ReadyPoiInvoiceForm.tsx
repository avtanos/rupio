import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { ReadyPoiInvoice, ReadyPoiInvoiceMaterial, ReadyPoiFitting } from '../types/invoices';
import { PersonalFile } from '../types/personalFile';
import { Order } from '../types';

interface ReadyPoiInvoiceFormProps {
  invoice?: ReadyPoiInvoice;
  onSave: (invoice: ReadyPoiInvoice) => void;
  onCancel: () => void;
  personalFiles?: PersonalFile[];
  orders?: Order[];
}

const ReadyPoiInvoiceForm: React.FC<ReadyPoiInvoiceFormProps> = ({
  invoice,
  onSave,
  onCancel,
  personalFiles = [],
  orders = []
}) => {
  const [formData, setFormData] = useState<Partial<ReadyPoiInvoice>>({
    type: 'ready-poi',
    status: 'draft',
    priority: 'normal',
    materials: [],
    fittings: [],
    needsCast: false,
    qualityCheck: false,
    ...invoice
  });

  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [selectedPersonalFileId, setSelectedPersonalFileId] = useState<string>('');

  const [newMaterial, setNewMaterial] = useState<Partial<ReadyPoiInvoiceMaterial>>({
    articleNumber: '',
    name: '',
    unit: '',
    quantity: 0,
    price: 0,
    notes: ''
  });

  const [newFitting, setNewFitting] = useState<Partial<ReadyPoiFitting>>({
    fittingNumber: 1,
    callDate: '',
    appointmentDate: ''
  });

  useEffect(() => {
    // Рассчитываем общую стоимость на основе материалов
    if (formData.materials && formData.materials.length > 0) {
      const totalAmount = formData.materials.reduce((sum, material) => sum + material.totalPrice, 0);
      setFormData(prev => ({ ...prev, totalAmount, unitPrice: totalAmount }));
    }
  }, [formData.materials]);

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
        personalFileId: selectedPersonalFile.id
      }));
    }
  };

  const addMaterial = () => {
    if (newMaterial.articleNumber && newMaterial.name && newMaterial.quantity && newMaterial.price) {
      const material: ReadyPoiInvoiceMaterial = {
        id: `mat-${Date.now()}`,
        articleNumber: newMaterial.articleNumber,
        name: newMaterial.name,
        unit: newMaterial.unit || 'шт',
        quantity: newMaterial.quantity,
        price: newMaterial.price,
        totalPrice: newMaterial.quantity * newMaterial.price,
        notes: newMaterial.notes
      };

      setFormData(prev => ({
        ...prev,
        materials: [...(prev.materials || []), material]
      }));

      setNewMaterial({
        articleNumber: '',
        name: '',
        unit: 'шт',
        quantity: 0,
        price: 0,
        notes: ''
      });
    }
  };

  const removeMaterial = (materialId: string) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials?.filter(mat => mat.id !== materialId) || []
    }));
  };

  const addFitting = () => {
    if (newFitting.callDate && newFitting.appointmentDate) {
      const fitting: ReadyPoiFitting = {
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
    
    const invoiceData: ReadyPoiInvoice = {
      id: formData.id || `inv-ready-poi-${Date.now()}`,
      type: 'ready-poi',
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
      productCategory: formData.productCategory || '',
      materials: formData.materials || [],
      fittings: formData.fittings || [],
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
              {invoice ? 'Редактировать накладную на готовые ПОИ' : 'Создать накладную на готовые ПОИ'}
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
                    .filter(order => order.productCategory === 'готовые_пои' || order.productType.toLowerCase().includes('готовые') || order.productType.toLowerCase().includes('пои'))
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
                  Категория изделия *
                </label>
                <select
                  value={formData.productCategory || ''}
                  onChange={(e) => handleInputChange('productCategory', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Выберите категорию</option>
                  <option value="Слуховые аппараты">Слуховые аппараты</option>
                  <option value="Голосообразующие аппараты">Голосообразующие аппараты</option>
                  <option value="Речевые процессоры">Речевые процессоры</option>
                  <option value="Инвалидные коляски">Инвалидные коляски</option>
                  <option value="Ходунки">Ходунки</option>
                  <option value="Костыли">Костыли</option>
                  <option value="Трости">Трости</option>
                  <option value="Кресла-каталки">Кресла-каталки</option>
                  <option value="Протезы глаз">Протезы глаз</option>
                  <option value="Голеностопные ортезы">Голеностопные ортезы</option>
                  <option value="Коленные ортезы">Коленные ортезы</option>
                  <option value="Поясничные корсеты">Поясничные корсеты</option>
                  <option value="Шейные воротники">Шейные воротники</option>
                  <option value="Бандажи">Бандажи</option>
                  <option value="Компрессионное белье">Компрессионное белье</option>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дата изготовления
                </label>
                <input
                  type="date"
                  value={formData.manufacturingDate || ''}
                  onChange={(e) => handleInputChange('manufacturingDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Материалы/Компоненты */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Компоненты и материалы</h3>
              
              {/* Добавление нового материала */}
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Артикул *
                  </label>
                  <input
                    type="text"
                    value={newMaterial.articleNumber || ''}
                    onChange={(e) => setNewMaterial(prev => ({ ...prev, articleNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Наименование *
                  </label>
                  <input
                    type="text"
                    value={newMaterial.name || ''}
                    onChange={(e) => setNewMaterial(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Единица измерения
                  </label>
                  <select
                    value={newMaterial.unit || 'шт'}
                    onChange={(e) => setNewMaterial(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="шт">шт</option>
                    <option value="компл">компл</option>
                    <option value="упак">упак</option>
                    <option value="пара">пара</option>
                    <option value="набор">набор</option>
                    <option value="м">м</option>
                    <option value="см">см</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Количество *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newMaterial.quantity || 0}
                    onChange={(e) => setNewMaterial(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Цена за единицу *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newMaterial.price || 0}
                    onChange={(e) => setNewMaterial(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Примечания
                  </label>
                  <input
                    type="text"
                    value={newMaterial.notes || ''}
                    onChange={(e) => setNewMaterial(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addMaterial}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить
                  </button>
                </div>
              </div>

              {/* Список материалов */}
              {formData.materials && formData.materials.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Артикул
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Наименование
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Единица
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Количество
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Цена за единицу
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Общая цена
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Примечания
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.materials.map((material) => (
                        <tr key={material.id}>
                          <td className="px-4 py-2 text-sm text-gray-900">{material.articleNumber}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{material.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{material.unit}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{material.quantity}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{material.price}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{material.totalPrice}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{material.notes}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            <button
                              type="button"
                              onClick={() => removeMaterial(material.id)}
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

export default ReadyPoiInvoiceForm;
