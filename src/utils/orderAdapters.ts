import { WorkOrder } from '../types/orders';
import { ProsthesisOrder, ProsthesisDiagnosis, ProsthesisOrderType } from '../types/prosthesisOrder';
import { FootwearOrder, FootwearDiagnosis } from '../types/footwearOrder';
import { OttobockOrder, OttobockProductType, OttobockDiagnosis, OttobockSide, OttobockOrderType, OttobockOrderStatus, OttobockServiceType } from '../types/ottobockOrder';
import { OrthosisOrder, OrthosisProductType, OrthosisDiagnosis, OrthosisSide, OrthosisOrderType, OrthosisOrderStatus, OrthosisServiceType } from '../types/orthosisOrder';
import { RepairOrder, RepairProductType, RepairOrderStatus, RepairServiceType } from '../types/repairOrder';
import { ReadyPoiOrder, ReadyPoiProductType, ReadyPoiDiagnosis, ReadyPoiOrderType, ReadyPoiOrderStatus, ReadyPoiServiceType } from '../types/readyPoiOrder';

export const adaptWorkOrderToProsthesisOrder = (workOrder: WorkOrder): ProsthesisOrder | null => {
  // Проверяем, что это заказ на изготовление протеза
  if (workOrder.orderType !== 'Заказ на изготовление протеза') {
    return null;
  }

  // Создаем базовый диагноз, если его нет
  const defaultDiagnosis: ProsthesisDiagnosis = {
    id: 'default',
    category: 'Ампутация нижней конечности',
    name: 'Не указан',
    code: 'N/A'
  };

  return {
    id: workOrder.id,
    orderNumber: workOrder.orderNumber,
    orderDate: workOrder.orderDate,
    personalFileId: workOrder.personalFileId,
    clientName: workOrder.clientName,
    disabilityGroup: workOrder.disabilityGroup,
    disabilityCategory: workOrder.disabilityCategory,
    prosthesisType: 'Протез', // Значение по умолчанию
    diagnosis: defaultDiagnosis,
    side: 'Правый', // Значение по умолчанию
    isHospitalized: false,
    orderType: 'Первичный' as ProsthesisOrderType, // Значение по умолчанию
    weight: undefined,
    height: undefined,
    activityLevel: undefined,
    status: 'Обычный', // Значение по умолчанию
    urgencyReason: undefined,
    serviceType: 'Бесплатная', // Значение по умолчанию
    components: [],
    fittings: [],
    manufacturingDate: workOrder.manufacturingDate,
    issueDate: workOrder.issueDate,
    createdBy: workOrder.createdBy,
    createdAt: workOrder.createdAt,
    updatedAt: workOrder.updatedAt,
    notes: workOrder.notes
  };
};

export const adaptProsthesisOrderToWorkOrder = (prosthesisOrder: ProsthesisOrder): WorkOrder => {
  return {
    id: prosthesisOrder.id,
    orderNumber: prosthesisOrder.orderNumber,
    orderDate: prosthesisOrder.orderDate,
    personalFileId: prosthesisOrder.personalFileId,
    clientName: prosthesisOrder.clientName,
    disabilityGroup: prosthesisOrder.disabilityGroup,
    disabilityCategory: prosthesisOrder.disabilityCategory,
    productName: prosthesisOrder.prosthesisType,
    manufacturingDate: prosthesisOrder.manufacturingDate,
    issueDate: prosthesisOrder.issueDate,
    movementStatus: 'В обработке', // Значение по умолчанию
    status: 'создан', // Значение по умолчанию
    orderType: 'Заказ на изготовление протеза', // Всегда заказ на изготовление протеза
    measurements: {}, // Пустые измерения
    notes: prosthesisOrder.notes,
    createdBy: prosthesisOrder.createdBy,
    createdAt: prosthesisOrder.createdAt,
    updatedAt: prosthesisOrder.updatedAt
  };
};

