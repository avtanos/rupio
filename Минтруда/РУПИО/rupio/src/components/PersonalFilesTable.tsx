import React, { useState } from 'react';
import { PersonalFile, PersonalFileSearchParams, ServiceRecord } from '../types/personalFile';
import { Search, Plus, Eye, Edit, FileText, Calendar, Phone, MapPin, User } from 'lucide-react';

interface PersonalFilesTableProps {
  personalFiles: PersonalFile[];
  onNewPersonalFile: () => void;
  onViewPersonalFile: (personalFile: PersonalFile) => void;
  onEditPersonalFile: (personalFile: PersonalFile) => void;
}

const PersonalFilesTable: React.FC<PersonalFilesTableProps> = ({
  personalFiles,
  onNewPersonalFile,
  onViewPersonalFile,
  onEditPersonalFile
}) => {
  const [searchParams, setSearchParams] = useState<PersonalFileSearchParams>({
    pin: '',
    lastName: '',
    firstName: '',
    middleName: '',
    personalFileNumber: ''
  });
  const [filteredFiles, setFilteredFiles] = useState<PersonalFile[]>(personalFiles);

  // Обновляем отфильтрованные данные при изменении personalFiles
  React.useEffect(() => {
    setFilteredFiles(personalFiles);
  }, [personalFiles]);

  const handleSearch = () => {
    const filtered = personalFiles.filter(file => {
      const matchesPin = !searchParams.pin || file.pin.includes(searchParams.pin);
      const matchesLastName = !searchParams.lastName || 
        file.lastName.toLowerCase().includes(searchParams.lastName.toLowerCase());
      const matchesFirstName = !searchParams.firstName || 
        file.firstName.toLowerCase().includes(searchParams.firstName.toLowerCase());
      const matchesMiddleName = !searchParams.middleName || 
        (file.middleName && file.middleName.toLowerCase().includes(searchParams.middleName.toLowerCase()));
      const matchesFileNumber = !searchParams.personalFileNumber || 
        file.personalFileNumber.toLowerCase().includes(searchParams.personalFileNumber.toLowerCase());
      
      return matchesPin && matchesLastName && matchesFirstName && matchesMiddleName && matchesFileNumber;
    });
    setFilteredFiles(filtered);
  };

  const handleClearSearch = () => {
    setSearchParams({
      pin: '',
      lastName: '',
      firstName: '',
      middleName: '',
      personalFileNumber: ''
    });
    setFilteredFiles(personalFiles);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'активный':
        return 'bg-green-100 text-green-800';
      case 'архивный':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDisabilityGroupColor = (group: string) => {
    switch (group) {
      case '1 группа':
        return 'bg-red-100 text-red-800';
      case '2 группа':
        return 'bg-yellow-100 text-yellow-800';
      case '3 группа':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Панель поиска */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Поиск личных дел</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ПИН
            </label>
            <input
              type="text"
              value={searchParams.pin}
              onChange={(e) => setSearchParams({...searchParams, pin: e.target.value})}
              placeholder="Введите ПИН"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Фамилия
            </label>
            <input
              type="text"
              value={searchParams.lastName}
              onChange={(e) => setSearchParams({...searchParams, lastName: e.target.value})}
              placeholder="Введите фамилию"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Имя
            </label>
            <input
              type="text"
              value={searchParams.firstName}
              onChange={(e) => setSearchParams({...searchParams, firstName: e.target.value})}
              placeholder="Введите имя"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Отчество
            </label>
            <input
              type="text"
              value={searchParams.middleName}
              onChange={(e) => setSearchParams({...searchParams, middleName: e.target.value})}
              placeholder="Введите отчество"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Номер личного дела
            </label>
            <input
              type="text"
              value={searchParams.personalFileNumber}
              onChange={(e) => setSearchParams({...searchParams, personalFileNumber: e.target.value})}
              placeholder="Введите номер дела"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleSearch}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Поиск</span>
          </button>
          <button
            onClick={handleClearSearch}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Очистить
          </button>
          <button
            onClick={onNewPersonalFile}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Создать личное дело</span>
          </button>
        </div>
      </div>

      {/* Таблица личных дел */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Личные дела ({filteredFiles.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Номер дела
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ФИО
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ПИН
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Группа инвалидности
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Услуг
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFiles.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {file.personalFileNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {file.lastName} {file.firstName} {file.middleName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {file.birthYear} г.р.
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {file.pin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDisabilityGroupColor(file.disabilityGroup)}`}>
                      {file.disabilityGroup}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(file.status)}`}>
                      {file.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-gray-400 mr-1" />
                      <span>{file.services.length}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onViewPersonalFile(file)}
                        className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Просмотр</span>
                      </button>
                      <button
                        onClick={() => onEditPersonalFile(file)}
                        className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Редактировать</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredFiles.length === 0 && (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Личные дела не найдены</h3>
            <p className="mt-1 text-sm text-gray-500">
              Попробуйте изменить параметры поиска или создать новое личное дело.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalFilesTable;
