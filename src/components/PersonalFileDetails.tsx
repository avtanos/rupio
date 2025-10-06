import React, { useState } from 'react';
import { PersonalFile, ServiceDirection, ProstheticsData, ServiceRecord } from '../types/personalFile';
import { WorkOrder } from '../types/orders';
import ServiceDirections from './ServiceDirections';
import ProstheticsDataComponent from './ProstheticsData';
import PersonalDataEdit from './PersonalDataEdit';
// Удалены неиспользуемые импорты ServiceDirectionsEdit и ProstheticsDataEdit
import OrdersTable from './OrdersTable';
import OrderForm from './OrderForm';
// import ProsthesisOrdersView from './ProsthesisOrdersView';
import { diagnoses, availableComponents } from '../data';
// import { adaptWorkOrderToProsthesisOrder } from '../utils/orderAdapters';
import { X, User, Calendar, Phone, MapPin, FileText, Clock, CheckCircle, XCircle, Edit, Package, Heart, Stethoscope, History } from 'lucide-react';

interface PersonalFileDetailsProps {
  personalFile: PersonalFile;
  onClose: () => void;
  onEdit: (personalFile: PersonalFile) => void;
  onUpdatePersonalFile: (id: string, updates: Partial<PersonalFile>) => void;
  workOrders?: WorkOrder[];
  onNewWorkOrder?: (workOrder: WorkOrder) => void;
  onUpdateWorkOrder?: (id: string, updates: Partial<WorkOrder>) => void;
}

