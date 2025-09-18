import React, { useState } from 'react';
import { ProstheticsData } from '../types/personalFile';
import { Save, X } from 'lucide-react';

interface ProstheticsDataEditProps {
  prostheticsData?: ProstheticsData;
  onSave: (prostheticsData: ProstheticsData) => void;
  onCancel: () => void;
}

const ProstheticsDataEdit: React.FC<ProstheticsDataEditProps> = ({
  prostheticsData,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<ProstheticsData>>({
    stumpLength: prostheticsData?.stumpLength || '',
    stumpShape: prostheticsData?.stumpShape || undefined,
    stumpMobility: prostheticsData?.stumpMobility || undefined,
    contractureDescription: prostheticsData?.contractureDescription || '',
    scar: prostheticsData?.scar || undefined,
    skinCondition: prostheticsData?.skinCondition || undefined,
    boneCondition: prostheticsData?.boneCondition || undefined,
    stumpSupport: prostheticsData?.stumpSupport || false,
    objectiveData: prostheticsData?.objectiveData || ''
  });

  const handleInputChange = (field: keyof ProstheticsData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const prostheticsDataToSave: ProstheticsData = {
      id: prostheticsData?.id || `PD${Date.now()}`,
      stumpLength: formData.stumpLength || '',
      stumpShape: formData.stumpShape as any,
      stumpMobility: formData.stumpMobility as any,
      contractureDescription: formData.contractureDescription || '',
      scar: formData.scar as any,
      skinCondition: formData.skinCondition as any,
      boneCondition: formData.boneCondition as any,
      stumpSupport: formData.stumpSupport || false,
      objectiveData: formData.objectiveData || ''
    };

    onSave(prostheticsDataToSave);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Редактирование данных по протезированию</h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Длина культи
            </label>
            <input
              type="text"
              value={formData.stumpLength || ''}
              onChange={(e) => handleInputChange('stumpLength', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Введите длину культи"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Форма культи
            </label>
            <select
              value={formData.stumpShape || ''}
              onChange={(e) => handleInputChange('stumpShape', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Выберите форму культи</option>
              <option value="цилиндрическая">Цилиндрическая</option>
              <option value="булавовидная">Булавовидная</option>
              <option value="умеренно-коническая">Умеренно-коническая</option>
              <option value="резко-коническая">Резко-коническая</option>
              <option value="избыток ткани">Избыток ткани</option>
              <option value="атрофия">Атрофия</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Подвижность культи
            </label>
            <select
              value={formData.stumpMobility || ''}
              onChange={(e) => handleInputChange('stumpMobility', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Выберите подвижность культи</option>
              <option value="нормальная">Нормальная</option>
              <option value="ограничение движения">Ограничение движения</option>
              <option value="контрактура">Контрактура</option>
            </select>
          </div>

          {formData.stumpMobility === 'контрактура' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание контрактуры
              </label>
              <input
                type="text"
                value={formData.contractureDescription || ''}
                onChange={(e) => handleInputChange('contractureDescription', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Опишите контрактуру"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Рубец
            </label>
            <select
              value={formData.scar || ''}
              onChange={(e) => handleInputChange('scar', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Выберите тип рубца</option>
              <option value="линейный">Линейный</option>
              <option value="звездчатый">Звездчатый</option>
              <option value="центральный">Центральный</option>
              <option value="передний">Передний</option>
              <option value="задний">Задний</option>
              <option value="боковой">Боковой</option>
              <option value="подвижный">Подвижный</option>
              <option value="спаянный">Спаянный</option>
              <option value="безболезненный">Безболезненный</option>
              <option value="келоидный">Келоидный</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Состояние кожного покрова и мягких тканей культи
            </label>
            <select
              value={formData.skinCondition || ''}
              onChange={(e) => handleInputChange('skinCondition', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Выберите состояние кожного покрова</option>
              <option value="нормальный">Нормальный</option>
              <option value="синюшный">Синюшный</option>
              <option value="отечный">Отечный</option>
              <option value="потертости">Потертости</option>
              <option value="трещины">Трещины</option>
              <option value="язвы">Язвы</option>
              <option value="свищи">Свищи</option>
              <option value="невромы">Невромы</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Костный опил
            </label>
            <select
              value={formData.boneCondition || ''}
              onChange={(e) => handleInputChange('boneCondition', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Выберите состояние костного опила</option>
              <option value="болезненный">Болезненный</option>
              <option value="безболезненный">Безболезненный</option>
              <option value="неровный">Неровный</option>
              <option value="гладкий">Гладкий</option>
              <option value="остеофиты">Остеофиты</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="stumpSupport"
              checked={formData.stumpSupport || false}
              onChange={(e) => handleInputChange('stumpSupport', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="stumpSupport" className="ml-2 block text-sm text-gray-900">
              Опорность культи (да/нет)
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Объективные данные
          </label>
          <textarea
            value={formData.objectiveData || ''}
            onChange={(e) => handleInputChange('objectiveData', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Введите объективные данные"
          />
        </div>

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
            <span>Сохранить изменения</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProstheticsDataEdit;
