import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, Calendar, User, Edit, Save, X } from 'lucide-react';
import { ProductReadiness, ProductReadinessStatus } from '../types/manufacturing';

interface ProductReadinessTrackingProps {
  readiness: ProductReadiness;
  onUpdateReadiness: (readiness: ProductReadiness) => void;
  isEditable?: boolean;
}

const ProductReadinessTracking: React.FC<ProductReadinessTrackingProps> = ({
  readiness,
  onUpdateReadiness,
  isEditable = true
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ProductReadiness>(readiness);

  const statusOptions: { value: ProductReadinessStatus; label: string; color: string }[] = [
    { value: 'В работе', label: 'В работе', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Готово к примерке', label: 'Готово к примерке', color: 'bg-blue-100 text-blue-800' },
    { value: 'На примерке', label: 'На примерке', color: 'bg-purple-100 text-purple-800' },
    { value: 'Доработка', label: 'Доработка', color: 'bg-orange-100 text-orange-800' },
    { value: 'Готово к передаче', label: 'Готово к передаче', color: 'bg-green-100 text-green-800' },
    { value: 'Передано на склад', label: 'Передано на склад', color: 'bg-emerald-100 text-emerald-800' }
  ];

  const getStatusIcon = (status: ProductReadinessStatus) => {
    switch (status) {
      case 'В работе':
        return <Clock className="w-4 h-4" />;
      case 'Готово к примерке':
        return <CheckCircle className="w-4 h-4" />;
      case 'На примерке':
        return <User className="w-4 h-4" />;
      case 'Доработка':
        return <AlertCircle className="w-4 h-4" />;
      case 'Готово к передаче':
        return <CheckCircle className="w-4 h-4" />;
      case 'Передано на склад':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: ProductReadinessStatus) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.color : 'bg-gray-100 text-gray-800';
  };

  const handleEdit = () => {
    setEditData(readiness);
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdateReadiness(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(readiness);
    setIsEditing(false);
  };

  const handleStatusChange = (status: ProductReadinessStatus) => {
    setEditData(prev => ({
      ...prev,
      status,
      readinessDate: status === 'Готово к примерке' || status === 'Готово к передаче' || status === 'Передано на склад' 
        ? new Date().toISOString().split('T')[0] 
        : prev.readinessDate
    }));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Не указано';
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Отслеживание готовности</h3>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Сохранить</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center space-x-1 px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Отмена</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Статус готовности */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Статус готовности *
            </label>
            <select
              value={editData.status}
              onChange={(e) => handleStatusChange(e.target.value as ProductReadinessStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Дата готовности */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Дата готовности
            </label>
            <input
              type="date"
              value={editData.readinessDate || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, readinessDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Дата вызова на примерку */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Дата вызова на примерку
            </label>
            <input
              type="date"
              value={editData.fittingCallDate || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, fittingCallDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Дата явки на примерку */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Дата явки на примерку
            </label>
            <input
              type="date"
              value={editData.fittingDate || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, fittingDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Примечания к примерке */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Примечания к примерке
          </label>
          <textarea
            value={editData.fittingNotes || ''}
            onChange={(e) => setEditData(prev => ({ ...prev, fittingNotes: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Результаты примерки, замечания, доработки..."
          />
        </div>

        {/* Дата завершения */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Дата завершения
          </label>
          <input
            type="date"
            value={editData.completionDate || ''}
            onChange={(e) => setEditData(prev => ({ ...prev, completionDate: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Примечания по качеству */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Примечания по качеству
          </label>
          <textarea
            value={editData.qualityNotes || ''}
            onChange={(e) => setEditData(prev => ({ ...prev, qualityNotes: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Оценка качества, соответствие стандартам..."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Отслеживание готовности</h3>
        {isEditable && (
          <button
            onClick={handleEdit}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Редактировать</span>
          </button>
        )}
      </div>

      {/* Текущий статус */}
      <div className="flex items-center space-x-3">
        {getStatusIcon(readiness.status)}
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(readiness.status)}`}>
          {readiness.status}
        </span>
      </div>

      {/* Информация о готовности */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <div>
              <span className="text-sm font-medium text-gray-700">Дата готовности:</span>
              <span className="ml-2 text-sm text-gray-900">{formatDate(readiness.readinessDate)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <div>
              <span className="text-sm font-medium text-gray-700">Вызов на примерку:</span>
              <span className="ml-2 text-sm text-gray-900">{formatDate(readiness.fittingCallDate)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-500" />
            <div>
              <span className="text-sm font-medium text-gray-700">Явка на примерку:</span>
              <span className="ml-2 text-sm text-gray-900">{formatDate(readiness.fittingDate)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-gray-500" />
            <div>
              <span className="text-sm font-medium text-gray-700">Дата завершения:</span>
              <span className="ml-2 text-sm text-gray-900">{formatDate(readiness.completionDate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Примечания */}
      {(readiness.fittingNotes || readiness.qualityNotes) && (
        <div className="space-y-3">
          {readiness.fittingNotes && (
            <div>
              <span className="text-sm font-medium text-gray-700">Примечания к примерке:</span>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">{readiness.fittingNotes}</p>
            </div>
          )}

          {readiness.qualityNotes && (
            <div>
              <span className="text-sm font-medium text-gray-700">Примечания по качеству:</span>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">{readiness.qualityNotes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductReadinessTracking;
