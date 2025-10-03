import React, { useState, useEffect } from 'react';
import { Printer, X, Plus, Trash2 } from 'lucide-react';
import { ProsthesisPrintBlank, ProsthesisPrintComponent } from '../types/printBlank';
import { prosthesisSemiFinished, prosthesisCodes } from '../data/printReferences';

interface ProsthesisPrintBlankProps {
  orderId: string;
  clientData: {
    pin: string;
    fullName: string;
    documentType: string;
    documentNumber: string;
    birthYear: number;
    gender: string;
  };
  diagnosis: string;
  productType: string;
  onClose: () => void;
  onPrint: (blank: ProsthesisPrintBlank) => void;
}

const ProsthesisPrintBlankComponent: React.FC<ProsthesisPrintBlankProps> = ({
  orderId,
  clientData,
  diagnosis,
  productType,
  onClose,
  onPrint
}) => {
  const [components, setComponents] = useState<ProsthesisPrintComponent[]>([
    {
      id: '1',
      name: 'Шины',
      code: 'ПБ-001',
      size: '',
      leftQuantity: 0,
      rightQuantity: 0,
      needsCast: false
    }
  ]);

  const [clientPhoto, setClientPhoto] = useState<string>('');

  const handleAddComponent = () => {
    const newComponent: ProsthesisPrintComponent = {
      id: `component_${Date.now()}`,
      name: 'Шины',
      code: 'ПБ-001',
      size: '',
      leftQuantity: 0,
      rightQuantity: 0,
      needsCast: false
    };
    setComponents([...components, newComponent]);
  };

  const handleRemoveComponent = (id: string) => {
    if (components.length > 1) {
      setComponents(components.filter(comp => comp.id !== id));
    }
  };

  const handleComponentChange = (id: string, field: keyof ProsthesisPrintComponent, value: any) => {
    setComponents(components.map(comp => 
      comp.id === id ? { ...comp, [field]: value } : comp
    ));
  };

  const handlePrint = () => {
    const printBlank: ProsthesisPrintBlank = {
      id: `blank_${Date.now()}`,
      orderId,
      orderType: 'prosthesis',
      printDate: new Date().toISOString(),
      printedBy: 'Текущий пользователь',
      clientData,
      orderData: {
        diagnosis,
        productType,
        components
      },
      clientPhoto
    };

    onPrint(printBlank);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setClientPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Бланк заказа на изготовление протеза</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Левая колонка - Личные данные и данные заказа */}
            <div className="space-y-6">
              {/* Личные данные заказчика */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Личные данные заказчика</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ПИН</label>
                    <p className="mt-1 text-sm text-gray-900">{clientData.pin}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ФИО</label>
                    <p className="mt-1 text-sm text-gray-900">{clientData.fullName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Документ</label>
                    <p className="mt-1 text-sm text-gray-900">{clientData.documentType} {clientData.documentNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Год рождения</label>
                    <p className="mt-1 text-sm text-gray-900">{clientData.birthYear}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Пол</label>
                    <p className="mt-1 text-sm text-gray-900">{clientData.gender}</p>
                  </div>
                </div>
              </div>

              {/* Данные заказа */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Данные заказа</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Диагноз</label>
                    <p className="mt-1 text-sm text-gray-900">{diagnosis}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Вид изделия</label>
                    <p className="mt-1 text-sm text-gray-900">{productType}</p>
                  </div>
                </div>
              </div>

              {/* Полуфабрикаты */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Полуфабрикаты</h3>
                  <button
                    onClick={handleAddComponent}
                    className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Добавить
                  </button>
                </div>
                
                <div className="space-y-4">
                  {components.map((component, index) => (
                    <div key={component.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">Полуфабрикат {index + 1}</h4>
                        {components.length > 1 && (
                          <button
                            onClick={() => handleRemoveComponent(component.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Наименование</label>
                          <select
                            value={component.name}
                            onChange={(e) => handleComponentChange(component.id, 'name', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                          >
                            {prosthesisSemiFinished.map(semi => (
                              <option key={semi} value={semi}>{semi}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Шифр</label>
                          <select
                            value={component.code}
                            onChange={(e) => handleComponentChange(component.id, 'code', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                          >
                            {prosthesisCodes.map(code => (
                              <option key={code} value={code}>{code}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Размер</label>
                          <input
                            type="text"
                            value={component.size}
                            onChange={(e) => handleComponentChange(component.id, 'size', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            placeholder="Введите размер"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Слепок</label>
                          <select
                            value={component.needsCast ? 'Да' : 'Нет'}
                            onChange={(e) => handleComponentChange(component.id, 'needsCast', e.target.value === 'Да')}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                          >
                            <option value="Нет">Нет</option>
                            <option value="Да">Да</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Левый (кол-во)</label>
                          <input
                            type="number"
                            min="0"
                            value={component.leftQuantity}
                            onChange={(e) => handleComponentChange(component.id, 'leftQuantity', parseInt(e.target.value) || 0)}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Правый (кол-во)</label>
                          <input
                            type="number"
                            min="0"
                            value={component.rightQuantity}
                            onChange={(e) => handleComponentChange(component.id, 'rightQuantity', parseInt(e.target.value) || 0)}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Правая колонка - Фото клиента */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Фото клиента</h3>
                <div className="space-y-4">
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  
                  {clientPhoto && (
                    <div className="mt-4">
                      <img
                        src={clientPhoto}
                        alt="Фото клиента"
                        className="w-full h-64 object-cover rounded-lg border border-gray-300"
                      />
                    </div>
                  )}
                  
                  {!clientPhoto && (
                    <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Фото не загружено</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Printer className="h-4 w-4 mr-2" />
              Печать бланка
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProsthesisPrintBlankComponent;
