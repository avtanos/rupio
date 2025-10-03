import React, { useState } from 'react';
import { ServiceDirection } from '../types/personalFile';
import { Plus, Calendar, Stethoscope, Building, User, FileText, Edit, Trash2 } from 'lucide-react';

interface ServiceDirectionsProps {
  directions: ServiceDirection[];
  onAddDirection: (direction: Omit<ServiceDirection, 'id'>) => void;
  onEditDirection: (id: string, direction: Omit<ServiceDirection, 'id'>) => void;
  onDeleteDirection: (id: string) => void;
}

const ServiceDirections: React.FC<ServiceDirectionsProps> = ({
  directions = [],
  onAddDirection,
  onEditDirection,
  onDeleteDirection
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingDirection, setEditingDirection] = useState<ServiceDirection | null>(null);
  const [formData, setFormData] = useState<Omit<ServiceDirection, 'id'>>({
    directionDate: '',
    diagnosis: '',
    institution: '',
    doctorName: '',
    serviceType: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDirection) {
      onEditDirection(editingDirection.id, formData);
    } else {
      onAddDirection(formData);
    }
    
    setShowForm(false);
    setEditingDirection(null);
    setFormData({
      directionDate: '',
      diagnosis: '',
      institution: '',
      doctorName: '',
      serviceType: '',
      notes: ''
    });
  };

  const handleEdit = (direction: ServiceDirection) => {
    setEditingDirection(direction);
    setFormData({
      directionDate: direction.directionDate,
      diagnosis: direction.diagnosis,
      institution: direction.institution,
      doctorName: direction.doctorName,
      serviceType: direction.serviceType,
      notes: direction.notes || ''
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingDirection(null);
    setFormData({
      directionDate: '',
      diagnosis: '',
      institution: '',
      doctorName: '',
      serviceType: '',
      notes: ''
    });
  };

  const serviceTypes = [
    'Изготовление протеза',
    'Изготовление ортопедической обуви',
    'Изготовление корсета',
    'Изготовление слухового аппарата',
    'Изготовление инвалидной коляски',
    'Ремонт протеза',
    'Ремонт ортопедической обуви',
    'Ремонт корсета',
    'Ремонт слухового аппарата',
    'Ремонт инвалидной коляски',
    'Готовые ПОИ (слуховые аппараты)',
    'Готовые ПОИ (протезы)',
    'Готовые ПОИ (кресла-коляски)'
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Направления на услуги ({directions.length})
        </h3>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить направление</span>
        </button>
      </div>

      {/* Список направлений */}
      <div className="space-y-3">
        {directions.map((direction) => (
          <div key={direction.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-gray-900">
                  {new Date(direction.directionDate).toLocaleDateString('ru-RU')}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(direction)}
                  className="text-blue-600 hover:text-blue-800 p-1"
                  title="Редактировать"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteDirection(direction.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Удалить"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Stethoscope className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Диагноз</p>
                    <p className="text-sm text-gray-900">{direction.diagnosis}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Building className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Учреждение</p>
                    <p className="text-sm text-gray-900">{direction.institution}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <User className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Врач</p>
                    <p className="text-sm text-gray-900">{direction.doctorName}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Вид услуги</p>
                    <p className="text-sm text-gray-900">{direction.serviceType}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {direction.notes && (
              <div className="mt-3 p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-500">Примечания:</p>
                <p className="text-sm text-gray-700">{direction.notes}</p>
              </div>
            )}
          </div>
        ))}
        
        {directions.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Направления не найдены</h3>
            <p className="mt-1 text-sm text-gray-500">
              Добавьте первое направление на услугу для этого клиента.
            </p>
          </div>
        )}
      </div>

      {/* Форма добавления/редактирования */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingDirection ? 'Редактирование направления' : 'Добавление направления'}
              </h3>
              <button
                onClick={handleCancel}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Дата направления <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.directionDate}
                    onChange={(e) => setFormData({...formData, directionDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Вид услуги <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Выберите вид услуги</option>
                    {serviceTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Диагноз при направлении <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введите диагноз"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Учреждение <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({...formData, institution: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Название медицинского учреждения"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ФИО Врача <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.doctorName}
                    onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Фамилия Имя Отчество"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Примечания
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Дополнительная информация"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingDirection ? 'Сохранить изменения' : 'Добавить направление'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDirections;
