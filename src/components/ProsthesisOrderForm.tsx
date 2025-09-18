import React, { useState, useEffect } from 'react';
import { 
  ProsthesisOrder, 
  ProsthesisOrderFormData, 
  ProsthesisType, 
  ProsthesisSide, 
  ProsthesisOrderType, 
  OrderStatus, 
  ServiceType, 
  ActivityLevel,
  ProsthesisDiagnosis,
  ProsthesisComponent,
  Fitting
} from '../types/prosthesisOrder';
import { PersonalFile } from '../types/personalFile';
import ProsthesisComponentsTable from './ProsthesisComponentsTable';
import FittingsManager from './FittingsManager';
import { X, Save, Package, AlertCircle, Printer } from 'lucide-react';

interface ProsthesisOrderFormProps {
  order?: ProsthesisOrder;
  personalFile?: PersonalFile;
  onSave: (order: ProsthesisOrder) => void;
  onCancel: () => void;
  onPrint?: () => void;
  diagnoses: {
    lowerLimb: ProsthesisDiagnosis[];
    upperLimb: ProsthesisDiagnosis[];
  };
  availableComponents: Array<{ id: string; name: string; code: string; description: string }>;
}

const ProsthesisOrderForm: React.FC<ProsthesisOrderFormProps> = ({
  order,
  personalFile,
  onSave,
  onCancel,
  onPrint,
  diagnoses,
  availableComponents
}) => {
  const [formData, setFormData] = useState<ProsthesisOrderFormData>({
    prosthesisType: 'Протез',
    diagnosis: null,
    side: 'Правый',
    isHospitalized: false,
    orderType: 'Первичный',
    weight: undefined,
    height: undefined,
    activityLevel: undefined,
    status: 'Обычный',
    urgencyReason: '',
    serviceType: 'Бесплатная',
    components: [],
    fittings: [],
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (order) {
      setFormData({
        prosthesisType: order.prosthesisType,
        diagnosis: order.diagnosis,
        side: order.side,
        isHospitalized: order.isHospitalized,
        orderType: order.orderType,
        weight: order.weight,
        height: order.height,
        activityLevel: order.activityLevel,
        status: order.status,
        urgencyReason: order.urgencyReason || '',
        serviceType: order.serviceType,
        components: order.components,
        fittings: order.fittings,
        notes: order.notes || ''
      });
    }
  }, [order]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.prosthesisType) newErrors.prosthesisType = 'Вид изделия обязателен';
    if (!formData.diagnosis) newErrors.diagnosis = 'Диагноз обязателен';
    if (!formData.side) newErrors.side = 'Сторона протеза обязательна';
    if (!formData.orderType) newErrors.orderType = 'Тип заказа обязателен';
    if (!formData.status) newErrors.status = 'Статус заказа обязателен';
    if (!formData.serviceType) newErrors.serviceType = 'Тип услуги обязателен';
    
    if (formData.status === 'Срочный' && !formData.urgencyReason) {
      newErrors.urgencyReason = 'Причина срочности обязательна для срочных заказов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProsthesisOrderFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const generateOrderNumber = () => {
    const currentYear = new Date().getFullYear();
    const randomNumber = Math.floor(Math.random() * 1000) + 1;
    return `П-${currentYear}-${randomNumber.toString().padStart(3, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const orderData: ProsthesisOrder = {
        id: order?.id || `PO${Date.now()}`,
        orderNumber: order?.orderNumber || generateOrderNumber(),
        orderDate: order?.orderDate || new Date().toISOString().split('T')[0],
        personalFileId: personalFile?.id || '',
        clientName: personalFile ? `${personalFile.lastName} ${personalFile.firstName} ${personalFile.middleName}` : '',
        disabilityGroup: personalFile?.disabilityGroup || '',
        disabilityCategory: personalFile?.disabilityCategory || '',
        prosthesisType: formData.prosthesisType,
        diagnosis: formData.diagnosis!,
        side: formData.side,
        isHospitalized: formData.isHospitalized,
        orderType: formData.orderType,
        weight: formData.weight,
        height: formData.height,
        activityLevel: formData.activityLevel,
        status: formData.status,
        urgencyReason: formData.urgencyReason,
        serviceType: formData.serviceType,
        components: formData.components,
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

  const getFilteredDiagnoses = () => {
    if (formData.prosthesisType === 'Протез') {
      return [...diagnoses.lowerLimb, ...diagnoses.upperLimb];
    }
    return diagnoses.lowerLimb;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {order ? 'Редактирование заказа на изготовление протеза' : 'Заказ на изготовление протеза'}
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
                Вид изделия <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.prosthesisType}
                onChange={(e) => handleInputChange('prosthesisType', e.target.value as ProsthesisType)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.prosthesisType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="Протез">Протез</option>
                <option value="Лангеты">Лангеты</option>
                <option value="Шина Веленского">Шина Веленского</option>
                <option value="Шина Джумабекова">Шина Джумабекова</option>
                <option value="Фикс-аппарат">Фикс-аппарат</option>
                <option value="Корсет">Корсет</option>
                <option value="Бандаж">Бандаж</option>
                <option value="Репликатор">Репликатор</option>
              </select>
              {errors.prosthesisType && <p className="text-red-500 text-xs mt-1">{errors.prosthesisType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Диагноз <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.diagnosis?.id || ''}
                onChange={(e) => {
                  const selectedDiagnosis = getFilteredDiagnoses().find(d => d.id === e.target.value);
                  handleInputChange('diagnosis', selectedDiagnosis || null);
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.diagnosis ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Выберите диагноз</option>
                {getFilteredDiagnoses().map(diagnosis => (
                  <option key={diagnosis.id} value={diagnosis.id}>
                    {diagnosis.name}
                  </option>
                ))}
              </select>
              {errors.diagnosis && <p className="text-red-500 text-xs mt-1">{errors.diagnosis}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Сторона протеза <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.side}
                onChange={(e) => handleInputChange('side', e.target.value as ProsthesisSide)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.side ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="Левый">Левый</option>
                <option value="Правый">Правый</option>
              </select>
              {errors.side && <p className="text-red-500 text-xs mt-1">{errors.side}</p>}
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
                onChange={(e) => handleInputChange('orderType', e.target.value as ProsthesisOrderType)}
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
                onChange={(e) => handleInputChange('status', e.target.value as OrderStatus)}
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
              onChange={(e) => handleInputChange('serviceType', e.target.value as ServiceType)}
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

        {/* Модульные протезы */}
        {formData.prosthesisType === 'Протез' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Параметры для модульных протезов</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Вес (кг)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight || ''}
                  onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введите вес"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Рост (см)
                </label>
                <input
                  type="number"
                  value={formData.height || ''}
                  onChange={(e) => handleInputChange('height', parseInt(e.target.value) || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введите рост"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Степень активности
                </label>
                <select
                  value={formData.activityLevel || ''}
                  onChange={(e) => handleInputChange('activityLevel', e.target.value as ActivityLevel || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Выберите активность</option>
                  <option value="Низкая">Низкая</option>
                  <option value="Средняя">Средняя</option>
                  <option value="Высокая">Высокая</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Таблица изделий */}
        <ProsthesisComponentsTable
          components={formData.components}
          onComponentsChange={(components) => handleInputChange('components', components)}
          availableComponents={availableComponents}
        />

        {/* Примерки */}
        <FittingsManager
          fittings={formData.fittings}
          onFittingsChange={(fittings) => handleInputChange('fittings', fittings)}
        />

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

export default ProsthesisOrderForm;
