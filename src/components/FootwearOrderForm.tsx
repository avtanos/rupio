import React, { useState, useEffect } from 'react';
import { 
  FootwearOrder, 
  FootwearOrderFormData, 
  FootwearDiagnosis,
  FootwearModel,
  FootwearColor,
  FootwearMaterial,
  HeelMaterial,
  FootwearOrderType,
  FootwearOrderStatus,
  FootwearServiceType,
  TechnicalOperation,
  FootwearFitting
} from '../types/footwearOrder';
import { PersonalFile } from '../types/personalFile';
import TechnicalOperationsTable from './TechnicalOperationsTable';
import FootwearFittingsManager from './FootwearFittingsManager';
import { X, Save, Plus, Trash2, Printer } from 'lucide-react';

interface FootwearOrderFormProps {
  order?: FootwearOrder;
  personalFile?: PersonalFile;
  personalFiles?: PersonalFile[]; // Добавляем список всех личных дел
  onSave: (order: FootwearOrder) => void;
  onCancel: () => void;
  onPrint?: () => void;
  diagnoses: FootwearDiagnosis[];
  models: FootwearModel[];
  colors: FootwearColor[];
  materials: FootwearMaterial[];
  heelMaterials: HeelMaterial[];
  technicalOperationsList: string[];
}