export const adaptWorkOrderToFootwearOrder = (workOrder: WorkOrder): FootwearOrder | null => {
  // Проверяем, что это заказ на изготовление обуви
  if (workOrder.orderType !== 'Заказ на изготовление обуви') {
    return null;
  }

  // Создаем базовый диагноз, если его нет
  const defaultDiagnosis: FootwearDiagnosis = 'ДЦП';

  return {
    id: workOrder.id,
    orderNumber: workOrder.orderNumber,
    orderDate: workOrder.orderDate,
    personalFileId: workOrder.personalFileId,
    clientName: workOrder.clientName,
    disabilityGroup: workOrder.disabilityGroup,
    disabilityCategory: workOrder.disabilityCategory,
    diagnosis: defaultDiagnosis,
    model: 'Ортопедические туфли', // Значение по умолчанию
    color: 'Черный', // Значение по умолчанию
    material: 'Натуральная кожа', // Значение по умолчанию
    heelHeight: 0,
    heelMaterial: 'Резина', // Значение по умолчанию
    isHospitalized: false,
    orderType: 'Первичный', // Значение по умолчанию
    leftLegShortening: undefined,
    rightLegShortening: undefined,
    status: 'Обычный', // Значение по умолчанию
    urgencyReason: undefined,
    serviceType: 'Бесплатная', // Значение по умолчанию
    technicalOperations: [],
    fittings: [],
    manufacturingDate: workOrder.manufacturingDate,
    issueDate: workOrder.issueDate,
    createdBy: workOrder.createdBy,
    createdAt: workOrder.createdAt,
    updatedAt: workOrder.updatedAt,
    notes: workOrder.notes
  };
};

export const adaptFootwearOrderToWorkOrder = (footwearOrder: FootwearOrder): WorkOrder => {
  return {
    id: footwearOrder.id,
    orderNumber: footwearOrder.orderNumber,
    orderDate: footwearOrder.orderDate,
    personalFileId: footwearOrder.personalFileId,
    clientName: footwearOrder.clientName,
    disabilityGroup: footwearOrder.disabilityGroup,
    disabilityCategory: footwearOrder.disabilityCategory,
    productName: footwearOrder.model,
    manufacturingDate: footwearOrder.manufacturingDate,
    issueDate: footwearOrder.issueDate,
    movementStatus: 'В обработке', // Значение по умолчанию
    status: 'создан', // Значение по умолчанию
    orderType: 'Заказ на изготовление обуви', // Всегда заказ на изготовление обуви
    measurements: {}, // Пустые измерения
    notes: footwearOrder.notes,
    createdBy: footwearOrder.createdBy,
    createdAt: footwearOrder.createdAt,
    updatedAt: footwearOrder.updatedAt
  };
};

export const adaptWorkOrderToOttobockOrder = (workOrder: WorkOrder): OttobockOrder | null => {
  // Проверяем, что это заказ на изготовление Отто-бок
  if (workOrder.orderType !== 'Заказ на изготовление Отто-бок') {
    return null;
  }

  // Создаем базовые значения по умолчанию
  const defaultProductType: OttobockProductType = 'Протез бедра';
  const defaultDiagnosis: OttobockDiagnosis = 'Ампутация левого бедра';
  const defaultSide: OttobockSide = 'Левый';
  const defaultOrderType: OttobockOrderType = 'Первичный';
  const defaultStatus: OttobockOrderStatus = 'Обычный';
  const defaultServiceType: OttobockServiceType = 'Бесплатная';

  return {
    id: workOrder.id,
    orderNumber: workOrder.orderNumber,
    orderDate: workOrder.orderDate,
    personalFileId: workOrder.personalFileId,
    clientName: workOrder.clientName,
    disabilityGroup: workOrder.disabilityGroup,
    disabilityCategory: workOrder.disabilityCategory,
    productType: defaultProductType,
    diagnosis: defaultDiagnosis,
    side: defaultSide,
    isHospitalized: false,
    orderType: defaultOrderType,
    materials: [],
    status: defaultStatus,
    urgencyReason: undefined,
    serviceType: defaultServiceType,
    orderCost: 0,
    fittings: [],
    manufacturingDate: workOrder.manufacturingDate,
    issueDate: workOrder.issueDate,
    createdBy: workOrder.createdBy,
    createdAt: workOrder.createdAt,
    updatedAt: workOrder.updatedAt,
    notes: workOrder.notes
  };
};

