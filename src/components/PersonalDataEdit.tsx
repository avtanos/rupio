import React, { useState, useEffect } from 'react';
import { PersonalFile } from '../types/personalFile';
import { X, Save } from 'lucide-react';

interface PersonalDataEditProps {
  personalFile: PersonalFile;
  onSave: (updates: Partial<PersonalFile>) => void;
  onCancel: () => void;
}

const PersonalDataEdit: React.FC<PersonalDataEditProps> = ({
  personalFile,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<PersonalFile>>({
    pin: personalFile.pin,
    documentType: personalFile.documentType,
    lastName: personalFile.lastName,
    firstName: personalFile.firstName,
    middleName: personalFile.middleName,
    gender: personalFile.gender,
    birthYear: personalFile.birthYear,
    passportSeries: personalFile.passportSeries,
    passportNumber: personalFile.passportNumber,
    passportIssuedBy: personalFile.passportIssuedBy,
    passportIssueDate: personalFile.passportIssueDate,
    pensionNumber: personalFile.pensionNumber,
    pensionIssueDate: personalFile.pensionIssueDate,
    pensionIssuedBy: personalFile.pensionIssuedBy,
    registrationAddress: personalFile.registrationAddress,
    actualAddress: personalFile.actualAddress,
    addressSameAsRegistration: personalFile.addressSameAsRegistration,
    phone: personalFile.phone,
    additionalPhone: personalFile.additionalPhone,
    workplace: personalFile.workplace,
    disabilityCategory: personalFile.disabilityCategory,
    disabilityGroup: personalFile.disabilityGroup,
    disabilityReason: personalFile.disabilityReason,
    operationInfo: personalFile.operationInfo,
    additions: personalFile.additions
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.pin) newErrors.pin = 'ПИН обязателен';
    if (!formData.documentType) newErrors.documentType = 'Документ обязателен';
    if (!formData.lastName) newErrors.lastName = 'Фамилия обязательна';
    if (!formData.firstName) newErrors.firstName = 'Имя обязательно';
    if (!formData.gender) newErrors.gender = 'Пол обязателен';
    if (!formData.birthYear) newErrors.birthYear = 'Год рождения обязателен';
    if (!formData.passportSeries) newErrors.passportSeries = 'Серия паспорта обязательна';
    if (!formData.passportNumber) newErrors.passportNumber = 'Номер паспорта обязателен';
    if (!formData.passportIssuedBy) newErrors.passportIssuedBy = 'Орган выдачи обязателен';
    if (!formData.passportIssueDate) newErrors.passportIssueDate = 'Дата выдачи обязательна';
    if (!formData.registrationAddress) newErrors.registrationAddress = 'Адрес по прописке обязателен';
    if (!formData.actualAddress) newErrors.actualAddress = 'Фактический адрес обязателен';
    if (!formData.disabilityCategory) newErrors.disabilityCategory = 'Категория инвалидности обязательна';
    if (!formData.disabilityGroup) newErrors.disabilityGroup = 'Группа инвалидности обязательна';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PersonalFile, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddressCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      addressSameAsRegistration: checked,
      actualAddress: checked ? prev.registrationAddress : prev.actualAddress
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Редактирование личных данных</h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Личные данные */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Личные данные</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ПИН <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.pin || ''}
                onChange={(e) => handleInputChange('pin', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.pin ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Введите ПИН"
              />
              {errors.pin && <p className="text-red-500 text-xs mt-1">{errors.pin}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Документ <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.documentType || ''}
                onChange={(e) => handleInputChange('documentType', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.documentType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="Паспорт">Паспорт</option>
                <option value="Свидетельство о рождении">Свидетельство о рождении</option>
              </select>
              {errors.documentType && <p className="text-red-500 text-xs mt-1">{errors.documentType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Фамилия <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.lastName || ''}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Введите фамилию"
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Имя <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.firstName || ''}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Введите имя"
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Отчество
              </label>
              <input
                type="text"
                value={formData.middleName || ''}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите отчество"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Пол <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.gender || ''}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.gender ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="Мужской">Мужской</option>
                <option value="Женский">Женский</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Год рождения <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.birthYear || ''}
                onChange={(e) => handleInputChange('birthYear', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.birthYear ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Введите год рождения"
                min="1900"
                max="2024"
              />
              {errors.birthYear && <p className="text-red-500 text-xs mt-1">{errors.birthYear}</p>}
            </div>
          </div>
        </div>

        {/* Документы */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Документы</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Серия <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.passportSeries || ''}
                onChange={(e) => handleInputChange('passportSeries', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.passportSeries ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="ID">ID</option>
                <option value="AC">AC</option>
                <option value="AN">AN</option>
                <option value="KGZ01">KGZ01</option>
                <option value="KR-X">KR-X</option>
              </select>
              {errors.passportSeries && <p className="text-red-500 text-xs mt-1">{errors.passportSeries}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                № Паспорта <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.passportNumber || ''}
                onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.passportNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Введите номер паспорта"
              />
              {errors.passportNumber && <p className="text-red-500 text-xs mt-1">{errors.passportNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Орган выдачи <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.passportIssuedBy || ''}
                onChange={(e) => handleInputChange('passportIssuedBy', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.passportIssuedBy ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Введите орган выдачи"
              />
              {errors.passportIssuedBy && <p className="text-red-500 text-xs mt-1">{errors.passportIssuedBy}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата выдачи <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.passportIssueDate || ''}
                onChange={(e) => handleInputChange('passportIssueDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.passportIssueDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.passportIssueDate && <p className="text-red-500 text-xs mt-1">{errors.passportIssueDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                № Пенсионного удостоверения
              </label>
              <input
                type="text"
                value={formData.pensionNumber || ''}
                onChange={(e) => handleInputChange('pensionNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите номер пенсионного удостоверения"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата выдачи пенсионного
              </label>
              <input
                type="date"
                value={formData.pensionIssueDate || ''}
                onChange={(e) => handleInputChange('pensionIssueDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Орган выдачи пенсионного
              </label>
              <input
                type="text"
                value={formData.pensionIssuedBy || ''}
                onChange={(e) => handleInputChange('pensionIssuedBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите орган выдачи пенсионного"
              />
            </div>
          </div>
        </div>

        {/* Адреса */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Адреса</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Адрес (по прописке) <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.registrationAddress || ''}
                onChange={(e) => handleInputChange('registrationAddress', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.registrationAddress ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={3}
                placeholder="Введите адрес по прописке"
              />
              {errors.registrationAddress && <p className="text-red-500 text-xs mt-1">{errors.registrationAddress}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Адрес (фактический) <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.actualAddress || ''}
                onChange={(e) => handleInputChange('actualAddress', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.actualAddress ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={3}
                placeholder="Введите фактический адрес"
              />
              {errors.actualAddress && <p className="text-red-500 text-xs mt-1">{errors.actualAddress}</p>}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="addressSameAsRegistration"
                checked={formData.addressSameAsRegistration || false}
                onChange={(e) => handleAddressCheckboxChange(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="addressSameAsRegistration" className="ml-2 block text-sm text-gray-900">
                Совпадает с пропиской
              </label>
            </div>
          </div>
        </div>

        {/* Контакты */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Контакты</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Номер телефона
              </label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+375 29 123-45-67"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дополнительный номер
              </label>
              <input
                type="tel"
                value={formData.additionalPhone || ''}
                onChange={(e) => handleInputChange('additionalPhone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+375 17 234-56-78"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Место работы
              </label>
              <input
                type="text"
                value={formData.workplace || ''}
                onChange={(e) => handleInputChange('workplace', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите место работы"
              />
            </div>
          </div>
        </div>

        {/* Медицинская информация */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Медицинская информация</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Категория инвалидности <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.disabilityCategory || ''}
                onChange={(e) => handleInputChange('disabilityCategory', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.disabilityCategory ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="ЛОВЗ до 18 лет">ЛОВЗ до 18 лет</option>
                <option value="ЛОВЗ с детства">ЛОВЗ с детства</option>
                <option value="Инвалид ВОВ">Инвалид ВОВ</option>
                <option value="Инвалид советской армии">Инвалид советской армии</option>
                <option value="Инвалид труда">Инвалид труда</option>
              </select>
              {errors.disabilityCategory && <p className="text-red-500 text-xs mt-1">{errors.disabilityCategory}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Группа инвалидности <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.disabilityGroup || ''}
                onChange={(e) => handleInputChange('disabilityGroup', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.disabilityGroup ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="1 группа">1 группа</option>
                <option value="2 группа">2 группа</option>
                <option value="3 группа">3 группа</option>
              </select>
              {errors.disabilityGroup && <p className="text-red-500 text-xs mt-1">{errors.disabilityGroup}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Причина инвалидности
              </label>
              <select
                value={formData.disabilityReason || ''}
                onChange={(e) => handleInputChange('disabilityReason', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Выберите причину</option>
                <option value="Травма">Травма</option>
                <option value="Врожденный">Врожденный</option>
                <option value="Заболевание">Заболевание</option>
              </select>
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Где и когда оперирован
              </label>
              <input
                type="text"
                value={formData.operationInfo || ''}
                onChange={(e) => handleInputChange('operationInfo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите информацию об операции"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дополнения
                <span className="text-gray-500 text-sm ml-2">(до 255 символов)</span>
              </label>
              <textarea
                value={formData.additions || ''}
                onChange={(e) => handleInputChange('additions', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Введите дополнительные сведения"
                maxLength={255}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {(formData.additions || '').length}/255
              </div>
            </div>
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
            <span>Сохранить изменения</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalDataEdit;
