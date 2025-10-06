import React, { useState, useEffect } from 'react';
import { PersonalFile } from '../types/personalFile';
import { X, Save, User, Phone, Heart, Package, FileText, Clock, History } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('basic');

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
    if (!formData.passportIssuedBy) newErrors.passportIssuedBy = 'Кем выдан паспорт обязательно';
    if (!formData.passportIssueDate) newErrors.passportIssueDate = 'Дата выдачи паспорта обязательна';
    if (!formData.registrationAddress) newErrors.registrationAddress = 'Адрес по прописке обязателен';
    if (!formData.addressSameAsRegistration && !formData.actualAddress) {
      newErrors.actualAddress = 'Фактический адрес обязателен';
    }
    if (!formData.disabilityCategory) newErrors.disabilityCategory = 'Категория инвалидности обязательна';
    if (!formData.disabilityGroup) newErrors.disabilityGroup = 'Группа инвалидности обязательна';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PersonalFile, value: string | number | boolean) => {
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

  const tabs = [
    { id: 'basic', label: 'Основная информация', icon: User },
    { id: 'contact', label: 'Контактная информация', icon: Phone },
    { id: 'medical', label: 'Медицинская информация', icon: Heart },
    { id: 'prosthetics', label: 'Данные по протезированию', icon: Package },
    { id: 'services', label: 'Направления на услуги', icon: FileText },
    { id: 'orders', label: 'Заказы на изготовление протеза', icon: Clock },
    { id: 'other', label: 'Другие заказы и наряды', icon: FileText },
    { id: 'history', label: 'История оказания услуг', icon: History }
  ];

  const renderBasicInfo = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Основная информация</h3>
      
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
            <option value="">Выберите документ</option>
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
            <option value="">Выберите пол</option>
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Серия паспорта <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.passportSeries || ''}
            onChange={(e) => handleInputChange('passportSeries', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.passportSeries ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Введите серию паспорта"
          />
          {errors.passportSeries && <p className="text-red-500 text-xs mt-1">{errors.passportSeries}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Номер паспорта <span className="text-red-500">*</span>
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
            Кем выдан <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.passportIssuedBy || ''}
            onChange={(e) => handleInputChange('passportIssuedBy', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.passportIssuedBy ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Введите кем выдан паспорт"
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
            Номер пенсионного удостоверения
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
            Дата выдачи пенсионного удостоверения
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
            Кем выдано пенсионное удостоверение
          </label>
          <input
            type="text"
            value={formData.pensionIssuedBy || ''}
            onChange={(e) => handleInputChange('pensionIssuedBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Введите кем выдано пенсионное удостоверение"
          />
        </div>
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Контактная информация</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Телефон
          </label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Введите номер телефона"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Дополнительный телефон
          </label>
          <input
            type="tel"
            value={formData.additionalPhone || ''}
            onChange={(e) => handleInputChange('additionalPhone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Введите дополнительный номер телефона"
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

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Адрес по прописке <span className="text-red-500">*</span>
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

        <div className="md:col-span-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="addressSameAsRegistration"
              checked={formData.addressSameAsRegistration || false}
              onChange={(e) => handleAddressCheckboxChange(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="addressSameAsRegistration" className="ml-2 block text-sm text-gray-700">
              Фактический адрес совпадает с адресом по прописке
            </label>
          </div>
        </div>

        {!formData.addressSameAsRegistration && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Фактический адрес <span className="text-red-500">*</span>
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
        )}
      </div>
    </div>
  );

  const renderMedicalInfo = () => (
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
            <option value="">Выберите категорию</option>
            <option value="1 группа">1 группа</option>
            <option value="2 группа">2 группа</option>
            <option value="3 группа">3 группа</option>
            <option value="Ребенок-инвалид">Ребенок-инвалид</option>
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
            <option value="">Выберите группу</option>
            <option value="1 группа">1 группа</option>
            <option value="2 группа">2 группа</option>
            <option value="3 группа">3 группа</option>
            <option value="Ребенок-инвалид">Ребенок-инвалид</option>
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
            Дополнительная информация
          </label>
          <textarea
            value={formData.additions || ''}
            onChange={(e) => handleInputChange('additions', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Введите дополнительную информацию"
            maxLength={255}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {(formData.additions || '').length}/255
          </div>
        </div>
      </div>
    </div>
  );

  const renderProstheticsInfo = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Данные по протезированию</h3>
      <div className="text-center py-8 text-gray-500">
        <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p>Раздел в разработке</p>
        <p className="text-sm">Здесь будет информация о протезировании</p>
      </div>
    </div>
  );

  const renderServicesInfo = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Направления на услуги</h3>
      <div className="text-center py-8 text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p>Раздел в разработке</p>
        <p className="text-sm">Здесь будут направления на услуги</p>
      </div>
    </div>
  );

  const renderOrdersInfo = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Заказы на изготовление протеза</h3>
      <div className="text-center py-8 text-gray-500">
        <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p>Раздел в разработке</p>
        <p className="text-sm">Здесь будут заказы на изготовление протеза</p>
      </div>
    </div>
  );

  const renderOtherOrdersInfo = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Другие заказы и наряды</h3>
      <div className="text-center py-8 text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p>Раздел в разработке</p>
        <p className="text-sm">Здесь будут другие заказы и наряды</p>
      </div>
    </div>
  );

  const renderHistoryInfo = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">История оказания услуг</h3>
      <div className="text-center py-8 text-gray-500">
        <History className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p>Раздел в разработке</p>
        <p className="text-sm">Здесь будет история оказания услуг</p>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return renderBasicInfo();
      case 'contact':
        return renderContactInfo();
      case 'medical':
        return renderMedicalInfo();
      case 'prosthetics':
        return renderProstheticsInfo();
      case 'services':
        return renderServicesInfo();
      case 'orders':
        return renderOrdersInfo();
      case 'other':
        return renderOtherOrdersInfo();
      case 'history':
        return renderHistoryInfo();
      default:
        return renderBasicInfo();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Редактирование личных данных</h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Вкладки */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {renderTabContent()}

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