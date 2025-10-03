import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Edit, Eye, Trash2, Calendar, User, FileText, Stethoscope, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { RehabilitationDirection, RehabilitationDirectionFilters } from '../types/rehabilitation';
import { PersonalFile } from '../types/personalFile';
import RehabilitationDirectionForm from './RehabilitationDirectionForm';

interface RehabilitationDirectionsPageProps {
  directions: RehabilitationDirection[];
  personalFiles: PersonalFile[];
  onNewDirection: (direction: any) => void;
  onUpdateDirection: (id: string, updates: Partial<RehabilitationDirection>) => void;
  onDeleteDirection: (id: string) => void;
}

const RehabilitationDirectionsPage: React.FC<RehabilitationDirectionsPageProps> = ({
  directions,
  personalFiles,
  onNewDirection,
  onUpdateDirection,
  onDeleteDirection
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showDirectionForm, setShowDirectionForm] = useState(false);
  const [editingDirection, setEditingDirection] = useState<RehabilitationDirection | null>(null);

  const statusOptions = [
    { value: 'all', label: 'Все статусы' },
    { value: 'Создано', label: 'Создано' },
    { value: 'Отправлено', label: 'Отправлено' },
    { value: 'Принято в ЦР ЛОВЗ', label: 'Принято в ЦР ЛОВЗ' },
    { value: 'В процессе реабилитации', label: 'В процессе реабилитации' },
    { value: 'Завершено', label: 'Завершено' },
    { value: 'Отклонено', label: 'Отклонено' }
  ];

  const filteredDirections = useMemo(() => {
    return directions.filter(direction => {
      const personalFile = personalFiles.find(pf => pf.id === direction.personalFileId);
      const fullName = personalFile ? `${personalFile.lastName} ${personalFile.firstName} ${personalFile.middleName || ''}`.toLowerCase() : '';
      
      const matchesSearch = searchTerm === '' || 
        direction.directionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        direction.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        direction.msekCertificate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fullName.includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || direction.status === statusFilter;

      const matchesDateFrom = !dateFrom || direction.directionDate >= dateFrom;
      const matchesDateTo = !dateTo || direction.directionDate <= dateTo;

      return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
    });
  }, [directions, personalFiles, searchTerm, statusFilter, dateFrom, dateTo]);

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      'Создано': 'bg-gray-100 text-gray-800',
      'Отправлено': 'bg-blue-100 text-blue-800',
      'Принято в ЦР ЛОВЗ': 'bg-green-100 text-green-800',
      'В процессе реабилитации': 'bg-yellow-100 text-yellow-800',
      'Завершено': 'bg-emerald-100 text-emerald-800',
      'Отклонено': 'bg-red-100 text-red-800'
    };

    return `px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Создано':
        return <Clock className="w-4 h-4" />;
      case 'Отправлено':
        return <FileText className="w-4 h-4" />;
      case 'Принято в ЦР ЛОВЗ':
        return <CheckCircle className="w-4 h-4" />;
      case 'В процессе реабилитации':
        return <Stethoscope className="w-4 h-4" />;
      case 'Завершено':
        return <CheckCircle className="w-4 h-4" />;
      case 'Отклонено':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleNewDirection = () => {
    setEditingDirection(null);
    setShowDirectionForm(true);
  };

  const handleEditDirection = (direction: RehabilitationDirection) => {
    setEditingDirection(direction);
    setShowDirectionForm(true);
  };

  const handleViewDirection = (direction: RehabilitationDirection) => {
    // В будущем можно добавить модальное окно для просмотра
    console.log('Просмотр направления:', direction);
  };

  const handleDeleteDirection = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить это направление?')) {
      onDeleteDirection(id);
    }
  };

  const handleSaveDirection = (directionData: any) => {
    if (editingDirection) {
      onUpdateDirection(editingDirection.id, directionData);
    } else {
      onNewDirection(directionData);
    }
    setShowDirectionForm(false);
    setEditingDirection(null);
  };

  const handleCancelForm = () => {
    setShowDirectionForm(false);
    setEditingDirection(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Направления на реабилитацию</h1>
          <p className="text-gray-600">Управление направлениями в ЦР ЛОВЗ</p>
        </div>
        <button
          onClick={handleNewDirection}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Новое направление</span>
        </button>
      </div>

      {/* Фильтры */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Поиск
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Номер, диагноз, ФИО, МСЭК..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Статус
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Дата с
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Дата по
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={clearFilters}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Очистить фильтры</span>
          </button>
        </div>
      </div>

      {/* Таблица направлений */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  № направления
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата направления
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Пациент
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Диагноз
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  МСЭК
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDirections.map((direction) => {
                const personalFile = personalFiles.find(pf => pf.id === direction.personalFileId);
                const fullName = personalFile ? `${personalFile.lastName} ${personalFile.firstName} ${personalFile.middleName || ''}`.trim() : 'Неизвестно';
                
                return (
                  <tr key={direction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm font-mono text-blue-600">
                          {direction.directionNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        {new Date(direction.directionDate).toLocaleDateString('ru-RU')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{fullName}</div>
                          {personalFile && (
                            <div className="text-sm text-gray-500">ПИН: {personalFile.pin}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={direction.diagnosis}>
                        {direction.diagnosis}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 font-mono">
                        {direction.msekCertificate}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(direction.status)}
                        <span className={`ml-2 ${getStatusBadge(direction.status)}`}>
                          {direction.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDirection(direction)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Просмотр"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditDirection(direction)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Редактировать"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDirection(direction.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredDirections.length === 0 && (
          <div className="text-center py-12">
            <Stethoscope className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Направления не найдены</h3>
            <p className="mt-1 text-sm text-gray-500">
              Попробуйте изменить параметры поиска или создать новое направление.
            </p>
          </div>
        )}
      </div>

      {/* Форма направления */}
      {showDirectionForm && (
        <RehabilitationDirectionForm
          direction={editingDirection || undefined}
          personalFiles={personalFiles}
          onSave={handleSaveDirection}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
};

export default RehabilitationDirectionsPage;
