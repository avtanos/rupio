import React, { useState, useEffect } from 'react';
import { X, Save, User, FileText, Calendar, Stethoscope } from 'lucide-react';
import { RehabilitationDirection, RehabilitationDirectionFormData } from '../types/rehabilitation';
import { PersonalFile } from '../types/personalFile';

interface RehabilitationDirectionFormProps {
  direction?: RehabilitationDirection;
  personalFiles: PersonalFile[];
  onSave: (direction: RehabilitationDirectionFormData) => void;
  onCancel: () => void;
}

const RehabilitationDirectionForm: React.FC<RehabilitationDirectionFormProps> = ({
  direction,
  personalFiles,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<RehabilitationDirectionFormData>({
    personalFileId: direction?.personalFileId || '',
    diagnosis: direction?.diagnosis || '',
    msekCertificate: direction?.msekCertificate || '',
    directionDate: direction?.directionDate || new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<Partial<RehabilitationDirectionFormData>>({});

  // Генерация номера направления (ГОД/НОМЕР)
  const generateDirectionNumber = () => {
    const currentYear = new Date().getFullYear();
    const currentCount = personalFiles.length + 1; // Простая логика для демо
    return `${currentYear}/${currentCount.toString().padStart(3, '0')}`;
  };

  const [directionNumber] = useState(direction?.directionNumber || generateDirectionNumber());

  useEffect(() => {
    if (direction) {
      setFormData({
        personalFileId: direction.personalFileId,
        diagnosis: direction.diagnosis,
        msekCertificate: direction.msekCertificate,
        directionDate: direction.directionDate
      });
    }
  }, [direction]);

  const validateForm = (): boolean => {
    const newErrors: Partial<RehabilitationDirectionFormData> = {};

    if (!formData.personalFileId) {
      newErrors.personalFileId = 'Выберите личное дело';
    }

    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = 'Введите диагноз';
    }

    if (!formData.msekCertificate.trim()) {
      newErrors.msekCertificate = 'Введите номер справки МСЭК';
    }

    if (!formData.directionDate) {
      newErrors.directionDate = 'Выберите дату направления';
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

  const handleInputChange = (field: keyof RehabilitationDirectionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const selectedPersonalFile = personalFiles.find(pf => pf.id === formData.personalFileId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {direction ? 'Редактировать направление' : 'Новое направление на реабилитацию'}
              </h2>
              <p className="text-sm text-gray-500">
                {direction ? 'Изменить данные направления' : 'Создать направление в ЦР ЛОВЗ'}
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
          {/* Номер направления */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Номер направления</span>
            </div>
            <div className="text-lg font-mono text-blue-600">
              {directionNumber}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Автоматически генерируется в формате ГОД/НОМЕР
            </p>
          </div>

          {/* Личные данные */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Личное дело *
            </label>
            <select
              value={formData.personalFileId}
              onChange={(e) => handleInputChange('personalFileId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.personalFileId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Выберите личное дело</option>
              {personalFiles.map((file) => (
                <option key={file.id} value={file.id}>
                  {file.pin} - {file.lastName} {file.firstName} {file.middleName || ''}
                </option>
              ))}
            </select>
            {errors.personalFileId && (
              <p className="mt-1 text-sm text-red-600">{errors.personalFileId}</p>
            )}
            
            {selectedPersonalFile && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Данные пациента:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">ПИН:</span> {selectedPersonalFile.pin}
                  </div>
                  <div>
                    <span className="text-gray-600">Пол:</span> {selectedPersonalFile.gender}
                  </div>
                  <div>
                    <span className="text-gray-600">Год рождения:</span> {selectedPersonalFile.birthYear}
                  </div>
                  <div>
                    <span className="text-gray-600">Группа инвалидности:</span> {selectedPersonalFile.disabilityGroup}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Справка МСЭК */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Номер справки МСЭК *
            </label>
            <input
              type="text"
              value={formData.msekCertificate}
              onChange={(e) => handleInputChange('msekCertificate', e.target.value)}
              placeholder="Например: МСЭК-2024-001234"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.msekCertificate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.msekCertificate && (
              <p className="mt-1 text-sm text-red-600">{errors.msekCertificate}</p>
            )}
          </div>

          {/* Дата направления */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Дата направления *
            </label>
            <input
              type="date"
              value={formData.directionDate}
              onChange={(e) => handleInputChange('directionDate', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.directionDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.directionDate && (
              <p className="mt-1 text-sm text-red-600">{errors.directionDate}</p>
            )}
          </div>

          {/* Диагноз */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Stethoscope className="w-4 h-4 inline mr-2" />
              Диагноз *
            </label>
            <textarea
              value={formData.diagnosis}
              onChange={(e) => handleInputChange('diagnosis', e.target.value)}
              placeholder="Введите диагноз пациента"
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.diagnosis ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.diagnosis && (
              <p className="mt-1 text-sm text-red-600">{errors.diagnosis}</p>
            )}
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
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{direction ? 'Сохранить изменения' : 'Создать направление'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RehabilitationDirectionForm;
