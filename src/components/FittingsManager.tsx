import React, { useState } from 'react';
import { Fitting } from '../types/prosthesisOrder';
import { Plus, Trash2, Edit, Calendar } from 'lucide-react';

interface FittingsManagerProps {
  fittings: Fitting[];
  onFittingsChange: (fittings: Fitting[]) => void;
}

const FittingsManager: React.FC<FittingsManagerProps> = ({
  fittings,
  onFittingsChange
}) => {
  const [editingFitting, setEditingFitting] = useState<Fitting | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleAddFitting = () => {
    const fittingNumber = (fittings.length + 1) as 1 | 2 | 3;
    const newFitting: Fitting = {
      id: `fitting_${Date.now()}`,
      fittingNumber,
      callDate: '',
      appointmentDate: ''
    };
    setEditingFitting(newFitting);
    setIsAddingNew(true);
  };

  const handleEditFitting = (fitting: Fitting) => {
    setEditingFitting(fitting);
    setIsAddingNew(false);
  };

  const handleSaveFitting = () => {
    if (!editingFitting) return;

    if (isAddingNew) {
      onFittingsChange([...fittings, editingFitting]);
    } else {
      onFittingsChange(
        fittings.map(fitting => 
          fitting.id === editingFitting.id ? editingFitting : fitting
        )
      );
    }

    setEditingFitting(null);
    setIsAddingNew(false);
  };

  const handleDeleteFitting = (id: string) => {
    onFittingsChange(fittings.filter(fitting => fitting.id !== id));
  };

  const handleCancelEdit = () => {
    setEditingFitting(null);
    setIsAddingNew(false);
  };

  const handleFittingFieldChange = (field: keyof Fitting, value: string) => {
    if (!editingFitting) return;
    
    setEditingFitting({
      ...editingFitting,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Примерки</h3>
        {fittings.length < 3 && (
          <button
            onClick={handleAddFitting}
            className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить примерку</span>
          </button>
        )}
      </div>

      {/* Список примерок */}
      <div className="space-y-3">
        {fittings.map((fitting) => (
          <div key={fitting.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="text-md font-semibold text-gray-900 mb-2">
                  Примерка {fitting.fittingNumber}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Дата вызова
                    </label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {fitting.callDate ? new Date(fitting.callDate).toLocaleDateString('ru-RU') : 'Не указана'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Дата явки
                    </label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {fitting.appointmentDate ? new Date(fitting.appointmentDate).toLocaleDateString('ru-RU') : 'Не указана'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleEditFitting(fitting)}
                  className="p-2 text-indigo-600 hover:text-indigo-900"
                  title="Редактировать"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteFitting(fitting.id)}
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

      {/* Форма редактирования/добавления */}
      {editingFitting && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            {isAddingNew ? 'Добавление примерки' : 'Редактирование примерки'}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата вызова
              </label>
              <input
                type="date"
                value={editingFitting.callDate || ''}
                onChange={(e) => handleFittingFieldChange('callDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата явки
              </label>
              <input
                type="date"
                value={editingFitting.appointmentDate || ''}
                onChange={(e) => handleFittingFieldChange('appointmentDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleSaveFitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Сохранить
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FittingsManager;
