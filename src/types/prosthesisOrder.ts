export type ProsthesisType = 
  | 'Протез' 
  | 'Лангеты' 
  | 'Шина Веленского' 
  | 'Шина Джумабекова' 
  | 'Фикс-аппарат' 
  | 'Корсет' 
  | 'Бандаж' 
  | 'Репликатор';

export type ProsthesisSide = 'Левый' | 'Правый';

export type ProsthesisOrderType = 'Первичный' | 'Вторичный';

export type OrderStatus = 'Срочный' | 'Обычный';

export type ServiceType = 'Платная' | 'Бесплатная';

export type ActivityLevel = 'Низкая' | 'Средняя' | 'Высокая';

export interface ProsthesisDiagnosis {
  id: string;
  category: 'Ампутация нижней конечности' | 'Ампутация верхней конечности';
  name: string;
  code: string;
}

export interface ProsthesisComponent {
  id: string;
  name: string;
  code: string;
  size?: string;
  quantityLeft?: number;
  quantityRight?: number;
}

export interface Fitting {
  id: string;
  fittingNumber: 1 | 2 | 3;
  callDate?: string;
  appointmentDate?: string;
}

export interface ProsthesisOrder {
  id: string;
  orderNumber: string;
  orderDate: string;
  personalFileId: string;
  clientName: string;
  disabilityGroup: string;
  disabilityCategory: string;
  
  // Основные поля заказа
  prosthesisType: ProsthesisType;
  diagnosis: ProsthesisDiagnosis;
  side: ProsthesisSide;
  isHospitalized: boolean;
  orderType: ProsthesisOrderType;
  
  // Модульные протезы
  weight?: number;
  height?: number;
  activityLevel?: ActivityLevel;
  
  // Статус и приоритет
  status: OrderStatus;
  urgencyReason?: string;
  serviceType: ServiceType;
  
  // Таблица изделий
  components: ProsthesisComponent[];
  
  // Примерки
  fittings: Fitting[];
  
  // Даты выполнения
  manufacturingDate?: string;
  issueDate?: string;
  
  // Системные поля
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface ProsthesisOrderFormData {
  prosthesisType: ProsthesisType;
  diagnosis: ProsthesisDiagnosis | null;
  side: ProsthesisSide;
  isHospitalized: boolean;
  orderType: ProsthesisOrderType;
  weight?: number;
  height?: number;
  activityLevel?: ActivityLevel;
  status: OrderStatus;
  urgencyReason?: string;
  serviceType: ServiceType;
  components: ProsthesisComponent[];
  fittings: Fitting[];
  notes?: string;
}
