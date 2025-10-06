import React, { useState } from 'react';
import { ServiceDirection } from '../types/personalFile';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface ServiceDirectionsEditProps {
  directions: ServiceDirection[];
  onSave: (directions: ServiceDirection[]) => void;
  onCancel: () => void;
}

const ServiceDirectionsEdit: React.FC<ServiceDirectionsEditProps> = ({
  directions,
  onSave,
  onCancel
}) => {
  const [editingDirection, setEditingDirection] = useState<ServiceDirection | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState<Partial<ServiceDirection>>({
    directionDate: '',
    diagnosis: '',
    institution: '',
    doctorName: '',
    serviceType: '',
    notes: ''
  });

  const handleAddNew = () => {
    setFormData({
      directionDate: '',
      diagnosis: '',
      institution: '',
      doctorName: '',
      serviceType: '',
      notes: ''
    });
    setIsAddingNew(true);
    setEditingDirection(null);
  };

  const handleEdit = (direction: ServiceDirection) => {
    setFormData(direction);
    setEditingDirection(direction);
    setIsAddingNew(false);
  };

  const handleSave = () => {
    if (!formData.directionDate || !formData.diagnosis || !formData.institution || 
        !formData.doctorName || !formData.serviceType) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    const newDirection: ServiceDirection = {
      ...formData,
      id: editingDirection?.id || `D${Date.now()}`
    } as ServiceDirection;

    let updatedDirections: ServiceDirection[];
    
    if (editingDirection) {
      updatedDirections = directions.map(dir => 
        dir.id === editingDirection.id ? newDirection : dir
      );
    } else {
      updatedDirections = [...directions, newDirection];
    }

    onSave(updatedDirections);
    handleCancel();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить это направление?')) {
      const updatedDirections = directions.filter(dir => dir.id !== id);
      onSave(updatedDirections);
    }
  };

  const handleCancel = () => {
    setEditingDirection(null);
    setIsAddingNew(false);
    setFormData({
      directionDate: '',
      diagnosis: '',
      institution: '',
      doctorName: '',
      serviceType: '',
      notes: ''
    });
  };

  const handleInputChange = (field: keyof ServiceDirection, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Редактирование направлений на услуги</h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Список существующих направлений */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Направления на услуги</h3>
          <button
            onClick={handleAddNew}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить направление</span>
          </button>
        </div>

        {directions.length > 0 ? (
          <div className="space-y-3">
            {directions.map((direction) => (
              <div key={direction.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Дата направления</p>
                        <p className="text-sm text-gray-900">
                          {new Date(direction.directionDate).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Вид услуги</p>
                        <p className="text-sm text-gray-900">{direction.serviceType}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Диагноз</p>
                        <p className="text-sm text-gray-900">{direction.diagnosis}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Учреждение</p>
                        <p className="text-sm text-gray-900">{direction.institution}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">ФИО Врача</p>
                        <p className="text-sm text-gray-900">{direction.doctorName}</p>
                      </div>
                      {direction.notes && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Примечания</p>
                          <p className="text-sm text-gray-900">{direction.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(direction)}
                      className="p-2 text-blue-600 hover:text-blue-900"
                      title="Редактировать"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(direction.id)}
                      className="p-2 text-red-600 hover:text-red-900"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Направления на услуги не добавлены</p>
        )}
      </div>

      {/* Форма добавления/редактирования */}
      {(isAddingNew || editingDirection) && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isAddingNew ? 'Добавление нового направления' : 'Редактирование направления'}
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дата направления <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.directionDate || ''}
                  onChange={(e) => handleInputChange('directionDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Вид услуги <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.serviceType || ''}
                  onChange={(e) => handleInputChange('serviceType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введите вид услуги"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Диагноз при направлении <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.diagnosis || ''}
                  onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введите диагноз"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Учреждение <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.institution || ''}
                  onChange={(e) => handleInputChange('institution', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введите учреждение"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ФИО Врача <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.doctorName || ''}
                  onChange={(e) => handleInputChange('doctorName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введите ФИО врача"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Примечания
                </label>
                <input
                  type="text"
                  value={formData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введите примечания"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Сохранить</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Кнопки управления */}
      <div className="flex justify-end space-x-4 pt-6 border-t mt-6">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default ServiceDirectionsEdit;
