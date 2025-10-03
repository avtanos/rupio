import React, { useState, useEffect } from 'react';
import { PersonalFile } from '../types/personalFile';
import { X } from 'lucide-react';

interface PersonalFileFormProps {
  personalFile?: PersonalFile;
  onSave: (personalFile: PersonalFile) => void;
  onCancel: () => void;
}

const PersonalFileForm: React.FC<PersonalFileFormProps> = ({
  personalFile,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<PersonalFile>>({
    personalFileNumber: '',
    pin: '',
    documentType: 'Паспорт',
    lastName: '',
    firstName: '',
    middleName: '',
    gender: 'Мужской',
    birthYear: '',
    passportSeries: 'ID',
    passportNumber: '',
    passportIssuedBy: '',
    passportIssueDate: '',
    pensionNumber: '',
    pensionIssueDate: '',
    pensionIssuedBy: '',
    registrationAddress: '',
    actualAddress: '',
    addressSameAsRegistration: false,
    phone: '',
    additionalPhone: '',
    workplace: '',
    disabilityCategory: 'ЛОВЗ до 18 лет',
    disabilityGroup: '3 группа',
    disabilityReason: 'Травма',
    operationInfo: '',
    additions: '',
    registrationDate: new Date().toISOString().split('T')[0],
    status: 'активный',
    services: [],
    directions: [],
    prostheticsData: undefined
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (personalFile) {
      setFormData(personalFile);
    } else {
      // Генерация номера личного дела для нового дела (формат: ГОД-НОМЕР ДЕЛА)
      const currentYear = new Date().getFullYear();
      const randomNumber = Math.floor(Math.random() * 1000) + 1;
      setFormData(prev => ({
        ...prev,
        personalFileNumber: `${currentYear}-${randomNumber.toString().padStart(4, '0')}`
      }));
    }
  }, [personalFile]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const personalFileData: PersonalFile = {
      id: personalFile?.id || `PF${Date.now()}`,
      personalFileNumber: formData.personalFileNumber || '',
      pin: formData.pin || '',
      documentType: formData.documentType || 'Паспорт',
      lastName: formData.lastName || '',
      firstName: formData.firstName || '',
      middleName: formData.middleName || '',
      gender: formData.gender || 'Мужской',
      birthYear: formData.birthYear || '',
      passportSeries: formData.passportSeries || 'ID',
      passportNumber: formData.passportNumber || '',
      passportIssuedBy: formData.passportIssuedBy || '',
      passportIssueDate: formData.passportIssueDate || '',
      pensionNumber: formData.pensionNumber || '',
      pensionIssueDate: formData.pensionIssueDate || '',
      pensionIssuedBy: formData.pensionIssuedBy || '',
      registrationAddress: formData.registrationAddress || '',
      actualAddress: formData.actualAddress || '',
      addressSameAsRegistration: formData.addressSameAsRegistration || false,
      phone: formData.phone || '',
      additionalPhone: formData.additionalPhone || '',
      workplace: formData.workplace || '',
      disabilityCategory: formData.disabilityCategory || 'ЛОВЗ до 18 лет',
      disabilityGroup: formData.disabilityGroup || '3 группа',
      disabilityReason: formData.disabilityReason || undefined,
      operationInfo: formData.operationInfo || '',
      additions: formData.additions || '',
      registrationDate: formData.registrationDate || new Date().toISOString().split('T')[0],
      status: formData.status || 'активный',
      services: formData.services || [],
      directions: formData.directions || [],
      prostheticsData: formData.prostheticsData
    };

    onSave(personalFileData);
  };

  const handleInputChange = (field: keyof PersonalFile, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Заголовок */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {personalFile ? 'Редактирование личного дела' : 'Создание нового личного дела'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Номер личного дела */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              № личного дела
            </label>
            <input
              type="text"
              value={formData.personalFileNumber}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Формат: ГОД-НОМЕР ДЕЛА (ХХХХ-ХХХХ)</p>
          </div>

          {/* Личные данные */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Личные данные</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ПИН <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.pin}
                  onChange={(e) => handleInputChange('pin', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.pin ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Введите ПИН"
                />
                {errors.pin && <p className="text-red-500 text-sm mt-1">{errors.pin}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Документ <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.documentType}
                  onChange={(e) => handleInputChange('documentType', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.documentType ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="Паспорт">Паспорт</option>
                  <option value="Свидетельство о рождении">Свидетельство о рождении</option>
                </select>
                {errors.documentType && <p className="text-red-500 text-sm mt-1">{errors.documentType}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Фамилия <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.lastName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Введите фамилию"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Имя <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.firstName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Введите имя"
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Отчество
                </label>
                <input
                  type="text"
                  value={formData.middleName}
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
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.gender ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="Мужской">Мужской</option>
                  <option value="Женский">Женский</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Год рождения <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.birthYear}
                  onChange={(e) => handleInputChange('birthYear', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.birthYear ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Год рождения"
                  min="1900"
                  max={new Date().getFullYear()}
                />
                {errors.birthYear && <p className="text-red-500 text-sm mt-1">{errors.birthYear}</p>}
              </div>
            </div>
          </div>

          {/* Документы */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Документы</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Серия <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.passportSeries}
                  onChange={(e) => handleInputChange('passportSeries', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.passportSeries ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="ID">ID</option>
                  <option value="AC">AC</option>
                  <option value="AN">AN</option>
                  <option value="KGZ01">KGZ01</option>
                  <option value="KR-X">KR-X</option>
                </select>
                {errors.passportSeries && <p className="text-red-500 text-sm mt-1">{errors.passportSeries}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  № Паспорта <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.passportNumber}
                  onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.passportNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Номер паспорта"
                />
                {errors.passportNumber && <p className="text-red-500 text-sm mt-1">{errors.passportNumber}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Орган выдачи <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.passportIssuedBy}
                  onChange={(e) => handleInputChange('passportIssuedBy', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.passportIssuedBy ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Орган выдачи паспорта"
                />
                {errors.passportIssuedBy && <p className="text-red-500 text-sm mt-1">{errors.passportIssuedBy}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дата выдачи <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.passportIssueDate}
                  onChange={(e) => handleInputChange('passportIssueDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.passportIssueDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.passportIssueDate && <p className="text-red-500 text-sm mt-1">{errors.passportIssueDate}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  № Пенсионного удостоверения
                </label>
                <input
                  type="text"
                  value={formData.pensionNumber}
                  onChange={(e) => handleInputChange('pensionNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Номер пенсионного удостоверения"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дата выдачи пенсионного
                </label>
                <input
                  type="date"
                  value={formData.pensionIssueDate}
                  onChange={(e) => handleInputChange('pensionIssueDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Орган выдачи пенсионного
                </label>
                <input
                  type="text"
                  value={formData.pensionIssuedBy}
                  onChange={(e) => handleInputChange('pensionIssuedBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Орган выдачи пенсионного удостоверения"
                />
              </div>
            </div>
          </div>

          {/* Адреса */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Адреса</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Адрес (по прописке) <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.registrationAddress}
                  onChange={(e) => handleInputChange('registrationAddress', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.registrationAddress ? 'border-red-300' : 'border-gray-300'
                  }`}
                  rows={2}
                  placeholder="Область/Район/село, город/Улица, дом, кв."
                />
                {errors.registrationAddress && <p className="text-red-500 text-sm mt-1">{errors.registrationAddress}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Адрес (фактический) <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.actualAddress}
                  onChange={(e) => handleInputChange('actualAddress', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.actualAddress ? 'border-red-300' : 'border-gray-300'
                  }`}
                  rows={2}
                  placeholder="Область/Район/село, город/Улица, дом, кв."
                />
                {errors.actualAddress && <p className="text-red-500 text-sm mt-1">{errors.actualAddress}</p>}
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="addressSameAsRegistration"
                  checked={formData.addressSameAsRegistration}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData(prev => ({
                      ...prev,
                      addressSameAsRegistration: checked,
                      actualAddress: checked ? prev.registrationAddress : prev.actualAddress
                    }));
                    if (errors.addressSameAsRegistration) {
                      setErrors(prev => ({ ...prev, addressSameAsRegistration: '' }));
                    }
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="addressSameAsRegistration" className="ml-2 block text-sm text-gray-700">
                  Совпадает с пропиской
                </label>
              </div>
            </div>
          </div>

          {/* Контакты */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Контакты</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Номер телефона
                </label>
                <input
                  type="tel"
                  value={formData.phone}
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
                  value={formData.additionalPhone}
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
                  value={formData.workplace}
                  onChange={(e) => handleInputChange('workplace', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Место работы"
                />
              </div>
            </div>
          </div>

          {/* Медицинская информация */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Медицинская информация</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Категория инвалидности <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.disabilityCategory}
                  onChange={(e) => handleInputChange('disabilityCategory', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.disabilityCategory ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="ЛОВЗ до 18 лет">ЛОВЗ до 18 лет</option>
                  <option value="ЛОВЗ с детства">ЛОВЗ с детства</option>
                  <option value="Инвалид ВОВ">Инвалид ВОВ</option>
                  <option value="Инвалид советской армии">Инвалид советской армии</option>
                  <option value="Инвалид труда">Инвалид труда</option>
                </select>
                {errors.disabilityCategory && <p className="text-red-500 text-sm mt-1">{errors.disabilityCategory}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Группа инвалидности <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.disabilityGroup}
                  onChange={(e) => handleInputChange('disabilityGroup', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.disabilityGroup ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="1 группа">1 группа</option>
                  <option value="2 группа">2 группа</option>
                  <option value="3 группа">3 группа</option>
                </select>
                {errors.disabilityGroup && <p className="text-red-500 text-sm mt-1">{errors.disabilityGroup}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Причина инвалидности
                </label>
                <select
                  value={formData.disabilityReason}
                  onChange={(e) => handleInputChange('disabilityReason', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Выберите причину</option>
                  <option value="Травма">Травма</option>
                  <option value="Врожденный">Врожденный</option>
                  <option value="Заболевание">Заболевание</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Где и когда оперирован
              </label>
              <textarea
                value={formData.operationInfo}
                onChange={(e) => handleInputChange('operationInfo', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Укажите информацию об операциях"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дополнения
              </label>
              <textarea
                value={formData.additions}
                onChange={(e) => handleInputChange('additions', e.target.value)}
                rows={3}
                maxLength={255}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Дополнительная информация (до 255 символов)"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.additions?.length || 0}/255 символов
              </p>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {personalFile ? 'Сохранить изменения' : 'Создать личное дело'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalFileForm;
