import React, { useState } from 'react';
import { PersonalFile, ServiceDirection, ProstheticsData } from '../types/personalFile';
import { WorkOrder } from '../types/orders';
import ServiceDirections from './ServiceDirections';
import ProstheticsDataComponent from './ProstheticsData';
import PersonalDataEdit from './PersonalDataEdit';
// Удалены неиспользуемые импорты ServiceDirectionsEdit и ProstheticsDataEdit
import OrdersTable from './OrdersTable';
import OrderForm from './OrderForm';
import ProsthesisOrdersView from './ProsthesisOrdersView';
import { diagnoses, availableComponents } from '../data';
import { adaptWorkOrderToProsthesisOrder } from '../utils/orderAdapters';
import { X, User, Calendar, Phone, MapPin, FileText, Clock, CheckCircle, XCircle, Edit, Package } from 'lucide-react';

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
      directions: [...currentPersonalFile.directions, newDirection]
    };
    
    setCurrentPersonalFile(updatedFile);
    onUpdatePersonalFile(currentPersonalFile.id, { directions: updatedFile.directions });
  };

  const handleEditDirection = (id: string, direction: Omit<ServiceDirection, 'id'>) => {
    const updatedDirections = currentPersonalFile.directions.map(dir =>
      dir.id === id ? { ...direction, id } : dir
    );
    
    const updatedFile = {
      ...currentPersonalFile,
      directions: updatedDirections
    };
    
    setCurrentPersonalFile(updatedFile);
    onUpdatePersonalFile(currentPersonalFile.id, { directions: updatedDirections });
  };

  const handleDeleteDirection = (id: string) => {
    const updatedDirections = currentPersonalFile.directions.filter(dir => dir.id !== id);
    
    const updatedFile = {
      ...currentPersonalFile,
      directions: updatedDirections
    };
    
    setCurrentPersonalFile(updatedFile);
    onUpdatePersonalFile(currentPersonalFile.id, { directions: updatedDirections });
  };

  const handleSaveProstheticsData = (prostheticsData: ProstheticsData) => {
    const updatedFile = {
      ...currentPersonalFile,
      prostheticsData
    };
    
    setCurrentPersonalFile(updatedFile);
    onUpdatePersonalFile(currentPersonalFile.id, { prostheticsData });
  };

  const handleEditBlock = (blockName: string) => {
    // Только для личных данных
    if (blockName === 'personalData') {
      setEditingBlock(blockName);
    }
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

  const handleNewWorkOrder = () => {
    setEditingOrder(null);
    setShowOrderForm(true);
  };

  const handleViewWorkOrder = (order: WorkOrder) => {
    setEditingOrder(order);
    setShowOrderForm(true);
  };

  const handleEditWorkOrder = (order: WorkOrder) => {
    setEditingOrder(order);
    setShowOrderForm(true);
  };

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

  const handleViewProsthesisOrder = (order: any) => {
    // Здесь можно открыть модальное окно с детальной информацией о заказе
    // или перейти на страницу заказов протеза
    console.log('Просмотр заказа протеза:', order);
  };

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
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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

        <div className="p-6 space-y-6">
          {/* Основная информация */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
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
              </div>
            </div>

            <div className="space-y-4">
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
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Адрес по прописке</p>
                    <p className="text-sm text-gray-900">{currentPersonalFile.registrationAddress}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Фактический адрес</p>
                    <p className="text-sm text-gray-900">{currentPersonalFile.actualAddress}</p>
                  </div>
                </div>
                
                {currentPersonalFile.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Телефон</p>
                      <p className="text-sm text-gray-900">{currentPersonalFile.phone}</p>
                    </div>
                  </div>
                )}
                
                {currentPersonalFile.additionalPhone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Доп. телефон</p>
                      <p className="text-sm text-gray-900">{currentPersonalFile.additionalPhone}</p>
                    </div>
                  </div>
                )}
                
                {currentPersonalFile.workplace && (
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Место работы</p>
                      <p className="text-sm text-gray-900">{currentPersonalFile.workplace}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Медицинская информация */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Медицинская информация</h3>
              <button
                onClick={() => handleEditBlock('personalData')}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Редактировать</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Категория инвалидности</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{currentPersonalFile.disabilityCategory}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Группа инвалидности</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{currentPersonalFile.disabilityGroup}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Дата регистрации</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {new Date(currentPersonalFile.registrationDate).toLocaleDateString('ru-RU')}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Статус дела</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{currentPersonalFile.status}</p>
              </div>
            </div>
            
            {currentPersonalFile.disabilityReason && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Причина инвалидности</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{currentPersonalFile.disabilityReason}</p>
              </div>
            )}
            
            {currentPersonalFile.operationInfo && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Где и когда оперирован</p>
                <p className="text-sm text-gray-900 mt-1">{currentPersonalFile.operationInfo}</p>
              </div>
            )}
            
            {currentPersonalFile.additions && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Дополнения</p>
                <p className="text-sm text-gray-900 mt-1">{currentPersonalFile.additions}</p>
              </div>
            )}
          </div>

                {/* Данные по протезированию */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Данные по протезированию</h3>
                  <ProstheticsDataComponent
                    prostheticsData={currentPersonalFile.prostheticsData}
                    onSave={handleSaveProstheticsData}
                    onCancel={() => {}}
                  />
                </div>

          {/* Направления на услуги */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Направления на услуги</h3>
            <ServiceDirections
              directions={currentPersonalFile.directions || []}
              onAddDirection={handleAddDirection}
              onEditDirection={handleEditDirection}
              onDeleteDirection={handleDeleteDirection}
            />
          </div>

                {/* Заказы на изготовление протеза */}
                <ProsthesisOrdersView
                  orders={workOrders
                    .filter(order => 
                      order.personalFileId === currentPersonalFile.id && 
                      order.orderType === 'Заказ на изготовление протеза'
                    )
                    .map(adaptWorkOrderToProsthesisOrder)
                    .filter((order): order is NonNullable<typeof order> => order !== null)
                  }
                  onViewOrder={handleViewProsthesisOrder}
                />

                {/* Другие заказы и наряды */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Другие заказы и наряды ({workOrders.filter(order => 
                        order.personalFileId === currentPersonalFile.id && 
                        order.orderType !== 'Заказ на изготовление протеза'
                      ).length})
                    </h3>
                    <button
                      onClick={handleNewWorkOrder}
                      className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <Package className="w-4 h-4" />
                      <span>Новый заказ/наряд</span>
                    </button>
                  </div>
                  <OrdersTable
                    orders={workOrders}
                    onNewOrder={handleNewWorkOrder}
                    onViewOrder={handleViewWorkOrder}
                    onEditOrder={handleEditWorkOrder}
                    personalFileId={currentPersonalFile.id}
                  />
                </div>

          {/* История услуг */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              История оказания услуг ({currentPersonalFile.services.length})
            </h3>
            
            {currentPersonalFile.services.length > 0 ? (
              <div className="space-y-3">
                {currentPersonalFile.services.map((service) => (
                  <div key={service.id} className="border border-gray-200 rounded-lg p-4">
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

        </div>
      </div>
    </div>
  );
};

export default PersonalFileDetails;
