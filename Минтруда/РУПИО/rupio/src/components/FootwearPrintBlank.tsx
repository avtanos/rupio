import React, { useState } from 'react';
import { Printer, X } from 'lucide-react';
import { FootwearPrintBlank, FootwearMeasurements } from '../types/printBlank';
import { 
  footwearDescriptions, 
  footwearProductNames, 
  footwearColors, 
  footwearFastenings, 
  footwearSoles,
  footwearDetailedDescriptions 
} from '../data/printReferences';

interface FootwearPrintBlankProps {
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
  onClose: () => void;
  onPrint: (blank: FootwearPrintBlank) => void;
}

const FootwearPrintBlankComponent: React.FC<FootwearPrintBlankProps> = ({
  orderId,
  clientData,
  diagnosis,
  onClose,
  onPrint
}) => {
  const [formData, setFormData] = useState({
    productDescription: 'круговой жесткий корсет с обеих сторон до носка',
    productName: 'ортботинки из хрома без меха',
    color: 'черный',
    fasteningType: 'на шнуровке',
    soleType: 'микропористая',
    needsCast: false
  });

  const [measurements, setMeasurements] = useState<FootwearMeasurements>({
    archSize: '',
    pronatorSize: '',
    footSize: '',
    shorteningSize: '',
    heelPlugSize: ''
  });

  const [clientPhoto, setClientPhoto] = useState<string>('');

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMeasurementChange = (field: keyof FootwearMeasurements, value: string) => {
    setMeasurements(prev => ({ ...prev, [field]: value }));
  };

  const handlePrint = () => {
    const printBlank: FootwearPrintBlank = {
      type: 'footwear',
      id: `blank_${Date.now()}`,
      orderId,
      orderType: 'footwear',
      printDate: new Date().toISOString(),
      printedBy: 'Текущий пользователь',
      clientData,
      diagnosis,
      orderData: {
        diagnosis,
        productDescription: formData.productDescription,
        productName: formData.productName,
        color: formData.color,
        fasteningType: formData.fasteningType,
        soleType: formData.soleType,
        measurements,
        needsCast: formData.needsCast
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

  const selectedDescriptionDetails = footwearDetailedDescriptions[formData.productDescription as keyof typeof footwearDetailedDescriptions] || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Бланк заказа на изготовление ортобуви</h2>
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
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Диагноз</label>
                    <p className="mt-1 text-sm text-gray-900">{diagnosis}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Описание изделия</label>
                    <select
                      value={formData.productDescription}
                      onChange={(e) => handleInputChange('productDescription', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      {footwearDescriptions.map(desc => (
                        <option key={desc} value={desc}>{desc}</option>
                      ))}
                    </select>
                    
                    {/* Детальное описание */}
                    {selectedDescriptionDetails.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700 mb-1">Детали:</p>
                        <ul className="text-sm text-gray-600 list-disc list-inside">
                          {selectedDescriptionDetails.map((detail, index) => (
                            <li key={index}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Наименование изделия</label>
                    <select
                      value={formData.productName}
                      onChange={(e) => handleInputChange('productName', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      {footwearProductNames.map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Цвет</label>
                      <select
                        value={formData.color}
                        onChange={(e) => handleInputChange('color', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      >
                        {footwearColors.map(color => (
                          <option key={color} value={color}>{color}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Вид крепления</label>
                      <select
                        value={formData.fasteningType}
                        onChange={(e) => handleInputChange('fasteningType', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      >
                        {footwearFastenings.map(fastening => (
                          <option key={fastening} value={fastening}>{fastening}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Вид подошвы</label>
                    <select
                      value={formData.soleType}
                      onChange={(e) => handleInputChange('soleType', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      {footwearSoles.map(sole => (
                        <option key={sole} value={sole}>{sole}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Слепок (гипс)</label>
                    <select
                      value={formData.needsCast ? 'Да' : 'Нет'}
                      onChange={(e) => handleInputChange('needsCast', e.target.value === 'Да')}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="Нет">Нет</option>
                      <option value="Да">Да</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Размеры */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Размеры</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Размер вкладки свода</label>
                    <input
                      type="text"
                      value={measurements.archSize}
                      onChange={(e) => handleMeasurementChange('archSize', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      placeholder="Введите размер"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Размер пронатора</label>
                    <input
                      type="text"
                      value={measurements.pronatorSize}
                      onChange={(e) => handleMeasurementChange('pronatorSize', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      placeholder="Введите размер"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Размер стопы</label>
                    <input
                      type="text"
                      value={measurements.footSize}
                      onChange={(e) => handleMeasurementChange('footSize', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      placeholder="Введите размер"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Размер укорочения</label>
                    <input
                      type="text"
                      value={measurements.shorteningSize}
                      onChange={(e) => handleMeasurementChange('shorteningSize', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      placeholder="Введите размер"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Размер пробки по пяту</label>
                    <input
                      type="text"
                      value={measurements.heelPlugSize}
                      onChange={(e) => handleMeasurementChange('heelPlugSize', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      placeholder="Введите размер"
                    />
                  </div>
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

export default FootwearPrintBlankComponent;
