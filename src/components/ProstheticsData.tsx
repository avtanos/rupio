import React, { useState } from 'react';
import { ProstheticsData } from '../types/personalFile';
import { Edit, Save, X, Ruler, Activity, Shield, Eye, Bone, CheckCircle } from 'lucide-react';

interface ProstheticsDataProps {
  prostheticsData?: ProstheticsData;
  onSave: (data: ProstheticsData) => void;
  onCancel: () => void;
}

const ProstheticsDataComponent: React.FC<ProstheticsDataProps> = ({
  prostheticsData,
  onSave,
  onCancel
}) => {
  const [isEditing, setIsEditing] = useState(!prostheticsData);
  const [formData, setFormData] = useState<ProstheticsData>(prostheticsData || {
    id: `PD${Date.now()}`,
    stumpLength: '',
    stumpShape: undefined,
    stumpMobility: undefined,
    contractureDescription: '',
    scar: undefined,
    skinCondition: undefined,
    boneCondition: undefined,
    stumpSupport: undefined,
    objectiveData: ''
  });

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (prostheticsData) {
      setFormData(prostheticsData);
      setIsEditing(false);
    } else {
      onCancel();
    }
  };

  const handleInputChange = (field: keyof ProstheticsData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const stumpShapes = [
    'цилиндрическая',
    'булавовидная', 
    'умеренно-коническая',
    'резко-коническая',
    'избыток ткани',
    'атрофия'
  ];

  const stumpMobilities = [
    'нормальная',
    'ограничение движения',
    'контрактура'
  ];

  const scarTypes = [
    'линейный',
    'звездчатый',
    'центральный',
    'передний',
    'задний',
    'боковой',
    'подвижный',
    'спаянный',
    'безболезненный',
    'келоидный'
  ];

  const skinConditions = [
    'нормальный',
    'синюшный',
    'отечный',
    'потертости',
    'трещины',
    'язвы',
    'свищи',
    'невромы'
  ];

  const boneConditions = [
    'болезненный',
    'безболезненный',
    'неровный',
    'гладкий',
    'остеофиты'
  ];

  if (!isEditing && prostheticsData) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Данные по протезированию</h3>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-3 py-1 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Редактировать</span>
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Ruler className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Длина культи</p>
                  <p className="text-sm text-gray-900">{prostheticsData.stumpLength || 'Не указано'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Форма культи</p>
                  <p className="text-sm text-gray-900">{prostheticsData.stumpShape || 'Не указано'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Подвижность культи</p>
                  <p className="text-sm text-gray-900">{prostheticsData.stumpMobility || 'Не указано'}</p>
                  {prostheticsData.stumpMobility === 'контрактура' && prostheticsData.contractureDescription && (
                    <p className="text-xs text-gray-600 mt-1">{prostheticsData.contractureDescription}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Рубец</p>
                  <p className="text-sm text-gray-900">{prostheticsData.scar || 'Не указано'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Состояние кожного покрова</p>
                  <p className="text-sm text-gray-900">{prostheticsData.skinCondition || 'Не указано'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Bone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Костный опил</p>
                  <p className="text-sm text-gray-900">{prostheticsData.boneCondition || 'Не указано'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Опорность культи</p>
                  <p className="text-sm text-gray-900">
                    {prostheticsData.stumpSupport === true ? 'Да' : prostheticsData.stumpSupport === false ? 'Нет' : 'Не указано'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {prostheticsData.objectiveData && (
            <div className="mt-4 p-3 bg-white rounded border">
              <p className="text-sm font-medium text-gray-700 mb-2">Объективные данные</p>
              <p className="text-sm text-gray-900">{prostheticsData.objectiveData}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Данные по протезированию</h3>
        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Сохранить</span>
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center space-x-2 px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Отмена</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Длина культи
            </label>
            <input
              type="text"
              value={formData.stumpLength || ''}
              onChange={(e) => handleInputChange('stumpLength', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Например: 15 см"
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
              <option value="">Выберите форму</option>
              {stumpShapes.map((shape) => (
                <option key={shape} value={shape}>{shape}</option>
              ))}
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
              <option value="">Выберите подвижность</option>
              {stumpMobilities.map((mobility) => (
                <option key={mobility} value={mobility}>{mobility}</option>
              ))}
            </select>
          </div>

          {formData.stumpMobility === 'контрактура' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание контрактуры
              </label>
              <textarea
                value={formData.contractureDescription || ''}
                onChange={(e) => handleInputChange('contractureDescription', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Опишите характер контрактуры"
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
              {scarTypes.map((scar) => (
                <option key={scar} value={scar}>{scar}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Состояние кожного покрова
            </label>
            <select
              value={formData.skinCondition || ''}
              onChange={(e) => handleInputChange('skinCondition', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Выберите состояние</option>
              {skinConditions.map((condition) => (
                <option key={condition} value={condition}>{condition}</option>
              ))}
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
              <option value="">Выберите состояние</option>
              {boneConditions.map((condition) => (
                <option key={condition} value={condition}>{condition}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Опорность культи
            </label>
            <select
              value={formData.stumpSupport === undefined ? '' : formData.stumpSupport ? 'true' : 'false'}
              onChange={(e) => handleInputChange('stumpSupport', e.target.value === 'true')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Выберите</option>
              <option value="true">Да</option>
              <option value="false">Нет</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Объективные данные
          </label>
          <textarea
            value={formData.objectiveData || ''}
            onChange={(e) => handleInputChange('objectiveData', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Свободная текстовая запись объективных данных"
          />
        </div>
      </div>
    </div>
  );
};

export default ProstheticsDataComponent;
