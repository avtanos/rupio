import React, { useState } from 'react';
import { Package, Truck, User, Calendar, Save, X, Plus } from 'lucide-react';
import { TransferOrder, ManufacturingOrder } from '../types/manufacturing';

interface TransferOrderFormProps {
  manufacturingOrder: ManufacturingOrder;
  onSave: (transferOrder: Omit<TransferOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  existingTransferOrder?: TransferOrder;
}

const TransferOrderForm: React.FC<TransferOrderFormProps> = ({
  manufacturingOrder,
  onSave,
  onCancel,
  existingTransferOrder
}) => {
  const [formData, setFormData] = useState({
    manufacturingOrderId: manufacturingOrder.id,
    transferNumber: existingTransferOrder?.transferNumber || generateTransferNumber(),
    transferDate: existingTransferOrder?.transferDate || new Date().toISOString().split('T')[0],
    warehouseLocation: existingTransferOrder?.warehouseLocation || '',
    transferredBy: existingTransferOrder?.transferredBy || '',
    receivedBy: existingTransferOrder?.receivedBy || '',
    status: existingTransferOrder?.status || 'Создан',
    notes: existingTransferOrder?.notes || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function generateTransferNumber(): string {
    const currentYear = new Date().getFullYear();
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TRF-${currentYear}${currentMonth}-${randomNum}`;
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.warehouseLocation.trim()) {
      newErrors.warehouseLocation = 'Укажите место на складе';
    }

    if (!formData.transferredBy.trim()) {
      newErrors.transferredBy = 'Укажите кто передает';
    }

    if (formData.status === 'Принят' && !formData.receivedBy.trim()) {
      newErrors.receivedBy = 'Укажите кто принял';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getTotalMaterialsCost = () => {
    return manufacturingOrder.materials.reduce((total, material) => total + material.totalCost, 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Truck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {existingTransferOrder ? 'Редактировать наряд передачи' : 'Наряд передачи на склад'}
              </h2>
              <p className="text-sm text-gray-500">
                {existingTransferOrder ? 'Изменить данные передачи' : 'Создать наряд для передачи готовой продукции'}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Информация о заказе */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Информация о заказе</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-700">Номер заказа:</span>
                <span className="ml-2 text-sm text-gray-900 font-mono">{manufacturingOrder.orderNumber}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Тип заказа:</span>
                <span className="ml-2 text-sm text-gray-900">{manufacturingOrder.orderType}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Изделие:</span>
                <span className="ml-2 text-sm text-gray-900">{manufacturingOrder.productName}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Цех:</span>
                <span className="ml-2 text-sm text-gray-900">{manufacturingOrder.workshop}</span>
              </div>
            </div>
          </div>

          {/* Основные данные наряда */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="w-4 h-4 inline mr-2" />
                Номер наряда передачи *
              </label>
              <input
                type="text"
                value={formData.transferNumber}
                onChange={(e) => handleInputChange('transferNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Дата передачи *
              </label>
              <input
                type="date"
                value={formData.transferDate}
                onChange={(e) => handleInputChange('transferDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Место на складе *
              </label>
              <input
                type="text"
                value={formData.warehouseLocation}
                onChange={(e) => handleInputChange('warehouseLocation', e.target.value)}
                placeholder="Например: Склад-А, Стеллаж-15, Полка-3"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.warehouseLocation ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.warehouseLocation && (
                <p className="mt-1 text-sm text-red-600">{errors.warehouseLocation}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Кто передает *
              </label>
              <input
                type="text"
                value={formData.transferredBy}
                onChange={(e) => handleInputChange('transferredBy', e.target.value)}
                placeholder="ФИО сотрудника цеха"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.transferredBy ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.transferredBy && (
                <p className="mt-1 text-sm text-red-600">{errors.transferredBy}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Кто принимает
              </label>
              <input
                type="text"
                value={formData.receivedBy}
                onChange={(e) => handleInputChange('receivedBy', e.target.value)}
                placeholder="ФИО сотрудника склада"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.receivedBy ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.receivedBy && (
                <p className="mt-1 text-sm text-red-600">{errors.receivedBy}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Статус
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Создан">Создан</option>
                <option value="Передан">Передан</option>
                <option value="Принят">Принят</option>
              </select>
            </div>
          </div>

          {/* Список материалов */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Расходные материалы</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Материал
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Код
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Использовано
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Стоимость
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {manufacturingOrder.materials.map((material) => (
                      <tr key={material.id}>
                        <td className="px-3 py-2 text-sm text-gray-900">{material.materialName}</td>
                        <td className="px-3 py-2 text-sm text-gray-900 font-mono">{material.materialCode}</td>
                        <td className="px-3 py-2 text-sm text-gray-900">
                          {material.quantityUsed} {material.unit}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900">
                          {material.totalCost.toLocaleString('ru-RU')} ₽
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Общая стоимость материалов:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {getTotalMaterialsCost().toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Примечания */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Примечания
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Дополнительная информация о передаче..."
            />
          </div>

          {/* Кнопки */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{existingTransferOrder ? 'Сохранить изменения' : 'Создать наряд'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferOrderForm;