export const adaptOttobockOrderToWorkOrder = (ottobockOrder: OttobockOrder): WorkOrder => {
  return {
    id: ottobockOrder.id,
    orderNumber: ottobockOrder.orderNumber,
    orderDate: ottobockOrder.orderDate,
    personalFileId: ottobockOrder.personalFileId,
    clientName: ottobockOrder.clientName,
    disabilityGroup: ottobockOrder.disabilityGroup,
    disabilityCategory: ottobockOrder.disabilityCategory,
    productName: ottobockOrder.productType,
    manufacturingDate: ottobockOrder.manufacturingDate,
    issueDate: ottobockOrder.issueDate,
    movementStatus: 'В обработке', // Значение по умолчанию
    status: 'создан', // Значение по умолчанию
    orderType: 'Заказ на изготовление Отто-бок', // Всегда заказ на изготовление Отто-бок
    measurements: {}, // Пустые измерения
    notes: ottobockOrder.notes,
    createdBy: ottobockOrder.createdBy,
    createdAt: ottobockOrder.createdAt,
    updatedAt: ottobockOrder.updatedAt
  };
};

export const adaptWorkOrderToOrthosisOrder = (workOrder: WorkOrder): OrthosisOrder | null => {
  // Проверяем, что это заказ на изготовление Оттобок
  if (workOrder.orderType !== 'Заказ на изготовление Оттобок') {
    return null;
  }

  // Создаем базовые значения по умолчанию
  const defaultProductType: OrthosisProductType = 'Ортез коленного сустава';
  const defaultDiagnosis: OrthosisDiagnosis = 'Артроз коленного сустава';
  const defaultSide: OrthosisSide = 'Правый';
  const defaultOrderType: OrthosisOrderType = 'Первичный';
  const defaultStatus: OrthosisOrderStatus = 'Обычный';
  const defaultServiceType: OrthosisServiceType = 'Бесплатная';

  return {
    id: workOrder.id,
    orderNumber: workOrder.orderNumber,
    orderDate: workOrder.orderDate,
    personalFileId: workOrder.personalFileId,
    clientName: workOrder.clientName,
    disabilityGroup: workOrder.disabilityGroup,
    disabilityCategory: workOrder.disabilityCategory,
    productType: defaultProductType,
    diagnosis: defaultDiagnosis,
    side: defaultSide,
    isHospitalized: false,
    orderType: defaultOrderType,
    materials: [],
    status: defaultStatus,
    urgencyReason: undefined,
    serviceType: defaultServiceType,
    orderCost: 0,
    fittings: [],
    manufacturingDate: workOrder.manufacturingDate,
    issueDate: workOrder.issueDate,
    createdBy: workOrder.createdBy,
    createdAt: workOrder.createdAt,
    updatedAt: workOrder.updatedAt,
    notes: workOrder.notes
  };
};

export const adaptOrthosisOrderToWorkOrder = (orthosisOrder: OrthosisOrder): WorkOrder => {
  return {
    id: orthosisOrder.id,
    orderNumber: orthosisOrder.orderNumber,
    orderDate: orthosisOrder.orderDate,
    personalFileId: orthosisOrder.personalFileId,
    clientName: orthosisOrder.clientName,
    disabilityGroup: orthosisOrder.disabilityGroup,
    disabilityCategory: orthosisOrder.disabilityCategory,
    productName: orthosisOrder.productType,
    manufacturingDate: orthosisOrder.manufacturingDate,
    issueDate: orthosisOrder.issueDate,
    movementStatus: 'В обработке', // Значение по умолчанию
    status: 'создан', // Значение по умолчанию
    orderType: 'Заказ на изготовление Оттобок', // Всегда заказ на изготовление Оттобок
    measurements: {}, // Пустые измерения
    notes: orthosisOrder.notes,
    createdBy: orthosisOrder.createdBy,
    createdAt: orthosisOrder.createdAt,
    updatedAt: orthosisOrder.updatedAt
  };
};

export const adaptWorkOrderToRepairOrder = (workOrder: WorkOrder): RepairOrder | null => {
  // Проверяем, что это наряд на ремонт
  if (workOrder.orderType !== 'Наряд на ремонт') {
    return null;
  }

  // Создаем базовые значения по умолчанию
  const defaultProductType: RepairProductType = 'Протез бедра';
  const defaultStatus: RepairOrderStatus = 'Обычный';
  const defaultServiceType: RepairServiceType = 'Бесплатная';

  return {
    id: workOrder.id,
    orderNumber: workOrder.orderNumber,
    orderDate: workOrder.orderDate,
    personalFileId: workOrder.personalFileId,
    clientName: workOrder.clientName,
    disabilityGroup: workOrder.disabilityGroup,
    disabilityCategory: workOrder.disabilityCategory,
    productType: defaultProductType,
    materials: [],
    status: defaultStatus,
    urgencyReason: undefined,
    serviceType: defaultServiceType,
    orderCost: 0,
    fittings: [],
    manufacturingDate: workOrder.manufacturingDate,
    issueDate: workOrder.issueDate,
    createdBy: workOrder.createdBy,
    createdAt: workOrder.createdAt,
    updatedAt: workOrder.updatedAt,
    notes: workOrder.notes
  };
};