const FootwearOrderForm: React.FC<FootwearOrderFormProps> = ({
  order,
  personalFile,
  personalFiles = [],
  onSave,
  onCancel,
  onPrint,
  diagnoses,
  models,
  colors,
  materials,
  heelMaterials,
  technicalOperationsList
}) => {
  const [formData, setFormData] = useState<FootwearOrderFormData>({
    diagnosis: 'ДЦП',
    model: 'Ортопедические туфли',
    color: 'Черный',
    material: 'Натуральная кожа',
    heelHeight: 0,
    heelMaterial: 'Резина',
    isHospitalized: false,
    orderType: 'Первичный',
    leftLegShortening: undefined,
    rightLegShortening: undefined,
    status: 'Обычный',
    urgencyReason: '',
    serviceType: 'Бесплатная',
    technicalOperations: [],
    fittings: [],
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (order) {
      setFormData({
        diagnosis: order.diagnosis,
        model: order.model,
        color: order.color,
        material: order.material,
        heelHeight: order.heelHeight,
        heelMaterial: order.heelMaterial,
        isHospitalized: order.isHospitalized,
        orderType: order.orderType,
        leftLegShortening: order.leftLegShortening,
        rightLegShortening: order.rightLegShortening,
        status: order.status,
        urgencyReason: order.urgencyReason || '',
        serviceType: order.serviceType,
        technicalOperations: order.technicalOperations,
        fittings: order.fittings,
        notes: order.notes || ''
      });
    }
  }, [order]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.diagnosis) newErrors.diagnosis = 'Диагноз обязателен';
    if (!formData.model) newErrors.model = 'Модель обязательна';
    if (!formData.color) newErrors.color = 'Цвет обязателен';
    if (!formData.material) newErrors.material = 'Материал обязателен';
    if (!formData.orderType) newErrors.orderType = 'Тип заказа обязателен';
    if (!formData.status) newErrors.status = 'Статус заказа обязателен';
    if (!formData.serviceType) newErrors.serviceType = 'Тип услуги обязателен';
    
    if (formData.status === 'Срочный' && !formData.urgencyReason) {
      newErrors.urgencyReason = 'Причина срочности обязательна для срочных заказов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FootwearOrderFormData, value: string | number | boolean | TechnicalOperation[] | FootwearFitting[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddTechnicalOperation = () => {
    const newOperation: TechnicalOperation = {
      id: `op_${Date.now()}`,
      operationName: technicalOperationsList[0] || 'Новая операция',
      executorName: '',
      executionDate: '',
      qualityCheck: false
    };
    
    setFormData(prev => ({
      ...prev,
      technicalOperations: [...prev.technicalOperations, newOperation]
    }));
  };

  const handleAddFitting = () => {
    const fittingNumber = Math.min(formData.fittings.length + 1, 3) as 1 | 2 | 3;
    const newFitting: FootwearFitting = {
      id: `fit_${Date.now()}`,
      fittingNumber,
      callDate: new Date().toISOString().split('T')[0], // Текущая дата по умолчанию
      appointmentDate: ''
    };
    
    setFormData(prev => ({
      ...prev,
      fittings: [...prev.fittings, newFitting]
    }));
  };

  const handleClearAllOperations = () => {
    if (window.confirm('Вы уверены, что хотите удалить все технические операции?')) {
      setFormData(prev => ({
        ...prev,
        technicalOperations: []
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
    return `О-${currentYear}-${randomNumber.toString().padStart(3, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const orderData: FootwearOrder = {
        id: order?.id || `FO${Date.now()}`,
        orderNumber: order?.orderNumber || generateOrderNumber(),
        orderDate: order?.orderDate || new Date().toISOString().split('T')[0],
        personalFileId: personalFile?.id || '',
        clientName: personalFile ? `${personalFile.lastName} ${personalFile.firstName} ${personalFile.middleName}` : '',
        disabilityGroup: personalFile?.disabilityGroup || '',
        disabilityCategory: personalFile?.disabilityCategory || '',
        diagnosis: formData.diagnosis,
        model: formData.model,
        color: formData.color,
        material: formData.material,
        heelHeight: formData.heelHeight,
        heelMaterial: formData.heelMaterial,
        isHospitalized: formData.isHospitalized,
        orderType: formData.orderType,
        leftLegShortening: formData.leftLegShortening,
        rightLegShortening: formData.rightLegShortening,
        status: formData.status,
        urgencyReason: formData.urgencyReason,
        serviceType: formData.serviceType,
        technicalOperations: formData.technicalOperations,
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
          {order ? 'Редактирование заказа на изготовление обуви' : 'Заказ на изготовление обуви'}
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

        {/* Основная информация о заказе */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Основная информация о заказе</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Диагноз <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.diagnosis}
                onChange={(e) => handleInputChange('diagnosis', e.target.value as FootwearDiagnosis)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.diagnosis ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {diagnoses.map(diagnosis => (
                  <option key={diagnosis} value={diagnosis}>{diagnosis}</option>
                ))}
              </select>
              {errors.diagnosis && <p className="text-red-500 text-xs mt-1">{errors.diagnosis}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Модель <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value as FootwearModel)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.model ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {models.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
              {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Цвет обуви <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value as FootwearColor)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.color ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {colors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
              {errors.color && <p className="text-red-500 text-xs mt-1">{errors.color}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Материал <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.material}
                onChange={(e) => handleInputChange('material', e.target.value as FootwearMaterial)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.material ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {materials.map(material => (
                  <option key={material} value={material}>{material}</option>
                ))}
              </select>
              {errors.material && <p className="text-red-500 text-xs mt-1">{errors.material}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Высота каблука (см)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.heelHeight}
                onChange={(e) => handleInputChange('heelHeight', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите высоту каблука"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Материал каблука
              </label>
              <select
                value={formData.heelMaterial}
                onChange={(e) => handleInputChange('heelMaterial', e.target.value as HeelMaterial)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {heelMaterials.map(material => (
                  <option key={material} value={material}>{material}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Госпитализирован
              </label>
              <select
                value={formData.isHospitalized ? 'Да' : 'Нет'}
                onChange={(e) => handleInputChange('isHospitalized', e.target.value === 'Да')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Нет">Нет</option>
                <option value="Да">Да</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тип заказа <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.orderType}
                onChange={(e) => handleInputChange('orderType', e.target.value as FootwearOrderType)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.orderType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="Первичный">Первичный</option>
                <option value="Вторичный">Вторичный</option>
              </select>
              {errors.orderType && <p className="text-red-500 text-xs mt-1">{errors.orderType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Статус заказа <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as FootwearOrderStatus)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.status ? 'border-red-500' : 'border-gray-300'
                } ${formData.status === 'Срочный' ? 'bg-red-50 border-red-300' : ''}`}
              >
                <option value="Обычный">Обычный</option>
                <option value="Срочный">Срочный</option>
              </select>
              {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
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
              Услуга <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.serviceType}
              onChange={(e) => handleInputChange('serviceType', e.target.value as FootwearServiceType)}
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

        {/* Дополнительные поля для укорочения */}
        {(formData.diagnosis.includes('Укорочение') || formData.diagnosis.includes('укорочение')) && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Параметры укорочения</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Укорочение левой ноги (см)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.leftLegShortening || ''}
                  onChange={(e) => handleInputChange('leftLegShortening', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введите размер укорочения"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Укорочение правой ноги (см)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.rightLegShortening || ''}
                  onChange={(e) => handleInputChange('rightLegShortening', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введите размер укорочения"
                />
              </div>
            </div>
          </div>
        )}

        {/* Технические операции */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Технические операции ({formData.technicalOperations.length})
            </h3>
            <div className="flex space-x-2">
              {formData.technicalOperations.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllOperations}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Очистить все</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleAddTechnicalOperation}
                disabled={formData.technicalOperations.length >= 15}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  formData.technicalOperations.length >= 15
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>
                  {formData.technicalOperations.length >= 15 ? 'Максимум 15 операций' : 'Добавить операцию'}
                </span>
              </button>
            </div>
          </div>
          <TechnicalOperationsTable
            operations={formData.technicalOperations}
            onOperationsChange={(operations) => handleInputChange('technicalOperations', operations)}
            availableOperations={technicalOperationsList}
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
          <FootwearFittingsManager
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
          {onPrint && (
            <button
              type="button"
              onClick={onPrint}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Печать бланка</span>
            </button>
          )}
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{order ? 'Сохранить изменения' : 'Создать заказ'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default FootwearOrderForm;
