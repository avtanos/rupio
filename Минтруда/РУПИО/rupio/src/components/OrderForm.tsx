import React, { useState, useEffect } from 'react';
import { WorkOrder, OrderFormData, OrderType } from '../types/orders';
import { PersonalFile } from '../types/personalFile';
import { ProsthesisDiagnosis } from '../types/prosthesisOrder';
import ProsthesisOrderForm from './ProsthesisOrderForm';
import FootwearOrderForm from './FootwearOrderForm';
import { X, Save, Package } from 'lucide-react';
import { footwearDiagnoses, footwearModels, footwearColors, footwearMaterials, heelMaterials, technicalOperationsList } from '../data/footwearReferences';

interface OrderFormProps {
  order?: WorkOrder;
  personalFile?: PersonalFile;
  personalFiles?: PersonalFile[]; // Добавляем список всех личных дел
  onSave: (order: WorkOrder) => void;
  onCancel: () => void;
  diagnoses?: {
    lowerLimb: ProsthesisDiagnosis[];
    upperLimb: ProsthesisDiagnosis[];
  };
  availableComponents?: Array<{ id: string; name: string; code: string; description: string }>;
}

const OrderForm: React.FC<OrderFormProps> = ({
  order,
  personalFile,
  personalFiles = [],
  onSave,
  onCancel,
  diagnoses,
  availableComponents
}) => {
  const [formData, setFormData] = useState<OrderFormData>({
    personalFileId: personalFile?.id || '',
    orderType: 'Заказ на изготовление протеза',
    productName: '',
    measurements: {},
    notes: ''
  });

  const [selectedPersonalFile, setSelectedPersonalFile] = useState<PersonalFile | null>(personalFile || null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (order) {
      setFormData({
        personalFileId: order.personalFileId,
        orderType: order.orderType,
        productName: order.productName,
        measurements: order.measurements,
        notes: order.notes || ''
      });
      // Находим личное дело по ID
      const file = personalFiles.find(pf => pf.id === order.personalFileId);
      setSelectedPersonalFile(file || null);
    } else if (personalFile) {
      setFormData(prev => ({
        ...prev,
        personalFileId: personalFile.id
      }));
      setSelectedPersonalFile(personalFile);
    }
  }, [order, personalFile, personalFiles]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.personalFileId) newErrors.personalFileId = 'Личное дело обязательно';
    if (!formData.orderType) newErrors.orderType = 'Тип заказа обязателен';
    if (!formData.productName) newErrors.productName = 'Наименование изделия обязательно';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof OrderFormData, value: string | Record<string, number>) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePersonalFileChange = (personalFileId: string) => {
    const file = personalFiles.find(pf => pf.id === personalFileId);
    setSelectedPersonalFile(file || null);
    setFormData(prev => ({
      ...prev,
      personalFileId
    }));
  };

  const handleMeasurementChange = (key: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      measurements: { ...prev.measurements, [key]: value }
    }));
  };

  const generateOrderNumber = () => {
    const currentYear = new Date().getFullYear();
    const randomNumber = Math.floor(Math.random() * 1000) + 1;
    const prefix = formData.orderType.includes('Наряд') ? 'Н' : 'З';
    return `${prefix}-${currentYear}-${randomNumber.toString().padStart(3, '0')}`;
  };

  // Если это заказ на изготовление протеза, показываем специализированную форму
  if (formData.orderType === 'Заказ на изготовление протеза' && diagnoses && availableComponents) {
    return (
      <ProsthesisOrderForm
        order={order as any}
        personalFile={selectedPersonalFile || undefined}
        onSave={onSave as any}
        onCancel={onCancel}
        diagnoses={diagnoses}
        availableComponents={availableComponents}
      />
    );
  }

  // Если это заказ на изготовление обуви, показываем специализированную форму
  if (formData.orderType === 'Заказ на изготовление обуви') {
    return (
      <FootwearOrderForm
        order={order as any}
        personalFile={selectedPersonalFile || undefined}
        onSave={onSave as any}
        onCancel={onCancel}
        diagnoses={footwearDiagnoses}
        models={footwearModels}
        colors={footwearColors}
        materials={footwearMaterials}
        heelMaterials={heelMaterials}
        technicalOperationsList={technicalOperationsList}
      />
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const orderData: WorkOrder = {
        id: order?.id || `O${Date.now()}`,
        orderNumber: order?.orderNumber || generateOrderNumber(),
        orderDate: order?.orderDate || new Date().toISOString().split('T')[0],
        personalFileId: formData.personalFileId,
        clientName: selectedPersonalFile ? `${selectedPersonalFile.lastName} ${selectedPersonalFile.firstName} ${selectedPersonalFile.middleName}` : '',
        disabilityGroup: selectedPersonalFile?.disabilityGroup || '',
        disabilityCategory: selectedPersonalFile?.disabilityCategory || '',
        productName: formData.productName,
        manufacturingDate: order?.manufacturingDate,
        issueDate: order?.issueDate,
        movementStatus: order?.movementStatus || 'В обработке',
        status: order?.status || 'создан',
        orderType: formData.orderType,
        measurements: formData.measurements,
        notes: formData.notes,
        createdBy: order?.createdBy || 'ЗавМедОтдела',
        createdAt: order?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      onSave(orderData);
    }
  };

  const getMeasurementFields = () => {
    switch (formData.orderType) {
      case 'Заказ на изготовление протеза':
        return [
          { key: 'stumpLength', label: 'Длина культи (см)', required: true },
          { key: 'stumpCircumference', label: 'Обхват культи (см)', required: true },
          { key: 'height', label: 'Рост (см)', required: true },
          { key: 'weight', label: 'Вес (кг)', required: false }
        ];
      case 'Заказ на изготовление обуви':
        return [
          { key: 'leftFootLength', label: 'Длина левой стопы (см)', required: true },
          { key: 'rightFootLength', label: 'Длина правой стопы (см)', required: true },
          { key: 'leftFootWidth', label: 'Ширина левой стопы (см)', required: true },
          { key: 'rightFootWidth', label: 'Ширина правой стопы (см)', required: true },
          { key: 'leftFootHeight', label: 'Высота левой стопы (см)', required: true },
          { key: 'rightFootHeight', label: 'Высота правой стопы (см)', required: true }
        ];
      case 'Заказ на изготовление Оттобок':
        return [
          { key: 'chestCircumference', label: 'Обхват груди (см)', required: true },
          { key: 'waistCircumference', label: 'Обхват талии (см)', required: true },
          { key: 'height', label: 'Рост (см)', required: true },
          { key: 'shoulderWidth', label: 'Ширина плеч (см)', required: false }
        ];
      case 'Наряд на ремонт':
        return [
          { key: 'repairType', label: 'Тип ремонта (код)', required: true },
          { key: 'damageDescription', label: 'Описание повреждения (код)', required: true }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {order ? 'Редактирование заказа/наряда' : 'Новый заказ/наряд'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Выбор личного дела */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Личное дело пациента *
          </label>
          <select
            value={formData.personalFileId}
            onChange={(e) => handlePersonalFileChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.personalFileId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Выберите личное дело</option>
            {personalFiles.map((file) => (
              <option key={file.id} value={file.id}>
                {file.lastName} {file.firstName} {file.middleName} (ПИН: {file.pin})
              </option>
            ))}
          </select>
          {errors.personalFileId && (
            <p className="text-red-500 text-sm">{errors.personalFileId}</p>
          )}
        </div>

        {/* Информация о клиенте */}
        {selectedPersonalFile && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Информация о клиенте</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">ФИО</p>
                <p className="text-sm text-gray-900">
                  {selectedPersonalFile.lastName} {selectedPersonalFile.firstName} {selectedPersonalFile.middleName}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Группа инвалидности</p>
                <p className="text-sm text-gray-900">{selectedPersonalFile.disabilityGroup}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Категория</p>
                <p className="text-sm text-gray-900">{selectedPersonalFile.disabilityCategory}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">ПИН</p>
                <p className="text-sm text-gray-900">{selectedPersonalFile.pin}</p>
              </div>
            </div>
          </div>
        )}

        {/* Основная информация о заказе */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Информация о заказе/наряде</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тип заказа/наряда <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.orderType}
                onChange={(e) => handleInputChange('orderType', e.target.value as OrderType)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.orderType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="Заказ на изготовление протеза">Заказ на изготовление протеза</option>
                <option value="Заказ на изготовление обуви">Заказ на изготовление обуви</option>
                <option value="Заказ на изготовление Оттобок">Заказ на изготовление Оттобок</option>
                <option value="Наряд на ремонт">Наряд на ремонт</option>
              </select>
              {errors.orderType && <p className="text-red-500 text-xs mt-1">{errors.orderType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Наименование ПОИ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.productName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Введите наименование изделия"
              />
              {errors.productName && <p className="text-red-500 text-xs mt-1">{errors.productName}</p>}
            </div>
          </div>
        </div>

        {/* Измерения */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Измерения</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getMeasurementFields().map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.measurements[field.key] || ''}
                  onChange={(e) => handleMeasurementChange(field.key, parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Введите ${field.label.toLowerCase()}`}
                />
              </div>
            ))}
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
            <span>{order ? 'Сохранить изменения' : 'Создать заказ'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