export const adaptRepairOrderToWorkOrder = (repairOrder: RepairOrder): WorkOrder => {
  return {
    id: repairOrder.id,
    orderNumber: repairOrder.orderNumber,
    orderDate: repairOrder.orderDate,
    personalFileId: repairOrder.personalFileId,
    clientName: repairOrder.clientName,
    disabilityGroup: repairOrder.disabilityGroup,
    disabilityCategory: repairOrder.disabilityCategory,
    productName: repairOrder.productType,
    manufacturingDate: repairOrder.manufacturingDate,
    issueDate: repairOrder.issueDate,
    movementStatus: 'В обработке', // Значение по умолчанию
    status: 'создан', // Значение по умолчанию
    orderType: 'Наряд на ремонт', // Всегда наряд на ремонт
    measurements: {}, // Пустые измерения
    notes: repairOrder.notes,
    createdBy: repairOrder.createdBy,
    createdAt: repairOrder.createdAt,
    updatedAt: repairOrder.updatedAt
  };
};

export const adaptWorkOrderToReadyPoiOrder = (workOrder: WorkOrder): ReadyPoiOrder | null => {
  // Проверяем, что это заказ на готовые ПОИ
  if (workOrder.orderType !== 'Заказ на готовые ПОИ') {
    return null;
  }

  // Создаем базовые значения по умолчанию
  const defaultProductType: ReadyPoiProductType = 'Кресло-коляска';
  const defaultDiagnosis: ReadyPoiDiagnosis = 'G80 - Детский церебральный паралич';
  const defaultOrderType: ReadyPoiOrderType = 'Первичный';
  const defaultStatus: ReadyPoiOrderStatus = 'Обычный';
  const defaultServiceType: ReadyPoiServiceType = 'Бесплатная';

  return {
    id: workOrder.id,
    orderNumber: workOrder.orderNumber,
    orderDate: workOrder.orderDate,
    personalFileId: workOrder.personalFileId,
    clientName: workOrder.clientName,
    disabilityGroup: workOrder.disabilityGroup,
    disabilityCategory: workOrder.disabilityCategory,
    productType: defaultProductType,
    diagnosis: defaultDiagnosis,
    orderType: defaultOrderType,
    materials: [],
    status: defaultStatus,
    urgencyReason: undefined,
    serviceType: defaultServiceType,
    orderCost: 0,
    fittings: [],
    manufacturingDate: workOrder.manufacturingDate,
    issueDate: workOrder.issueDate,
    createdBy: workOrder.createdBy,
    createdAt: workOrder.createdAt,
    updatedAt: workOrder.updatedAt,
    notes: workOrder.notes
  };
};

export const adaptReadyPoiOrderToWorkOrder = (readyPoiOrder: ReadyPoiOrder): WorkOrder => {
  return {
    id: readyPoiOrder.id,
    orderNumber: readyPoiOrder.orderNumber,
    orderDate: readyPoiOrder.orderDate,
    personalFileId: readyPoiOrder.personalFileId,
    clientName: readyPoiOrder.clientName,
    disabilityGroup: readyPoiOrder.disabilityGroup,
    disabilityCategory: readyPoiOrder.disabilityCategory,
    productName: readyPoiOrder.productType,
    manufacturingDate: readyPoiOrder.manufacturingDate,
    issueDate: readyPoiOrder.issueDate,
    movementStatus: 'В обработке', // Значение по умолчанию
    status: 'создан', // Значение по умолчанию
    orderType: 'Заказ на готовые ПОИ', // Всегда заказ на готовые ПОИ
    measurements: {}, // Пустые измерения
    notes: readyPoiOrder.notes,
    createdBy: readyPoiOrder.createdBy,
    createdAt: readyPoiOrder.createdAt,
    updatedAt: readyPoiOrder.updatedAt
  };
};