const PersonalFileDetails: React.FC<PersonalFileDetailsProps> = ({
  personalFile,
  onClose,
  onEdit,
  onUpdatePersonalFile,
  workOrders = [],
  onNewWorkOrder,
  onUpdateWorkOrder
}) => {
  const [currentPersonalFile, setCurrentPersonalFile] = useState<PersonalFile>(personalFile);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<WorkOrder | null>(null);
  const [activeTab, setActiveTab] = useState('basic');

  // Обновляем локальное состояние при изменении пропса
  React.useEffect(() => {
    setCurrentPersonalFile(personalFile);
  }, [personalFile]);

  const handleAddDirection = (direction: Omit<ServiceDirection, 'id'>) => {
    const newDirection: ServiceDirection = {
      ...direction,
      id: `D${Date.now()}`
    };
    
    const updatedFile = {
      ...currentPersonalFile,
      directions: [...(currentPersonalFile.directions || []), newDirection]
    };
    
    setCurrentPersonalFile(updatedFile);
    onUpdatePersonalFile(currentPersonalFile.id, { directions: updatedFile.directions });
  };

  const handleUpdateDirection = (id: string, updates: Partial<ServiceDirection>) => {
    const updatedDirections = (currentPersonalFile.directions || []).map((direction: ServiceDirection) =>
      direction.id === id ? { ...direction, ...updates } : direction
    );
    
    const updatedFile = {
      ...currentPersonalFile,
      directions: updatedDirections
    };
    
    setCurrentPersonalFile(updatedFile);
    onUpdatePersonalFile(currentPersonalFile.id, { directions: updatedDirections });
  };

  const handleDeleteDirection = (id: string) => {
    const updatedDirections = (currentPersonalFile.directions || []).filter((direction: ServiceDirection) => direction.id !== id);
    
    const updatedFile = {
      ...currentPersonalFile,
      directions: updatedDirections
    };
    
    setCurrentPersonalFile(updatedFile);
    onUpdatePersonalFile(currentPersonalFile.id, { directions: updatedDirections });
  };

  const handleUpdateProstheticsData = (data: ProstheticsData) => {
    const updatedFile = {
      ...currentPersonalFile,
      prostheticsData: data
    };
    
    setCurrentPersonalFile(updatedFile);
    onUpdatePersonalFile(currentPersonalFile.id, { prostheticsData: data });
  };

  const handleEditBlock = (block: string) => {
    setEditingBlock(block);
  };

  const handleSavePersonalData = (updates: Partial<PersonalFile>) => {
    const updatedFile = {
      ...currentPersonalFile,
      ...updates
    };
    
    setCurrentPersonalFile(updatedFile);
    onUpdatePersonalFile(currentPersonalFile.id, updates);
    setEditingBlock(null);
  };

  // Удалены неиспользуемые обработчики для направлений и данных протезирования

  const handleCancelEdit = () => {
    setEditingBlock(null);
  };

  // Удалены неиспользуемые функции для устранения ESLint ошибок
  // const handleNewWorkOrder = () => {
  //   setEditingOrder(null);
  //   setShowOrderForm(true);
  // };

  // const handleViewWorkOrder = (order: WorkOrder) => {
  //   setEditingOrder(order);
  //   setShowOrderForm(true);
  // };

  // const handleEditWorkOrder = (order: WorkOrder) => {
  //   setEditingOrder(order);
  //   setShowOrderForm(true);
  // };

  const handleSaveWorkOrder = (workOrder: WorkOrder) => {
    if (editingOrder) {
      onUpdateWorkOrder?.(workOrder.id, workOrder);
    } else {
      onNewWorkOrder?.(workOrder);
    }
    setShowOrderForm(false);
    setEditingOrder(null);
  };

  const handleCancelOrderForm = () => {
    setShowOrderForm(false);
    setEditingOrder(null);
  };

  // Удалена неиспользуемая функция handleViewProsthesisOrder для устранения ESLint ошибки
  // const handleViewProsthesisOrder = (order: any) => {
  //   // Здесь можно открыть модальное окно с детальной информацией о заказе
  //   // или перейти на страницу заказов протеза
  // };

  const getServiceStatusIcon = (status: string) => {
    switch (status) {
      case 'завершен':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'в_процессе':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'отменен':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case 'завершен':
        return 'bg-green-100 text-green-800';
      case 'в_процессе':
        return 'bg-yellow-100 text-yellow-800';
      case 'отменен':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'basic', label: 'Основная информация', icon: User },
    { id: 'contact', label: 'Контактная информация', icon: Phone },
    { id: 'medical', label: 'Медицинская информация', icon: Heart },
    { id: 'prosthetics', label: 'Данные по протезированию', icon: Package },
    { id: 'services', label: 'Направления на услуги', icon: Stethoscope },
    { id: 'orders', label: 'Заказы и наряды', icon: Clock },
    { id: 'history', label: 'История оказания услуг', icon: History }
  ];

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Основная информация</h3>
        <button
          onClick={() => handleEditBlock('personalData')}
          className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <Edit className="w-4 h-4" />
          <span>Редактировать</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">ФИО</p>
              <p className="text-sm text-gray-900">
                {currentPersonalFile.lastName} {currentPersonalFile.firstName} {currentPersonalFile.middleName}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Год рождения</p>
              <p className="text-sm text-gray-900">{currentPersonalFile.birthYear}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Пол</p>
              <p className="text-sm text-gray-900">{currentPersonalFile.gender}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">ПИН</p>
              <p className="text-sm text-gray-900">{currentPersonalFile.pin}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Документ</p>
              <p className="text-sm text-gray-900">{currentPersonalFile.documentType}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Серия и номер паспорта</p>
              <p className="text-sm text-gray-900">
                {currentPersonalFile.passportSeries} {currentPersonalFile.passportNumber}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Контактная информация</h3>
        <button
          onClick={() => handleEditBlock('personalData')}
          className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <Edit className="w-4 h-4" />
          <span>Редактировать</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Телефон</p>
              <p className="text-sm text-gray-900">{currentPersonalFile.phone || 'Не указан'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Дополнительный телефон</p>
              <p className="text-sm text-gray-900">{currentPersonalFile.additionalPhone || 'Не указан'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Место работы</p>
              <p className="text-sm text-gray-900">{currentPersonalFile.workplace || 'Не указано'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Адрес по прописке</p>
              <p className="text-sm text-gray-900">{currentPersonalFile.registrationAddress}</p>
            </div>
          </div>
          
          {!currentPersonalFile.addressSameAsRegistration && (
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Фактический адрес</p>
                <p className="text-sm text-gray-900">{currentPersonalFile.actualAddress}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderMedicalInfo = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Медицинская информация</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700">Категория инвалидности</p>
            <p className="text-sm text-gray-900">{currentPersonalFile.disabilityCategory || 'Не указана'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-700">Группа инвалидности</p>
            <p className="text-sm text-gray-900">{currentPersonalFile.disabilityGroup || 'Не указана'}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700">Причина инвалидности</p>
            <p className="text-sm text-gray-900">{currentPersonalFile.disabilityReason || 'Не указана'}</p>
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-3 space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700">Где и когда оперирован</p>
            <p className="text-sm text-gray-900">{currentPersonalFile.operationInfo || 'Не указано'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-700">Дополнительная информация</p>
            <p className="text-sm text-gray-900">{currentPersonalFile.additions || 'Не указано'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProstheticsInfo = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Данные по протезированию</h3>
      </div>
      
      <ProstheticsDataComponent
        prostheticsData={currentPersonalFile.prostheticsData}
        onSave={(data: ProstheticsData) => handleUpdateProstheticsData(data)}
        onCancel={() => {}}
      />
    </div>
  );

  const renderServicesInfo = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Направления на услуги</h3>
      </div>
      
      <ServiceDirections
        directions={currentPersonalFile.directions || []}
        onAddDirection={handleAddDirection}
        onEditDirection={(id: string, direction: Omit<ServiceDirection, 'id'>) => handleUpdateDirection(id, direction)}
        onDeleteDirection={handleDeleteDirection}
      />
    </div>
  );

  const renderOrdersInfo = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Заказы и наряды</h3>
      </div>
      
      <OrdersTable
        orders={workOrders}
      />
    </div>
  );

  const renderHistoryInfo = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">История оказания услуг</h3>
      </div>
      
      {currentPersonalFile.services && currentPersonalFile.services.length > 0 ? (
        <div className="space-y-4">
          {currentPersonalFile.services.map((service: ServiceRecord, index: number) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  {getServiceStatusIcon(service.status)}
                  <h4 className="font-medium text-gray-900">{service.serviceType}</h4>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getServiceStatusColor(service.status)}`}>
                  {service.status}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{service.serviceDescription}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Дата услуги</p>
                  <p className="font-medium">{new Date(service.serviceDate).toLocaleDateString('ru-RU')}</p>
                </div>
                {service.orderNumber && (
                  <div>
                    <p className="text-gray-500">Номер заказа</p>
                    <p className="font-medium">{service.orderNumber}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-500">Ответственный</p>
                  <p className="font-medium">{service.responsiblePerson}</p>
                </div>
              </div>
              
              {service.notes && (
                <div className="mt-2 p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500">Примечания:</p>
                  <p className="text-sm text-gray-700">{service.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Услуги не оказывались</h3>
          <p className="mt-1 text-sm text-gray-500">
            История оказания услуг будет отображаться здесь по мере поступления заказов.
          </p>
        </div>
      )}
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
      case 'history':
        return renderHistoryInfo();
      default:
        return renderBasicInfo();
    }
  };

  // Если открыт режим редактирования блока, показываем соответствующую форму
  if (editingBlock === 'personalData') {
    return (
      <PersonalDataEdit
        personalFile={currentPersonalFile}
        onSave={handleSavePersonalData}
        onCancel={handleCancelEdit}
      />
    );
  }

  // Удалены условные рендеры для редактирования направлений и данных протезирования

  // Если открыта форма заказов
  if (showOrderForm) {
    return (
      <OrderForm
        order={editingOrder || undefined}
        personalFile={currentPersonalFile}
        onSave={handleSaveWorkOrder}
        onCancel={handleCancelOrderForm}
        diagnoses={diagnoses}
        availableComponents={availableComponents}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Заголовок */}
        <div className="flex justify-between items-start p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Личное дело {currentPersonalFile.personalFileNumber}
            </h2>
            <p className="text-gray-600 mt-1">
              {currentPersonalFile.lastName} {currentPersonalFile.firstName} {currentPersonalFile.middleName}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Вкладки */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
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

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default PersonalFileDetails;