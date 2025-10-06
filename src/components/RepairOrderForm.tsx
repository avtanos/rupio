import React, { useState, useEffect } from 'react';
import { 
  RepairOrder, 
  RepairOrderFormData, 
  RepairProductType,
  RepairOrderStatus,
  RepairServiceType,
  RepairMaterial,
  RepairFitting
} from '../types/repairOrder';
import { PersonalFile } from '../types/personalFile';
import RepairMaterialsTable from './RepairMaterialsTable';
import RepairFittingsManager from './RepairFittingsManager';
import { X, Save, Plus, Trash2 } from 'lucide-react';

interface RepairOrderFormProps {
  order?: RepairOrder;
  personalFile?: PersonalFile;
  personalFiles?: PersonalFile[]; // Добавляем список всех личных дел
  onSave: (order: RepairOrder) => void;
  onCancel: () => void;
  productTypes: RepairProductType[];
  materialUnits: string[];
  defaultMaterials: RepairMaterial[];
}

const RepairOrderForm: React.FC<RepairOrderFormProps> = ({
  order,
  personalFile,
  personalFiles = [],
  onSave,
  onCancel,
  productTypes,
  materialUnits,
  defaultMaterials
}) => {
  const [formData, setFormData] = useState<RepairOrderFormData>({
    productType: 'Протез бедра',
    materials: defaultMaterials,
    status: 'Обычный',
    urgencyReason: '',
    serviceType: 'Бесплатная',
    orderCost: 0,
    fittings: [],
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (order) {
      setFormData({
        productType: order.productType,
        materials: order.materials,
        status: order.status,
        urgencyReason: order.urgencyReason || '',
        serviceType: order.serviceType,
        orderCost: order.orderCost,
        fittings: order.fittings,
        notes: order.notes || ''
      });
    }
  }, [order]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.productType) newErrors.productType = 'Вид изделия обязателен';
    if (!formData.status) newErrors.status = 'Статус наряда обязателен';
    if (!formData.serviceType) newErrors.serviceType = 'Тип услуги обязателен';
    
    if (formData.status === 'Срочный' && !formData.urgencyReason) {
      newErrors.urgencyReason = 'Причина срочности обязательна для срочных нарядов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof RepairOrderFormData, value: string | number | boolean | RepairMaterial[] | RepairFitting[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddFitting = () => {
    const fittingNumber = Math.min(formData.fittings.length + 1, 3) as 1 | 2 | 3;
    const newFitting: RepairFitting = {
      id: `fit_${Date.now()}`,
      fittingNumber,
      callDate: new Date().toISOString().split('T')[0],
      appointmentDate: ''
    };
    
    setFormData(prev => ({
      ...prev,
      fittings: [...prev.fittings, newFitting]
    }));
  };

  const handleClearAllMaterials = () => {
    if (window.confirm('Вы уверены, что хотите удалить все материалы?')) {
      setFormData(prev => ({
        ...prev,
        materials: []
      }));
    }
  };

  const handleClearAllFittings = () => {
    if (window.confirm('Вы уверены, что хотите удалить все примерки?')) {
      setFormData(prev => ({
        ...prev,
        fittings: []
      }));
    }
  };

  const generateOrderNumber = () => {
    const currentYear = new Date().getFullYear();
    const randomNumber = Math.floor(Math.random() * 1000) + 1;
    return `РЕМ-${currentYear}-${randomNumber.toString().padStart(3, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const orderData: RepairOrder = {
        id: order?.id || `REP${Date.now()}`,
        orderNumber: order?.orderNumber || generateOrderNumber(),
        orderDate: order?.orderDate || new Date().toISOString().split('T')[0],
        personalFileId: personalFile?.id || '',
        clientName: personalFile ? `${personalFile.lastName} ${personalFile.firstName} ${personalFile.middleName}` : '',
        disabilityGroup: personalFile?.disabilityGroup || '',
        disabilityCategory: personalFile?.disabilityCategory || '',
        productType: formData.productType,
        materials: formData.materials,
        status: formData.status,
        urgencyReason: formData.urgencyReason,
        serviceType: formData.serviceType,
        orderCost: formData.orderCost,
        fittings: formData.fittings,
        manufacturingDate: order?.manufacturingDate,
        issueDate: order?.issueDate,
        createdBy: order?.createdBy || 'ЗавМедОтдела',
        createdAt: order?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: formData.notes
      };

      onSave(orderData);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {order ? 'Редактирование наряда на ремонт' : 'Наряд на ремонт'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
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

        {/* Основная информация о наряде */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Основная информация о наряде</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Вид изделия <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.productType}
                onChange={(e) => handleInputChange('productType', e.target.value as RepairProductType)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.productType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {productTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.productType && <p className="text-red-500 text-xs mt-1">{errors.productType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Статус наряда <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as RepairOrderStatus)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.status ? 'border-red-500' : 'border-gray-300'
                } ${formData.status === 'Срочный' ? 'bg-red-50 border-red-300' : ''}`}
              >
                <option value="Обычный">Обычный</option>
                <option value="Срочный">Срочный</option>
              </select>
              {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Услуга <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.serviceType}
                onChange={(e) => handleInputChange('serviceType', e.target.value as RepairServiceType)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.serviceType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="Бесплатная">Бесплатная</option>
                <option value="Платная">Платная</option>
              </select>
              {errors.serviceType && <p className="text-red-500 text-xs mt-1">{errors.serviceType}</p>}
            </div>
          </div>

          {/* Причина срочности */}
          {formData.status === 'Срочный' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Причина срочности <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.urgencyReason || ''}
                onChange={(e) => handleInputChange('urgencyReason', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.urgencyReason ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Укажите причину срочности"
              />
              {errors.urgencyReason && <p className="text-red-500 text-xs mt-1">{errors.urgencyReason}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Стоимость наряда (₽)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.orderCost}
              onChange={(e) => handleInputChange('orderCost', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Введите стоимость наряда"
            />
          </div>
        </div>

        {/* Материалы и комплектация */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Материалы и комплектация ({formData.materials.length})
            </h3>
            <div className="flex space-x-2">
              {formData.materials.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllMaterials}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Очистить все</span>
                </button>
              )}
            </div>
          </div>
          <RepairMaterialsTable
            materials={formData.materials}
            onMaterialsChange={(materials) => handleInputChange('materials', materials)}
            availableUnits={materialUnits}
          />
        </div>

        {/* Примерки */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Примерки ({formData.fittings.length}/3)
            </h3>
            <div className="flex space-x-2">
              {formData.fittings.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllFittings}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Очистить все</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleAddFitting}
                disabled={formData.fittings.length >= 3}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  formData.fittings.length >= 3
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>
                  {formData.fittings.length >= 3 ? 'Максимум 3 примерки' : 'Добавить примерку'}
                </span>
              </button>
            </div>
          </div>
          <RepairFittingsManager
            fittings={formData.fittings}
            onFittingsChange={(fittings) => handleInputChange('fittings', fittings)}
            onAddFitting={handleAddFitting}
          />
        </div>

        {/* Даты выполнения */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Даты выполнения</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата изготовления
              </label>
              <input
                type="date"
                value={order?.manufacturingDate || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                placeholder="Заполняется по мере выполнения"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата выдачи
              </label>
              <input
                type="date"
                value={order?.issueDate || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                placeholder="Заполняется по мере выполнения"
              />
            </div>
          </div>
        </div>

        {/* Примечания */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Дополнительная информация</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Примечания
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Введите дополнительные сведения"
            />
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{order ? 'Сохранить изменения' : 'Создать наряд'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default RepairOrderForm;
